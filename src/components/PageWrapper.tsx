import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    paper: {
      width: 'calc(100vw - 120px)',
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(2),
    },
    title: {
      marginRight: '20px',
      flex: 1,
    },
    topToolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  })
);

interface IPageWrapperProps {
  label: string;
}

const PageWrapper: React.FC<IPageWrapperProps> = ({ children, label }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Toolbar className={classes.topToolbar}>
          <Typography className={classes.title} variant="h6" id="tableTitle">
            {label}
          </Typography>
        </Toolbar>
        {children}
      </Paper>
    </div>
  );
};

export default PageWrapper;
