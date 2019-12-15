import { configure } from "@storybook/react";
import { addDecorator } from "@storybook/react";
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import apolloStorybookDecorator from "apollo-storybook-react";
import { withA11y } from "@storybook/addon-a11y";
import { withConsole } from '@storybook/addon-console';
import Root from "../src/components/Root";
import React, { ReactNode } from 'react'
import { mocks, typeDefs } from "./graphqlMocks"
import { StoryFn } from '@storybook/addons';

addDecorator((storyFn, context) => withConsole()(storyFn)(context));
addDecorator(withA11y);

const RootDecorator = (storyFn: StoryFn<ReactNode>) => <Root>{storyFn()}</Root>;
addDecorator(RootDecorator);

const router: NextRouter = {
  asPath: '/',
  events: {
    emit: () => {},
    on: () => {},
    off: () => {},
  },
  pathname: '/',
  query: {},
  back: () => Promise.resolve(true),
  beforePopState: () => Promise.resolve(true),
  prefetch: () => Promise.resolve(),
  push: () => Promise.resolve(true),
  reload: () => Promise.resolve(true),
  replace: () => Promise.resolve(true),
  route: '/',
};

const RouterDecorator = (storyFn: StoryFn<ReactNode>) => <RouterContext.Provider value={router}>{storyFn()}</RouterContext.Provider>;
addDecorator(RouterDecorator);

addDecorator(
  apolloStorybookDecorator({
    typeDefs,
    mocks
  })
);

// automatically import all files ending in *.stories.js
// @ts-ignore
const req = require.context("../stories", true, /\.stories\.tsx$/);
function loadStories() {
  req.keys().forEach((filename: string) => req(filename));
}

configure(loadStories, module);
