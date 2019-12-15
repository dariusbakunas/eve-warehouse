import characterScopes from "../src/__generated__/schema.graphql";

export const typeDefs = characterScopes;

export const mocks = {
  Query: () => ({
    scopes: () => ([
      { id: 1, name: "scope 1" },
      { id: 2, name: "scope 2" },
      { id: 3, name: "scope 3" },
      { id: 4, name: "scope 4" },
      { id: 5, name: "scope 5" }
    ])
  })
};
