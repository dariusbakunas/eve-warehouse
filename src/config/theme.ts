import { red, indigo } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#8590A6',
      main: '#5C5D73',
      dark: '#343240',
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
