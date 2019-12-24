import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { GetMarketOrders, GetMarketOrdersVariables, GetMarketOrders_marketOrders_orders as MarketOrder } from '../__generated__/getMarketOrders';
import { MarketOrderOrderBy, Order, OrderStateFilter } from '../__generated__/globalTypes';
import { useQuery } from '@apollo/react-hooks';
import { useSnackbar } from 'notistack';
import Chip from '@material-ui/core/Chip';
import DataTable from './DataTable';
import getMarketOrdersQuery from '../queries/getMarketOrders.graphql';
import LinearProgress from '@material-ui/core/LinearProgress';
import Maybe from 'graphql/tsutils/Maybe';
import moment from 'moment';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';

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

  const tableData = data ? data.marketOrders.orders : null;
  const total = data ? data.marketOrders.total : 0;

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  const handleSort = (column: MarketOrderOrderBy) => {
    onPageChange(0);
    onOrderByChange(column);
  };

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
      <DataTable<MarketOrder, MarketOrderOrderBy>
        idField="id"
        columns={[
          { field: row => moment(row.issued).format('MM/DD/YYYY HH:mm'), title: 'Issued', orderBy: MarketOrderOrderBy.issued },
          {
            field: row =>
              moment(row.issued)
                .add(row.duration, 'days')
                .format('MM/DD/YYYY HH:mm'),
            title: 'Expires',
          },
          {
            field: row => row.character ? row.character.name : null,
            title: 'Character',
          },
          {
            field: row => (row.isBuy ? 'buy' : 'sell'),
            title: 'Buy/Sell',
          },
          {
            field: row => row.item.name,
            title: 'Item',
            icon: {
              imageUrl: row => `https://images.evetech.net/types/${row.item.id}/icon`,
            },
          },
          {
            field: row => `${row.volumeRemain.toLocaleString()}/${row.volumeTotal.toLocaleString()}`,
            title: 'Quantity',
            align: 'right',
          },
          {
            field: row => row.price.toLocaleString(undefined, { minimumFractionDigits: 2 }),
            title: 'Price',
            align: 'right',
          },
          {
            field: row => row.state,
            title: 'State',
          },
          {
            field: row => row.location.name,
            title: 'Station',
          },
        ]}
        data={tableData}
        pagingOptions={{
          page: page,
          rowCount: total,
          rowsPerPage: rowsPerPage,
          onChangePage: handleChangePage,
          onChangeRowsPerPage: handleChangeRowsPerPage,
        }}
        size="small"
        sortingOptions={{
          order: order,
          orderBy: orderBy,
          onOrderByChange: handleSort,
          onOrderChange: onOrderChange,
        }}
      />
      {/*<div className={classes.tableWrapper}>*/}
      {/*  <Table size="small" aria-label="wallet transactions" className={classes.table}>*/}
      {/*    <TableHead>*/}
      {/*      <TableRow>*/}
      {/*        <TableCell>{sortableHeader(MarketOrderOrderBy.issued, 'Issued')}</TableCell>*/}
      {/*        <TableCell>Expires</TableCell>*/}
      {/*        <TableCell>Character</TableCell>*/}
      {/*        <TableCell>Buy/Sell</TableCell>*/}
      {/*        <TableCell>Item</TableCell>*/}
      {/*        <TableCell align="right">Quantity</TableCell>*/}
      {/*        <TableCell align="right">Price</TableCell>*/}
      {/*        <TableCell>State</TableCell>*/}
      {/*        <TableCell>Station</TableCell>*/}
      {/*      </TableRow>*/}
      {/*    </TableHead>*/}
      {/*    <TableBody>*/}
      {/*      {rows.map(row => (*/}
      {/*        <TableRow key={row.id}>*/}
      {/*          <TableCell>{row.issued}</TableCell>*/}
      {/*          <TableCell>{row.expiresAt}</TableCell>*/}
      {/*          <TableCell>{row.character}</TableCell>*/}
      {/*          <TableCell>{row.buySell}</TableCell>*/}
      {/*          <TableCell>{row.item}</TableCell>*/}
      {/*          <TableCell align="right">{row.quantity}</TableCell>*/}
      {/*          <TableCell align="right">{row.price}</TableCell>*/}
      {/*          <TableCell>{row.state}</TableCell>*/}
      {/*          <TableCell>{row.station}</TableCell>*/}
      {/*        </TableRow>*/}
      {/*      ))}*/}
      {/*    </TableBody>*/}
      {/*  </Table>*/}
      {/*</div>*/}
      {/*<TablePagination*/}
      {/*  rowsPerPageOptions={[5, 10, 15, 25]}*/}
      {/*  component="div"*/}
      {/*  count={total}*/}
      {/*  rowsPerPage={rowsPerPage}*/}
      {/*  page={page}*/}
      {/*  backIconButtonProps={{*/}
      {/*    'aria-label': 'previous page',*/}
      {/*  }}*/}
      {/*  nextIconButtonProps={{*/}
      {/*    'aria-label': 'next page',*/}
      {/*  }}*/}
      {/*  onChangePage={handleChangePage}*/}
      {/*  onChangeRowsPerPage={handleChangeRowsPerPage}*/}
      {/*/>*/}
    </React.Fragment>
  );
};

export default WalletOrdersTab;
