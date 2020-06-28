import * as Sentry from '@sentry/node';
import { applicationConfig } from './applicationConfig';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { getAccessToken } from './auth/getAccessToken';
import { getAuthRoutes } from './auth/getAuthRoutes';
import Auth0Strategy from 'passport-auth0';
import auth0Verify, { ISessionUser } from './auth/auth0Verify';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import logger from './logger';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import pJson from '../package.json';
import session from 'cookie-session';

export interface IClientEnv {
  EVE_API_HOST: string;
  EVE_LOGIN_URL: string;
  EVE_CLIENT_ID: string;
  EVE_CHARACTER_REDIRECT_URL: string;
}

const SERVER_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const IS_DEV = process.env.NODE_ENV !== 'production';

Sentry.init({
  dsn: 'https://45c7dca4f55f43c38bec427d60cb08a1@sentry.io/1816311',
  release: `${pJson.name}@${pJson.version}`,
});

(async function () {
  try {
    await applicationConfig.load();
  } catch (e) {
    logger.error(e);
  }

  const { config } = applicationConfig;

  const apiProxyConfig: Options = {
    changeOrigin: true,
    onError: (err, req, res) => {
      res.writeHead(500, {
        'Content-Type': 'application/json',
      });

      res.end(JSON.stringify({ message: err.message }));
    },
    onProxyReq: async (proxyReq, req: Request & { user: ISessionUser; session: any }) => {
      if (req.session && req.user) {
        const { accessToken } = req.user;
        proxyReq.setHeader('authorization', `Bearer ${accessToken}`);
      }
    },
    target: config.eveApiHost,
  };

  const server = express();
  server.use(helmet());
  server.use(Sentry.Handlers.requestHandler());

  server.use(
    morgan('short', {
      skip: (req: Request, res: Response) => {
        return (
          req.url === '/health-check' ||
          req.url === '/favicon.ico' ||
          req.originalUrl === '/.well-known/apollo/server-health' ||
          req.originalUrl === '/favicon.ico' ||
          res.statusCode < 400
        );
      },
      stream: process.stderr,
    })
  );

  server.use(
    morgan('short', {
      skip: (req: Request, res: Response) => {
        return (
          req.url === '/health-check' ||
          req.url === '/favicon.ico' ||
          req.originalUrl === '/.well-known/apollo/server-health' ||
          req.originalUrl === '/favicon.ico' ||
          res.statusCode >= 400
        );
      },
      stream: process.stdout,
    })
  );

  const sessionConfig = {
    name: 'eve-app',
    secret: config.cookieSecret,
    cookie: {
      maxAge: 900 * 1000, // 15 minutes in milliseconds
      secure: !IS_DEV,
      httpOnly: !IS_DEV,
    },
  };

  server.use(session(sessionConfig));

  const auth0Strategy = new Auth0Strategy(
    {
      domain: config.auth0Domain,
      clientID: config.auth0ClientId,
      clientSecret: config.auth0ClientSecret,
      callbackURL: config.auth0CallbackUrl,
    },
    auth0Verify
  );

  passport.use(auth0Strategy);
  passport.serializeUser((user: any, done: (err: any, user: any) => void) => done(null, user));
  passport.deserializeUser(async (user: any, done: (err: any, user: any) => void) => {
    const { refreshToken, expiresAt } = user;

    // subtract 5 minutes for safety
    if (new Date().getTime() > expiresAt - 5 * 1000 * 60) {
      // get new token
      const response = await getAccessToken(refreshToken);
      const { access_token: newAccessToken, expires_in: expiresIn } = response;
      const newExpiresAt = expiresIn * 1000 + new Date().getTime();

      const updatedUser = {
        ...user,
        accessToken: newAccessToken,
        expiresAt: newExpiresAt,
      };

      return done(null, updatedUser);
    }

    return done(null, user);
  });

  server.get('/health-check', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Status: OK!');
  });

  server.use(express.static(path.join(__dirname, '..', 'client')));

  server.use(passport.initialize());
  server.use(passport.session());
  server.use('/api', createProxyMiddleware(apiProxyConfig));

  server.use(express.json());
  server.use(express.urlencoded());

  server.use('/auth', getAuthRoutes(config.auth0Domain, config.auth0ClientId, config.auth0Audience, config.baseUrl));
  server.use('/env', (req, res) => {
    const clientEnv: IClientEnv = {
      EVE_API_HOST: config.eveApiHost,
      EVE_LOGIN_URL: config.eveLoginUrl,
      EVE_CLIENT_ID: config.eveClientId,
      EVE_CHARACTER_REDIRECT_URL: config.eveCharacterRedirectUrl,
    };

    res.json(clientEnv);
  });

  server.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
  });

  server.use(Sentry.Handlers.errorHandler());

  server.listen(SERVER_PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${SERVER_PORT}`);
  });
})();
