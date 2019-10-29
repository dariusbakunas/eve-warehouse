import { Request } from 'express';
import fetch from 'isomorphic-fetch';
import { ISessionUser, IUser } from './auth0Verify';

const getUser: (req: Request & { user?: ISessionUser }) => Promise<IUser> = async req => {
  if (typeof window === 'undefined') {
    if (req && req.user) {
      const user: ISessionUser = req.user;

      return {
        email: user.email,
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

export default getUser;
