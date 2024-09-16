import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from "jsonwebtoken";
import config from "../../../config.json"

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
            response.status(401).send("Invalid token");
        }
    } catch (error:any) {
        response.status(401).send(error.message);
    }
}