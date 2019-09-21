import React, { useState } from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Header from "../src/components/Header";
import SideMenu from "../src/components/SideMenu";

const MenuExample: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexGrow: 1, height: "100vh" }}>
      <Header isAuthenticated={true} sideMenuOpen={open} onSideMenuOpen={() => setOpen(true)} sideMenuEnabled={true} onLogoutClick={action("logout click")} title="Header" />
      <SideMenu sideMenuOpen={open} onSideMenuClose={() => setOpen(false)} />
    </div>
  );
};

storiesOf("Components|SideMenu", module).add("Default", () => <MenuExample />);
