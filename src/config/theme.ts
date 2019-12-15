import { createMuiTheme } from '@material-ui/core/styles';
import { indigo, red } from '@material-ui/core/colors';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#CFD8DC',
      main: '#607D8B',
      dark: '#455A64',
    },
    secondary: {
      main: '#343240',
    },
    error: {
      main: red.A400,
    },
    background: {
      paper: '#fff',
      default: '#F0F2F2',
    },
  },
});

export default theme;
