import { GetWarehouseItems, GetWarehouseItemsVariables } from '../__generated__/GetWarehouseItems';
import { makeStyles, TableRow, Theme } from '@material-ui/core';
import { RemoveItemsFromWarehouse, RemoveItemsFromWarehouseVariables } from '../__generated__/RemoveItemsFromWarehouse';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useSnackbar } from 'notistack';
import { GetWarehouses_warehouses as Warehouse } from '../__generated__/GetWarehouses';
import Checkbox from '@material-ui/core/Checkbox';
import ConfirmDialog from '../dialogs/ConfirmDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import getWarehouseItemsQuery from '../queries/getWarehouseItems.graphql';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import React, { useMemo, useState } from 'react';
import removeItemsFromWarehouseMutation from '../queries/removeItemsFromWarehouse.graphql';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import useConfirmDialog from '../hooks/useConfirmDialog';

const useStyles = makeStyles<Theme>(theme => ({
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
  expand: {
    marginLeft: 'auto',
  },
  table: {
    whiteSpace: 'nowrap',
  },
  title: {
    flex: '1 1 100%',
  },
  tableWrapper: {
    width: '100%',
    maxHeight: 300,
    overflowY: 'auto',
    overflowX: 'scroll',
  },
}));

interface IWarehouseTileProps {
  warehouse: Warehouse;
}

const WarehouseTile: React.FC<IWarehouseTileProps> = ({ warehouse }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { confirmDialogProps, showAlert } = useConfirmDialog();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { loading, data, refetch: refetchItems } = useQuery<GetWarehouseItems, GetWarehouseItemsVariables>(getWarehouseItemsQuery, {
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
      setSelected(new Set(data.warehouse.items.map(item => item.id)));
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

  const totalIsk = useMemo(() => {
    if (data && data.warehouse) {
      return data.warehouse.items.reduce<number>((acc, item) => {
        acc += item.quantity * item.unitCost;
        return acc;
      }, 0);
    }
  }, [data]);

  return (
    <div className={classes.root}>
      {loading && <LinearProgress />}
      {!numSelected && (
        <Toolbar className={classes.filterToolbar}>
          <Typography className={classes.title} color="inherit" variant="overline">
            Total: {totalIsk ? `${totalIsk.toLocaleString(undefined, { minimumFractionDigits: 2 })} ISK` : 'N/A'}
          </Typography>
        </Toolbar>
      )}
      {!!numSelected && (
        <Toolbar className={classes.selectToolbar}>
          <Typography className={classes.title} color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
          <Tooltip title="Remove">
            <IconButton aria-label="remove selected items from warehouse" onClick={handleRemoveItems}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      )}
      {data && data.warehouse && (
        <div className={classes.tableWrapper}>
          <Table stickyHeader size="small" aria-label="wallet transactions" className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={numSelected > 0 && numSelected < data.warehouse.items.length}
                    checked={numSelected === data.warehouse.items.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'select all desserts' }}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Unit Cost</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.warehouse.items.map(item => {
                const isRowSelected = selected.has(item.id);
                const labelId = `table-checkbox-${item.id}`;

                return (
                  <TableRow
                    key={item.id}
                    hover
                    role="checkbox"
                    aria-checked={isRowSelected}
                    tabIndex={-1}
                    selected={isRowSelected}
                    onClick={event => handleRowSelect(event, item.id)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isRowSelected} inputProps={{ 'aria-labelledby': labelId }} />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">{item.quantity.toLocaleString()}</TableCell>
                    <TableCell align="right">{item.unitCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell align="right">{(item.unitCost * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <ConfirmDialog {...confirmDialogProps} />
        </div>
      )}
    </div>
  );
};

export default WarehouseTile;
