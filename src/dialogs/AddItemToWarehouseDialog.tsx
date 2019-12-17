import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '../components/DialogActions';
import DialogContent from '../components/DialogContent';
import DialogTitle from '../components/DialogTitle';
import green from '@material-ui/core/colors/green';
import InvItemAutocomplete, { InvItem } from '../components/InvItemAutocomplete';
import Maybe from 'graphql/tsutils/Maybe';
import React, { useEffect } from 'react';
import red from '@material-ui/core/colors/red';
import TextField from '@material-ui/core/TextField';
import useForm from 'react-hook-form';
import QtyNumberFormat from '../components/QtyNumberFormat';

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
      width: 100,
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
  qty: number;
  unitCost: number;
}

const AddItemToWarehouseDialog: React.FC<IDialogProps> = ({ open, onCancel, onSubmit }) => {
  const { register, handleSubmit, errors, setValue } = useForm<IFormData>();
  const classes = useStyles();

  useEffect(() => {
    register({ name: 'item' }, { required: true });
  }, [register]);

  const handleCancel = () => {
    onCancel();
  };

  const handleAddClick = (data: IFormData) => {
    onSubmit({
      item: data.item,
      qty: +data.qty, // TODO: check why this is converted to string on submition
      unitCost: +data.unitCost,
    });
  };

  const handleSelectItem = (item: Maybe<InvItem>) => {
    setValue('item', item);
  };

  return (
    <Dialog open={open} fullWidth={true}>
      <DialogTitle onClose={handleCancel}>Add item to warehouse</DialogTitle>
      <DialogContent dividers className={classes.root}>
        <InvItemAutocomplete error={!!errors.item} onSelect={handleSelectItem} className={classes.itemField} />
        <TextField
          className={classes.qtyField}
          label="Qty"
          error={!!errors.qty}
          //type="number"
          name="qty"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            inputComponent: QtyNumberFormat as any,
          }}
          inputRef={register({ required: true, min: 1 })}
        />
        <TextField
          className={classes.qtyField}
          label="Unit Cost"
          name="unitCost"
          //type="number"
          error={!!errors.unitCost}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            inputComponent: QtyNumberFormat as any,
          }}
          inputRef={register({ required: true, min: 0 })}
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
