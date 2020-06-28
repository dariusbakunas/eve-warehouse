import Maybe from 'graphql/tsutils/Maybe';
import React, { useState } from 'react';

const useDialog = <T extends {}>() => {
  const [isOpen, setOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState<Maybe<T>>(null);

  const open = (props: T) => {
    setDialogProps(props);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  return {
    open,
    close,
    isOpen,
    dialogProps,
  };
};

export default useDialog;
