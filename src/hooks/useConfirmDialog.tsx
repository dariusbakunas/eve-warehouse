import { ConfirmDialogProps } from '../dialogs/ConfirmDialog';
import { useState } from 'react';

const useConfirmDialog = () => {
  const [confirmDialogProps, setConfirmDialogProps] = useState<ConfirmDialogProps>({
    title: '',
    text: '',
    onClose: () => {},
    open: false,
  });

  const showAlert = (title: string, text: string, onClose: (confirm: boolean) => void) => {
    const newProps = {
      ...confirmDialogProps,
      open: true,
      title,
      text,
      onClose: (confirm: boolean) => {
        setConfirmDialogProps({
          title: '',
          text: '',
          onClose: () => {},
          open: false,
        });
        onClose(confirm);
      },
    };

    setConfirmDialogProps(newProps);
  };

  return {
    confirmDialogProps,
    showAlert,
  };
};

export default useConfirmDialog;
