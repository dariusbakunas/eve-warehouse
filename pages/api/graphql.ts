import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';

export const config = {
  api: {
    // Enable `externalResolver` option in Next.js
    externalResolver: true,
    bodyParser: false,
  },
};

const graphql = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const { accessToken } = await getAccessToken(req, res);

  return httpProxyMiddleware(req, res, {
    // You can use the `http-proxy` option
    target: 'http://localhost:4000',
    // In addition, you can use the `pathRewrite` option provided by `next-http-proxy-middleware`
    pathRewrite: [{
      patternStr: '^/api/graphql',
      replaceStr: '/graphql'
    }],
    onProxyInit: (proxy) => {
      proxy.on('proxyReq', (proxyReq, req, res) => {
        proxyReq.setHeader('Authorization', `Bearer ${accessToken}`);
      })
    }
  });
}

export default withApiAuthRequired(graphql);