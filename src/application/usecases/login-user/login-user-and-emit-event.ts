import { IEncrypterProvider } from '@application/adapters/providers/encrypter';
import { IEventProvider } from '@application/adapters/providers/event';
import { ITokenProvider, TokenTypes } from '@application/adapters/providers/token';
import { IUserRepository } from '@application/adapters/repositories/user';
import { InvalidPasswordError } from '@application/errors/invalid-password';
import { UserNotFoundError } from '@application/errors/user-not-found';
import { UserLoginSuccessEvent, UserLoginSuccessEventPayload } from '@application/events/user-login-success';
import { failure, success } from '@shared/either';
import { HOUR_IN_MS } from '@shared/time';
import { ILoginUser } from './login-user';

export class LoginUserAndEmitEvent implements ILoginUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encrypterProvider: IEncrypterProvider,
    private readonly tokenProvider: ITokenProvider,
    private readonly eventProvider: IEventProvider
  ) {}

  async login({ email, password, ip }: ILoginUser.Params): ILoginUser.Result {
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      return failure(new UserNotFoundError());
    }

    const compareRes = this.encrypterProvider.compare(password, user.hashedPassword);

    if (compareRes.isFailure()) {
      return failure(compareRes.value);
    }

    const isValidPassword = compareRes.value;

    if (!isValidPassword) {
      return failure(new InvalidPasswordError());
    }

    const tokenRes = this.tokenProvider.generateToken({
      type: TokenTypes.USER_AUTH,
      expirationInMs: HOUR_IN_MS,
      payload: {
        user: {
          id: user.id,
          email: user.email.value,
          emailValidated: user.emailValidated,
        },
      },
    });

    if (tokenRes.isFailure()) {
      return failure(tokenRes.value);
    }

    const authToken = tokenRes.value;

    this.eventProvider.emit<UserLoginSuccessEventPayload>(
      new UserLoginSuccessEvent({
        user,
        ip,
        token: authToken,
      })
    );

    return success({
      token: authToken,
    });
  }
}
