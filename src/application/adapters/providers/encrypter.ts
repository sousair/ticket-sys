import { InternalError } from '@application/errors/internal-error';
import { Either } from '@shared/either';

export interface IEncrypterProvider {
  encrypt(value: string): Either<InternalError, string>;
  compare(value: string, hash: string): Either<InternalError, boolean>;
}
