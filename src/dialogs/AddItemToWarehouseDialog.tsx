import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { NewWarehouseItemInput } from '../__generated__/globalTypes';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '../components/DialogActions';
import DialogContent from '../components/DialogContent';
import DialogTitle from '../components/DialogTitle';
import green from '@material-ui/core/colors/green';
import React from 'react';
import red from '@material-ui/core/colors/red';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    negative: {
      color: red[500],
    },
    positive: {
      color: green[500],
    },
  })
);

export interface IDialogProps {
  open: boolean;
  onCancel: () => void;
}

const AddItemToWarehouseDialog: React.FC<IDialogProps> = ({ open, onCancel }) => {
  const handleCancel = () => {
    onCancel();
  };

  const handleSubmit = () => {
    console.log('submit');
  };

  return (
    <Dialog open={open} fullWidth={true}>
      <DialogTitle onClose={handleCancel}>Add item to warehouse</DialogTitle>
      <DialogContent dividers>content</DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary" disabled={true}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemToWarehouseDialog;
