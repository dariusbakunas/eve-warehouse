import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import DashboardIcon from "@material-ui/icons/Dashboard";
import CharactersIcon from "../icons/CharactersIcon";
import Router from "next/router";
import { withRouter } from "next/router";
import { WithRouterProps } from "next/dist/client/with-router";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9)
    }
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  }
}));

interface ISideMenuProps extends WithRouterProps {
  onSideMenuClose: () => void;
  sideMenuOpen: boolean;
}

export const SideMenu: React.FC<ISideMenuProps> = ({ onSideMenuClose, sideMenuOpen, router }) => {
  const classes = useStyles({});
  const { pathname, push } = router;

  const handleNavigate = route => {
    push({
      pathname: route
    });
  };

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !sideMenuOpen && classes.drawerPaperClose)
      }}
      open={sideMenuOpen}
    >
      <div className={classes.toolbarIcon}>
        <IconButton onClick={onSideMenuClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItem button selected={pathname === "/"} onClick={() => handleNavigate("/")}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button selected={pathname === "/characters"} onClick={() => handleNavigate("/characters")}>
          <ListItemIcon>
            <CharactersIcon />
          </ListItemIcon>
          <ListItemText primary="Characters" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default withRouter(SideMenu);
