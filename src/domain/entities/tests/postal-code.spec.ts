import { InvalidPostalCodeError } from '@domain/errors/invalid-postal-code';
import { PostalCode } from '@entities/postal-code';
import { Failure, Success } from '@shared/either';

describe('PostalCode Entity', () => {
  const validParams: PostalCode = {
    id: 'validId',
    postalCode: 'validPostalCode',
    street: 'streetName',
    city: 'cityName',
    state: 'stateName',
    country: 'countryName',
  };

  describe('validate', () => {
    it('should return false for an empty object', () => {
      const result = PostalCode.validate(<PostalCode>{});

      expect(result).toBeFalsy();
    });

    describe('should return false for an PostalCode with an undefined field', () => {
      for (const key in validParams) {
        it(`#${key}`, () => {
          const result = PostalCode.validate({ ...validParams, [key]: undefined });

          expect(result).toBeFalsy();
        });
      }
    });

    it('should return true for a valid PostalCode', () => {
      const result = PostalCode.validate(validParams);

      expect(result).toBeTruthy();
    });
  });

  describe('create', () => {
    it('should return failure and InvalidPostalCodeError for an invalid PostalCode', () => {
      const result = PostalCode.create({ ...validParams, postalCode: undefined });

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InvalidPostalCodeError);
    });

    it('should return success and PostalCode entity for a valid PostalCode', () => {
      const result = PostalCode.create(validParams);

      expect(result).toBeInstanceOf(Success);
      expect(result.value).toBeInstanceOf(PostalCode);
    });
  });
});
