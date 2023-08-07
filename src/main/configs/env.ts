
export class EnvConfig {
  APP_PORT: string;

  static get APP_PORT(): string {
    return process.env.APP_PORT;
  }
}