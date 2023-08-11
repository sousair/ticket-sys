export interface IEventHandler<EventPayload> {
  handle(payload: EventPayload): void;
}
