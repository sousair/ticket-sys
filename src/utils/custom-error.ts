export type ApplicationErrorParams = {
  name: string;
  message: string;
  stack?: string;
};

export abstract class ApplicationError extends Error {
  name: string;
  message: string;
  stack?: string;

  constructor({ message, name, stack }: ApplicationErrorParams) {
    super(message);
    this.message = message;
    this.name = name;
    this.stack = stack;
  }
}