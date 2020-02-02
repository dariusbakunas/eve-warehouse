import { getItemImageUrl } from '../utils/getItemImageUrl';
import {
  GetWarehouseItems,
  GetWarehouseItemsVariables,
  GetWarehouseItems_warehouse_items as WarehouseItem,
} from '../__generated__/GetWarehouseItems';
import { makeStyles, Theme } from '@material-ui/core';
import { RemoveItemsFromWarehouse, RemoveItemsFromWarehouseVariables } from '../__generated__/RemoveItemsFromWarehouse';
import { UpdateItemsInWarehouse, UpdateItemsInWarehouseVariables } from '../__generated__/UpdateItemsInWarehouse';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useSnackbar } from 'notistack';
import { GetWarehouses_warehouses as Warehouse } from '../__generated__/GetWarehouses';
import commonStyles from '../config/commonStyles';
import ConfirmDialog from '../dialogs/ConfirmDialog';
import DataTable from './DataTable';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import getWarehouseItemsQuery from '../queries/getWarehouseItems.graphql';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Maybe from 'graphql/tsutils/Maybe';
import React, { useState } from 'react';
import removeItemsFromWarehouseMutation from '../queries/removeItemsFromWarehouse.graphql';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import updateItemsInWarehouseMutation from '../queries/updateItemsInWarehouse.graphql';
import UpdateWarehouseItemDialog, { IFormData as IUpdateItemFormData } from '../dialogs/UpdateWarehouseItemDialog';
import useConfirmDialog from '../hooks/useConfirmDialog';

const useStyles = makeStyles<Theme>(theme => ({
  ...commonStyles(theme),
  root: {
    width: '100%',
    minHeight: '100px',
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
  expand: {
    marginLeft: 'auto',
  },
  title: {
    flex: '1 1 100%',
  },
}));

interface IWarehouseTileProps {
  warehouse: Warehouse;
  onItemUpdate?: (data: UpdateItemsInWarehouse) => void;
  onRemoveItems?: (ids: string[]) => void;
}

const WarehouseTile: React.FC<IWarehouseTileProps> = ({ onItemUpdate, onRemoveItems, warehouse }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [updateItemDialogOpen, setUpdateItemDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Maybe<WarehouseItem>>(null);
  const { confirmDialogProps, showAlert } = useConfirmDialog();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { loading: itemsLoading, data, refetch: refetchItems } = useQuery<GetWarehouseItems, GetWarehouseItemsVariables>(getWarehouseItemsQuery, {
    variables: {
      id: warehouse.id,
    },
  });

  const [removeItems, { loading: removeItemsLoading }] = useMutation<RemoveItemsFromWarehouse, RemoveItemsFromWarehouseVariables>(
    removeItemsFromWarehouseMutation,
    {
      onError: error => {
        enqueueSnackbar(`Failed to remove items: ${error.message}`, { variant: 'error', autoHideDuration: 5000 });
      },
      update: (store, { data }) => {
        if (data && data.removeItemsFromWarehouse) {
          const cache = store.readQuery<GetWarehouseItems, GetWarehouseItemsVariables>({
            query: getWarehouseItemsQuery,
            variables: { id: warehouse.id },
          });
          const removedIds = new Set(data.removeItemsFromWarehouse);

          if (cache && cache.warehouse && cache.warehouse.items) {
            cache.warehouse.items = cache.warehouse.items.filter(item => !removedIds.has(item.item.id));
            store.writeQuery<GetWarehouseItems, GetWarehouseItemsVariables>({
              query: getWarehouseItemsQuery,
              data: cache,
              variables: { id: warehouse.id },
            });
          }
        }
      },
      onCompleted: data => {
        enqueueSnackbar(`Items removed successfully`, { variant: 'success', autoHideDuration: 5000 });
        if (onRemoveItems) {
          onRemoveItems(data.removeItemsFromWarehouse);
        }
        setSelected(new Set());
      },
    }
  );

  const [updateItemsInWarehouse, { loading: updatingItemsInWarehouseLoading }] = useMutation<UpdateItemsInWarehouse, UpdateItemsInWarehouseVariables>(
    updateItemsInWarehouseMutation,
    {
      onError: error => {
        enqueueSnackbar(`Failed to update items: ${error.message}`, { variant: 'error', autoHideDuration: 5000 });
      },
      onCompleted: data => {
        enqueueSnackbar(`Items updated successfully`, { variant: 'success', autoHideDuration: 5000 });

        if (onItemUpdate) {
          onItemUpdate(data);
        }

        refetchItems({
          id: warehouse.id,
        });
      },
    }
  );

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

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && data && data.warehouse) {
      setSelected(new Set(data.warehouse.items.map(item => item.item.id)));
    } else {
      setSelected(new Set());
    }
  };

  const handleRemoveItems = () => {
    showAlert(`Remove selected items?`, `Selected items will be removed`, async confirm => {
      if (confirm) {
        removeItems({
          variables: {
            id: warehouse.id,
            itemIds: [...selected],
          },
        });
      }
    });
  };

  const handleUpdateItemSubmit = (data: IUpdateItemFormData) => {
    setUpdateItemDialogOpen(false);

    if (currentItem && data.qty && data.unitCost != null) {
      updateItemsInWarehouse({
        variables: {
          id: warehouse.id,
          input: [
            {
              id: currentItem.item.id,
              quantity: data.qty,
              unitCost: data.unitCost,
            },
          ],
        },
      });
    }
  };

  const handleRemoveItem = (item: WarehouseItem) => {
    showAlert(`Remove ${item.item.name}?`, `${item.item.name} will be removed`, async confirm => {
      if (confirm) {
        removeItems({
          variables: {
            id: warehouse.id,
            itemIds: [item.item.id],
          },
        });
      }
    });
  };

  const handleEditItem = (item: WarehouseItem) => {
    setCurrentItem(item);
    setUpdateItemDialogOpen(true);
  };

  const loading = itemsLoading || removeItemsLoading || updatingItemsInWarehouseLoading;

  return (
    <React.Fragment>
      <ExpansionPanelDetails>
        <div className={classes.root}>
          {loading && <LinearProgress />}
          {!!numSelected && (
            <Toolbar className={classes.selectToolbar}>
              <Typography className={classes.title} color="inherit" variant="subtitle1">
                {numSelected} selected
              </Typography>
              <Tooltip title="Remove">
                <IconButton aria-label="remove selected items from warehouse" onClick={handleRemoveItems}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Toolbar>
          )}
          {data && data.warehouse && (
            <DataTable<WarehouseItem, {}>
              idField={row => row.item.id}
              actions={[
                { icon: 'edit', onAction: handleEditItem },
                { icon: 'delete', onAction: handleRemoveItem },
              ]}
              columns={[
                {
                  field: row => row.item.name,
                  title: 'Name',
                  icon: {
                    imageUrl: row => getItemImageUrl(row.item.id, row.item.name),
                  },
                },
                { field: row => row.quantity.toLocaleString(), title: 'Quantity', align: 'right' },
                {
                  field: row => row.unitCost.toLocaleString(undefined, { maximumFractionDigits: 2 }),
                  title: 'Unit Cost, ISK',
                  align: 'right',
                  cellClassName: row =>
                    row.item.jitaPrice && row.item.jitaPrice.buy ? (row.unitCost < row.item.jitaPrice.buy ? classes.positive : classes.negative) : '',
                },
                {
                  field: row => (row.quantity * row.item.volume).toLocaleString(),
                  title: 'Volume, m³',
                  align: 'right',
                },
                {
                  field: row =>
                    row.item.jitaPrice && row.item.jitaPrice.buy
                      ? row.item.jitaPrice.buy.toLocaleString(undefined, { maximumFractionDigits: 2 })
                      : 'N/A',
                  title: 'Jita Cost, ISK',
                  align: 'right',
                },
                {
                  field: row => (row.unitCost * row.quantity).toLocaleString(undefined, { maximumFractionDigits: 2 }),
                  title: 'Total, ISK',
                  align: 'right',
                },
              ]}
              data={data.warehouse.items}
              size="small"
              aria-label="warehouse items"
              selectionOptions={{
                selected: selected,
                rowCount: data.warehouse.items.length,
                onRowSelect: handleRowSelect,
                onSelectAll: handleSelectAllClick,
              }}
            />
          )}
        </div>
      </ExpansionPanelDetails>
      <ConfirmDialog {...confirmDialogProps} />
      {currentItem && (
        <UpdateWarehouseItemDialog
          item={currentItem}
          open={updateItemDialogOpen}
          onCancel={() => setUpdateItemDialogOpen(false)}
          onSubmit={handleUpdateItemSubmit}
        />
      )}
    </React.Fragment>
  );
};

export default WarehouseTile;
