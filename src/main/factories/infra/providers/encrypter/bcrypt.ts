import { BcryptEncrypterProvider } from '@infra/providers/encrypter/bcrypt';
import { EnvConfig } from '@main/configs/env';

export class BcryptEncrypterProviderFactory {
  static instance: BcryptEncrypterProvider;

  static getInstance(): BcryptEncrypterProvider {
    if (this.instance) return this.instance;

    this.instance = new BcryptEncrypterProvider(EnvConfig.BCRYPT_PASSWORD_SALT_ROUNDS);
    return this.instance;
  }
}
