import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Index from "../src/pages/Index";

storiesOf("Pages|Index", module)
  .add("Default", () => <Index />);
