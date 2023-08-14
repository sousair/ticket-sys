import { Express } from 'express';
import { jsonParserMiddleware } from './json';

export function setupMiddlewares(app: Express): void {
  app.use(jsonParserMiddleware);
}
