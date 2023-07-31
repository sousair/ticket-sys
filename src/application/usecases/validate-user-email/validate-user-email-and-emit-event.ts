import { ITokenProvider, TokenTypes } from '@application/adapters/providers/token';
import { failure } from '@utils/either';
import { IValidateUserEmail } from './validate-user-email';
import { TokenExpiredError } from '@application/errors/token-expired';

export class ValidateUserEmailAndEmitEvent implements IValidateUserEmail {
  constructor(
    private readonly tokenProvider: ITokenProvider,
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

    
  }
}
