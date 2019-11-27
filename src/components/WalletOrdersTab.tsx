import React from 'react';
import { createStyles, makeStyles, TableRow, Theme } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import getMarketOrdersQuery from '../queries/getMarketOrders.graphql';
import { useQuery } from '@apollo/react-hooks';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import moment from 'moment';
import { Order, MarketOrderOrderBy, OrderStateFilter } from '../__generated__/globalTypes';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Maybe from 'graphql/tsutils/Maybe';
import Toolbar from '@material-ui/core/Toolbar';
import Chip from '@material-ui/core/Chip';
import { GetMarketOrders, GetMarketOrdersVariables } from '../__generated__/getMarketOrders';

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
  issued: string;
  item: Maybe<string>;
  quantity: string;
  state: string;
  price: string;
  buySell: string;
  expiresAt: string;
  station: string;
}

const getTableData: (data?: GetMarketOrders) => { rows: ITableRow[]; total: number } = data => {
  if (!data || !data.marketOrders) {
    return {
      total: 0,
      rows: [],
    };
  }

  const {
    marketOrders: { orders, total },
  } = data;

  const rows = orders.map(order => ({
    id: order.id,
    character: order.character ? order.character.name : null,
    issued: moment(order.issued).format('MM/DD/YYYY HH:mm'),
    item: order.item ? order.item.name : null,
    quantity: `${order.volumeRemain.toLocaleString()}/${order.volumeTotal.toLocaleString()}`,
    price: order.price.toLocaleString(undefined, { minimumFractionDigits: 2 }),
    state: order.state,
    buySell: order.isBuy ? 'buy' : 'sell',
    expiresAt: moment(order.issued)
      .add(order.duration, 'days')
      .format('MM/DD/YYYY HH:mm'),
    station: order.location.name,
  }));

  return {
    total: total,
    rows: rows,
  };
};

interface IWalletOrdersTab {
  orderStateFilter: OrderStateFilter;
  characterFilter: Maybe<{ id: string; name: string }>;
  onPageChange: (page: number) => void;
  order: Order;
  orderBy: MarketOrderOrderBy;
  onClearCharacterFilter: () => void;
  onRowsPerPageChange: (rows: number) => void;
  onOrderChange: (order: Order) => void;
  onOrderByChange: (orderBy: MarketOrderOrderBy) => void;
  onOrderStateFilterChange: (state: OrderStateFilter) => void;
  page: number;
  rowsPerPage: number;
}

const WalletOrdersTab: React.FC<IWalletOrdersTab> = ({
  characterFilter,
  page,
  order,
  orderBy,
  onClearCharacterFilter,
  orderStateFilter,
  onOrderStateFilterChange,
  onPageChange,
  onOrderChange,
  onOrderByChange,
  onRowsPerPageChange,
  rowsPerPage,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { data, loading } = useQuery<GetMarketOrders, GetMarketOrdersVariables>(getMarketOrdersQuery, {
    variables: {
      page: {
        index: page,
        size: rowsPerPage,
      },
      filter: {
        characterId: characterFilter ? characterFilter.id : null,
        state: orderStateFilter,
      },
      orderBy: {
        column: orderBy,
        order: order,
      },
    },
    onError: error => {
      enqueueSnackbar(`Market orders failed to load: ${error.message}`, { variant: 'error', autoHideDuration: 5000 });
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

  const handleSort = (event: React.MouseEvent<unknown>, column: MarketOrderOrderBy) => {
    const isDesc = orderBy === column && order === Order.desc;
    onPageChange(0);
    onOrderChange(isDesc ? Order.asc : Order.desc);
    onOrderByChange(column);
  };

  const sortableHeader = (column: MarketOrderOrderBy, label: string) => (
    <TableSortLabel active={orderBy === column} direction={order} onClick={e => handleSort(e, column)}>
      {label}
      {orderBy === column ? <span className={classes.visuallyHidden}>{order === Order.desc ? 'sorted descending' : 'sorted ascending'}</span> : null}
    </TableSortLabel>
  );

  const clearOrderStateFilter = (name: string) => () => {
    const newState = {
      ...orderStateFilter,
      [name]: false,
    };

    onOrderStateFilterChange(newState);
  };

  return (
    <React.Fragment>
      {(characterFilter || orderStateFilter.active || orderStateFilter.cancelled || orderStateFilter.expired) && (
        <Toolbar className={classes.filterToolbar}>
          {characterFilter && <Chip label={`Character: ${characterFilter.name}`} onDelete={onClearCharacterFilter} variant={'outlined'} />}
          {orderStateFilter.active && <Chip label={'State: active'} onDelete={clearOrderStateFilter('active')} variant={'outlined'} />}
          {orderStateFilter.expired && <Chip label={'State: expired'} onDelete={clearOrderStateFilter('expired')} variant={'outlined'} />}
          {orderStateFilter.cancelled && <Chip label={'State: cancelled'} onDelete={clearOrderStateFilter('cancelled')} variant={'outlined'} />}
        </Toolbar>
      )}
      {loading && <LinearProgress />}
      <div className={classes.tableWrapper}>
        <Table size="small" aria-label="wallet transactions" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>{sortableHeader(MarketOrderOrderBy.issued, 'Issued')}</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Character</TableCell>
              <TableCell>Buy/Sell</TableCell>
              <TableCell>Item</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Station</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.issued}</TableCell>
                <TableCell>{row.expiresAt}</TableCell>
                <TableCell>{row.character}</TableCell>
                <TableCell>{row.buySell}</TableCell>
                <TableCell>{row.item}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">{row.price}</TableCell>
                <TableCell>{row.state}</TableCell>
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

export default WalletOrdersTab;
