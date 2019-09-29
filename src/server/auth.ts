import express, { NextFunction, Request } from 'express';
import passport from 'passport';

const router = express.Router();

router.get(
  '/login',
  passport.authenticate('auth0', {
    scope: 'openid email profile',
    audience: process.env.AUTH0_AUDIENCE,
  }),
  (req, res) => res.redirect('/')
);

router.get('/user', (req: Request, res) => {
  res.setHeader('Content-Type', 'application/json');
  const user =
    req.session && req.session.passport && req.session.passport.user
      ? req.session.passport.user.profile
      : null;
  res.json(user);
});

/**
 * Auth0 redirects back to this URL and appends additional parameters to it,
 * including an access code which will be exchanged for an id_token, access_token and refresh_token.
 */
router.get('/callback', (req: Request, res, next: NextFunction) => {
  const request = req as Request & {
    logIn: (user: any, callback: (err?: any) => void) => void;
  };

  passport.authenticate('auth0', (err?: any, user?: any) => {
    if (err) return next(err);
    if (!user) return res.redirect('/login');

    request.logIn(user, err => {
      if (err) return next(err);
      res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', (req: Request, res) => {
  const request = req as Request & { logOut: () => void };
  request.logOut();

  const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, BASE_URL } = process.env;
  res.redirect(
    `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${BASE_URL}`
  );
});

export default router;
