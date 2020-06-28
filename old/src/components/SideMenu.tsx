import { makeStyles, Theme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import CharactersIcon from '../icons/CharactersIcon';
import clsx from 'clsx';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IndustryIcon from '../icons/IndustryIcon';
import LayoutContext, { ILayoutContext } from '../context/LayoutContext';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LogsIcon from '../icons/LogsIcon';
import React, { ReactNode, useContext } from 'react';
import SkillsIcon from '../icons/SkillsIcon';
import WalletIcon from '../icons/WalletIcon';
import WarehouseIcon from '../icons/WarehouseIcon';

const useStyles = makeStyles<Theme, { drawerWidth: number }, string>(theme => ({
  appBarSpacer: {
    ...theme.mixins.toolbar,
  },
  drawer: {
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: props => ({
    width: props.drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  drawerClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
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
    drawerWidth,
  });
  const { pathname, push } = router;

  const handleNavigate = (route: string) => {
    push({
      pathname: route,
    });
  };

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: opened,
        [classes.drawerClose]: !opened,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: opened,
          [classes.drawerClose]: !opened,
        }),
      }}
      open={opened}
      onClose={() => setOpened(false)}
    >
      <div className={classes.appBarSpacer} />
      <Divider />
      <List>
        {/*<ListItem selected={pathname === '/'} button onClick={() => handleNavigate('/')}>*/}
        {/*  <ListItemIcon>*/}
        {/*    <DashboardIcon />*/}
        {/*  </ListItemIcon>*/}
        {/*  <ListItemText primary="Dashboard" primaryTypographyProps={{ noWrap: true }} />*/}
        {/*</ListItem>*/}
        <ListItem selected={pathname === '/characters'} button onClick={() => handleNavigate('/characters')}>
          <ListItemIcon>
            <CharactersIcon />
          </ListItemIcon>
          <ListItemText primary="Characters" primaryTypographyProps={{ noWrap: true }} />
        </ListItem>
        <ListItem selected={pathname === '/skills'} button onClick={() => handleNavigate('/skills')}>
          <ListItemIcon>
            <SkillsIcon />
          </ListItemIcon>
          <ListItemText primary="Skills" primaryTypographyProps={{ noWrap: true }} />
        </ListItem>
        <ListItem selected={pathname === '/wallet'} button onClick={() => handleNavigate('/wallet')}>
          <ListItemIcon>
            <WalletIcon />
          </ListItemIcon>
          <ListItemText primary="Wallet" primaryTypographyProps={{ noWrap: true }} />
        </ListItem>
        <ListItem selected={pathname === '/warehouse'} button onClick={() => handleNavigate('/warehouse')}>
          <ListItemIcon>
            <WarehouseIcon />
          </ListItemIcon>
          <ListItemText primary="Warehouse" primaryTypographyProps={{ noWrap: true }} />
        </ListItem>
        <ListItem selected={pathname === '/industry'} button onClick={() => handleNavigate('/industry')}>
          <ListItemIcon>
            <IndustryIcon />
          </ListItemIcon>
          <ListItemText primary="Industry" primaryTypographyProps={{ noWrap: true }} />
        </ListItem>
        <ListItem selected={pathname === '/logs'} button onClick={() => handleNavigate('/logs')}>
          <ListItemIcon>
            <LogsIcon />
          </ListItemIcon>
          <ListItemText primary="Logs" primaryTypographyProps={{ noWrap: true }} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default SideMenu;
