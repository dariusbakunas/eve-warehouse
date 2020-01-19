import { makeStyles, Theme } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import LayoutContext from '../context/LayoutContext';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuRounded from '@material-ui/icons/MenuRounded';
import React, { MouseEvent, useContext } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles<Theme, { drawerWidth: number }>(theme => ({
  appBar: {
    backgroundColor: '#1F1F1F',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: props => props.drawerWidth,
    width: props => `calc(100% - ${props.drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  title: {
    flexGrow: 1,
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
}));

interface IHeaderProps {
  isAuthenticated: boolean;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  title: string;
  user?: {
    displayName?: string;
    nickname?: string;
    picture: string;
  };
}

export const Header: React.FC<IHeaderProps> = ({ isAuthenticated, onLoginClick, onLogoutClick, title, user }) => {
  const { drawerWidth, opened, setOpened } = useContext(LayoutContext)!;

  const classes = useStyles({
    drawerWidth,
  });
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
  const accountMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      getContentAnchorEl={null}
      id={menuId}
      keepMounted
      open={!!anchorEl}
      onClose={handleMenuClose}
    >
      {/*<MenuItem onClick={handleMenuClose}>Profile</MenuItem>*/}
      <MenuItem onClick={onLogoutClick}>Logout</MenuItem>
    </Menu>
  );

  function handleAccountMenuOpen(event: MouseEvent) {
    setAnchorEl(event.currentTarget);
  }

  return (
    <AppBar position="fixed" className={clsx(classes.appBar, opened && classes.appBarShift)}>
      <Toolbar className={classes.toolbar}>
        <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={() => setOpened(!opened)} className={classes.menuButton}>
          {opened ? <ChevronLeft /> : <MenuRounded />}
        </IconButton>
        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
          {title}
        </Typography>
        {!isAuthenticated && (
          <Button color="inherit" onClick={onLoginClick}>
            Login
          </Button>
        )}
        {isAuthenticated && (
          <React.Fragment>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleAccountMenuOpen}
              color="inherit"
            >
              {user && user.picture ? <Avatar alt={user.displayName || user.nickname || 'Account'} src={user.picture} /> : <AccountCircle />}
            </IconButton>
            {accountMenu}
          </React.Fragment>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
