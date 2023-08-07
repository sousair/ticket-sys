import Express from 'express';
import { setupMiddlewares } from './middlewares/setup';
import { router } from './routes';

const app = Express();
setupMiddlewares(app);
app.use(router);

export { app };
