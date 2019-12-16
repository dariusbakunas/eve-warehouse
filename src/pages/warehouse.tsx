import { AddWarehouse, AddWarehouseVariables } from '../__generated__/AddWarehouse';
import { GetWarehouses } from '../__generated__/GetWarehouses';
import { makeStyles, Theme } from '@material-ui/core';
import { RemoveWarehouse, RemoveWarehouseVariables } from '../__generated__/RemoveWarehouse';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useSnackbar } from 'notistack';
import AddIcon from '@material-ui/icons/Add';
import AddItemToWarehouseDialog from '../dialogs/AddItemToWarehouseDialog';
import addWarehouseMutation from '../queries/addWarehouse.graphql';
import Button from '@material-ui/core/Button';
import ConfirmDialog from '../dialogs/ConfirmDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import getWarehousesQuery from '../queries/getWarehouses.graphql';
import LinearProgress from '@material-ui/core/LinearProgress';
import React, { useState } from 'react';
import removeWarehouseMutation from '../queries/removeWarehouse.graphql';
import Typography from '@material-ui/core/Typography';
import useConfirmDialog from '../hooks/useConfirmDialog';
import WarehouseDialog from '../dialogs/WarehouseDialog';
import WarehouseTile from '../components/WarehouseTile';
import withApollo from '../lib/withApollo';
import withWidth, { isWidthUp, WithWidthProps } from '@material-ui/core/withWidth';

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    padding: theme.spacing(2),
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
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
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const { confirmDialogProps, showAlert } = useConfirmDialog();
  const [isWarehouseDialogOpen, setWarehouseDialogOpen] = useState(false);
  const [addItemToWarehouseDialogOpen, setAddItemToWarehouseDialogOpen] = useState(false);

  const { loading: warehousesLoading, data: warehousesResponse, refetch: refetchWarehouses } = useQuery<GetWarehouses>(getWarehousesQuery);

  const [addWarehouse, { loading: warehouseAddLoading }] = useMutation<AddWarehouse, AddWarehouseVariables>(addWarehouseMutation, {
    onError: error => {
      enqueueSnackbar(`Failed to add new warehouse: ${error.message}`, { variant: 'error', autoHideDuration: 5000 });
    },
    onCompleted: data => {
      enqueueSnackbar(`Warehouse '${data.addWarehouse.name}' added successfully`, { variant: 'success', autoHideDuration: 5000 });
    },
    update(cache, { data }) {
      if (data) {
        const queryResponse = cache.readQuery<GetWarehouses>({
          query: getWarehousesQuery,
        });

        if (queryResponse) {
          cache.writeQuery({
            query: getWarehousesQuery,
            data: {
              warehouses: queryResponse.warehouses.concat([data.addWarehouse]),
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

  const handleAddItemToWarehouseDialogCancel = () => {
    setAddItemToWarehouseDialogOpen(false);
  };

  const handleRemoveWarehouse = (id: string, name: string) => {
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

  const handleAddItem = (id: string, name: string) => {
    setAddItemToWarehouseDialogOpen(true);
  };

  //const cellHeight = warehousesLoading ? 80 : 'auto';
  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const loading = warehousesLoading || warehouseAddLoading || warehouseRemoveLoading;

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
            TransitionProps={{ unmountOnExit: true }}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${warehouse.id}-content`}
              id={`panel-${warehouse.id}-header`}
            >
              <Typography className={classes.heading}>{warehouse.name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <WarehouseTile warehouse={warehouse} />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddItem(warehouse.id, warehouse.name)}
                startIcon={<AddIcon />}
                disabled={loading}
              >
                Add Item
              </Button>
              <Button
                variant="contained"
                onClick={() => handleRemoveWarehouse(warehouse.id, warehouse.name)}
                startIcon={<DeleteIcon />}
                disabled={loading}
              >
                Remove Warehouse
              </Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
      <Button color="primary" onClick={() => setWarehouseDialogOpen(true)} disabled={loading}>
        Add Warehouse
      </Button>
      <ConfirmDialog {...confirmDialogProps} />
      <WarehouseDialog open={isWarehouseDialogOpen} onCancel={handleWarehouseDialogCancel} onSubmit={handleWarehouseDialogSubmit} />
      <AddItemToWarehouseDialog open={addItemToWarehouseDialogOpen} onCancel={handleAddItemToWarehouseDialogCancel} />
    </div>
  );
};

export default withWidth()(withApollo(WarehousePage));
