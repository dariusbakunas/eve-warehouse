import { createMuiTheme } from '@material-ui/core/styles';
import { indigo, red } from '@material-ui/core/colors';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#29b6f6',
      contrastText: '#E1E1E1',
    },
    secondary: {
      main: '#b0bec5',
    },
    error: {
      main: '#CF6679',
    },
  },
});

export default theme;
