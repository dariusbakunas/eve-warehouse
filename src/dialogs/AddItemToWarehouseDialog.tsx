import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '../components/DialogActions';
import DialogContent from '../components/DialogContent';
import DialogTitle from '../components/DialogTitle';
import green from '@material-ui/core/colors/green';
import InvItemAutocomplete, { InvItem } from '../components/InvItemAutocomplete';
import IskNumberFormat from '../components/IskNumberFormat';
import Maybe from 'graphql/tsutils/Maybe';
import QtyNumberFormat from '../components/QtyNumberFormat';
import React, { useEffect, useState } from 'react';
import red from '@material-ui/core/colors/red';
import TextField from '@material-ui/core/TextField';
import useValidator from '../hooks/useValidator';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    negative: {
      color: red[500],
    },
    positive: {
      color: green[500],
    },
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
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: IFormData) => void;
}

export interface IFormData {
  item: Maybe<InvItem>;
  qty: Maybe<number>;
  unitCost: Maybe<number>;
}

const AddItemToWarehouseDialog: React.FC<IDialogProps> = ({ open, onCancel, onSubmit }) => {
  const { register, handleSubmit, errors, setValue } = useValidator<IFormData>();
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
      <DialogTitle onClose={handleCancel}>Add item to warehouse</DialogTitle>
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
