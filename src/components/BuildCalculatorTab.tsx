import { createStyles, makeStyles, Theme } from '@material-ui/core';
import InvItemAutocomplete, { InvItem } from './InvItemAutocomplete';
import Maybe from 'graphql/tsutils/Maybe';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    blueprintSelector: {
      flex: '0.5',
    },
  })
);

const BuildCalculatorTab: React.FC = () => {
  const classes = useStyles();

  const handleSelectItem = (item: Maybe<InvItem>) => {
    console.log(item);
  };

  return (
    <div className={classes.root}>
      <InvItemAutocomplete
        categoryIds={['9']}
        className={classes.blueprintSelector}
        label="Select Blueprint or Reaction"
        onSelect={handleSelectItem}
      />
    </div>
  );
};

export default BuildCalculatorTab;
