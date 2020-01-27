import { Theme } from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

const commonStyles = (theme: Theme) => ({
  selectToolbar: {
    display: 'flex',
    background: theme.palette.grey.A400,
    justifyContent: 'left',
    '& > *': {
      margin: theme.spacing(0.5),
    },
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
  },
  negative: {
    color: red['500'],
  },
  positive: {
    color: green.A200,
  },
});

export default commonStyles;
