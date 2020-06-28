import { applicationConfig } from '../applicationConfig';
import fetch from 'node-fetch';

export const getAccessToken = async (refreshToken: string) => {
  const { config } = applicationConfig;

  const form: { [key: string]: string } = {
    // eslint-disable-next-line @typescript-eslint/camelcase
    grant_type: 'refresh_token',
    // eslint-disable-next-line @typescript-eslint/camelcase
    client_id: config.auth0ClientId,
    // eslint-disable-next-line @typescript-eslint/camelcase
    client_secret: config.auth0ClientSecret,
    // eslint-disable-next-line @typescript-eslint/camelcase
    refresh_token: refreshToken,
  };

  const searchParams = Object.keys(form)
    .map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(form[key]);
    })
    .join('&');

  const response = await fetch(`https://${config.auth0Domain}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: searchParams,
  });

  return response.json();
};
