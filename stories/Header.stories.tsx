import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Header from "../src/components/Header";

storiesOf("Header", module)
  .add("Not authenticated", () => <Header isAuthenticated={false} onLoginClick={action("login click")} title="Header" />)
  .add("Authenticated", () => <Header isAuthenticated={true} onLogoutClick={action("logout click")} title="Header" />);
