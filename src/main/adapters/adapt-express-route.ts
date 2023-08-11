import { IController } from '@shared/interfaces/controller';
import { Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function adaptControllerToExpressRoute<Params, Res>(controller: IController<Params, Res>) {
  return async (req: Request, res: Response): Promise<Response> => {
    const params = {
      ...req.body,
      ...req.params,
    };

    const { status, data } = await controller.handle(params);

    return res.status(<number>status).json(data);
  };
}
