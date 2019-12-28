import { AddItemsToWarehouse, AddItemsToWarehouseVariables } from '../__generated__/AddItemsToWarehouse';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { getItemImageUrl } from '../utils/getItemImageUrl';
import { GetTransactionIds, GetTransactionIdsVariables } from '../__generated__/GetTransactionIds';
import {
  GetTransactions,
  GetTransactionsVariables,
  GetTransactions_walletTransactions_transactions as WalletTransaction,
} from '../__generated__/GetTransactions';
import { Order, OrderType, WalletTransactionOrderBy, WarehouseItemInput } from '../__generated__/globalTypes';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import { useSnackbar } from 'notistack';
import addItemsToWarehouseMutation from '../queries/addItemsToWarehouse.graphql';
import AddTransactionsToWarehouseDialog from '../dialogs/AddTransactionsToWarehouseDialog';
import Chip from '@material-ui/core/Chip';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import DataTable from './DataTable';
import getTransactionIdsQuery from '../queries/getTransactionIds.graphql';
import getTransactionsQuery from '../queries/getTransactions.graphql';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Maybe from 'graphql/tsutils/Maybe';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

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
    selectToolbar: {
      display: 'flex',
      background: theme.palette.primary.light,
      justifyContent: 'left',
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
    title: {
      flex: '1 1 100%',
    },
  })
);

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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [addToWarehouseDialogOpen, setAddToWarehouseDialogOpen] = useState(false);

  const [getTransactionIds, { loading: idsLoading, data: transactionIds }] = useLazyQuery<GetTransactionIds, GetTransactionIdsVariables>(
    getTransactionIdsQuery,
    {
      fetchPolicy: 'no-cache',
      onCompleted: data => {
        setSelected(new Set(data.walletTransactionIds));
      },
    }
  );

  useEffect(() => {
    // remove selection if filter changes
    setSelected(new Set());
  }, [characterFilter, orderType, itemFilter]);

  const { loading: transactionsLoading, data } = useQuery<GetTransactions, GetTransactionsVariables>(getTransactionsQuery, {
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

  const [addItemsToWarehouse, { loading: addingItemsToWarehouseLoading }] = useMutation<AddItemsToWarehouse, AddItemsToWarehouseVariables>(
    addItemsToWarehouseMutation,
    {
      onError: error => {
        enqueueSnackbar(`Failed to add items: ${error.message}`, { variant: 'error', autoHideDuration: 5000 });
      },
      onCompleted: () => {
        enqueueSnackbar(`Items added successfully`, { variant: 'success', autoHideDuration: 5000 });
      },
    }
  );

  const loading = transactionsLoading || idsLoading || addingItemsToWarehouseLoading;

  const handleSort = (column: WalletTransactionOrderBy) => {
    onPageChange(0);
    onOrderByChange(column);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  const handleRemoveOrderTypeFilter = () => {
    onClearOrderTypeFilter();
  };

  const handleRemoveItemFilter = () => {
    onClearItemFilter();
  };

  const numSelected = selected.size;

  const handleRowSelect = (event: React.MouseEvent<unknown>, id: string) => {
    const newSelected = new Set(selected);

    if (selected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }

    setSelected(newSelected);
  };

  const handleAddTransactionsToWarehouse = (warehouseId: string, items: WarehouseItemInput[]) => {
    addItemsToWarehouse({
      variables: {
        id: warehouseId,
        input: items,
      },
    });
    setAddToWarehouseDialogOpen(false);
  };

  const tableData = data ? data.walletTransactions.transactions : null;
  const total = data ? data.walletTransactions.total : 0;

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      if (data && data.walletTransactions) {
        if (total > data.walletTransactions.transactions.length) {
          // if this is paged we need to get all ids
          getTransactionIds({
            variables: {
              filter: {
                characterId: characterFilter ? characterFilter.id : null,
                orderType,
                item: itemFilter,
              },
            },
          });
        } else {
          setSelected(new Set(data.walletTransactions.transactions.map(transaction => transaction.id)));
        }
      }
    } else {
      setSelected(new Set());
    }
  };

  return (
    <React.Fragment>
      {!numSelected && (
        <Toolbar className={classes.filterToolbar}>
          <Typography className={classes.title} color="inherit" variant="overline">
            Last update: {data ? moment(data.walletTransactions.lastUpdate).format('MM/DD/YYYY HH:mm') : 'N/A'}
          </Typography>
        </Toolbar>
      )}
      {!!numSelected && (
        <Toolbar className={classes.selectToolbar}>
          <Typography className={classes.title} color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
          <Tooltip title="Add to warehouse">
            <IconButton aria-label="add to warehouse" onClick={() => setAddToWarehouseDialogOpen(true)}>
              <CreateNewFolderIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      )}
      {(orderType || characterFilter || itemFilter) && (
        <Toolbar className={classes.filterToolbar}>
          {orderType && <Chip label={`Buy/Sell: ${orderType}`} onDelete={handleRemoveOrderTypeFilter} variant={'outlined'} />}
          {characterFilter && <Chip label={`Character: ${characterFilter.name}`} onDelete={onClearCharacterFilter} variant={'outlined'} />}
          {itemFilter && <Chip label={`Item: ${itemFilter}`} onDelete={handleRemoveItemFilter} variant={'outlined'} />}
        </Toolbar>
      )}
      {loading && <LinearProgress />}
      <DataTable<WalletTransaction, WalletTransactionOrderBy>
        idField="id"
        columns={[
          { field: row => moment(row.date).format('MM/DD/YYYY HH:mm'), title: 'Date', orderBy: WalletTransactionOrderBy.date },
          { field: row => (row.character ? row.character.name : null), title: 'Character', orderBy: WalletTransactionOrderBy.character },
          {
            field: row => (row.item ? row.item.name : null),
            title: 'Item',
            orderBy: WalletTransactionOrderBy.item,
            icon: {
              imageUrl: row => getItemImageUrl(row.item.id, row.item.name),
            },
          },
          { field: row => (row.item ? row.item.invGroup.name : null), title: 'Group', orderBy: WalletTransactionOrderBy.invGroup },
          { field: row => row.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }), title: 'Price', align: 'right' },
          { field: row => row.quantity.toLocaleString(), title: 'Quantity', align: 'right' },
          {
            field: row => row.credit.toLocaleString(undefined, { minimumFractionDigits: 2 }),
            title: 'Credit',
            align: 'right',
            cellClassName: row => (row.isBuy ? classes.negative : classes.positive),
          },
          { field: row => row.location.name, title: 'Station' },
        ]}
        data={tableData}
        size="small"
        pagingOptions={{
          page: page,
          rowCount: total,
          rowsPerPage: rowsPerPage,
          onChangePage: handleChangePage,
          onChangeRowsPerPage: handleChangeRowsPerPage,
        }}
        selectionOptions={{
          selected: selected,
          rowCount: total,
          onRowSelect: handleRowSelect,
          onSelectAll: handleSelectAllClick,
        }}
        sortingOptions={{
          order: order,
          orderBy: orderBy,
          onOrderByChange: handleSort,
          onOrderChange: onOrderChange,
        }}
      />
      <AddTransactionsToWarehouseDialog
        open={addToWarehouseDialogOpen}
        transactionIds={selected}
        onSubmit={handleAddTransactionsToWarehouse}
        onCancel={() => setAddToWarehouseDialogOpen(false)}
      />
    </React.Fragment>
  );
};

export default WalletTransactionsTab;
