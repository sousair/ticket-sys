import { adaptControllerToExpressRoute } from '@main/adapters/adapt-express-route';
import { RegisterUserControllerFactory } from '@main/factories/presentantion/http/controllers/register-user';
import { Router } from 'express';

const userRouter = Router();

userRouter.post('/user', adaptControllerToExpressRoute(RegisterUserControllerFactory.getInstance()));

export { userRouter };
