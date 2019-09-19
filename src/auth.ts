import express, { Request } from "express";
import passport from "passport";

const router = express.Router();

interface IAuthRequest extends Request {
  logIn: (user, options, done?) => void;
  logOut: () => void;
  session: {
    passport?: {
      user: any;
    };
  };
}

router.get(
  "/login",
  passport.authenticate("auth0", {
    scope: "openid email profile"
  }),
  (req, res) => res.redirect("/")
);

router.get("/user", (req: IAuthRequest, res) => {
  res.setHeader("Content-Type", "application/json");
  const user = req.session && req.session.passport && req.session.passport.user ? req.session.passport.user : null;
  res.json(user);
});

/**
 * Auth0 redirects back to this URL and appends additional parameters to it,
 * including an access code which will be exchanged for an id_token, access_token and refresh_token.
 */
router.get("/callback", (req: IAuthRequest, res, next) => {
  passport.authenticate("auth0", (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect("/auth/login");
    req.logIn(user, err => {
      if (err) return next(err);
      res.redirect("/");
    });
  })(req, res, next);
});

router.get("/logout", (req: IAuthRequest, res) => {
  req.logOut();

  const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, BASE_URL } = process.env;
  res.redirect(`https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${BASE_URL}`);
});

export default router;
