import React, { ReactNode, useContext } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
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
import { withRouter, useRouter } from "next/router";
import { WithRouterProps } from "next/dist/client/with-router";
import LayoutContext, { ILayoutContext } from "../context/LayoutContext";

const useStyles = makeStyles<Theme, { drawerWidth: number }>(({ breakpoints, spacing, transitions, mixins }) => ({
  container: {
    overflow: "hidden",
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    transition: transitions.create(["width"], {
      easing: transitions.easing.sharp,
      duration: transitions.duration.leavingScreen
    })
  },
  content: {
    flexGrow: 1,
    overflow: "auto"
  }
}));

interface SideMenuProps {
  header?: (context: ILayoutContext) => ReactNode;
  children?: ReactNode;
}

export const SideMenu: React.FC<SideMenuProps> = ({ children, header }) => {
  const layoutContext = useContext(LayoutContext)!;
  const { drawerWidth, opened, setOpened } = layoutContext;
  const router = useRouter();
  const classes = useStyles({
    drawerWidth
  });
  const { pathname, push } = router;

  const handleNavigate = (route: string) => {
    push({
      pathname: route
    });
  };

  return (
    <Drawer anchor="left" variant="persistent" open={opened} onClose={() => setOpened(false)}>
      <div className={classes.container} style={{ width: drawerWidth }}>
        {header && header(layoutContext)}
        <div className={classes.content}>{children}</div>
      </div>
    </Drawer>
  );
};

export default SideMenu;
