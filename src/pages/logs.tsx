import { useQuery } from '@apollo/react-hooks';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import FilterListIcon from '@material-ui/icons/FilterList';
import Maybe from 'graphql/tsutils/Maybe';
import moment from 'moment';
import React, { ChangeEvent, useState } from 'react';
import { GetCharacterNames } from '../__generated__/GetCharacterNames';
import { GetProcessingLogs, GetProcessingLogsVariables } from '../__generated__/GetProcessingLogs';
import withApollo from '../lib/withApollo';
import getCharacterNames from '../queries/getCharacterNames.graphql';
import getProcessingLogsQuery from '../queries/getProcessingLogs.graphql';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    filterMenu: {
      width: '250px',
      padding: theme.spacing(2),
    },
    filterFormControl: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    filterToolbar: {
      display: 'flex',
      justifyContent: 'left',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
    },
    paper: {
      width: 'calc(100vw - 120px)',
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(2),
    },
    title: {
      marginRight: '20px',
      flex: 1,
    },
    labelToolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    tableWrapper: {
      overflowX: 'scroll',
    },
    table: {
      whiteSpace: 'nowrap',
    },
  })
);

interface ITableRow {
  id: string;
  date: string;
  category: string;
  character: string | null;
  success: boolean;
  error: string | null;
  message: string;
}

const getTableData: (data?: GetProcessingLogs) => ITableRow[] = data => {
  if (!data || !data.processingLogs) {
    return [];
  }

  const { processingLogs } = data;

  return processingLogs.map(entry => ({
    id: entry.id,
    category: entry.category,
    character: entry.character ? entry.character.name : null,
    success: entry.status === 'SUCCESS',
    date: moment(entry.createdAt).format('MM/DD/YYYY HH:mm'),
    error: entry.error,
    message: entry.message,
  }));
};

const Logs = () => {
  const classes = useStyles();
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<HTMLButtonElement | null>(null);
  const [characterFilter, setCharacterFilter] = useState<Maybe<{ id: string; name: string }>>(null);

  const { loading: characterNamesLoading, data: characterNamesData } = useQuery<GetCharacterNames>(getCharacterNames);
  const { data, loading } = useQuery<GetProcessingLogs, GetProcessingLogsVariables>(getProcessingLogsQuery, {
    variables: {
      filter: {
        characterId: characterFilter ? characterFilter.id : null,
      },
    },
  });

  const handleOpenFilerMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleCloseFilterMenu = () => {
    setFilterMenuAnchor(null);
  };

  const rows = getTableData(data);
  const filterMenuOpen = Boolean(filterMenuAnchor);

  const handleCharacterChange = (event: ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;

    if (value === 'all' || !characterNamesData) {
      setCharacterFilter(null);
    } else {
      const character = characterNamesData.characters.find(character => character.id === value);
      if (character) {
        setCharacterFilter({ id: character.id, name: character.name });
      }
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Toolbar className={classes.labelToolbar}>
          <Typography className={classes.title} variant="h6" id="tableTitle">
            Logs
          </Typography>
          <Tooltip title="Filter list">
            <IconButton aria-label="filter list" aria-labelledby="filterMenu" onClick={handleOpenFilerMenu}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
        {characterFilter && (
          <Toolbar className={classes.filterToolbar}>
            <Chip label={`Character: ${characterFilter.name}`} onDelete={() => setCharacterFilter(null)} variant={'outlined'} />
          </Toolbar>
        )}
        {(loading || characterNamesLoading) && <LinearProgress />}
        <div className={classes.tableWrapper}>
          <Table size="small" aria-label="wallet transactions" className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Character</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.character}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.success ? <CheckIcon /> : <ClearIcon />}</TableCell>
                  <TableCell>{row.success ? row.message : row.error}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
      <Popover
        id="filterMenu"
        open={filterMenuOpen}
        anchorEl={filterMenuAnchor}
        onClose={handleCloseFilterMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper className={classes.filterMenu}>
          <FormControl className={classes.filterFormControl}>
            <InputLabel id="character-label">Character</InputLabel>
            <Select
              labelId="character-label"
              id="character-select"
              onChange={handleCharacterChange}
              value={characterFilter ? characterFilter.id : 'all'}
            >
              <MenuItem value={'all'}>All</MenuItem>
              {characterNamesData &&
                characterNamesData.characters.map(character => (
                  <MenuItem key={character.id} value={character.id}>
                    {character.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Paper>
      </Popover>
    </div>
  );
};

export default withApollo(Logs);
