import { JSONWebTokenConfigs, JSONWebTokenProvider } from '@infra/providers/token/jsonwebtoken';
import { EnvConfig } from '@main/configs/env';

export class JSONWebTokenProviderFactory {
  static instance: JSONWebTokenProvider;

  static getInstance(): JSONWebTokenProvider {
    if (this.instance) return this.instance;

    const jwtConfigs: JSONWebTokenConfigs = {
      emailValidationTokenSecret: EnvConfig.VALIDATION_EMAIL_JWT_SECRET,
      userAuthTokenSecret: EnvConfig.USER_AUTH_JWT_SECRET,
    };

    this.instance = new JSONWebTokenProvider(jwtConfigs);
    return this.instance;
  }
}
