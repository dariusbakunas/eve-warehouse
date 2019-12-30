import { CharacterMarketOrderOrderBy, Order, OrderStateFilter } from '../__generated__/globalTypes';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { getItemImageUrl } from '../utils/getItemImageUrl';
import {
  GetMarketOrders,
  GetMarketOrdersVariables,
  GetMarketOrders_characterMarketOrders_orders as MarketOrder,
} from '../__generated__/getMarketOrders';
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
  })
);

interface IWalletOrdersTab {
  orderStateFilter: OrderStateFilter;
  characterFilter: Maybe<{ id: string; name: string }>;
  onPageChange: (page: number) => void;
  order: Order;
  orderBy: CharacterMarketOrderOrderBy;
  onClearCharacterFilter: () => void;
  onRowsPerPageChange: (rows: number) => void;
  onOrderChange: (order: Order) => void;
  onOrderByChange: (orderBy: CharacterMarketOrderOrderBy) => void;
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

  const tableData = data ? data.characterMarketOrders.orders : null;
  const total = data ? data.characterMarketOrders.total : 0;

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  const handleSort = (column: CharacterMarketOrderOrderBy) => {
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
      <DataTable<MarketOrder, CharacterMarketOrderOrderBy>
        idField="id"
        columns={[
          { field: row => moment(row.issued).format('MM/DD/YYYY HH:mm'), title: 'Issued', orderBy: CharacterMarketOrderOrderBy.issued },
          {
            field: row =>
              moment(row.issued)
                .add(row.duration, 'days')
                .format('MM/DD/YYYY HH:mm'),
            title: 'Expires',
          },
          {
            field: row => (row.character ? row.character.name : null),
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
              imageUrl: row => getItemImageUrl(row.item.id, row.item.name),
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
    </React.Fragment>
  );
};

export default WalletOrdersTab;
