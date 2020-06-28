import { SecretManagerServiceClient } from '@google-cloud/secret-manager/build/src';
import logger from './logger';

export interface IApplicationConfig {
  auth0Domain: string;
  auth0Audience: string;
  auth0ClientId: string;
  auth0ClientSecret: string;
  auth0CallbackUrl: string;
  eveApiHost: string;
  gcProjectId?: string;
  cookieSecret: string;
  eveClientId: string;
  eveClientSecret: string;
  eveCharacterRedirectUrl: string;
  eveLoginUrl: string;
  baseUrl: string;
}

const REQUIRED_CONFIG: Array<keyof IApplicationConfig> = [
  'auth0Domain',
  'auth0Audience',
  'auth0ClientId',
  'auth0ClientSecret',
  'auth0CallbackUrl',
  'cookieSecret',
  'eveApiHost',
  'eveClientId',
  'eveClientSecret',
  'eveLoginUrl',
  'eveCharacterRedirectUrl',
  'baseUrl',
];

class ApplicationConfig {
  private _config: IApplicationConfig;

  constructor() {
    this._config = {
      auth0Domain: '',
      auth0Audience: '',
      auth0ClientId: '',
      auth0ClientSecret: '',
      auth0CallbackUrl: '',
      baseUrl: '',
      eveApiHost: '',
      eveClientId: '',
      eveClientSecret: '',
      eveCharacterRedirectUrl: '',
      eveLoginUrl: '',
      cookieSecret: '',
    };
  }

  private async loadGCloudSecret(
    // @ts-ignore
    secretClient: SecretManagerServiceClient,
    projectId: string,
    secretName: string,
    version = 'latest'
  ): Promise<string> {
    const path = `projects/${projectId}/secrets/${secretName}/versions/${version}`;
    const [response] = await secretClient.accessSecretVersion({
      name: path,
    });
    return response?.payload?.data?.toString() ?? '';
  }

  private async loadLatestGCloudSecrets(
    // @ts-ignore
    secretClient: SecretManagerServiceClient,
    projectId: string,
    secretNames: string[]
  ): Promise<Array<string>> {
    return Promise.all(secretNames.map((secret) => this.loadGCloudSecret(secretClient, projectId, secret)));
  }

  private validateConfig() {
    REQUIRED_CONFIG.forEach((key) => {
      const value = this.config[key];

      if (!value || value === '') {
        throw new Error(`Missing configuration entry for ${key}`);
      }
    });
  }

  private getConfigFromEnv(): IApplicationConfig {
    return {
      auth0Domain: process.env['AUTH0_DOMAIN'] || '',
      auth0Audience: process.env['AUTH0_AUDIENCE'] || '',
      auth0CallbackUrl: process.env['AUTH0_CALLBACK_URL'] || '',
      auth0ClientId: process.env['AUTH0_CLIENT_ID'] || '',
      auth0ClientSecret: process.env['AUTH0_CLIENT_SECRET'] || '',
      baseUrl: process.env['BASE_URL'] || '',
      eveApiHost: process.env['EVE_API_HOST'] || '',
      eveCharacterRedirectUrl: process.env['EVE_CHARACTER_REDIRECT_URL'] || '',
      eveClientId: process.env['EVE_CLIENT_ID'] || '',
      eveClientSecret: process.env['EVE_CLIENT_SECRET'] || '',
      eveLoginUrl: process.env['EVE_LOGIN_URL'] || '',
      cookieSecret: process.env['COOKIE_SECRET'] || '',
    };
  }

  async load(validate = true) {
    if (process.env.NODE_ENV === 'development') {
      this._config = this.getConfigFromEnv();
    } else {
      // TODO: add support for deployments to different clouds
      if (process.env.APP_ENGINE === 'true') {
        const secretClient = new SecretManagerServiceClient();
        const projectId = await secretClient.getProjectId();

        const [
          auth0ClientId,
          auth0ClientSecret,
          auth0CallbackUrl,
          baseUrl,
          cookieSecret,
          eveApiHost,
          eveCharacterRedirectUrl,
          eveClientId,
          eveClientSecret,
          eveLoginUrl,
          auth0Audience,
          auth0Domain,
        ] = await this.loadLatestGCloudSecrets(secretClient, projectId, [
          'AUTH0_CLIENT_ID',
          'AUTH0_CLIENT_SECRET',
          'AUTH0_CALLBACK_URL',
          'BASE_URL',
          'COOKIE_SECRET',
          'EVE_API_HOST',
          'EVE_CHARACTER_REDIRECT_URL',
          'EVE_CLIENT_ID',
          'EVE_CLIENT_SECRET',
          'EVE_LOGIN_URL',
          'AUTH0_AUDIENCE',
          'AUTH0_DOMAIN',
        ]);

        this._config = {
          auth0ClientId,
          auth0ClientSecret,
          auth0CallbackUrl,
          auth0Audience,
          auth0Domain,
          baseUrl,
          eveApiHost,
          eveCharacterRedirectUrl,
          eveClientId,
          eveClientSecret,
          eveLoginUrl,
          gcProjectId: projectId,
          cookieSecret,
        };
      } else {
        this._config = this.getConfigFromEnv();
      }
    }

    if (validate) {
      this.validateConfig();
    }

    if (process.env.NODE_ENV === 'development') {
      logger.info(`Loaded config: ${JSON.stringify(this._config)}`);
    }
  }

  get config(): Readonly<IApplicationConfig> {
    return this._config;
  }
}

export const applicationConfig = new ApplicationConfig();
