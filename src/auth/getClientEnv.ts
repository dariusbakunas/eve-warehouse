import { IClientEnv } from '../server';
import { Request } from 'express';
import fetch from 'isomorphic-fetch';

const getClientEnv: (req: Request) => Promise<IClientEnv> = async req => {
  if (typeof window === 'undefined') {
    const env: IClientEnv = {
      EVE_API_HOST: process.env.EVE_API_HOST!,
      EVE_LOGIN_URL: process.env.EVE_LOGIN_URL!,
      EVE_CLIENT_ID: process.env.EVE_CLIENT_ID!,
      EVE_CHARACTER_REDIRECT_URL: process.env.EVE_CHARACTER_REDIRECT_URL!,
    };
    return env;
  } else {
    const baseURL = req ? `${req.protocol}://${req.get('Host')}` : '';
    const res = await fetch(`${baseURL}/env`);
    return await res.json();
  }
};

export default getClientEnv;
