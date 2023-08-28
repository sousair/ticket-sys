import { InvalidPostalCodeError } from '@domain/errors/invalid-postal-code';
import { Either, failure, success } from '@shared/either';
import { isEmptyObject } from '@shared/helpers/is-empty-object';
import { objectHasUndefinedField } from '@shared/helpers/object-has-undefined-field';

export class PostalCode {
  id: string;
  postalCode: string;
  street: string;
  city: string;
  state: string;
  country: string;

  private constructor(postalCode: PostalCode) {
    Object.assign(this, postalCode);
  }

  static validate(postalCode: PostalCode): boolean {
    if (isEmptyObject(postalCode)) {
      return false;
    }

    if (objectHasUndefinedField(postalCode)) {
      return false;
    }

    return true;
  }

  static create(postalCode: PostalCode): Either<InvalidPostalCodeError, PostalCode> {
    if (!this.validate(postalCode)) {
      return failure(new InvalidPostalCodeError());
    }

    return success(new PostalCode(postalCode));
  }
}
