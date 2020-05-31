import { ModalProps } from "carbon-components-react";
import React, { useCallback, useState } from "react";

export const useConfirm = () => {
  const [dialogProps, setDialogProps] = useState<ModalProps>({
    modalAriaLabel: "Alert",
    iconDescription: "Close",
    hasForm: false,
    primaryButtonText: "Yes",
    secondaryButtonText: "No",
    open: false,
  });

  const showConfirmDialog = useCallback(
    (heading: string, text: string, onClose: (confirm: boolean) => void) => {
      const handleClose = () => {
        setDialogProps((prevProps) => ({
          ...prevProps,
          open: false,
        }));
        onClose(false);
      };

      const handleSubmit = () => {
        setDialogProps((prevProps) => ({
          ...prevProps,
          open: false,
        }));
        onClose(true);
      };

      setDialogProps((prevProps) => {
        return {
          ...prevProps,
          open: true,
          modalHeading: heading,
          onRequestClose: handleClose,
          onRequestSubmit: handleSubmit,
          children: text,
        };
      });
    },
    [setDialogProps]
  );

  return {
    showConfirmDialog,
    confirmDialogProps: dialogProps,
  };
};
