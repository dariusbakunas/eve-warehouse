import * as Sentry from '@sentry/node';
import { Firestore } from '@google-cloud/firestore';
import { getAccessToken } from '../auth/getAccessToken';
import Auth0Strategy from 'passport-auth0';
import auth0Verify, { ISessionUser } from '../auth/auth0Verify';
import express, { NextFunction, Request, Response } from 'express';
import getAuthRoutes from './auth';
import helmet from 'helmet';
import morgan from 'morgan';
import next from 'next';
import passport from 'passport';
import pJson from '../../package.json';
import proxy, { Config } from 'http-proxy-middleware';
import session from 'cookie-session';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: './src' });
const handle = app.getRequestHandler();

Sentry.init({
  dsn: 'https://45c7dca4f55f43c38bec427d60cb08a1@sentry.io/1816311',
  release: `${pJson.name}@${pJson.version}`,
});

export interface IClientEnv {
  EVE_API_HOST: string;
  EVE_LOGIN_URL: string;
  EVE_CLIENT_ID: string;
  EVE_CHARACTER_REDIRECT_URL: string;
}

(async function() {
  if (process.env.APP_ENGINE === 'true') {
    require('@google-cloud/debug-agent').start();
    const firestore = new Firestore();
    const ref = firestore.collection('configs').doc('eve-mate-app');
    const doc = await ref.get();

    if (!doc.exists) {
      throw new Error('Unable to load app engine configs');
    } else {
      const configs = doc.data();

      if (configs) {
        Object.keys(configs).forEach(key => {
          process.env[key] = configs[key];
        });
      }
    }
  }

  const requiredEnv = ['AUTH0_AUDIENCE', 'AUTH0_DOMAIN', 'AUTH0_CLIENT_ID'];

  requiredEnv.forEach(env => {
    if (!process.env[env]) {
      throw new Error(`process.env.${env} is required`);
    }
  });

  const apiProxyConfig: Config = {
    changeOrigin: true,
    onError: (err, req, res) => {
      res.writeHead(500, {
        'Content-Type': 'application/json',
      });

      res.end(JSON.stringify({ message: err.message }));
    },
    onProxyReq: async (proxyReq, req: Request & { user: ISessionUser }) => {
      if (req.session && req.user) {
        const { accessToken } = req.user;
        proxyReq.setHeader('authorization', `Bearer ${accessToken}`);
      }
    },
    target: process.env.EVE_API_HOST,
  };

  await app.prepare();

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
    secret: process.env.COOKIE_SECRET,
    cookie: {
      maxAge: 900 * 1000, // 15 minutes in milliseconds
      secure: !dev,
      httpOnly: !dev,
    },
  };

  server.use(session(sessionConfig));

  const auth0Strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL,
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

  const clientEnv: IClientEnv = {
    EVE_API_HOST: process.env.EVE_API_HOST!,
    EVE_LOGIN_URL: process.env.EVE_LOGIN_URL!,
    EVE_CLIENT_ID: process.env.EVE_CLIENT_ID!,
    EVE_CHARACTER_REDIRECT_URL: process.env.EVE_CHARACTER_REDIRECT_URL!,
  };

  server.get('/health-check', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Status: OK!');
  });

  server.use('/public', express.static('public'));

  server.use(passport.initialize());
  server.use(passport.session());

  server.use('/api', proxy(apiProxyConfig));

  server.use(express.json());
  server.use(express.urlencoded());
  server.use('/auth', getAuthRoutes(process.env.AUTH0_DOMAIN!, process.env.AUTH0_CLIENT_ID!, process.env.AUTH0_AUDIENCE!, process.env.BASE_URL));
  server.use('/env', (req, res) => {
    res.json(clientEnv);
  });

  const restrictAccess = (req: Request, res: Response, nextFn: NextFunction) => {
    const request = req as Request & {
      isAuthenticated: () => boolean;
      user?: ISessionUser;
    };

    if (!request.isAuthenticated()) return res.redirect('/login');

    if (request.user) {
      if (request.user.status === 'GUEST' && request.originalUrl !== '/register' && request.baseUrl !== '/register') {
        return res.redirect('/register');
      } else if (request.user.status === 'NOT_VERIFIED' && request.originalUrl !== '/verify' && request.baseUrl !== '/verify') {
        return res.redirect('/verify');
      }
    }

    return nextFn();
  };

  server.get('/login', (req, res) => {
    return handle(req, res);
  });

  server.use('/$', restrictAccess);
  server.use('/characters', restrictAccess);
  server.use('/wallet', restrictAccess);
  server.use('/warehouse', restrictAccess);
  server.use('/industry', restrictAccess);
  server.use('/logs', restrictAccess);

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.use(Sentry.Handlers.errorHandler());

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
})();
