import { Request,Response } from "express";

export interface IAccountInteractor{
    login(request:Request,response:Response):any;
    refreshToken(request:Request,response:Response):any;
    logout(request:Request,response:Response):any;
}