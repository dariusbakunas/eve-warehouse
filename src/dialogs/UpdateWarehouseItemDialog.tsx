import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { GetWarehouseItems_warehouse_items as WarehouseItem } from '../__generated__/GetWarehouseItems';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '../components/DialogActions';
import DialogContent from '../components/DialogContent';
import DialogTitle from '../components/DialogTitle';
import green from '@material-ui/core/colors/green';
import IskNumberFormat from '../components/IskNumberFormat';
import Maybe from 'graphql/tsutils/Maybe';
import QtyNumberFormat from '../components/QtyNumberFormat';
import React, { useEffect } from 'react';
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
    qtyField: {
      flex: 1,
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 150,
    },
  })
);

export interface IDialogProps {
  item: WarehouseItem;
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: IFormData) => void;
}

export interface IFormData {
  qty: Maybe<number>;
  unitCost: Maybe<number>;
}

const UpdateWarehouseItemDialog: React.FC<IDialogProps> = ({ item, open, onCancel, onSubmit }) => {
  const { register, handleSubmit, errors, setValue } = useValidator<IFormData>({
    qty: item.quantity,
    unitCost: item.unitCost,
  });
  const classes = useStyles();

  useEffect(() => {
    register('qty', { required: true, min: 1 });
    register('unitCost', { required: true, min: 0 });
  }, []);

  const handleCancel = () => {
    onCancel();
  };

  const handleApplyClick = (data: IFormData) => {
    if (data.qty != null && data.unitCost != null) {
      onSubmit({
        qty: data.qty, // TODO: check why this is converted to string on submition
        unitCost: data.unitCost,
      });
    }
  };

  return (
    <Dialog open={open} fullWidth={true}>
      <DialogTitle onClose={handleCancel}>Update {item.name}</DialogTitle>
      <DialogContent dividers className={classes.root}>
        <TextField
          className={classes.qtyField}
          label="Qty"
          error={!!errors.qty}
          name="qty"
          helperText={errors.qty ? errors.qty.message : null}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            inputComponent: QtyNumberFormat as any,
          }}
          defaultValue={item.quantity}
          onChange={event => setValue('qty', event.target.value ? +event.target.value : null)}
        />
        <TextField
          className={classes.qtyField}
          label="Unit Cost"
          name="unitCost"
          error={!!errors.unitCost}
          helperText={errors.unitCost ? errors.unitCost.message : null}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            inputComponent: IskNumberFormat as any,
          }}
          defaultValue={item.unitCost}
          onChange={event => setValue('unitCost', event.target.value ? +event.target.value : null)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit(handleApplyClick)} color="primary" disabled={false}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateWarehouseItemDialog;
