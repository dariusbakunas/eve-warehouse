import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Header from "../src/components/Header";
import { SideMenu } from "../src/components/SideMenu";
import { NextRouter } from "next/router";
import { RouterContext } from "next-server/dist/lib/router-context";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DashboardIcon from "@material-ui/icons/Dashboard";
import CharactersIcon from "../src/icons/CharactersIcon";
import SideMenuHeader from "../src/components/SideMenuHeader";

const router: NextRouter = {
  asPath: "/",
  events: {
    emit: () => {},
    on: () => {},
    off: () => {}
  },
  pathname: "/",
  query: {},
  back: () => Promise.resolve(true),
  beforePopState: () => Promise.resolve(true),
  prefetch: () => Promise.resolve(),
  push: () => Promise.resolve(true),
  reload: () => Promise.resolve(true),
  replace: () => Promise.resolve(true),
  route: "/"
};

const MenuExample: React.FC = () => {
  return (
    <RouterContext.Provider value={router}>
      <Header isAuthenticated={true} onLogoutClick={action("logout click")} title="Header" />
      <SideMenu
        header={() => (
          <SideMenuHeader
            user={{
              name: "Test User",
              email: "test@gmail.com",
              picture: "https://avatars0.githubusercontent.com/u/2111392?v=4"
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
    </RouterContext.Provider>
  );
};

storiesOf("Components|SideMenu", module).add("Default", () => <MenuExample />);
