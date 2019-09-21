import React, { MouseEvent } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar/AppBar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  }
}));

interface IHeaderProps {
  isAuthenticated: boolean;
  onSideMenuOpen?: () => void;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  sideMenuOpen?: boolean;
  sideMenuEnabled?: boolean;
  title: string;
}

export const Header: React.FC<IHeaderProps> = ({ isAuthenticated, onLoginClick, onLogoutClick, onSideMenuOpen, sideMenuOpen, sideMenuEnabled, title }) => {
  const classes = useStyles({});
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";
  const accountMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      getContentAnchorEl={null}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
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
    <AppBar position="absolute" className={clsx(classes.appBar, sideMenuOpen && classes.appBarShift)}>
      <Toolbar className={classes.toolbar}>
        {sideMenuEnabled && (
          <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={onSideMenuOpen} className={clsx(classes.menuButton, sideMenuOpen && classes.menuButtonHidden)}>
            <MenuIcon />
          </IconButton>
        )}
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
            <IconButton edge="end" aria-label="account of current user" aria-controls={menuId} aria-haspopup="true" onClick={handleAccountMenuOpen} color="inherit">
              <AccountCircle />
            </IconButton>
            {accountMenu}
          </React.Fragment>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
