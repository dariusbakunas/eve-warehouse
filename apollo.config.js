module.exports = {
  client: {
    service: {
      addTypename: true,
      name: "eve-app",
      includes: ["./src/queries.ts"],
      tagName: "gql",
      localSchemaFile: "src/__generated__/schema.graphql"
    },
    excludes: ["src/gql/__generated__/schema.graphql"]
  }
};
