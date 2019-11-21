import React, { useMemo } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import { Order, OrderType, WalletTransactionOrderBy } from '../__generated__/globalTypes';
import Maybe from 'graphql/tsutils/Maybe';
import moment from 'moment';
import { useQuery } from '@apollo/react-hooks';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import { GetTransactions, GetTransactionsVariables } from '../__generated__/GetTransactions';
import getTransactionsQuery from '../queries/getTransactions.graphql';
import { useSnackbar } from 'notistack';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    formControl: {
      margin: theme.spacing(1),
      minWidth: 150,
    },
    negative: {
      color: '#8b251f',
    },
    positive: {
      color: '#187119',
    },
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
  character: Maybe<string>;
  client: string;
  date: string;
  isBuy: boolean;
  item: Maybe<string>;
  price: string;
  quantity: string;
  credit: string;
  station: string;
}

const getTableData: (data?: GetTransactions) => { rows: ITableRow[]; total: number } = data => {
  if (!data || !data.walletTransactions) {
    return {
      total: 0,
      rows: [],
    };
  }

  const {
    walletTransactions: { transactions, total },
  } = data;
  const rows = transactions.map(transaction => ({
    id: transaction.id,
    character: transaction.character ? transaction.character.name : null,
    client: transaction.client.name,
    date: moment(transaction.date).format('MM/DD/YYYY HH:mm'),
    item: transaction.item ? transaction.item.name : null,
    isBuy: transaction.isBuy,
    price: transaction.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }),
    quantity: transaction.quantity.toLocaleString(),
    credit: transaction.credit.toLocaleString(undefined, { minimumFractionDigits: 2 }),
    station: transaction.location.name,
  }));

  return {
    total: total,
    rows: rows,
  };
};

interface IWalletTransactionsTab {
  characterFilter: Maybe<{ id: string; name: string }>;
  itemFilter: Maybe<string>;
  order: Order;
  orderBy: WalletTransactionOrderBy;
  orderType: Maybe<OrderType>;
  page: number;
  onPageChange: (page: number) => void;
  onOrderChange: (order: Order) => void;
  onOrderByChange: (orderBy: WalletTransactionOrderBy) => void;
  onClearCharacterFilter: () => void;
  onClearItemFilter: () => void;
  onClearOrderTypeFilter: () => void;
  onRowsPerPageChange: (rows: number) => void;
  rowsPerPage: number;
}

const WalletTransactionsTab: React.FC<IWalletTransactionsTab> = ({
  characterFilter,
  onClearCharacterFilter,
  itemFilter,
  order,
  orderBy,
  page,
  onClearItemFilter,
  orderType,
  onOrderChange,
  onOrderByChange,
  onClearOrderTypeFilter,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { loading, data } = useQuery<GetTransactions, GetTransactionsVariables>(getTransactionsQuery, {
    variables: {
      page: {
        index: page,
        size: rowsPerPage,
      },
      filter: {
        characterId: characterFilter ? characterFilter.id : null,
        orderType,
        item: itemFilter,
      },
      orderBy: {
        column: orderBy,
        order: order,
      },
    },
    onError: error => {
      enqueueSnackbar(`Wallet transactions failed to load: ${error.message}`, { variant: 'error', autoHideDuration: 5000 });
    },
  });

  const { rows, total } = useMemo<{ rows: ITableRow[]; total: number }>(() => getTableData(data), [data]);

  const handleSort = (event: React.MouseEvent<unknown>, column: WalletTransactionOrderBy) => {
    const isDesc = orderBy === column && order === Order.desc;
    onPageChange(0);
    onOrderChange(isDesc ? Order.asc : Order.desc);
    onOrderByChange(column);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  const sortableHeader = (column: WalletTransactionOrderBy, label: string) => (
    <TableSortLabel active={orderBy === column} direction={order} onClick={e => handleSort(e, column)}>
      {label}
      {orderBy === column ? <span className={classes.visuallyHidden}>{order === Order.desc ? 'sorted descending' : 'sorted ascending'}</span> : null}
    </TableSortLabel>
  );

  const handleRemoveOrderTypeFilter = () => {
    onClearOrderTypeFilter();
  };

  const handleRemoveItemFilter = () => {
    onClearItemFilter();
  };

  return (
    <React.Fragment>
      {(orderType || characterFilter || itemFilter) && (
        <Toolbar className={classes.filterToolbar}>
          {orderType && <Chip label={`Buy/Sell: ${orderType}`} onDelete={handleRemoveOrderTypeFilter} variant={'outlined'} />}
          {characterFilter && <Chip label={`Character: ${characterFilter.name}`} onDelete={onClearCharacterFilter} variant={'outlined'} />}
          {itemFilter && <Chip label={`Item: ${itemFilter}`} onDelete={handleRemoveItemFilter} variant={'outlined'} />}
        </Toolbar>
      )}
      {loading && <LinearProgress />}
      <div className={classes.tableWrapper}>
        <Table size="small" aria-label="wallet transactions" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>{sortableHeader(WalletTransactionOrderBy.date, 'Date')}</TableCell>
              <TableCell>{sortableHeader(WalletTransactionOrderBy.character, 'Character')}</TableCell>
              <TableCell>{sortableHeader(WalletTransactionOrderBy.item, 'Item')}</TableCell>
              <TableCell align="right">{sortableHeader(WalletTransactionOrderBy.unitPrice, 'Price')}</TableCell>
              <TableCell align="right">{sortableHeader(WalletTransactionOrderBy.quantity, 'Quantity')}</TableCell>
              <TableCell align="right">{sortableHeader(WalletTransactionOrderBy.credit, 'Credit')}</TableCell>
              <TableCell>{sortableHeader(WalletTransactionOrderBy.client, 'Client')}</TableCell>
              <TableCell>{sortableHeader(WalletTransactionOrderBy.station, 'Station')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.character}</TableCell>
                <TableCell>{row.item}</TableCell>
                <TableCell align="right">{row.price}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right" className={row.isBuy ? classes.negative : classes.positive}>
                  {row.credit}
                </TableCell>
                <TableCell>{row.client}</TableCell>
                <TableCell>{row.station}</TableCell>
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

export default WalletTransactionsTab;
