import { InvalidAddressError } from '@domain/errors/invalid-address';
import { Address } from '@entities/address';
import { Failure, Success } from '@shared/either';

describe('Address Entity', () => {
  const validParams: Address = {
    id: 'vaidId',
    postalCode: '1234123',
    number: '12',
    addressLine: 'complement',
    street: 'streetName',
    city: 'cityName',
    state: 'stateName',
    country: 'countryName',
  };
  describe('validate', () => {
    it('should return false when an empty object is sent', () => {
      const result = Address.validate(<Address>{});

      expect(result).toBeFalsy();
    });

    describe('should return false when an property is send undefined', () => {
      for (const key in validParams) {
        it(`#${key}`, () => {
          const result = Address.validate({ ...validParams, [key]: undefined });

          expect(result).toBeFalsy();
        });
      }
    });

    it('should return true when addressLine is  sent null', () => {
      const result = Address.validate({ ...validParams, addressLine: null });

      expect(result).toBeTruthy();
    });

    it('should return true when sent valid params', () => {
      const result = Address.validate(validParams);

      expect(result).toBeTruthy();
    });
  });

  describe('create', () => {
    it('should return failure and InvlaidAddressError when sent an invalid address', () => {
      const result = Address.create({ ...validParams, postalCode: undefined });

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InvalidAddressError);
    });

    it('should return success and Address entity on success', () => {
      const result = Address.create(validParams);

      expect(result).toBeInstanceOf(Success);
      expect(result.value).toBeInstanceOf(Address);
    });
  });
});
