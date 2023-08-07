export class EnvConfig {
  APP_PORT: string;

  // * Nodemailer configs
  FROM_EMAIL: string;
  NODEMAILER_HOST: string;
  NODEMAILER_PORT: number;
  NODEMAILER_USER: string;
  NODEMAILER_USER_PASSWORD: string;

  // * BCrypt configs
  BCRYPT_PASSWORD_SALT_ROUNTS: number;

  // * JWT configs
  VALIDATION_EMAIL_JWT_SECRET: string;
  USER_AUTH_JWT_SECRET: string;

  static get APP_PORT(): string {
    return process.env.APP_PORT;
  }

  static get FROM_EMAIL(): string {
    return process.env.FROM_EMAIL;
  }

  static get NODEMAILER_HOST(): string {
    return process.env.NODEMAILER_HOST;
  }

  static get NODEMAILER_PORT(): number {
    return Number(process.env.NODEMAILER_PORT);
  }

  static get NODEMAILER_USER(): string {
    return process.env.NODEMAILER_USER;
  }

  static get NODEMAILER_USER_PASSWORD(): string {
    return process.env.NODEMAILER_USER_PASSWORD;
  }

  static get BCRYPT_PASSWORD_SALT_ROUNTS(): number {
    return Number(process.env.BCRYPT_PASSWORD_SALT_ROUNTS);
  }

  static get VALIDATION_EMAIL_JWT_SECRET(): string {
    return process.env.VALIDATION_EMAIL_JWT_SECRET;
  }
  static get USER_AUTH_JWT_SECRET(): string {
    return process.env.USER_AUTH_JWT_SECRET;
  }
}
