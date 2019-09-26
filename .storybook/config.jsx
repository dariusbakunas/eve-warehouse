import { configure } from "@storybook/react";
import { addDecorator } from "@storybook/react";
import apolloStorybookDecorator from "apollo-storybook-react";
import { withA11y } from "@storybook/addon-a11y";
import Root from "../src/components/Root";
import React from 'react'
import { mocks, typeDefs } from "./graphqlMocks"

addDecorator(withA11y);

const RootDecorator = storyFn => <Root>{storyFn()}</Root>;
addDecorator(RootDecorator);

addDecorator(
  apolloStorybookDecorator({
    typeDefs,
    mocks
  })
);

// automatically import all files ending in *.stories.js
const req = require.context("../stories", true, /\.stories\.tsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
