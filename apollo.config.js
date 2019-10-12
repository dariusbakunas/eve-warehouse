module.exports = {
  client: {
    service: {
      addTypename: true,
      name: 'eve-app',
      includes: ['src/queries/*.graphql'],
      localSchemaFile: 'src/__generated__/schema.graphql',
    },
    excludes: ['src/__generated__/schema.graphql'],
  },
};
