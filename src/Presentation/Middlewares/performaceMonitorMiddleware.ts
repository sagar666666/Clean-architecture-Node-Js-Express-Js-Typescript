import { NextFunction, Request, Response } from "express";
import logger from "../../Infrastructure/logger/logger";

export const performace = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.once('finish', () => {
        const duration = Date.now() - start;
        const ip = req.ip;

        // Logged long running request
        if(duration > 500){
           logger.info("Time taken to process " + req.originalUrl + " is: " + duration + "for ip: " +ip )
        }
    });

    next();
}