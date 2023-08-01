import { InternalError } from '@application/errors/internal-error';
import { BcryptEncrypterProvider } from '../bcrypt';
import { UserPassword } from '@entities/user-password';
import { Failure, Success } from '@utils/either';
import bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hashSync(): string {
    return 'hashedPassword';
  }
}));

describe('BcryptEncrypter Provider', () => {

  let sut: BcryptEncrypterProvider;
  
  const mockedUserPassSalt = 10;

  const validParams = new UserPassword('v4l!dPass');

  beforeEach(() => {
    sut = new BcryptEncrypterProvider(mockedUserPassSalt);
  });

  it('should call bcrypt.hashSync with correct values', () => {
    const bcryptSpy = jest.spyOn(bcrypt, 'hashSync');

    sut.encryptUserPassword(validParams);

    expect(bcryptSpy).toHaveBeenCalledTimes(1);
    expect(bcryptSpy).toHaveBeenCalledWith(validParams.value, mockedUserPassSalt);
  });

  it('should return Failure and InternalError when bcrypt.hashSync throws', () => {
    jest.spyOn(bcrypt, 'hashSync').mockImplementationOnce(() => {
      throw new Error();
    });

    const result = sut.encryptUserPassword(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(InternalError);
  });

  it('should return Failure and InternalError when bcrypt.hashSync returns an empty string', () => {
    jest.spyOn(bcrypt, 'hashSync').mockReturnValueOnce('');
    
    const result = sut.encryptUserPassword(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(InternalError);
  });
});
