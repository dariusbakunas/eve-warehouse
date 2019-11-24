import fetch from 'isomorphic-fetch';

export const getAccessToken = async (refreshToken: string) => {
  const form: { [key: string]: string } = {
    // eslint-disable-next-line @typescript-eslint/camelcase
    grant_type: 'refresh_token',
    // eslint-disable-next-line @typescript-eslint/camelcase
    client_id: process.env.AUTH0_CLIENT_ID!,
    // eslint-disable-next-line @typescript-eslint/camelcase
    client_secret: process.env.AUTH0_CLIENT_SECRET!,
    // eslint-disable-next-line @typescript-eslint/camelcase
    refresh_token: refreshToken,
  };

  const searchParams = Object.keys(form)
    .map(key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(form[key]);
    })
    .join('&');

  const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: searchParams,
  });

  return response.json();
};
