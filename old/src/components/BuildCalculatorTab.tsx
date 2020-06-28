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
import React, { useMemo, useState } from 'react';
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
  jitaCost: Maybe<number>;
  warehouseCost: Maybe<number>;
  warehouseQuantity: number;
}

interface ITotals {
  jitaCost: Maybe<number>;
  warehouseCost: Maybe<number>;
  productionCount: Maybe<number>;
}

const BuildCalculatorTab: React.FC = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [blueprint, setBlueprint] = useApplicationState<Maybe<InvItem>>('BuildCalculatorTab:blueprint', null);
  const [me, setMe] = useState<number>(10);
  const [meRig, setMeRig] = useState<Maybe<number>>(-4.2);
  const [te, setTe] = useState<number>(20);
  const [runs, setRuns] = useState<Maybe<number>>(1);

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

      const structureBonus = meRig ? -meRig : 0;
      const actualMe = isReaction ? 0 : me;

      return materials.map(material => {
        let jobQuantity = null;
        const unitQuantity = material.quantity * (1 - actualMe * 0.01) * (1 - structureBonus * 0.01);

        if (runs) {
          jobQuantity = Math.max(runs, Math.ceil(unitQuantity * runs));
        }

        const warehouseItem = warehouseItems[material.item.id];
        const warehouseQuantity = warehouseItem ? warehouseItem.quantity : 0;
        const warehouseCost = warehouseItem && jobQuantity ? warehouseItem.unitCost * jobQuantity : null;
        const jitaCost =
          material.item && material.item.jitaPrice && material.item.jitaPrice.buy && jobQuantity ? material.item.jitaPrice.buy * jobQuantity : null;
        const jobDiff = jobQuantity && jobQuantity > warehouseQuantity ? warehouseQuantity - jobQuantity : null;

        return {
          id: material.item.id,
          name: material.item.name,
          jobQuantity,
          unitQuantity: Math.ceil(unitQuantity),
          warehouseQuantity,
          warehouseCost,
          jobDiff,
          jitaCost,
        };
      });
    } else {
      return [];
    }
  }, [warehouseItems, buildInfoResponse, runs, me, te, meRig]);

  const totals = useMemo<ITotals>(() => {
    const result: ITotals = {
      jitaCost: null,
      warehouseCost: null,
      productionCount: null,
    };

    if (runs && buildInfoResponse && buildInfoResponse.buildInfo) {
      const aggregate = rows.reduce<{
        totalWarehouseCost: number;
        totalJitaCost: number;
      }>(
        (acc, row) => {
          if (row.warehouseCost && acc.totalWarehouseCost >= 0) {
            acc.totalWarehouseCost += row.warehouseCost;
          } else {
            acc.totalWarehouseCost = -1;
          }

          if (row.jitaCost && acc.totalJitaCost >= 0) {
            acc.totalJitaCost += row.jitaCost;
          } else {
            acc.totalJitaCost = -1;
          }
          return acc;
        },
        { totalWarehouseCost: 0, totalJitaCost: 0 }
      );

      if (aggregate.totalWarehouseCost >= 0) {
        result.warehouseCost = aggregate.totalWarehouseCost / runs / buildInfoResponse.buildInfo.quantity;
      }

      if (aggregate.totalJitaCost >= 0) {
        result.jitaCost = aggregate.totalJitaCost / runs / buildInfoResponse.buildInfo.quantity;
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

  const handleMeRigChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value ? +(event.target.value as number) : null;

    if (value && value <= 0) {
      setMeRig(event.target.value as number);
    } else {
      setMeRig(null);
    }
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
          defaultValue={blueprint}
          onSelect={handleSelectItem}
        />
        {!isReaction && (
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
        )}
        {!isReaction && (
          <FormControl className={classes.formControl}>
            <InputLabel id="te-select-label">TE</InputLabel>
            <Select labelId="te-select-label" id="te-select" value={te} onChange={handleTeChange}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(num => (
                <MenuItem key={num} value={num}>
                  -{num}%
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
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
          <TextField
            id="me-rig"
            label="ME Rig Bonus, %"
            type="number"
            value={meRig || ''}
            onChange={handleMeRigChange}
            inputProps={{
              min: -10,
              max: 0,
            }}
          />
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
            field: row => (row.jitaCost && row.jitaCost ? row.jitaCost.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'N/A'),
            title: 'Jita Cost, ISK',
            align: 'right',
          },
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
        <div>
          <span className={classes.totalsLabel}>Jita Cost:</span>
          <span>
            {totals.jitaCost ? `${totals.jitaCost.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 })} ISK` : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BuildCalculatorTab;
