import { InvalidTicketTypeError } from '@domain/errors/invalid-ticket-type';
import { Either, failure, success } from '@shared/either';
import { isEmptyObject } from '@shared/helpers/is-empty-object';
import { objectHasUndefinedField } from '@shared/helpers/object-has-undefined-field';

export class TicketType {
  id: string;
  name: string;
  description: string;

  private constructor(ticketType: TicketType) {
    Object.assign(this, ticketType);
  }

  static validate(ticketType: TicketType): boolean {
    if (isEmptyObject(ticketType)) {
      return false;
    }

    if (objectHasUndefinedField(ticketType)) {
      return false;
    }

    return true;
  }

  static create(ticketType: TicketType): Either<InvalidTicketTypeError, TicketType> {
    if (!this.validate(ticketType)) {
      return failure(new InvalidTicketTypeError());
    }

    return success(new TicketType(ticketType));
  }
}
