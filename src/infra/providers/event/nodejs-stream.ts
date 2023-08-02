import { IEventProvider } from '@application/adapters/providers/event';
import { EventEmitter } from 'stream';

export class NodeJSStreamEventProvider implements IEventProvider {
  private readonly streamEventEmitter = new EventEmitter();

  emit<Event>({ eventName, payload }: IEventProvider.Params<Event>): void {
    this.streamEventEmitter.emit(eventName, payload);
  }
}
