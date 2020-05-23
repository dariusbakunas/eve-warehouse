import express, { NextFunction, Request } from "express";
import getCurrentUser from "../auth/getCurrentUser";
import logger from "../logger";
import passport from "passport";

const DEV = process.env.NODE_ENV === "development";

export const getAuthRoutes = (auth0Domain: string, auth0ClientId: string, auth0Audience: string, baseUr?: string) => {
  const router = express.Router();

  router.get(
    "/login",
    // @ts-ignore
    passport.authenticate("auth0", { scope: "openid email profile offline_access", audience: auth0Audience }),
    (req, res) => res.redirect("/")
  );

  router.get("/user", async (req: Request, res) => {
    res.setHeader("Content-Type", "application/json");
    // @ts-ignore
    const user = await getCurrentUser(req);
    res.json(user);
  });

  /**
   * Auth0 redirects back to this URL and appends additional parameters to it,
   * including an access code which will be exchanged for an id_token, access_token and refresh_token.
   */
  router.get("/callback", (req: Request, res, next: NextFunction) => {
    logger.debug("auth/callback: passport.authenticate");
    const urlPrefix = DEV ? "http://localhost:3000" : "";
    const request = req as Request & {
      logIn: (user: any, callback: (err?: any) => void) => void;
    };

    passport.authenticate("auth0", (err?: any, user?: any) => {
      logger.debug(`passport.authenticate, user: ${user ? JSON.stringify(user) : null}`);
      if (err) {
        logger.error(err);
        return next(err);
      }

      if (!user) return res.redirect(`${urlPrefix}/login`);

      return request.logIn(user, (loginErr) => {
        if (err) return next(err);

        if (user) {
          if (user.status === "GUEST") {
            return res.redirect(`${urlPrefix}/register`);
          } else if (user.status === "NOT_VERIFIED") {
            return res.redirect(`${urlPrefix}/verify`);
          }
        }

        return res.redirect(`${urlPrefix}/characters`);
      });
    })(req, res, next);
  });

  router.get("/logout", (req: Request, res) => {
    const request = req as Request & { logOut: () => void };
    request.logOut();

    res.redirect(`https://${auth0Domain}/v2/logout?client_id=${auth0ClientId}&returnTo=${baseUr || "/"}`);
  });

  return router;
};
