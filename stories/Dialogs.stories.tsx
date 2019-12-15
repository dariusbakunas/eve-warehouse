import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import Button from '@material-ui/core/Button';
import CharacterScopeDialog from '../src/dialogs/CharacterScopeDialog';
import React, { useState } from 'react';

const CharacterScopesDemo: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleClose = (values?: string[]) => {
    setOpen(false);
  };

  const handleSubmit = (values?: string[]) => {
    setOpen(false);
    const result = values ? values.join(', ') : '';
    console.log(values);
    action(result);
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <CharacterScopeDialog open={open} onSubmit={handleSubmit} onCancel={handleClose} />
    </div>
  );
};

storiesOf('Dialogs|CharacterScopes', module).add('Default', () => <CharacterScopesDemo />);
