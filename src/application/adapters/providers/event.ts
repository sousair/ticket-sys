
import { IEvent } from '@utils/interfaces/event';

export interface IEventProvider {
  emit<Event>(params: IEventProvider.Params<Event>): IEventProvider.Result;
}

export namespace IEventProvider {
  export type Params<Event> = IEvent<Event>;

  export type Result = void;
}
