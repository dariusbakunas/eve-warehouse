import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import commonStyles from '../config/commonStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '../components/DialogActions';
import DialogContent from '../components/DialogContent';
import DialogTitle from '../components/DialogTitle';
import InvItemAutocomplete, { InvItem } from '../components/InvItemAutocomplete';
import IskNumberFormat from '../components/IskNumberFormat';
import Maybe from 'graphql/tsutils/Maybe';
import QtyNumberFormat from '../components/QtyNumberFormat';
import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import useValidator from '../hooks/useValidator';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ...commonStyles(theme),
    root: {
      display: 'flex',
      flexWrap: 'nowrap',
    },
    itemField: {
      flex: 1,
    },
    qtyField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 150,
    },
  })
);

export interface IDialogProps {
  warehouseId: number;
  warehouseName: string;
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: IFormData) => void;
}

export interface IFormData {
  warehouseId: number;
  item: Maybe<InvItem>;
  qty: Maybe<number>;
  unitCost: Maybe<number>;
}

const AddItemToWarehouseDialog: React.FC<IDialogProps> = ({ open, onCancel, onSubmit, warehouseName, warehouseId }) => {
  const { register, handleSubmit, errors, setValue, values } = useValidator<IFormData>();
  const classes = useStyles();

  useEffect(() => {
    register('item', { required: true });
    register('qty', { required: true, min: 1 });
    register('unitCost', { required: true, min: 0 });
  }, []);

  const handleCancel = () => {
    onCancel();
  };

  const handleAddClick = (data: IFormData) => {
    if (data.item && data.qty != null && data.unitCost != null) {
      onSubmit({
        warehouseId: warehouseId,
        item: data.item,
        qty: data.qty,
        unitCost: data.unitCost,
      });
    }
  };

  const handleSelectItem = (item: Maybe<InvItem>) => {
    setValue('item', item);
  };

  return (
    <Dialog open={open} fullWidth={true} maxWidth="md">
      <DialogTitle onClose={handleCancel}>{`Add item to "${warehouseName}" warehouse`}</DialogTitle>
      <DialogContent dividers className={classes.root}>
        <InvItemAutocomplete error={!!errors.item} onSelect={handleSelectItem} className={classes.itemField} />
        <TextField
          className={classes.qtyField}
          label="Qty"
          error={!!errors.qty}
          name="qty"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            inputComponent: QtyNumberFormat as any,
          }}
          onChange={event => setValue('qty', event.target.value ? +event.target.value : null)}
        />
        <TextField
          className={classes.qtyField}
          label="Unit Cost"
          name="unitCost"
          error={!!errors.unitCost}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            inputComponent: IskNumberFormat as any,
          }}
          onChange={event => setValue('unitCost', event.target.value ? +event.target.value : null)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit(handleAddClick)} color="primary" disabled={false}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemToWarehouseDialog;
