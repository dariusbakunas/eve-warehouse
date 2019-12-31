import { ISessionUser, IUser } from './auth0Verify';
import { Request } from 'express';
import fetch from 'isomorphic-fetch';

const getCurrentUser: (req: Request & { user?: ISessionUser }) => Promise<IUser> = async req => {
  if (typeof window === 'undefined') {
    if (req && req.user) {
      const user: ISessionUser = req.user;

      return {
        email: user.email,
        picture: user.picture,
        status: user.status,
      };
    }

    return null;
  } else {
    const baseURL = req ? `${req.protocol}://${req.get('Host')}` : '';
    const res = await fetch(`${baseURL}/auth/user`);
    return await res.json();
  }
};

export default getCurrentUser;
