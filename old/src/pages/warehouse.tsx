import { AddItemsToWarehouse, AddItemsToWarehouseVariables } from '../__generated__/AddItemsToWarehouse';
import { AddWarehouse, AddWarehouseVariables } from '../__generated__/AddWarehouse';
import { GetWarehouses, GetWarehouses_warehouses as Warehouse } from '../__generated__/GetWarehouses';
import { makeStyles, Theme } from '@material-ui/core';
import { RemoveWarehouse, RemoveWarehouseVariables } from '../__generated__/RemoveWarehouse';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useSnackbar } from 'notistack';
import AddIcon from '@material-ui/icons/AddCircle';
import addItemsToWarehouseMutation from '../queries/addItemsToWarehouse.graphql';
import AddItemToWarehouseDialog, { IFormData as IAddItemFormData } from '../dialogs/AddItemToWarehouseDialog';
import addWarehouseMutation from '../queries/addWarehouse.graphql';
import Button from '@material-ui/core/Button';
import ConfirmDialog from '../dialogs/ConfirmDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import getWarehouseItemsQuery from '../queries/getWarehouseItems.graphql';
import getWarehousesQuery from '../queries/getWarehouses.graphql';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import React, { useState } from 'react';
import removeWarehouseMutation from '../queries/removeWarehouse.graphql';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import useConfirmDialog from '../hooks/useConfirmDialog';
import useDialog from '../hooks/useDialog';
import WarehouseDialog from '../dialogs/WarehouseDialog';
import WarehouseTile from '../components/WarehouseTile';
import withApollo from '../lib/withApollo';
import withWidth, { WithWidthProps } from '@material-ui/core/withWidth';
import { addItemsToWarehouseUpdate } from '../cache/addItemsToWarehouseUpdate';

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    padding: theme.spacing(2),
    width: '100%',
  },
  panelSummary: {
    margin: 0,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  deleteButton: {
    color: theme.palette.error.main,
  },
  secondaryHeading: {
    //color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightLight,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(2),
  },
  paper: {
    width: 'calc(100vw - 120px)',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  scopes: {
    height: '200px',
    overflow: 'auto',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const WarehousePage: React.FC<WithWidthProps> = ({ width }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const {
    open: openAddItemToWarehouseDialog,
    close: closeAddItemToWarehouseDialog,
    isOpen: addItemToWarehouseDialogIsOpen,
    dialogProps: addItemToWarehouseDialogProps,
  } = useDialog<{ warehouseId: number; warehouseName: string }>();
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const { confirmDialogProps, showAlert } = useConfirmDialog();
  const [isWarehouseDialogOpen, setWarehouseDialogOpen] = useState(false);

  const { loading: warehousesLoading, data: warehousesResponse, refetch: refetchWarehouses } = useQuery<GetWarehouses>(getWarehousesQuery);

  const [addWarehouse, { loading: warehouseAddLoading }] = useMutation<AddWarehouse, AddWarehouseVariables>(addWarehouseMutation, {
    onError: error => {
      enqueueSnackbar(`Failed to add new warehouse: ${error.message}`, { variant: 'error', autoHideDuration: 5000 });
    },
    onCompleted: data => {
      enqueueSnackbar(`Warehouse '${data.addWarehouse.name}' added successfully`, { variant: 'success', autoHideDuration: 5000 });
    },
    update(store, { data }) {
      if (data) {
        const cache = store.readQuery<GetWarehouses>({
          query: getWarehousesQuery,
        });

        if (cache) {
          const newWarehouse: Warehouse = {
            ...data.addWarehouse,
            summary: {
              __typename: 'WarehouseSummary',
              totalCost: 0,
              totalVolume: 0,
            },
          };

          store.writeQuery({
            query: getWarehousesQuery,
            data: {
              warehouses: cache.warehouses.concat([newWarehouse]),
            },
          });
        }
      }
    },
  });

  const [removeWarehouse, { loading: warehouseRemoveLoading }] = useMutation<RemoveWarehouse, RemoveWarehouseVariables>(removeWarehouseMutation, {
    onError: error => {
      enqueueSnackbar(`Warehouse removal failed: ${error.message}`);
    },
    onCompleted: data => {
      refetchWarehouses();
      enqueueSnackbar(`Warehouse removed successfully`, { variant: 'success', autoHideDuration: 5000 });
    },
  });

  const [addItemsToWarehouse, { loading: addingItemsToWarehouseLoading }] = useMutation<AddItemsToWarehouse, AddItemsToWarehouseVariables>(
    addItemsToWarehouseMutation,
    {
      onError: error => {
        enqueueSnackbar(`Failed to add items: ${error.message}`, { variant: 'error', autoHideDuration: 5000 });
      },
      update: addItemsToWarehouseUpdate,
      onCompleted: () => {
        enqueueSnackbar(`Items added successfully`, { variant: 'success', autoHideDuration: 5000 });
        refetchWarehouses();
      },
    }
  );

  const handleWarehouseDialogCancel = () => {
    setWarehouseDialogOpen(false);
  };

  const handleWarehouseDialogSubmit = (name: string) => {
    addWarehouse({
      variables: {
        name,
      },
    });
    setWarehouseDialogOpen(false);
  };

  //const cellHeight = warehousesLoading ? 80 : 'auto';
  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleRemoveWarehouse = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string, name: string) => {
    event.stopPropagation();
    showAlert(`Remove warehouse '${name}'?`, `Warehouse '${name}' will be removed`, async confirm => {
      if (confirm) {
        removeWarehouse({
          variables: {
            id: id,
          },
        });
      }
    });
  };

  const handleAddItemToWarehouseDialogCancel = () => {
    closeAddItemToWarehouseDialog();
  };

  const handleAddItemToWarehouseDialogSubmit = (data: IAddItemFormData) => {
    closeAddItemToWarehouseDialog();

    if (data.item && data.qty && data.unitCost) {
      addItemsToWarehouse({
        variables: {
          id: `${data.warehouseId}`,
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

  const handleAddItemToWarehouse = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, warehouseId: number, warehouseName: string) => {
    event.stopPropagation();
    openAddItemToWarehouseDialog({ warehouseId, warehouseName });
  };

  const loading = warehousesLoading || warehouseAddLoading || warehouseRemoveLoading || addingItemsToWarehouseLoading;

  return (
    <div className={classes.root}>
      {loading && <LinearProgress />}
      {warehousesResponse &&
        warehousesResponse.warehouses &&
        warehousesResponse.warehouses.map(warehouse => (
          <ExpansionPanel
            key={warehouse.id}
            expanded={expanded === `panel-${warehouse.id}`}
            onChange={handleChange(`panel-${warehouse.id}`)}
            TransitionProps={{ unmountOnExit: true, timeout: 0 }}
          >
            <ExpansionPanelSummary
              classes={{
                content: classes.panelSummary,
              }}
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${warehouse.id}-content`}
              id={`panel-${warehouse.id}-header`}
            >
              <Grid container spacing={0} alignItems="center">
                <Grid item xs={true}>
                  <Typography className={classes.heading}>{warehouse.name}</Typography>
                </Grid>
                <Grid item xs>
                  <Typography className={classes.secondaryHeading} noWrap>{`Cost: ${warehouse.summary.totalCost.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })} ISK`}</Typography>
                </Grid>
                <Grid item xs>
                  <Typography className={classes.secondaryHeading} noWrap>{`Volume: ${warehouse.summary.totalVolume.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })} m³`}</Typography>
                </Grid>
                <Grid item xs={false}>
                  <Tooltip title="Add Item">
                    <IconButton aria-label="Add item" onClick={e => handleAddItemToWarehouse(e, +warehouse.id, warehouse.name)}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remove Warehouse">
                    <IconButton
                      className={classes.deleteButton}
                      aria-label="Remove warehouse"
                      onClick={e => handleRemoveWarehouse(e, warehouse.id, warehouse.name)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            <WarehouseTile warehouse={warehouse} onRemoveItems={() => refetchWarehouses()} onItemUpdate={() => refetchWarehouses()} />
          </ExpansionPanel>
        ))}
      <Button color="primary" onClick={() => setWarehouseDialogOpen(true)} disabled={loading}>
        Add Warehouse
      </Button>
      {addItemToWarehouseDialogIsOpen && addItemToWarehouseDialogProps && (
        <AddItemToWarehouseDialog
          open={addItemToWarehouseDialogIsOpen}
          onCancel={handleAddItemToWarehouseDialogCancel}
          onSubmit={handleAddItemToWarehouseDialogSubmit}
          {...addItemToWarehouseDialogProps}
        />
      )}
      <ConfirmDialog {...confirmDialogProps} />
      <WarehouseDialog open={isWarehouseDialogOpen} onCancel={handleWarehouseDialogCancel} onSubmit={handleWarehouseDialogSubmit} />
    </div>
  );
};

export default withWidth()(withApollo(WarehousePage));
