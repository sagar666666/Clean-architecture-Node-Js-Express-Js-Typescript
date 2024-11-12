import { Request, Response } from "express";

export interface IUserInteractor{
    addUser(request:Request, response:Response);
}