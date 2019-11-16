import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '../components/DialogContent';
import { useQuery } from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import LinearProgress from '@material-ui/core/LinearProgress';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '../components/DialogTitle';
import DialogActions from '../components/DialogActions';
import characterScopesQuery from '../queries/characterScopes.graphql';
import { CharacterScopes } from '../__generated__/CharacterScopes';
import Maybe from 'graphql/tsutils/Maybe';

export interface CharacterScopeDialogProps {
  open: boolean;
  onSubmit: (scopes?: string[]) => void;
  onCancel: () => void;
  scopes?: Maybe<string[]>;
}

const CharacterScopeDialog: React.FC<CharacterScopeDialogProps> = ({ open, onCancel, onSubmit, scopes }) => {
  const { loading, error, data } = useQuery<CharacterScopes>(characterScopesQuery);
  const [checked, setChecked] = React.useState<number[]>([]);

  useEffect(() => {
    if (data && scopes && scopes.length) {
      // select current scopes
      const selected = data.scopes.filter(scope => scopes.includes(scope.name)).map(scope => +scope.id);
      setChecked(selected);
    } else {
      setChecked([]);
    }
  }, [data, scopes]);

  const handleSubmit = () => {
    const scopes = data ? data.scopes.filter(scope => checked.includes(+scope.id)).map(scope => scope.name) : [];
    onSubmit(scopes);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <Dialog onClose={handleCancel} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle onClose={handleCancel}>Select character scopes</DialogTitle>
      <DialogContent dividers>
        {loading && <LinearProgress />}
        {data && (
          <List>
            {data.scopes.map(scope => {
              const labelId = `checkbox-list-label-${scope.id}`;

              return (
                <ListItem key={scope.id} role={undefined} dense button onClick={handleToggle(+scope.id)}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(+scope.id) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={scope.name} />
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary" disabled={!checked.length}>
          {scopes ? 'Update Character' : 'Add Character'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CharacterScopeDialog;
