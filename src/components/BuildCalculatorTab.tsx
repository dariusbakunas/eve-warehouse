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

const BuildCalculatorTab: React.FC = () => {
  const classes = useStyles();
  const [blueprint, setBlueprint] = usePersistentState<Maybe<InvItem>>(`BuildCalculatorTab:blueprint`, null);
  const [me, setMe] = usePersistentState<number>('BuildCalculatorTab:me', 10);
  const [te, setTe] = usePersistentState<number>('BuildCalculatorTab:te', 20);
  const [runs, setRuns] = usePersistentState<Maybe<number>>('BuildCalculatorTab:runs', 1);

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
      return materials.map(material => {
        let jobQuantity = 'N/A';
        const unitQuantity = Math.ceil(material.quantity * (1 - me * 0.01)).toLocaleString();

        if (runs) {
          jobQuantity = Math.max(runs, Math.ceil(material.quantity * (1 - me * 0.01) * runs)).toLocaleString();
        }

        return {
          id: material.item.id,
          name: material.item.name,
          jobQuantity: jobQuantity,
          unitQuantity: unitQuantity,
        };
      });
    } else {
      return [];
    }
  }, [data, runs, me, te]);

  const handleMeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setMe(event.target.value as number);
  };

  const handleTeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTe(event.target.value as number);
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
      </div>
      <DataTable<IMaterialRow, {}>
        idField="id"
        size="small"
        columns={[
          {
            field: 'name',
            title: 'Name',
            icon: {
              imageUrl: row => `https://images.evetech.net/types/${row.id}/icon`,
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
