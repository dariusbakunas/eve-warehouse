import express, { Request, Response, NextFunction } from 'express';
import next from 'next';
import passport from 'passport';
import Auth0Strategy from 'passport-auth0';
import uid from 'uid-safe';
import session from 'cookie-session';
import proxy, { Config } from 'http-proxy-middleware';
import authRoutes from './auth';
import auth0Verify, { ISessionUser } from '../auth/auth0Verify';
import * as Sentry from '@sentry/node';
import pJson from '../../package.json';
import morgan from 'morgan';
import helmet from 'helmet';
import { getAccessToken } from '../auth/getAccessToken';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: './src' });
const handle = app.getRequestHandler();

Sentry.init({
  dsn: 'https://45c7dca4f55f43c38bec427d60cb08a1@sentry.io/1816311',
  release: `${pJson.name}@${pJson.version}`,
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

app.prepare().then(() => {
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
    secret: uid.sync(18),
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

  server.get('/health-check', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Status: OK!');
  });

  server.use(passport.initialize());
  server.use(passport.session());

  server.use('/api', proxy(apiProxyConfig));

  server.use(express.json());
  server.use(express.urlencoded());
  server.use('/auth', authRoutes);

  const restrictAccess = (req: Request, res: Response, nextFn: NextFunction) => {
    const request = req as Request & {
      isAuthenticated: () => boolean;
      user?: ISessionUser;
    };

    if (!request.isAuthenticated()) return res.redirect('/login');

    if (request.user && request.user.status === 'GUEST' && request.originalUrl !== '/register' && request.baseUrl !== '/register') {
      return res.redirect('/register');
    }

    return nextFn();
  };

  server.get('/login', (req, res) => {
    return handle(req, res);
  });

  server.use('/$', restrictAccess);
  server.use('/characters', restrictAccess);
  server.use('/wallet', restrictAccess);

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.use(Sentry.Handlers.errorHandler());

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
