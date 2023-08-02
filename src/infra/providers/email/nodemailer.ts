import { IEmailProvider } from '@application/adapters/providers/email';
import { EmailSendingError } from '@application/errors/email-sending';
import { failure, success } from '@utils/either';
import nodemailer from 'nodemailer';

export type NodemailerConfigs = {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
};

export class NodemailerProvider implements IEmailProvider {
  private readonly transport: nodemailer.Transporter;

  constructor(private readonly nodemailerConfigs: NodemailerConfigs) {
    this.transport = nodemailer.createTransport({
      host: this.nodemailerConfigs.host,
      port: this.nodemailerConfigs.port,
      auth: {
        user: this.nodemailerConfigs.user,
        pass: this.nodemailerConfigs.password,
      },
    });
  }

  async sendMail({ to, subject, html, attachments }: IEmailProvider.Params): IEmailProvider.Result {
    try {
      await this.transport.sendMail({
        from: this.nodemailerConfigs.from,
        to: to.value,
        subject: subject,
        html: html,
        attachments: attachments,
      });

      return success(true);
    } catch (err) {
      console.error(err);
      return failure(new EmailSendingError());
    }
  }
}
