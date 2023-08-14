import { NextFunction, Request, Response } from 'express';

export function setIpOnHeaders(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.headers['x-forwarded-for'];

  req.headers.ip = ip;

  next();
}
