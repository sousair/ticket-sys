import { IEncrypterProvider } from '@application/adapters/providers/encrypter';
import { InternalError } from '@application/errors/internal-error';
import { UserPassword } from '@entities/user-password';
import { Either, failure, success } from '@shared/either';
import bcrypt from 'bcrypt';

export class BcryptEncrypterProvider implements IEncrypterProvider {
  constructor(private readonly userPasswordSaltRounds: number) {}

  encryptUserPassword(userPassword: UserPassword): Either<InternalError, string> {

    try {
      const hashedPassword = bcrypt.hashSync(userPassword.value, this.userPasswordSaltRounds);

      if (!hashedPassword) {
        throw new Error(`Bcrypt returned an empty or invalid hash: ${hashedPassword}`);
      }

      return success(hashedPassword);
    } catch (err) {
      console.error(err);
      return failure(new InternalError('error hashing user password'));
    }
  }
}
