import { AddWarehouse, AddWarehouseVariables } from '../__generated__/AddWarehouse';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { GetWarehouses } from '../__generated__/GetWarehouses';
import { makeStyles, Theme } from '@material-ui/core';
import { RemoveWarehouse, RemoveWarehouseVariables } from '../__generated__/RemoveWarehouse';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useSnackbar } from 'notistack';
import addWarehouseMutation from '../queries/addWarehouse.graphql';
import Button from '@material-ui/core/Button';
import getWarehousesQuery from '../queries/getWarehouses.graphql';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import React, { useState } from 'react';
import removeWarehouseMutation from '../queries/removeWarehouse.graphql';
import Skeleton from '@material-ui/lab/Skeleton';
import WarehouseDialog from '../dialogs/WarehouseDialog';
import WarehouseTile from '../components/WarehouseTile';
import withApollo from '../lib/withApollo';
import withWidth, { isWidthUp, WithWidthProps } from '@material-ui/core/withWidth';
import useConfirmDialog from '../hooks/useConfirmDialog';
import ConfirmDialog from '../dialogs/ConfirmDialog';

const useStyles = makeStyles<Theme>(theme => ({
  content: {
    padding: theme.spacing(3),
  },
  scopes: {
    height: '200px',
    overflow: 'auto',
  },
}));

const getGridListCols = (width?: Breakpoint) => {
  if (width) {
    if (isWidthUp('xl', width)) {
      return 4;
    }

    if (isWidthUp('lg', width)) {
      return 3;
    }

    if (isWidthUp('md', width)) {
      return 2;
    }
  }

  return 1;
};

const Warehouse: React.FC<WithWidthProps> = ({ width }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
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

  const cellHeight = warehousesLoading ? 120 : 'auto';

  return (
    <div className={classes.content}>
      <GridList cellHeight={cellHeight} cols={getGridListCols(width)} spacing={10}>
        {warehousesLoading &&
          [0, 1, 2].map(i => (
            <GridListTile key={i}>
              <Skeleton variant="rect" height={cellHeight} />
            </GridListTile>
          ))}
        {warehousesResponse &&
          warehousesResponse.warehouses &&
          warehousesResponse.warehouses.map(warehouse => (
            <GridListTile key={warehouse.id}>
              <WarehouseTile warehouse={warehouse} onRemove={handleRemoveWarehouse} />
            </GridListTile>
          ))}
      </GridList>
      <Button color="primary" onClick={() => setWarehouseDialogOpen(true)}>
        Add Warehouse
      </Button>
      <ConfirmDialog {...confirmDialogProps} />
      <WarehouseDialog open={isWarehouseDialogOpen} onCancel={handleWarehouseDialogCancel} onSubmit={handleWarehouseDialogSubmit} />
    </div>
  );
};

export default withWidth()(withApollo(Warehouse));
