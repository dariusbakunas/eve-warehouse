import React, { ChangeEvent, useCallback, useMemo } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Toolbar from '@material-ui/core/Toolbar';
import debounce from 'lodash.debounce';
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filterToolbar: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    negative: {
      color: '#8b251f',
    },
    positive: {
      color: '#187119',
    },
    spacer: {
      flex: '1 1 100%',
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
  itemFilter: Maybe<string>;
  onItemFilterChange: (filter: string) => void;
  order: Order;
  orderBy: WalletTransactionOrderBy;
  orderType: Maybe<OrderType>;
  page: number;
  onPageChange: (page: number) => void;
  onOrderChange: (order: Order) => void;
  onOrderByChange: (orderBy: WalletTransactionOrderBy) => void;
  onOrderTypeChange: (orderType: Maybe<OrderType>) => void;
  onRowsPerPageChange: (rows: number) => void;
  rowsPerPage: number;
}

const WalletTransactionsTab: React.FC<IWalletTransactionsTab> = ({
  itemFilter,
  order,
  orderBy,
  page,
  onItemFilterChange,
  orderType,
  onOrderChange,
  onOrderByChange,
  onOrderTypeChange,
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

  const handleBuySellChange = (event: ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    onPageChange(0);
    if (value === 'all') {
      onOrderTypeChange(null);
    } else {
      onOrderTypeChange(value === 'buy' ? OrderType.buy : OrderType.sell);
    }
  };

  const setItemFilterDebounced = debounce(filter => {
    onPageChange(0);
    onItemFilterChange(filter);
  }, 500);

  const handleItemFilterChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value as string;

    if (value.length) {
      setItemFilterDebounced(value);
    } else {
      setItemFilterDebounced(null);
    }
  }, []);

  return (
    <React.Fragment>
      <Toolbar className={classes.filterToolbar}>
        <FormControl className={classes.formControl}>
          <InputLabel id="order-type-label">Buy/Sell</InputLabel>
          <Select labelId="order-type-label" id="order-type-select" onChange={handleBuySellChange} value={orderType || 'all'}>
            <MenuItem value={'all'}>Both</MenuItem>
            <MenuItem value={'buy'}>Buy</MenuItem>
            <MenuItem value={'sell'}>Sell</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.spacer}>
          <InputLabel htmlFor="item-search-label">Item</InputLabel>
          <Input
            id="item-search-input"
            onChange={handleItemFilterChange}
            defaultValue={itemFilter}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
          />
        </FormControl>
      </Toolbar>
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
