import { InvalidAddressError } from '@domain/errors/invalid-address';
import { Either, failure, success } from '@shared/either';

export class Address {
  id: string;
  postalCode: string;
  number: string;
  addressLine: string | null;
  street: string;
  city: string;
  state: string;
  country: string;

  private constructor(address: Address) {
    Object.assign(this, address);
  }

  static create(address: Address): Either<InvalidAddressError, Address> {
    if (!this.validate(address)) {
      return failure(new InvalidAddressError());
    }

    return success(new Address(address));
  }

  static validate(address: Address): boolean {
    if (!Object.keys(address).length) {
      return false;
    }

    if (Object.values(address).some((value) => value === undefined)) {
      return false;
    }

    return true;
  }
}
