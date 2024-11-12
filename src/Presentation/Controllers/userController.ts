import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../Domain/Constants/app-constants";
import { IUserInteractor } from "../../Application/IInteractors/IUserInteractor";
import { NextFunction, Request, Response } from "express";
import 'reflect-metadata';

@injectable()
export class UserController {
    private readonly userInteractor: IUserInteractor;
    constructor(@inject(INTERFACE_TYPE.UserInteractor) userInteractor: IUserInteractor) {
        this.userInteractor = userInteractor
    }

    async onAddUser(req: Request, res: Response, next: NextFunction) {
        try {
            return await this.userInteractor.addUser(req,res);
        }
        catch (error:any) {
            next(error);
        }
    }
}