import React, { ReactElement, ReactNode } from "react";
import apolloStorybookDecorator from "apollo-storybook-react";
import { GET_CURRENT_USER } from "../src/pages/Characters";

import { storiesOf } from "@storybook/react";
import { Characters } from "../src/pages/Characters";

const typeDefs = `
  type User {
    name: String
  }
  type Query {
    currentUser: User
  }

  schema {
    query: Query
  }
`;

const mocks = {
  Query: () => {
    return {
      currentUser: () => ({
        name: "TEST"
      })
    };
  }
};

storiesOf("Pages|Characters", module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks
    })
  )
  .add("Default", () => <Characters />);
