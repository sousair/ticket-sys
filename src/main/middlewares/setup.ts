import { Express, json } from 'express';

export function setupMiddlewares(app: Express): void {
  app.use(json());
}
