import { AddWarehouse, AddWarehouseVariables } from '../__generated__/AddWarehouse';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { GetWarehouses, GetWarehouses_warehouses as Warehouse } from '../__generated__/GetWarehouses';
import { makeStyles, Theme } from '@material-ui/core';
import { RemoveWarehouse, RemoveWarehouseVariables } from '../__generated__/RemoveWarehouse';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useSnackbar } from 'notistack';
import addWarehouseMutation from '../queries/addWarehouse.graphql';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ConfirmDialog from '../dialogs/ConfirmDialog';
import getWarehousesQuery from '../queries/getWarehouses.graphql';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Paper from '@material-ui/core/Paper';
import React, { useState } from 'react';
import removeWarehouseMutation from '../queries/removeWarehouse.graphql';
import Skeleton from '@material-ui/lab/Skeleton';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import useConfirmDialog from '../hooks/useConfirmDialog';
import WarehouseDialog from '../dialogs/WarehouseDialog';
import WarehouseItemsDialog from '../dialogs/WarehouseItemsDialog';
import WarehouseTile from '../components/WarehouseTile';
import withApollo from '../lib/withApollo';
import withWidth, { isWidthUp, WithWidthProps } from '@material-ui/core/withWidth';
import Maybe from 'graphql/tsutils/Maybe';

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    padding: theme.spacing(2),
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

const WarehousePage: React.FC<WithWidthProps> = ({ width }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { confirmDialogProps, showAlert } = useConfirmDialog();
  const [currentWarehouse, setCurrentWarehouse] = useState<Maybe<Warehouse>>(null);
  const [isWarehouseDialogOpen, setWarehouseDialogOpen] = useState(false);
  const [isWarehouseItemsDialogOpen, setWarehouseItemsDialogOpen] = useState(false);
  const [value, setValue] = React.useState(0);

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

  const handleWarehouseItemsDialogClose = () => {
    setWarehouseItemsDialogOpen(false);
  };

  const handleWarehouseItemsDialogOpen = (id: string) => {
    // we know warehouses are loaded once this is called
    const warehouse = warehousesResponse!.warehouses.find(warehouse => warehouse.id === id);
    setCurrentWarehouse(warehouse!);
    setWarehouseItemsDialogOpen(true);
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

  const cellHeight = warehousesLoading ? 80 : 'auto';

  return (
    <div className={classes.root}>
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
              <WarehouseTile warehouse={warehouse} onOpen={handleWarehouseItemsDialogOpen} onRemove={handleRemoveWarehouse} />
            </GridListTile>
          ))}
      </GridList>
      <Button color="primary" onClick={() => setWarehouseDialogOpen(true)}>
        Add Warehouse
      </Button>
      <ConfirmDialog {...confirmDialogProps} />
      <WarehouseDialog open={isWarehouseDialogOpen} onCancel={handleWarehouseDialogCancel} onSubmit={handleWarehouseDialogSubmit} />
      {currentWarehouse && (
        <WarehouseItemsDialog open={isWarehouseItemsDialogOpen} warehouse={currentWarehouse} onClose={handleWarehouseItemsDialogClose} />
      )}
    </div>
  );
};

export default withWidth()(withApollo(WarehousePage));
