import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '../components/DialogContent';
import Button from '@material-ui/core/Button';
import DialogTitle from '../components/DialogTitle';
import DialogActions from '../components/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: (confirm: boolean) => void;
  title?: string;
  text?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  title,
  text,
}) => {
  const handleSubmit = () => {
    onClose(true);
  };

  const handleCancel = () => {
    onClose(false);
  };

  return (
    <Dialog
      onClose={handleCancel}
      aria-labelledby="simple-dialog-title"
      aria-describedby="alert-dialog-description"
      open={open}
    >
      <DialogTitle onClose={handleCancel}>{title}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
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
