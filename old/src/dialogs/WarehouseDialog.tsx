import { GetWarehouses_warehouses as Warehouse } from '../__generated__/GetWarehouses';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '../components/DialogActions';
import DialogContent from '../components/DialogContent';
import DialogTitle from '../components/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

export interface IWarehouseDialogProps {
  open: boolean;
  warehouse?: Warehouse;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

const WarehouseDialog: React.FC<IWarehouseDialogProps> = ({ open, warehouse, onSubmit, onCancel }) => {
  const [name, setName] = useState('');

  const handleCancel = () => {
    onCancel();
  };

  const handleSubmit = () => {
    onSubmit(name);
  };

  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value as string;
    setName(value);
  }, []);

  useEffect(() => {
    // reset state whenever dialog is opened/closed
    setName('');
  }, [open]);

  return (
    <Dialog open={open} fullWidth={true}>
      <DialogTitle onClose={handleCancel}>{warehouse ? 'Update' : 'New'} Warehouse</DialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth={true}>
          <InputLabel htmlFor="warehouse-name-label">Name</InputLabel>
          <Input id="warehouse-name-label" onChange={handleNameChange} value={name} fullWidth={true} />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary" disabled={!name.length}>
          {warehouse ? 'Update Warehouse' : 'Add Warehouse'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarehouseDialog;
