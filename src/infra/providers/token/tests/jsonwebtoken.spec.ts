import { ITokenProvider, TokenTypes } from '@application/adapters/providers/token';
import jsonwebtoken from 'jsonwebtoken';
import { JSONWebTokenConfigs, JSONWebTokenProvider } from '../jsonwebtoken';
import { MINUTE_IN_MS } from '@utils/time';
import { Failure } from '@utils/either';
import { InternalError } from '@application/errors/internal-error';

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'token';
  }
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
  });
});
