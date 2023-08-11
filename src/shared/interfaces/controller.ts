/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatusCode } from '@shared/http-status-code';

export interface IController<HandleParams extends HttpRequest, ResponseData = ResponseDataT> {
  handle(params: HandleParams): Promise<IControllerResponse<ResponseData>>;
}

export type HttpRequest = {
  body?: {
    [key: string]: any;
  };
  headers?: {
    [key: string]: any;
  };
  params?: {
    [key: string]: any;
  };
};

type Message = {
  message: string;
};

type ResponseDataT = {
  [key: string]: any;
};

export interface IControllerResponse<Data = ResponseDataT> {
  status: HttpStatusCode;
  data: Message | (Data & Message);
}
