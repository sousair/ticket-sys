import { NodemailerConfigs, NodemailerProvider } from '@infra/providers/email/nodemailer';
import { EnvConfig } from '@main/configs/env';

export class NodemailerProviderFactory {
  static instance: NodemailerProvider;

  static getInstance(): NodemailerProvider {
    if (this.instance) return this.instance;

    const configs: NodemailerConfigs = {
      from: EnvConfig.FROM_EMAIL,
      host: EnvConfig.NODEMAILER_HOST,
      port: EnvConfig.NODEMAILER_PORT,
      user: EnvConfig.NODEMAILER_USER,
      password: EnvConfig.NODEMAILER_USER_PASSWORD,
    };

    this.instance = new NodemailerProvider(configs);
    return this.instance;
  }
}
