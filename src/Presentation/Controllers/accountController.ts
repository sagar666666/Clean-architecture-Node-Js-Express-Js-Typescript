import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../Domain/Constants/app-constants";
import { IAccountInteractor } from "../../Application/IInteractors/IAccountInteractor";

@injectable()
export class AccountController {
    private accountInteractor: IAccountInteractor;
    constructor(@inject(INTERFACE_TYPE.AccountInteractor) accountInteractor: IAccountInteractor) {
        this.accountInteractor = accountInteractor;
    }

    async onLogin(req: Request, res: Response, next: NextFunction) {
        try {
            return await this.accountInteractor.login(req, res);
        }
        catch (error: any) {
            next(error);
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            return await this.accountInteractor.refreshToken(req, res);
        }
        catch (error: any) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            return await this.accountInteractor.logout(req, res);
        }
        catch (error: any) {
            next(error);
        }
    }

}