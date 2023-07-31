export interface IEvent<PayloadType> {
  eventName: string;
  payload: PayloadType
}