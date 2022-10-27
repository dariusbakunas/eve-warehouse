import { handleAuth, handleLogin } from '@auth0/nextjs-auth0'
import { HttpError } from 'http-errors';
import { AccessTokenError } from '@auth0/nextjs-auth0/dist/utils/errors';

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        authorizationParams: {
          audience: 'https://eve-api', // or AUTH0_AUDIENCE
          // Add the `offline_access` scope to also get a Refresh Token
          scope: 'openid profile email' // or AUTH0_SCOPE
        }
      });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status || 400).end(error.message);
      } else if (error instanceof AccessTokenError) {
        res.status(400).end(error.message);
      }else if (error instanceof Error) {
        res.status(500).end(error.message);
      } else {
        res.status(500).end("Unknown error occurred");
      }
    }
  }
});