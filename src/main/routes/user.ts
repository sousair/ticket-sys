import { adaptControllerToExpressRoute } from '@main/adapters/adapt-express-route';
import { RegisterUserControllerFactory } from '@main/factories/presentantion/http/controllers/register-user';
import { ValidateUserEmailControllerFactory } from '@main/factories/presentantion/http/controllers/validate-user-email';
import { Router } from 'express';

const userRouter = Router();

userRouter.post('/', adaptControllerToExpressRoute(RegisterUserControllerFactory.getInstance()));
userRouter.post('/validate-email/:token', adaptControllerToExpressRoute(ValidateUserEmailControllerFactory.getInstance()));

export { userRouter };
