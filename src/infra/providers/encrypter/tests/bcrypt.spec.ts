import { InternalError } from '@application/errors/internal-error';
import { Failure, Success } from '@shared/either';
import bcrypt from 'bcrypt';
import { BcryptEncrypterProvider } from '../bcrypt';

jest.mock('bcrypt', () => ({
  hashSync(): string {
    return 'hashedValue';
  },
  compareSync(): boolean {
    return true;
  },
}));

describe('BcryptEncrypter Provider', () => {
  let sut: BcryptEncrypterProvider;

  const mockedUserPassSalt = 10;

  beforeEach(() => {
    sut = new BcryptEncrypterProvider(mockedUserPassSalt);
  });

  describe('hash', () => {
    const validParams = 'valueToHash';

    it('should call bcrypt.hashSync with correct values', () => {
      const bcryptSpy = jest.spyOn(bcrypt, 'hashSync');

      sut.encrypt(validParams);

      expect(bcryptSpy).toHaveBeenCalledTimes(1);
      expect(bcryptSpy).toHaveBeenCalledWith(validParams, mockedUserPassSalt);
    });

    it('should return Failure and InternalError when bcrypt.hashSync throws', () => {
      jest.spyOn(bcrypt, 'hashSync').mockImplementationOnce(() => {
        throw new Error();
      });

      const result = sut.encrypt(validParams);

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InternalError);
    });

    it('should return Failure and InternalError when bcrypt.hashSync returns an empty string', () => {
      jest.spyOn(bcrypt, 'hashSync').mockReturnValueOnce('');

      const result = sut.encrypt(validParams);

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InternalError);
    });

    it('should return Success and a hashed string on success', () => {
      const result = sut.encrypt(validParams);

      expect(result).toBeInstanceOf(Success);
      expect(result.value).toStrictEqual('hashedValue');
    });
  });
});
