import { CheckWarehouseItems, CheckWarehouseItemsVariables } from '../__generated__/CheckWarehouseItems';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { GetBuildInfo, GetBuildInfoVariables } from '../__generated__/GetBuildInfo';
import { getItemImageUrl } from '../utils/getItemImageUrl';
import { useApplicationState } from '../hooks/useApplicationState';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { useSnackbar } from 'notistack';
import checkWarehouseItemsQuery from '../queries/checkWarehouseItems.graphql';
import commonStyles from '../config/commonStyles';
import DataTable from './DataTable';
import FormControl from '@material-ui/core/FormControl';
import getBuildInfoQuery from '../queries/getBuildInfo.graphql';
import InputLabel from '@material-ui/core/InputLabel';
import InvItemAutocomplete, { InvItem } from './InvItemAutocomplete';
import LinearProgress from '@material-ui/core/LinearProgress';
import Maybe from 'graphql/tsutils/Maybe';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useEffect, useMemo, useState } from 'react';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ...commonStyles(theme),
    root: {},
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    blueprintSelector: {
      flexGrow: 1,
      minWidth: '320px',
      marginRight: theme.spacing(1),
    },
    controls: {
      alignItems: 'center',
      display: 'flex',
      flexWrap: 'wrap',
      marginBottom: theme.spacing(1),
    },
    totals: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: theme.spacing(3),
      '&>div': {
        alignSelf: 'flex-end',
        display: 'inline-flex',
        width: '320px',
      },
    },
    totalsLabel: {
      fontWeight: 'bold',
      flex: 1,
    },
  })
);

interface IMaterialRow {
  id: string;
  name: string;
  unitQuantity: number;
  jobQuantity: Maybe<number>;
  jobDiff: Maybe<number>;
  warehouseCost: Maybe<number>;
  warehouseQuantity: number;
}

interface ITotals {
  warehouseCost: Maybe<number>;
  productionCount: Maybe<number>;
}

const STRUCTURE_RIG_BONUSES: { [key: number]: { [key: string]: number } } = {
  0: { lowSec: 0, highSec: 0, nullSec: 0 },
  1: { lowSec: 3.8, highSec: 2, nullSec: 4.2 },
  2: { lowSec: 4.56, highSec: 2.4, nullSec: 5.04 },
};

const BuildCalculatorTab: React.FC = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [blueprint, setBlueprint] = useApplicationState<Maybe<InvItem>>('BuildCalculatorTab:blueprint', null);
  const [me, setMe] = useState<number>(10);
  const [te, setTe] = useState<number>(20);
  const [sec, setSec] = useState<string>('nullSec');
  const [runs, setRuns] = useState<Maybe<number>>(1);
  const [rig, setRig] = useState<number>(0);
  const [facility, setFacility] = useState<string>('complex');

  const [checkWarehouseItems, { loading: warehouseItemsLoading, data: warehouseItemsResponse }] = useLazyQuery<
    CheckWarehouseItems,
    CheckWarehouseItemsVariables
  >(checkWarehouseItemsQuery, {
    fetchPolicy: 'no-cache',
    onError: error => {
      enqueueSnackbar(`Warehouse items failed to load: ${error.message}`, { variant: 'error', autoHideDuration: 5000 });
    },
  });

  const { loading: buildItemsLoading, data: buildInfoResponse } = useQuery<GetBuildInfo, GetBuildInfoVariables>(getBuildInfoQuery, {
    skip: !blueprint,
    variables: {
      id: blueprint ? blueprint.id : '-1',
    },
    onCompleted: data => {
      checkWarehouseItems({
        variables: {
          itemIds: data && data.buildInfo ? data.buildInfo.materials.map(item => item.item.id) : [],
        },
      });
    },
    onError: error => {
      enqueueSnackbar(`Build info failed to load: ${error.message}`, { variant: 'error', autoHideDuration: 5000 });
    },
  });

  const handleSelectItem = (item: Maybe<InvItem>) => {
    setBlueprint(item);
  };

  const isReaction = blueprint ? blueprint.name.includes('Reaction') : false;

  const warehouseItems = useMemo(() => {
    if (warehouseItemsResponse && warehouseItemsResponse.warehouseItems) {
      return warehouseItemsResponse.warehouseItems.reduce<{ [key: string]: { quantity: number; unitCost: number } }>((acc, item) => {
        const existing = acc[item.item.id];
        if (existing) {
          // average unit cost if item is found in multiple warehouses
          const newQuantity = existing.quantity + item.quantity;
          const newCost = (existing.quantity * existing.unitCost + item.quantity * item.unitCost) / newQuantity;

          acc[item.item.id] = {
            quantity: existing.quantity + item.quantity,
            unitCost: newCost,
          };
        } else {
          acc[item.item.id] = {
            quantity: item.quantity,
            unitCost: item.unitCost,
          };
        }

        return acc;
      }, {});
    }

    return {};
  }, [warehouseItemsResponse]);

  const rows: IMaterialRow[] = useMemo(() => {
    if (warehouseItems && buildInfoResponse && buildInfoResponse.buildInfo) {
      const {
        buildInfo: { materials },
      } = buildInfoResponse;

      const actualMe = isReaction ? 0 : me;

      const structureRigBonus = STRUCTURE_RIG_BONUSES[rig][sec];
      const facilityBonus = facility === 'complex' ? 1 : 0;

      return materials.map(material => {
        let jobQuantity = null;
        const unitQuantity = material.quantity * (1 - actualMe * 0.01) * (1 - structureRigBonus * 0.01) * (1 - facilityBonus * 0.01);

        if (runs) {
          jobQuantity = Math.max(runs, Math.ceil(unitQuantity * runs));
        }

        const warehouseItem = warehouseItems[material.item.id];
        const warehouseQuantity = warehouseItem ? warehouseItem.quantity : 0;
        const warehouseCost = warehouseItem && jobQuantity ? warehouseItem.unitCost * jobQuantity : null;
        const jobDiff = jobQuantity && jobQuantity > warehouseQuantity ? warehouseQuantity - jobQuantity : null;

        return {
          id: material.item.id,
          name: material.item.name,
          jobQuantity,
          unitQuantity: Math.ceil(unitQuantity),
          warehouseQuantity,
          warehouseCost,
          jobDiff,
        };
      });
    } else {
      return [];
    }
  }, [warehouseItems, buildInfoResponse, runs, me, te, sec, rig, facility]);

  const totals = useMemo<ITotals>(() => {
    const result: ITotals = {
      warehouseCost: null,
      productionCount: null,
    };

    if (runs && buildInfoResponse && buildInfoResponse.buildInfo) {
      const aggregate = rows.reduce<{ warehouseCostAvailable: boolean; totalWarehouseCost: number }>(
        (acc, row) => {
          if (row.warehouseCost && acc.warehouseCostAvailable) {
            acc.totalWarehouseCost += row.warehouseCost;
          } else {
            acc.warehouseCostAvailable = false;
          }
          return acc;
        },
        { warehouseCostAvailable: true, totalWarehouseCost: 0 }
      );

      if (aggregate.warehouseCostAvailable) {
        result.warehouseCost = aggregate.totalWarehouseCost / runs / buildInfoResponse.buildInfo.quantity;
      }

      result.productionCount = buildInfoResponse.buildInfo.quantity * runs;
    }

    return result;
  }, [rows, runs, buildInfoResponse]);

  const handleMeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setMe(event.target.value as number);
  };

  const handleTeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTe(event.target.value as number);
  };

  const handleSecChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSec(event.target.value as string);
  };

  const handleFacilityChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFacility(event.target.value as string);
  };

  const handleRigChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRig(event.target.value as number);
  };

  const handleRunsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const runs = event.target.value ? +event.target.value : null;

    if (runs && runs > 0) {
      setRuns(runs);
    } else {
      setRuns(null);
    }
  };

  const loading = buildItemsLoading || warehouseItemsLoading;

  return (
    <div className={classes.root}>
      {loading && <LinearProgress />}
      <div className={classes.controls}>
        <InvItemAutocomplete
          className={classes.blueprintSelector}
          categoryIds={['9']}
          label="Select Blueprint or Reaction"
          value={blueprint}
          onSelect={handleSelectItem}
        />
        <FormControl className={classes.formControl} disabled={isReaction}>
          <InputLabel id="me-select-label">ME</InputLabel>
          <Select labelId="me-select-label" id="me-select" value={me} onChange={handleMeChange}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <MenuItem key={num} value={num}>
                -{num}%
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl} disabled={isReaction}>
          <InputLabel id="te-select-label">TE</InputLabel>
          <Select labelId="te-select-label" id="te-select" value={te} onChange={handleTeChange}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(num => (
              <MenuItem key={num} value={num}>
                -{num}%
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            id="num-runs"
            label="Job Runs"
            type="number"
            value={runs || ''}
            onChange={handleRunsChange}
            inputProps={{
              min: 1,
            }}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="facility-select-label">Facility</InputLabel>
          <Select labelId="facility-select-label" id="facility-select" value={facility} onChange={handleFacilityChange}>
            <MenuItem value={'other'}>Other</MenuItem>
            <MenuItem value={'complex'}>Engineering Complex</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="sec-select-label">Security</InputLabel>
          <Select labelId="sec-select-label" id="sec-select" value={sec} onChange={handleSecChange}>
            <MenuItem value={'highSec'}>High Sec</MenuItem>
            <MenuItem value={'lowSec'}>Low Sec</MenuItem>
            <MenuItem value={'nullSec'}>Null Sec</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="rig-select-label">ME Rig</InputLabel>
          <Select labelId="rig-select-label" id="rig-select" value={rig} onChange={handleRigChange}>
            <MenuItem value={0}>No Rig</MenuItem>
            <MenuItem value={1}>T1 Rig</MenuItem>
            <MenuItem value={2}>T2 Rig</MenuItem>
          </Select>
        </FormControl>
      </div>
      <DataTable<IMaterialRow, {}>
        idField="id"
        size="small"
        columns={[
          {
            field: 'name',
            title: 'Name',
            icon: {
              imageUrl: row => getItemImageUrl(row.id, row.name),
            },
          },
          { field: row => row.unitQuantity.toLocaleString(), title: 'Unit Quantity', align: 'right' },
          {
            field: row =>
              row.jobQuantity ? `${row.jobQuantity.toLocaleString()} ${row.jobDiff != null ? `(${row.jobDiff.toLocaleString()})` : ''}` : 'N/A',
            title: 'Job Quantity',
            align: 'right',
            cellClassName: row => (row.jobQuantity && row.jobQuantity < row.warehouseQuantity ? classes.positive : classes.negative),
          },
          { field: row => row.warehouseQuantity.toLocaleString(), title: 'Warehouse Quantity', align: 'right' },
          {
            field: row => (row.warehouseCost ? row.warehouseCost.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'N/A'),
            title: 'Warehouse Cost',
            align: 'right',
          },
        ]}
        data={rows}
      />
      <div className={classes.totals}>
        <div>
          <span className={classes.totalsLabel}>Units Produced:</span>
          <span>{totals.productionCount ? `${totals.productionCount.toLocaleString()}` : 'N/A'}</span>
        </div>
        <div>
          <span className={classes.totalsLabel}>Warehouse Cost:</span>
          <span>
            {totals.warehouseCost
              ? `${totals.warehouseCost.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 })} ISK`
              : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BuildCalculatorTab;
