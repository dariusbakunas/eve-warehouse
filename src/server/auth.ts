import express, { NextFunction, Request } from 'express';
import passport from 'passport';
import getCurrentUser from '../auth/getCurrentUser';
import logger from '../logger';

const router = express.Router();

router.get(
  '/login',
  passport.authenticate('auth0', {
    scope: 'openid email profile',
    audience: process.env.AUTH0_AUDIENCE,
  }),
  (req, res) => res.redirect('/')
);

router.get('/user', async (req: Request, res) => {
  res.setHeader('Content-Type', 'application/json');
  const user = await getCurrentUser(req);
  res.json(user);
});

/**
 * Auth0 redirects back to this URL and appends additional parameters to it,
 * including an access code which will be exchanged for an id_token, access_token and refresh_token.
 */
router.get('/callback', (req: Request, res, next: NextFunction) => {
  logger.debug('auth/callback: passport.authenticate');
  const request = req as Request & {
    logIn: (user: any, callback: (err?: any) => void) => void;
  };

  passport.authenticate('auth0', (err?: any, user?: any) => {
    logger.debug(`passport.authenticate, user: ${user ? JSON.stringify(user) : null}`);
    if (err) {
      logger.error(err);
      return next(err);
    }
    if (!user) return res.redirect('/login');

    // accessToken, refreshToken(undefined), profile, status = GUEST

    return request.logIn(user, loginErr => {
      if (err) return next(err);

      if (user && user.status === 'GUEST') {
        return res.redirect('/register');
      }

      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', (req: Request, res) => {
  const request = req as Request & { logOut: () => void };
  request.logOut();

  const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, BASE_URL } = process.env;
  res.redirect(`https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${BASE_URL}`);
});

export default router;
