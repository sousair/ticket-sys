import { HttpRequest, IController } from '@shared/interfaces/controller';
import { Request, Response } from 'express';

export function adaptControllerToExpressRoute(controller: IController<unknown, unknown>) {
  return async (req: Request, res: Response): Promise<Response> => {
    const params: HttpRequest = {
      body: req.body,
      headers: req.headers,
      params: req.params,
    };

    const { status, data } = await controller.handle(params);

    return res.status(<number>status).json(data);
  };
}
