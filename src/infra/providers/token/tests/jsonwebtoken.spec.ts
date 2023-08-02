import { ITokenProvider, TokenTypes } from '@application/adapters/providers/token';
import { InternalError } from '@application/errors/internal-error';
import { Failure, Success } from '@utils/either';
import { MINUTE_IN_MS } from '@utils/time';
import jsonwebtoken, { Jwt } from 'jsonwebtoken';
import { JSONWebTokenConfigs, JSONWebTokenProvider } from '../jsonwebtoken';
import { InvalidTokenError } from '@application/errors/invalid-token';

const mockedExpirationDate = new Date();

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'token';
  },
  verify(): Jwt {
    return {
      payload: {
        key: 'value',
        exp: mockedExpirationDate.getTime() / 1000,
      },
      signature: '',
      header: {
        alg: 'algorithm',
      },
    };
  },
}));

describe('JSONWebToken Provider', () => {
  let sut: JSONWebTokenProvider;

  const configs: JSONWebTokenConfigs = {
    emailValidationTokenSecret: 'anySecret1',
    userAuthTokenSecret: 'anySecret2',
  };

  beforeEach(() => {
    sut = new JSONWebTokenProvider(configs);
  });

  describe('generateToken', () => {
    let validParams: ITokenProvider.GenerateTokenParams;

    beforeEach(() => {
      validParams = {
        type: TokenTypes.USER_AUTH,
        payload: {
          key: 'value',
        },
        expirationInMs: 5 * MINUTE_IN_MS,
      };
    });

    it('should call jsonwebtoken.sign with correct values', () => {
      const jwtSpy = jest.spyOn(jsonwebtoken, 'sign');

      sut.generateToken(validParams);

      expect(jwtSpy).toHaveBeenCalledTimes(1);
      expect(jwtSpy).toHaveBeenCalledWith(validParams.payload, configs.userAuthTokenSecret, { expiresIn: validParams.expirationInMs / 1000 });
    });

    it('should return Failure and InternalError when jsonwebtoken.sign throws', () => {
      jest.spyOn(jsonwebtoken, 'sign').mockImplementationOnce(() => {
        throw new Error();
      });

      const result = sut.generateToken(validParams);

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InternalError);
    });

    it('should return Failure and InternalError when jsonwebtoken.sign returns an empty string', () => {
      jest.spyOn(jsonwebtoken, 'sign').mockReturnValueOnce();

      const result = sut.generateToken(validParams);

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InternalError);
    });

    it('should return Success and a token on success', () => {
      const result = sut.generateToken(validParams);

      expect(result).toBeInstanceOf(Success);
      expect(result.value).toStrictEqual('token');
    });
  });

  describe('validateToken', () => {
    let validParams: ITokenProvider.ValidateTokenParams;

    beforeEach(() => {
      validParams = {
        type: TokenTypes.VALIDATE_EMAIL,
        token: 'jwtToken',
      };
    });

    it('should call jsonwebtoken.verify with correct values', () => {
      const jwtSpy = jest.spyOn(jsonwebtoken, 'verify');

      sut.validateToken(validParams);

      expect(jwtSpy).toHaveBeenCalledTimes(1);
      expect(jwtSpy).toHaveBeenCalledWith(validParams.token, configs.emailValidationTokenSecret, { complete: true, ignoreExpiration: true });
    });

    it('should return Failure and InvalidTokenError when jsonwebtoken.verify throws', () => {
      jest.spyOn(jsonwebtoken, 'verify').mockImplementationOnce(() => {
        throw new Error();
      });

      const result = sut.validateToken(validParams);

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InvalidTokenError);
    });

    it('should return Success and PayloadInfo on success', () => {
      const result = sut.validateToken(validParams);

      expect(result).toBeInstanceOf(Success);
      expect(result.value).toMatchObject({
        payload: {
          key: 'value',
        },
        expirationDate: mockedExpirationDate,
      });
    });
  });
});
