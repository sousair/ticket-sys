import Express from 'express';
import { setupMiddlewares } from './middlewares/setup';

const app = Express();
setupMiddlewares(app);

export { app };
