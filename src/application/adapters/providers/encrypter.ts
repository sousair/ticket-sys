import { InternalError } from '@application/errors/internal-error';
import { Either } from '@utils/either';

export interface IEncrypterProvider {
  encryptUserPassword(password: string): Either<InternalError, string>;
}
