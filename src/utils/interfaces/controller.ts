import { HttpStatusCode } from '@utils/http-status-code';

export interface IController<ExecuteParams, ResponseAdditionalData> {
  handle(params: ExecuteParams): Promise<IControllerResponse<ResponseAdditionalData>>;
}

export interface IControllerResponse<
  Data = {
    [key: string]: unknown;
  }
> {
  status: HttpStatusCode;
  data: { message: string } & Partial<Data>;
}
