import { createStyles, makeStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';
import countdown from 'countdown';
import Maybe from 'graphql/tsutils/Maybe';
import moment from 'moment';
import range from 'lodash.range';
import React from 'react';

interface ISkillProgressProps {
  startDate?: string;
  finishDate?: string;
  trainedLevel?: Maybe<number>;
  queuedLevel?: Maybe<number>;
  injected?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'inline-flex',
      alignItems: 'center',
    },
    countdown: {
      color: 'rgb(105, 105, 105)',
      marginRight: theme.spacing(1),
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

const SkillProgress: React.FC<ISkillProgressProps> = ({ trainedLevel, queuedLevel, injected, startDate, finishDate }) => {
  countdown.setLabels('|s|m|h|d', '|s|m|h|d', ' ', ' ')
  const start = startDate ? moment(startDate).toDate() : null;
  const end = finishDate ? moment(finishDate).toDate() : null;

  const classes = useStyles({ injected });
  const countDown = countdown(start, end, ~countdown.MONTHS & ~countdown.WEEKS).toString();

  return (
    <div className={classes.root}>
      {countDown && <span className={classes.countdown}>{countDown}</span>}
      {range(5).map((n: number) => {
        const isTrained = trainedLevel && trainedLevel > n;
        const isQueued = !isTrained && queuedLevel && queuedLevel > n;

        const className = clsx(classes.slot, { [classes.trained]: isTrained }, { [classes.queued]: isQueued });
        return <span key={n} className={className} />;
      })}
    </div>
  );
};

export default SkillProgress;
