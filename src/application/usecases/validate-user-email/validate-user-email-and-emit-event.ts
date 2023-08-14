import { IEventProvider } from '@application/adapters/providers/event';
import { ITokenProvider, TokenTypes } from '@application/adapters/providers/token';
import { IUserRepository } from '@application/adapters/repositories/user';
import { InternalError } from '@application/errors/internal-error';
import { TokenExpiredError } from '@application/errors/token-expired';
import { UserNotFoundError } from '@application/errors/user-not-found';
import { UserEmailValidatedEvent, UserEmailValidatedEventPayload } from '@application/events/user-email-validated';
import { failure, success } from '@shared/either';
import { IValidateUserEmail } from './validate-user-email';

export class ValidateUserEmailAndEmitEvent implements IValidateUserEmail {
  constructor(
    private readonly tokenProvider: ITokenProvider,
    private readonly userRepository: IUserRepository,
    private readonly eventProvider: IEventProvider
  ) {}

  async validate({ token }: IValidateUserEmail.Params): IValidateUserEmail.Result {
    const validateTokenRes = this.tokenProvider.validateToken({
      type: TokenTypes.VALIDATE_EMAIL,
      token,
    });

    if (validateTokenRes.isFailure()) {
      return failure(validateTokenRes.value);
    }

    const { payload: tokenPayload, expirationDate: tokenExpirationDate } = validateTokenRes.value;

    if (tokenExpirationDate < new Date()) {
      return failure(new TokenExpiredError());
    }

    const userId = <string>tokenPayload.userId;

    if (!userId) {
      return failure(new InternalError('unable to identify user'));
    }

    const user = await this.userRepository.findOneById(userId);

    if (!user) {
      return failure(new UserNotFoundError());
    }

    user.emailValidated = true;

    const updateUserRes = await this.userRepository.update(user);

    if (updateUserRes.isFailure()) {
      return failure(updateUserRes.value);
    }

    this.eventProvider.emit<UserEmailValidatedEventPayload>(
      new UserEmailValidatedEvent({
        user,
        validationDate: new Date(),
      })
    );

    return success(true);
  }
}
