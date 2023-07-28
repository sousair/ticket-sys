export type CustomErrorParams = {
  name: string;
  message: string;
  stack?: string;
};

export abstract class CustomError extends Error {
  name: string;
  message: string;
  stack?: string;

  constructor({ message, name, stack }: CustomErrorParams) {
    super(message);
    this.message = message;
    this.name = name;
    this.stack = stack;
  }
}