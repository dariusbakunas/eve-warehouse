import React, { useState } from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Header from "../src/components/Header";
import { SideMenu } from "../src/components/SideMenu";
import { NextRouter } from "next/router";

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
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexGrow: 1, height: "100vh" }}>
      <Header
        isAuthenticated={true}
        sideMenuOpen={open}
        onSideMenuOpen={() => setOpen(true)}
        sideMenuEnabled={true}
        onLogoutClick={action("logout click")}
        title="Header"
      />
      <SideMenu sideMenuOpen={open} onSideMenuClose={() => setOpen(false)} router={router} />
    </div>
  );
};

storiesOf("Components|SideMenu", module).add("Default", () => <MenuExample />);
