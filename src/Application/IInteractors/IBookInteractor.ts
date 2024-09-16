import { Request, Response } from "express";

export interface IBookInteractor{
    addBook(req:Request, res:Response);

    getBooks(req:Request, res:Response);

    updateBooks(req:Request, res:Response);

    getBookById(req:Request, res:Response);
}