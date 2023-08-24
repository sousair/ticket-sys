import { InvalidEventScheduleError } from '@domain/errors/invalid-event-schedule';
import { Either, failure, success } from '@shared/either';
import { isEmptyObject } from '@shared/helpers/is-empty-object';
import { objectHasUndefinedField } from '@shared/helpers/object-has-undefined-field';
import { Event } from './event';

export class EventSchedule {
  id: string;
  date: Date;
  timeZone: number;

  eventId: string;

  event: Event | null;

  private constructor(schedule: EventSchedule) {
    Object.assign(this, schedule);
  }

  static validate(schedule: EventSchedule): boolean {
    if (isEmptyObject(schedule)) {
      return false;
    }

    if (objectHasUndefinedField(schedule)) {
      return false;
    }

    return true;
  }

  static create(schedule: EventSchedule): Either<InvalidEventScheduleError, EventSchedule> {
    if (!this.validate(schedule)) {
      return failure(new InvalidEventScheduleError());
    }

    return success(new EventSchedule(schedule));
  }
}
