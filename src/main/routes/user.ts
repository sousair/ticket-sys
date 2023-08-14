import { adaptControllerToExpressRoute } from '@main/adapters/adapt-express-route';
import { LoginUserControllerFactory } from '@main/factories/presentation/http/controllers/login-user';
import { RegisterUserControllerFactory } from '@main/factories/presentation/http/controllers/register-user';
import { ValidateUserEmailControllerFactory } from '@main/factories/presentation/http/controllers/validate-user-email';
import { Router } from 'express';

const userRouter = Router();

userRouter.post('/', adaptControllerToExpressRoute(RegisterUserControllerFactory.getInstance()));
userRouter.post('/validate-email/:token', adaptControllerToExpressRoute(ValidateUserEmailControllerFactory.getInstance()));
userRouter.post('/login', adaptControllerToExpressRoute(LoginUserControllerFactory.getInstance()));

export { userRouter };
