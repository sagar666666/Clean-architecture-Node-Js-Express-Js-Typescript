import { NextFunction, Request, Response } from "express";

export const openEndPoints = (path: string[], middleware: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (path.find(x => x.toLowerCase() === req.path.toLowerCase())) {
            return next();
        }
        else {
            return middleware(req, res, next);
        }
    };
};