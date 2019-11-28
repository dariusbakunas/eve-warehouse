import withApollo from '../lib/withApollo';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import Tooltip from '@material-ui/core/Tooltip';
import getProcessingLogsQuery from '../queries/getProcessingLogs.graphql';
import { useQuery } from '@apollo/react-hooks';
import { GetProcessingLogs, GetProcessingLogsVariables } from '../__generated__/GetProcessingLogs';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import moment from 'moment';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
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

  const { data, loading } = useQuery<GetProcessingLogs, GetProcessingLogsVariables>(getProcessingLogsQuery, {
    variables: {
      filter: {
        characterId: null,
      },
    },
  });

  const rows = getTableData(data);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Toolbar className={classes.labelToolbar}>
          <Typography className={classes.title} variant="h6" id="tableTitle">
            Logs
          </Typography>
          <Tooltip title="Filter list">
            <IconButton aria-label="filter list" aria-labelledby="filterMenu">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
        {loading && <LinearProgress />}
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
    </div>
  );
};

export default withApollo(Logs);
