const { parsed: localEnv } = require('dotenv').config();
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack');

const CLIENT_ENV_WHITELIST = ['EVE_API_HOST', 'EVE_LOGIN_URL', 'EVE_CLIENT_ID', 'EVE_CHARACTER_REDIRECT_URL'];

const env = CLIENT_ENV_WHITELIST.reduce((acc, key) => {
  const val = localEnv ? localEnv[key] : process.env[key];
  if (val) {
    acc[key] = val;
  }

  return acc;
}, {});

module.exports = withSass(
  withCSS({
    webpack: config => {
      config.module.rules.push({
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      });

      config.module.rules.push({
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
          },
        },
      });

      config.plugins.push(new webpack.EnvironmentPlugin(env));

      return config;
    },
  })
);
