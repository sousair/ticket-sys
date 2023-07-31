
import { IEvent } from '@utils/interfaces/event';

export interface IEventEmitter {
  emit<Event>(params: IEventEmitter.Params<Event>): IEventEmitter.Result;
}

export namespace IEventEmitter {
  export type Params<Event> = IEvent<Event>;

  export type Result = void;
}
