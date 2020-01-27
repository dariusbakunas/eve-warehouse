import { AddWarehouse, AddWarehouseVariables } from '../__generated__/AddWarehouse';
import { GetWarehouses, GetWarehouses_warehouses as Warehouse } from '../__generated__/GetWarehouses';
import { makeStyles, Theme } from '@material-ui/core';
import { RemoveWarehouse, RemoveWarehouseVariables } from '../__generated__/RemoveWarehouse';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useSnackbar } from 'notistack';
import addWarehouseMutation from '../queries/addWarehouse.graphql';
import Button from '@material-ui/core/Button';
import ConfirmDialog from '../dialogs/ConfirmDialog';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import getWarehousesQuery from '../queries/getWarehouses.graphql';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import React, { useState } from 'react';
import removeWarehouseMutation from '../queries/removeWarehouse.graphql';
import Typography from '@material-ui/core/Typography';
import useConfirmDialog from '../hooks/useConfirmDialog';
import WarehouseDialog from '../dialogs/WarehouseDialog';
import WarehouseTile from '../components/WarehouseTile';
import withApollo from '../lib/withApollo';
import withWidth, { WithWidthProps } from '@material-ui/core/withWidth';

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    padding: theme.spacing(2),
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
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
    update(cache, { data }) {
      if (data) {
        const queryResponse = cache.readQuery<GetWarehouses>({
          query: getWarehousesQuery,
        });

        if (queryResponse) {
          const newWarehouse: Warehouse = {
            ...data.addWarehouse,
            summary: {
              __typename: 'WarehouseSummary',
              totalCost: 0,
              totalVolume: 0,
            },
          };

          cache.writeQuery({
            query: getWarehousesQuery,
            data: {
              warehouses: queryResponse.warehouses.concat([newWarehouse]),
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

  //const cellHeight = warehousesLoading ? 80 : 'auto';
  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
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
            TransitionProps={{ unmountOnExit: true, timeout: 0 }}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${warehouse.id}-content`}
              id={`panel-${warehouse.id}-header`}
            >
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <Typography className={classes.heading}>{warehouse.name}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.secondaryHeading}>{`Cost: ${warehouse.summary.totalCost.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })} ISK`}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.secondaryHeading}>{`Volume: ${warehouse.summary.totalVolume.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })} m³`}</Typography>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            <WarehouseTile warehouse={warehouse} onRemoveWarehouse={handleRemoveWarehouse} />
          </ExpansionPanel>
        ))}
      <Button color="primary" onClick={() => setWarehouseDialogOpen(true)} disabled={loading}>
        Add Warehouse
      </Button>
      <ConfirmDialog {...confirmDialogProps} />
      <WarehouseDialog open={isWarehouseDialogOpen} onCancel={handleWarehouseDialogCancel} onSubmit={handleWarehouseDialogSubmit} />
    </div>
  );
};

export default withWidth()(withApollo(WarehousePage));
