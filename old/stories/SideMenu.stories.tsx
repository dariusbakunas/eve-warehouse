import { action } from '@storybook/addon-actions';
import { SideMenu } from '../src/components/SideMenu';
import { storiesOf } from '@storybook/react';
import CharactersIcon from '../src/icons/CharactersIcon';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Header from '../src/components/Header';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import SideMenuHeader from '../src/components/SideMenuHeader';

const MenuExample: React.FC = () => {
  return (
    <React.Fragment>
      <Header isAuthenticated={true} onLogoutClick={action('logout click')} title="Header" />
      <SideMenu
        header={() => (
          <SideMenuHeader
            user={{
              name: 'Test User',
              email: 'test@gmail.com',
              picture: 'https://avatars0.githubusercontent.com/u/2111392?v=4',
            }}
          />
        )}
      >
        <List>
          <ListItem selected={true} button>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" primaryTypographyProps={{ noWrap: true }} />
          </ListItem>
          <ListItem selected={false} button>
            <ListItemIcon>
              <CharactersIcon />
            </ListItemIcon>
            <ListItemText primary="Characters" primaryTypographyProps={{ noWrap: true }} />
          </ListItem>
        </List>
      </SideMenu>
    </React.Fragment>
  );
};

storiesOf('Components|SideMenu', module).add('Default', () => <MenuExample />);
