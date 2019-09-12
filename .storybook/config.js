import { configure } from "@storybook/react";
import { addDecorator } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { muiTheme } from "storybook-addon-material-ui";
import theme from "../src/theme";

addDecorator(withA11y);
addDecorator(muiTheme(theme));

// automatically import all files ending in *.stories.js
const req = require.context("../stories", true, /\.stories\.tsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
