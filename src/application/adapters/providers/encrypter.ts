import { InternalError } from '@application/errors/internal-error';
import { UserPassword } from '@entities/user-password';
import { Either } from '@shared/either';

export interface IEncrypterProvider {
  encryptUserPassword(userPassword: UserPassword): Either<InternalError, string>;
}
