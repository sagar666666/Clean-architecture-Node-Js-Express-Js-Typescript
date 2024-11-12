import { NextFunction, Request, Response } from "express";
import { IHTTPError } from "../utility/IHTTPError";
import logger from "../../Infrastructure/logger/logger";

export const errorHandler = (ex: Error, req: Request, res: Response, next: NextFunction) => {
  const err = ex as IHTTPError;
  const statusCode = err.statusCode || 500;
  const message = err.message ?? 'Oooops! Something went wrong';
  logger.error(message);
  res.status(statusCode).send({ message });
};