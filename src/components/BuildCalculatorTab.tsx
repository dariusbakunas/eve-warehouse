import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { GetBuildInfo, GetBuildInfoVariables } from '../__generated__/GetBuildInfo';
import { usePersistentState } from '../hooks/usePersistentState';
import { useQuery } from '@apollo/react-hooks';
import DataTable from './DataTable';
import FormControl from '@material-ui/core/FormControl';
import getBuildInfoQuery from '../queries/getBuildInfo.graphql';
import InputLabel from '@material-ui/core/InputLabel';
import InvItemAutocomplete, { InvItem } from './InvItemAutocomplete';
import Maybe from 'graphql/tsutils/Maybe';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useEffect, useMemo, useState } from 'react';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { getItemImageUrl } from '../utils/getItemImageUrl';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
);

interface IMaterialRow {
  id: string;
  name: string;
  unitQuantity: string;
  jobQuantity: string;
}

const STRUCTURE_RIG_BONUSES: { [key: number]: { [key: string]: number } } = {
  0: { lowSec: 0, highSec: 0, nullSec: 0 },
  1: { lowSec: 3.8, highSec: 2, nullSec: 4.2 },
  2: { lowSec: 4.56, highSec: 2.4, nullSec: 5.04 },
};

const BuildCalculatorTab: React.FC = () => {
  const classes = useStyles();
  const [blueprint, setBlueprint] = usePersistentState<Maybe<InvItem>>(`BuildCalculatorTab:blueprint`, null);
  const [me, setMe] = usePersistentState<number>('BuildCalculatorTab:me', 10);
  const [te, setTe] = usePersistentState<number>('BuildCalculatorTab:te', 20);
  const [sec, setSec] = usePersistentState<string>('BuildCalculatorTab:sec', 'nullSec');
  const [runs, setRuns] = usePersistentState<Maybe<number>>('BuildCalculatorTab:runs', 1);
  const [rig, setRig] = usePersistentState<number>('BuildCalculatorTab:rig', 0);
  const [facility, setFacility] = usePersistentState<string>('BuildCalculatorTab:facility', 'complex');

  const { loading, data } = useQuery<GetBuildInfo, GetBuildInfoVariables>(getBuildInfoQuery, {
    skip: !blueprint,
    variables: {
      id: blueprint ? blueprint.id : '-1',
    },
  });

  const handleSelectItem = (item: Maybe<InvItem>) => {
    setBlueprint(item);
  };

  const rows: IMaterialRow[] = useMemo(() => {
    if (data && data.buildInfo) {
      const {
        buildInfo: { materials },
      } = data;

      const structureRigBonus = STRUCTURE_RIG_BONUSES[rig][sec];
      const facilityBonus = facility === 'complex' ? 1 : 0;

      return materials.map(material => {
        let jobQuantity = 'N/A';
        const unitQuantity = material.quantity * (1 - me * 0.01) * (1 - structureRigBonus * 0.01) * (1 - facilityBonus * 0.01);

        if (runs) {
          jobQuantity = Math.max(runs, Math.ceil(unitQuantity * runs)).toLocaleString();
        }

        return {
          id: material.item.id,
          name: material.item.name,
          jobQuantity: jobQuantity,
          unitQuantity: Math.ceil(unitQuantity).toLocaleString(),
        };
      });
    } else {
      return [];
    }
  }, [data, runs, me, te, sec, rig, facility]);

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

  return (
    <div className={classes.root}>
      <div className={classes.controls}>
        <InvItemAutocomplete
          className={classes.blueprintSelector}
          categoryIds={['9']}
          label="Select Blueprint or Reaction"
          value={blueprint}
          onSelect={handleSelectItem}
        />
        <FormControl className={classes.formControl}>
          <InputLabel id="me-select-label">ME</InputLabel>
          <Select labelId="me-select-label" id="me-select" value={me} onChange={handleMeChange}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <MenuItem key={num} value={num}>
                -{num}%
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
          { field: 'unitQuantity', title: 'Unit Quantity', align: 'right' },
          { field: 'jobQuantity', title: 'Job Quantity', align: 'right' },
        ]}
        data={rows}
      />
    </div>
  );
};

export default BuildCalculatorTab;
