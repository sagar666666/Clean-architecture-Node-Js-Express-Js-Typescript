import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../Domain/Constants/app-constants";
import { IBookInteractor } from "../../Application/IInteractors/IBookInteractor";
import 'reflect-metadata';

@injectable()
export class BookController {
    private bookInteractor: IBookInteractor;

    constructor(@inject(INTERFACE_TYPE.BookInteractor) bookInteractor: IBookInteractor) {
        this.bookInteractor = bookInteractor;
    }

    async onGetBooks(req: Request, res: Response, next: NextFunction) {
        try {
            return await this.bookInteractor.getBooks(req,res);
        }
        catch (error:any) {
            next(error);
        }
    }

    async onCreateBook(req: Request, res: Response, next: NextFunction) {
        try {
            return await this.bookInteractor.addBook(req,res);
        }
        catch (error:any) {
            next(error);
        }
    }

    async onUpdateBook(req: Request, res: Response, next: NextFunction) {
        try {
            return await this.bookInteractor.updateBooks(req,res);
        }
        catch (error:any) {
            next(error);
        }
    }

    async onGetBookById(req: Request, res: Response, next: NextFunction) {
        try {
            return await this.bookInteractor.getBookById(req,res);
        }
        catch (error:any) {
            next(error);
        }
    }
}