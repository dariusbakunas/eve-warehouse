import React, { ChangeEvent, useCallback, useMemo } from 'react';
import { createStyles, makeStyles, TableRow, Theme } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import getJournalEntriesQuery from '../queries/getJournal.graphql';
import { GetJournal, GetJournalVariables } from '../__generated__/GetJournal';
import { useQuery } from '@apollo/react-hooks';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import moment from 'moment';
import { Order, WalletJournalOrderBy } from '../__generated__/globalTypes';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Maybe from 'graphql/tsutils/Maybe';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      whiteSpace: 'nowrap',
    },
    tableWrapper: {
      overflowX: 'scroll',
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  })
);

interface ITableRow {
  id: string;
  date: string;
  description: Maybe<string>;
  amount: string;
  balance: string;
}

const getTableData: (data?: GetJournal) => { rows: ITableRow[]; total: number} = data => {
  if (!data || !data.walletJournal) {
    return {
      total: 0,
      rows: [],
    };
  }

  const {
    walletJournal: { entries, total },
  } = data;

  const rows = entries.map(entry => ({
    id: entry.id,
    date: moment(entry.date).format('MM/DD/YYYY HH:mm'),
    description: entry.description,
    amount: entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }),
    balance: entry.balance.toLocaleString(undefined, { minimumFractionDigits: 2 }),
  }));

  return {
    total: total,
    rows: rows,
  };
};

interface IWalletJournalTab {
  onPageChange: (page: number) => void;
  order: Order;
  orderBy: WalletJournalOrderBy;
  onRowsPerPageChange: (rows: number) => void;
  onOrderChange: (order: Order) => void;
  onOrderByChange: (orderBy: WalletJournalOrderBy) => void;
  page: number;
  rowsPerPage: number;
}

const WalletJournalTab: React.FC<IWalletJournalTab> = ({ page, order, orderBy, onPageChange, onOrderChange, onOrderByChange, onRowsPerPageChange, rowsPerPage }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { data, loading } = useQuery<GetJournal, GetJournalVariables>(getJournalEntriesQuery, {
    variables: {
      page: {
        index: page,
        size: rowsPerPage,
      },
      orderBy: {
        column: orderBy,
        order: order,
      },
    },
    onError: error => {
      enqueueSnackbar(`Journal entries failed to load: ${error.message}`, { variant: 'error', autoHideDuration: 5000 });
    },
  });

  const { rows, total } = getTableData(data);

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  const handleSort = (event: React.MouseEvent<unknown>, column: WalletJournalOrderBy) => {
    const isDesc = orderBy === column && order === Order.desc;
    onPageChange(0);
    onOrderChange(isDesc ? Order.asc : Order.desc);
    onOrderByChange(column);
  };

  const sortableHeader = (column: WalletJournalOrderBy, label: string) => (
    <TableSortLabel active={orderBy === column} direction={order} onClick={e => handleSort(e, column)}>
      {label}
      {orderBy === column ? <span className={classes.visuallyHidden}>{order === Order.desc ? 'sorted descending' : 'sorted ascending'}</span> : null}
    </TableSortLabel>
  );

  return (
    <React.Fragment>
      {loading && <LinearProgress />}
      <div className={classes.tableWrapper}>
        <Table size="small" aria-label="wallet transactions" className={classes.table}>
          <TableHead>
            <TableCell>{sortableHeader(WalletJournalOrderBy.date, 'Date')}</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Balance</TableCell>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell align="right">{row.amount}</TableCell>
                <TableCell align="right">{row.balance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'previous page',
        }}
        nextIconButtonProps={{
          'aria-label': 'next page',
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </React.Fragment>
  );
};

export default WalletJournalTab;
