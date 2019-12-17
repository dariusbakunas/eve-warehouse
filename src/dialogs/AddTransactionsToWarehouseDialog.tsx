import { createStyles, makeStyles, TableRow, Theme } from '@material-ui/core';
import { GetTransactionSummary, GetTransactionSummaryVariables } from '../__generated__/GetTransactionSummary';
import {
  GetWarehouseItems,
  GetWarehouseItemsVariables,
  GetWarehouseItems_warehouse_items as WarehouseItem,
} from '../__generated__/GetWarehouseItems';
import { GetWarehouses } from '../__generated__/GetWarehouses';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { WarehouseItemInput } from '../__generated__/globalTypes';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '../components/DialogActions';
import DialogContent from '../components/DialogContent';
import DialogTitle from '../components/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import getTransactionSummary from '../queries/getTransactionSummary.graphql';
import getWarehouseItemsQuery from '../queries/getWarehouseItems.graphql';
import getWarehousesQuery from '../queries/getWarehouses.graphql';
import green from '@material-ui/core/colors/green';
import InputLabel from '@material-ui/core/InputLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import Maybe from 'graphql/tsutils/Maybe';
import MenuItem from '@material-ui/core/MenuItem';
import React, { ChangeEvent, useEffect, useState } from 'react';
import red from '@material-ui/core/colors/red';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Typography from '@material-ui/core/Typography';

export interface IDialogProps {
  open: boolean;
  transactionIds: Set<string>;
  onSubmit: (warehouseId: string, items: WarehouseItemInput[]) => void;
  onCancel: () => void;
}

interface WarehouseItemUpdate {
  id: string;
  name: string;
  newItemPrice: number;
  oldItemPrice: number;
  oldQuantity: number;
  newQuantity: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      whiteSpace: 'nowrap',
    },
    negative: {
      color: red[500],
    },
    positive: {
      color: green[500],
    },
    tableWrapper: {
      marginTop: theme.spacing(2),
      maxHeight: 440,
      overflow: 'auto',
    },
  })
);

const AddTransactionsToWarehouseDialog: React.FC<IDialogProps> = ({ open, onSubmit, onCancel, transactionIds }) => {
  const classes = useStyles();
  const [selectedWarehouse, setSelectedWarehouse] = useState<Maybe<string>>(null);
  const [updates, setUpdates] = useState<WarehouseItemUpdate[]>([]);

  const { loading: warehousesLoading, data: warehousesResponse } = useQuery<GetWarehouses>(getWarehousesQuery, {
    skip: !open,
    onCompleted: data => {
      if (!selectedWarehouse) {
        setSelectedWarehouse(data.warehouses[0].id);
      }
    },
  });

  const { loading: summaryLoading, data: transactionSummary } = useQuery<GetTransactionSummary, GetTransactionSummaryVariables>(
    getTransactionSummary,
    {
      skip: !open,
      variables: {
        ids: [...transactionIds],
      },
    }
  );

  const [getWarehouseItems, { loading: warehouseItemsLoading, data: warehouseItems }] = useLazyQuery<GetWarehouseItems, GetWarehouseItemsVariables>(
    getWarehouseItemsQuery,
    {
      fetchPolicy: 'no-cache',
    }
  );

  const loading = warehousesLoading || summaryLoading || warehouseItemsLoading;

  useEffect(() => {
    if (selectedWarehouse && open) {
      getWarehouseItems({
        variables: {
          id: selectedWarehouse,
        },
      });
    }
  }, [selectedWarehouse, open]);

  useEffect(() => {
    if (warehouseItems && warehouseItems.warehouse && transactionSummary) {
      const wareHouseItemMap = warehouseItems.warehouse.items.reduce<{ [key: string]: WarehouseItem }>((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});

      const newUpdates: WarehouseItemUpdate[] = transactionSummary.walletTransactionSummary.items
        .filter(item => item.credit < 0)
        .map(item => {
          const currentItem = wareHouseItemMap[item.id];

          const itemPrice = -1 * (item.credit / item.quantity);

          return {
            id: item.id,
            name: item.name,
            oldQuantity: currentItem?.quantity || 0,
            newQuantity: currentItem ? currentItem.quantity + item.quantity : item.quantity,
            oldItemPrice: currentItem?.unitCost || 0,
            newItemPrice: currentItem
              ? (currentItem.unitCost * currentItem.quantity - item.credit) / (currentItem.quantity + item.quantity)
              : itemPrice,
          };
        });
      setUpdates(newUpdates);
    }
  }, [warehouseItems, transactionSummary]);

  const handleCancel = () => {
    onCancel();
  };

  const handleSubmit = () => {
    if (selectedWarehouse && transactionSummary) {
      const items: WarehouseItemInput[] = transactionSummary.walletTransactionSummary.items
        .filter(item => item.credit < 0)
        .map(item => ({
          id: item.id,
          quantity: item.quantity,
          unitCost: -1 * (item.credit / item.quantity),
        }));

      onSubmit(selectedWarehouse, items);
    }
  };

  const handleWarehouseChange = (event: ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setSelectedWarehouse(value);
  };

  const renderDiff = (newVal: number, oldVal: number, numFractionDigits = 0, invertColor = false) => {
    const diff = newVal - oldVal;

    if (diff <= 0.01) {
      return null;
    }

    const sign = diff > 0 ? '+' : '';

    const positive = invertColor ? diff < 0 : diff > 0;
    const colorClass = positive ? classes.positive : classes.negative;

    return (
      <Typography className={colorClass} display="inline" variant="inherit">
        ({sign}
        {diff.toLocaleString(undefined, { minimumFractionDigits: numFractionDigits })})
      </Typography>
    );
  };

  return (
    <Dialog open={open} fullWidth={true} maxWidth="lg">
      <DialogTitle onClose={handleCancel}>Apply {transactionIds.size} transaction(s) to warehouse</DialogTitle>
      <DialogContent dividers>
        {loading && <LinearProgress />}
        <FormControl fullWidth={true}>
          <InputLabel id="warehouse">Warehouse</InputLabel>
          {open && selectedWarehouse && (
            <Select labelId="warehouse" id="warehouse-select" onChange={handleWarehouseChange} value={selectedWarehouse}>
              {warehousesResponse &&
                warehousesResponse.warehouses.map(warehouse => (
                  <MenuItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </MenuItem>
                ))}
            </Select>
          )}
        </FormControl>
        <div className={classes.tableWrapper}>
          <Table stickyHeader size="small" aria-label="warehouse items" className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Unit Cost</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {updates.map(update => (
                <TableRow key={update.id}>
                  <TableCell>{update.name}</TableCell>
                  <TableCell align="right">
                    {update.newQuantity} {renderDiff(update.newQuantity, update.oldQuantity)}
                  </TableCell>
                  <TableCell align="right">
                    {update.newItemPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}{' '}
                    {renderDiff(update.newItemPrice, update.oldItemPrice, 2, true)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary" disabled={loading || updates.length === 0}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTransactionsToWarehouseDialog;
