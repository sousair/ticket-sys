/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

export const EventHandler =
  (eventName: string) =>
  (target: any): any => {
    Reflect.defineMetadata('EVENT_NAME', eventName, target);
    return target;
  };
