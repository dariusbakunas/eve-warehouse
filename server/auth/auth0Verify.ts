import { createApolloClient } from '../lib/createApolloClient';
import { GetUserByEmail, GetUserByEmailVariables } from '../../client/src/__generated__/GetUserByEmail';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import logger from '../logger';
import StrategyInternal from 'passport-auth0';

export interface IUser {
  email: string;
  picture?: string;
  status: 'ACTIVE' | 'GUEST' | 'INACTIVE' | 'NOT_VERIFIED';
}

export interface ISessionUser extends IUser {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

const getUser = (apolloClient: ApolloClient<NormalizedCacheObject>, email: string) =>
  apolloClient.query<GetUserByEmail, GetUserByEmailVariables>({
    query: gql`
      query GetUserByEmail($email: String!) {
        userByEmail(email: $email) {
          id
          email
          username
          status
        }
      }
    `,
    variables: {
      email,
    },
  });

export const auth0Verify: StrategyInternal.VerifyFunction = async (
  accessToken: string,
  refreshToken: string,
  extraParams,
  profile,
  done: (error: Error | null, user?: ISessionUser) => void
) => {
  const apolloClient = createApolloClient(accessToken);

  if (!profile.emails || !profile.emails.length) {
    return done(new Error('Auth0: profile.emails missing'));
  }

  try {
    logger.debug(`auth0Verify: getUser(${profile.emails[0].value})`);
    const response = await getUser(apolloClient, profile.emails[0].value);
    const {
      data: { userByEmail },
      errors,
    } = response;

    if (errors) {
      logger.error(errors);
    }

    // @ts-ignore
    const { expires_in: expiresIn } = extraParams;
    const expiresAt = expiresIn * 1000 + Date.now();

    return done(null, {
      accessToken,
      refreshToken,
      expiresAt,
      email: profile.emails[0].value,
      // @ts-ignore
      picture: profile.picture,
      status: userByEmail ? userByEmail.status : 'GUEST',
    });
  } catch (e) {
    logger.error(e);
    return done(e);
  }
};

export default auth0Verify;
