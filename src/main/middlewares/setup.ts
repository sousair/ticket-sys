import { Express } from 'express';
import { jsonParserMiddleware } from './json';
import { setIpOnHeaders } from './set-ip-on-haders';

export function setupMiddlewares(app: Express): void {
  app.use(jsonParserMiddleware);
  app.use(setIpOnHeaders);
}
