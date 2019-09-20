import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Login from "../src/pages/Login";

storiesOf("Pages|Login", module)
  .add("Default", () => <Login />);
