import { createStyles, makeStyles, TableRow, Theme } from '@material-ui/core';
import { GetWarehouseItems, GetWarehouseItemsVariables } from '../__generated__/GetWarehouseItems';
import { useQuery } from '@apollo/react-hooks';
import { GetWarehouses_warehouses as Warehouse } from '../__generated__/GetWarehouses';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '../components/DialogContent';
import DialogTitle from '../components/DialogTitle';
import getWarehouseItemsQuery from '../queries/getWarehouseItems.graphql';
import LinearProgress from '@material-ui/core/LinearProgress';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';

export interface IWarehouseDialogProps {
  open: boolean;
  warehouse: Warehouse;
  onClose: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      whiteSpace: 'nowrap',
    },
    tableWrapper: {
      overflowX: 'scroll',
    },
  })
);

const WarehouseItemsDialog: React.FC<IWarehouseDialogProps> = ({ open, warehouse, onClose }) => {
  const classes = useStyles();
  const { loading, data } = useQuery<GetWarehouseItems, GetWarehouseItemsVariables>(getWarehouseItemsQuery, {
    variables: {
      id: warehouse.id,
    },
  });

  return (
    <Dialog open={open} fullWidth={true}>
      <DialogTitle onClose={onClose}>Warehouse: {warehouse.name}</DialogTitle>
      <DialogContent dividers>
        {loading && <LinearProgress />}
        {data && data.warehouse && data.warehouse.items && (
          <div className={classes.tableWrapper}>
            <Table size="small" aria-label="wallet transactions" className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Cost</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.warehouse.items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">{item.quantity.toLocaleString()}</TableCell>
                    <TableCell align="right">{item.unitCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell align="right">{(item.unitCost * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WarehouseItemsDialog;
