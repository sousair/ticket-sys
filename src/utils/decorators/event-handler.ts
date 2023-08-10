export const EventHandler = (eventName: string): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata('EVENT_NAME', eventName, target.prototype);
    return target;
  };
};
