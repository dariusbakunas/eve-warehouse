import React from 'react';
import range from 'lodash.range';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Maybe from 'graphql/tsutils/Maybe';

interface ISkillProgressProps {
  trainedLevel?: Maybe<number>;
  queuedLevel?: Maybe<number>;
  injected?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'inline-block',
      verticalAlign: 'middle',
    },
    slot: ({ injected }: ISkillProgressProps) => ({
      display: 'inline-block',
      width: injected ? '12px' : '6px',
      height: injected ? '12px' : '6px',
      margin: injected ? '1px' : '4px',
      borderWidth: '1px',
      borderStyle: 'solid',
    }),
    trained: {
      backgroundColor: '#474748',
      borderColor: '#474748',
    },
    queued: {
      backgroundColor: '#369bd5',
      borderColor: '#369bd5',
    },
  })
);

const SkillProgress: React.FC<ISkillProgressProps> = ({ trainedLevel, queuedLevel, injected }) => {
  const classes = useStyles({ injected });

  return (
    <div className={classes.root}>
      {range(5).map((n: number) => {
        const isTrained = trainedLevel && trainedLevel > n;

        const isQueued = !isTrained && queuedLevel && queuedLevel > n;
        return <span key={n} className={`${classes.slot} ${isTrained ? classes.trained : null} ${isQueued ? classes.queued : null}`} />;
      })}
    </div>
  );
};

export default SkillProgress;
