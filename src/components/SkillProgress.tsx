import { createStyles, makeStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';
import countdown from 'countdown';
import Maybe from 'graphql/tsutils/Maybe';
import moment from 'moment';
import range from 'lodash.range';
import React, { useEffect, useMemo, useRef } from 'react';

countdown.setLabels('|s|m|h|d', '|s|m|h|d', ' ', ' ');

interface ISkillProgressProps {
  dynamicTimer?: boolean;
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
      backgroundColor: theme.palette.info.dark,
      borderColor: theme.palette.info.dark,
    },
    queued: {
      backgroundColor: theme.palette.info.light,
      borderColor: theme.palette.info.light,
    },
    empty: {
      borderColor: theme.palette.info.light,
    },
  })
);

const SkillProgress: React.FC<ISkillProgressProps> = ({ trainedLevel, queuedLevel, injected, startDate, finishDate, dynamicTimer }) => {
  let start;
  let countDown;
  let tsId: any;
  const countDownEl = useRef(null);

  if (startDate) {
    if (moment(startDate).isBefore()) {
      start = new Date();
    } else {
      start = moment(startDate).toDate();
    }
  }

  const end = finishDate ? moment(finishDate).toDate() : null;

  const classes = useStyles({ injected });

  useEffect(() => {
    return () => {
      if (tsId) {
        window.clearInterval(tsId);
      }
    };
  });

  if (dynamicTimer && end) {
    tsId = countdown(
      ts => {
        if (!countDownEl || !countDownEl.current) {
          return;
        }

        //@ts-ignore
        countDownEl.current.innerHTML = ts.toString();
      },
      end,
      ~countdown.MONTHS & ~countdown.WEEKS & ~countdown.MILLISECONDS
    );
  } else {
    countDown = countdown(start, end, ~countdown.MONTHS & ~countdown.WEEKS & ~countdown.MILLISECONDS).toString();
  }

  return (
    <div className={classes.root}>
      {(countDown || dynamicTimer) && (
        <span className={classes.countdown} ref={countDownEl}>
          {countDown}
        </span>
      )}
      {range(5).map((n: number) => {
        const isTrained = trainedLevel && trainedLevel > n;
        const isQueued = !isTrained && queuedLevel && queuedLevel > n;

        const className = clsx(classes.slot, { [classes.trained]: isTrained }, { [classes.queued]: isQueued }, { [classes.empty]: !isTrained && !isQueued });
        return <span key={n} className={className} />;
      })}
    </div>
  );
};

export default SkillProgress;
