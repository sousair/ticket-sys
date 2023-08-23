import { InvalidAddressError } from '@domain/errors/invalid-address';
import { Either, failure, success } from '@shared/either';
import { isEmptyObject } from '@shared/helpers/is-empty-object';
import { objectHasUndefinedField } from '@shared/helpers/object-has-undefined-field';

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
    if (isEmptyObject(address)) {
      return false;
    }

    if (objectHasUndefinedField(address)) {
      return false;
    }

    return true;
  }
}
