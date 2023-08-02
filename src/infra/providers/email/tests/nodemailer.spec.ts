import { IEmailProvider } from '@application/adapters/providers/email';
import nodemailer from 'nodemailer';
import { NodemailerProvider } from '../nodemailer';
import { NodemailerConfigs } from './../nodemailer';
import { Email } from '@entities/email';
import { Failure, Success } from '@utils/either';
import { EmailSendingError } from '@application/errors/email-sending';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({}),
  }),
}));

describe('Nodemailer Provider', () => {
  let sut: NodemailerProvider;

  let validParams: IEmailProvider.Params;

  const mockedNodemailerConfigs: NodemailerConfigs = {
    host: 'host',
    port: 1234,
    user: 'user',
    password: 'password',
    from: 'from@domain.com',
  };

  beforeEach(() => {
    sut = new NodemailerProvider(mockedNodemailerConfigs);

    validParams = {
      to: new Email('email@domain.com'),
      subject: 'subject',
      html: '<></>',
      attachments: [
        {
          name: 'name',
          path: 'file/path.extension',
        },
      ],
    };
  });

  it('should call nodemailer.createTransport with correct values', () => {
    const nodemailerSpy = jest.spyOn(nodemailer, 'createTransport');

    expect(nodemailerSpy).toHaveBeenCalledTimes(1);
    expect(nodemailerSpy).toHaveBeenCalledWith({
      host: mockedNodemailerConfigs.host,
      port: mockedNodemailerConfigs.port,
      auth: {
        user: mockedNodemailerConfigs.user,
        pass: mockedNodemailerConfigs.password,
      },
    });
  });

  it('should call nodemailer.sendMail with correct values', async () => {
    const nodemailerSpy = jest.spyOn(nodemailer.createTransport(), 'sendMail');

    await sut.sendMail(validParams);

    expect(nodemailerSpy).toHaveBeenCalledTimes(1);
    expect(nodemailerSpy).toHaveBeenCalledWith({
      from: mockedNodemailerConfigs.from,
      ...validParams,
      to: validParams.to.value,
    });
  });

  it('should return Failure and EmailSendingError when nodemailer.sendMail throws', async () => {
    jest.spyOn(nodemailer.createTransport(), 'sendMail').mockImplementationOnce(() => {
      throw new Error();
    });

    const result = await sut.sendMail(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(EmailSendingError);
  });

  it('should return Success on success', async () => {
    const result = await sut.sendMail(validParams);

    expect(result).toBeInstanceOf(Success);
    expect(result.value).toBeTruthy();
  });
});
