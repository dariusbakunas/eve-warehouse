module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.stories\.tsx?$/,
    loaders: [require.resolve("@storybook/addon-storysource/loader")],
    enforce: "pre"
  });
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve("babel-loader"),
    options: {
      presets: [["react-app", { flow: false, typescript: true }]]
    }
  });
  config.module.rules.push({
    test: /\.(graphql|gql)$/,
    exclude: /node_modules/,
    loader: "graphql-tag/loader"
  });
  config.resolve.extensions.push(".ts", ".tsx");
  return config;
};
