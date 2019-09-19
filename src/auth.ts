import express, { Request } from "express";
import passport from "passport";

const router = express.Router();

interface IAuthRequest extends Request {
  logIn: (user, options, done?) => void;
  logOut: () => void;
}

router.get(
  "/login",
  passport.authenticate("auth0", {
    scope: "openid email profile"
  }),
  (req, res) => res.redirect("/")
);

router.get("/callback", (req: IAuthRequest, res, next) => {
  passport.authenticate("auth0", (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect("/login");
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
