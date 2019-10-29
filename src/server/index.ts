import express, { Request, Response, NextFunction } from 'express';
import next from 'next';
import passport from 'passport';
import Auth0Strategy from 'passport-auth0';
import uid from 'uid-safe';
import session from 'express-session';
import bodyParser from 'body-parser';
import proxy, { Config } from 'http-proxy-middleware';
import authRoutes from './auth';
import auth0Verify, { ISessionUser } from '../auth/auth0Verify';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: './src' });
const handle = app.getRequestHandler();

const apiProxyConfig: Config = {
  changeOrigin: true,
  onError: (err, req, res) => {
    res.writeHead(500, {
      'Content-Type': 'application/json',
    });

    res.end(JSON.stringify({ message: err.message }));
  },
  onProxyReq: (proxyReq, req: Request & { user: ISessionUser }) => {
    if (req.user) {
      proxyReq.setHeader('authorization', `Bearer ${req.user.accessToken}`);
    }
  },
  target: process.env.EVE_API_HOST,
};

app.prepare().then(() => {
  const server = express();

  const sessionConfig = {
    secret: uid.sync(18),
    cookie: {
      maxAge: 86400 * 1000, // 24 hours in milliseconds
      secure: !dev,
    },
    resave: false,
    saveUninitialized: true,
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
  passport.deserializeUser((user: any, done: (err: any, user: any) => void) => done(null, user));

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

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
