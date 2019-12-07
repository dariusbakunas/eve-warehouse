import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '../components/DialogActions';
import DialogContent from '../components/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '../components/DialogTitle';
import React from 'react';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: (confirm: boolean) => void;
  title?: string;
  text?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, onClose, title, text }) => {
  const handleSubmit = () => {
    onClose(true);
  };

  const handleCancel = () => {
    onClose(false);
  };

  return (
    <Dialog fullWidth={true} onClose={handleCancel} aria-labelledby="simple-dialog-title" aria-describedby="alert-dialog-description" open={open}>
      <DialogTitle onClose={handleCancel}>{title}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText id="alert-dialog-description">{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          No
        </Button>
        <Button onClick={handleSubmit} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
