import { IEncrypterProvider } from '@application/adapters/providers/encrypter';
import { InternalError } from '@application/errors/internal-error';
import { Either, failure, success } from '@shared/either';
import bcrypt from 'bcrypt';

export class BcryptEncrypterProvider implements IEncrypterProvider {
  constructor(private readonly userPasswordSaltRounds: number) {}

  encrypt(value: string): Either<InternalError, string> {
    try {
      const hashedPassword = bcrypt.hashSync(value, this.userPasswordSaltRounds);

      if (!hashedPassword) {
        throw new Error(`Bcrypt returned an empty or invalid hash: ${hashedPassword}`);
      }

      return success(hashedPassword);
    } catch (err) {
      console.error(err);
      return failure(new InternalError('error hashing value'));
    }
  }

  compare(value: string, hash: string): Either<InternalError, boolean> {
    try {
      const result = bcrypt.compareSync(value, hash);

      return success(result);
    } catch (err) {
      console.error(err);

      return failure(new InternalError('error comparing hashes'));
    }
  }
}
