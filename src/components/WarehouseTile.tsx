import { AddItemsToWarehouse, AddItemsToWarehouseVariables } from '../__generated__/AddItemsToWarehouse';
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
import AddIcon from '@material-ui/icons/Add';
import addItemsToWarehouseMutation from '../queries/addItemsToWarehouse.graphql';
import AddItemToWarehouseDialog, { IFormData as IAddItemFormData } from '../dialogs/AddItemToWarehouseDialog';
import Button from '@material-ui/core/Button';
import commonStyles from '../config/commonStyles';
import ConfirmDialog from '../dialogs/ConfirmDialog';
import DataTable from './DataTable';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import getWarehouseItemsQuery from '../queries/getWarehouseItems.graphql';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Maybe from 'graphql/tsutils/Maybe';
import React, { useMemo, useState } from 'react';
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
  onRemoveWarehouse?: (id: string, name: string) => void;
  warehouse: Warehouse;
}

const WarehouseTile: React.FC<IWarehouseTileProps> = ({ onRemoveWarehouse, warehouse }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [addItemToWarehouseDialogOpen, setAddItemToWarehouseDialogOpen] = useState(false);
  const [updateItemDialogOpen, setUpdateItemDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Maybe<WarehouseItem>>(null);
  const { confirmDialogProps, showAlert } = useConfirmDialog();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { loading: itemsLoading, data, refetch: refetchItems } = useQuery<GetWarehouseItems, GetWarehouseItemsVariables>(getWarehouseItemsQuery, {
    fetchPolicy: 'no-cache',
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
      onCompleted: data => {
        enqueueSnackbar(`Items removed successfully`, { variant: 'success', autoHideDuration: 5000 });
        refetchItems({
          id: warehouse.id,
        });
        setSelected(new Set());
      },
    }
  );

  const [addItemsToWarehouse, { loading: addingItemsToWarehouseLoading }] = useMutation<AddItemsToWarehouse, AddItemsToWarehouseVariables>(
    addItemsToWarehouseMutation,
    {
      onError: error => {
        enqueueSnackbar(`Failed to add items: ${error.message}`, { variant: 'error', autoHideDuration: 5000 });
      },
      onCompleted: () => {
        enqueueSnackbar(`Items added successfully`, { variant: 'success', autoHideDuration: 5000 });
        refetchItems({
          id: warehouse.id,
        });
      },
    }
  );

  const [updateItemsInWarehouse, { loading: updatingItemsInWarehouseLoading }] = useMutation<UpdateItemsInWarehouse, UpdateItemsInWarehouseVariables>(
    updateItemsInWarehouseMutation,
    {
      onError: error => {
        enqueueSnackbar(`Failed to update items: ${error.message}`, { variant: 'error', autoHideDuration: 5000 });
      },
      onCompleted: () => {
        enqueueSnackbar(`Items updated successfully`, { variant: 'success', autoHideDuration: 5000 });
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

  const handleAddItemToWarehouseDialogCancel = () => {
    setAddItemToWarehouseDialogOpen(false);
  };

  const handleAddItemToWarehouseDialogSubmit = (data: IAddItemFormData) => {
    setAddItemToWarehouseDialogOpen(false);

    if (data.item && data.qty && data.unitCost) {
      addItemsToWarehouse({
        variables: {
          id: warehouse.id,
          input: [
            {
              id: data.item.id,
              quantity: data.qty,
              unitCost: data.unitCost,
            },
          ],
        },
      });
    }
  };

  const handleAddItem = () => {
    setAddItemToWarehouseDialogOpen(true);
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

  const handleRemoveWarehouse = (id: string, name: string) => {
    if (onRemoveWarehouse) {
      onRemoveWarehouse(id, name);
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

  const loading = itemsLoading || removeItemsLoading || addingItemsToWarehouseLoading || updatingItemsInWarehouseLoading;

  return (
    <React.Fragment>
      <ExpansionPanelDetails>
        <div className={classes.root}>
          {loading && <LinearProgress />}
          <Toolbar className={classes.selectToolbar} style={{ visibility: numSelected > 0 ? 'visible' : 'hidden'}}>
            <Typography className={classes.title} color="inherit" variant="subtitle1">
              {numSelected} selected
            </Typography>
            <Tooltip title="Remove">
              <IconButton aria-label="remove selected items from warehouse" onClick={handleRemoveItems}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
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
                { field: row => row.unitCost.toLocaleString(undefined, { maximumFractionDigits: 2 }), title: 'Unit Cost, ISK', align: 'right' },
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
      <ExpansionPanelActions>
        <Button variant="contained" color="primary" onClick={handleAddItem} startIcon={<AddIcon />} disabled={loading}>
          Add Item
        </Button>
        <Button variant="contained" onClick={() => handleRemoveWarehouse(warehouse.id, warehouse.name)} startIcon={<DeleteIcon />} disabled={loading}>
          Remove Warehouse
        </Button>
      </ExpansionPanelActions>
      <ConfirmDialog {...confirmDialogProps} />
      <AddItemToWarehouseDialog
        open={addItemToWarehouseDialogOpen}
        onCancel={handleAddItemToWarehouseDialogCancel}
        onSubmit={handleAddItemToWarehouseDialogSubmit}
      />
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
