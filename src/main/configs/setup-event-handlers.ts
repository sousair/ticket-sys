import { NodeJSStreamEventProviderFactory } from '@main/factories/infra/providers/event/nodejs-stream';
import * as EventHandlersFactories from '@main/factories/presentation/event-handlers';

export const setupNodeJSEventHandlers = (): void => {
  const eventHandlersFactories = [...Object.values(EventHandlersFactories)];

  const eventProvider = NodeJSStreamEventProviderFactory.getInstance();

  eventHandlersFactories.forEach((eventHandlerFactory) => {
    const eventHandlerInstance = eventHandlerFactory.getInstance();

    const eventName = Reflect.getMetadata('EVENT_NAME', eventHandlerInstance);

    const successfullyRegistered = eventProvider.registerHandler(eventName, eventHandlerInstance.handle.bind(eventHandlerInstance));

    if (successfullyRegistered) {
      console.log(`[SetupEventHandlers]: registered "${eventHandlerInstance.constructor.name}" handler for ${eventName} event`);
    }
  });
};
