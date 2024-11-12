import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from "jsonwebtoken";
import config from "../../../config.json"
import { HTTPStatusCode } from "../../Domain/Enums/httpStatusCode";

export interface CustomRequest extends Request {
    token: string | JwtPayload;
   }

export const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        const token = request.header('Authorization')?.replace('Bearer ', '');

        if (token) {
            const decodedInfo = jwt.verify(token, config.jwt.jwtSecret);
            (request as CustomRequest).token = decodedInfo
            next();
        } else {
            response.status(HTTPStatusCode.Unauthorized).send("Invalid token");
        }
    } catch (error:any) {
        response.status(HTTPStatusCode.Unauthorized).send(error.message);
    }
}