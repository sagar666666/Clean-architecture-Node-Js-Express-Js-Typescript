import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../Domain/Constants/app-constants";
import { IBookRepository } from "../../Infrastructure/IRepositories/IBookRepository";
import { IMailer } from "../../Infrastructure/Interfaces/IMailer";
import { Request, Response } from "express";
import { Book } from "../../Domain/Entities/Book";
import { HTTPStatusCode } from "../../Domain/Enums/httpStatusCode";
import { IBookInteractor } from "../IInteractors/IBookInteractor";
import 'reflect-metadata';

@injectable()
export class BookInteractor implements IBookInteractor {
    private bookRepo: IBookRepository;
    private mailer: IMailer;

    constructor(@inject(INTERFACE_TYPE.BookRepository) bookRepo: IBookRepository, @inject(INTERFACE_TYPE.Mailer) mailer: IMailer) {
        this.bookRepo = bookRepo;
        this.mailer = mailer;
    }

    async addBook(req: Request, res: Response) {
        if (!req.body) {
            return res.status(HTTPStatusCode.BadRequest).json({ isSuccess: false, reasonForFailure: 'invalid inputs' });
        }

        await this.bookRepo.create(new Book(req.body));
        return res.status(HTTPStatusCode.Ok).json({ isSuccess: true, messageOnSuccess: 'Book added successfully!' });
    }

    async getBooks(req: Request, res: Response) {
        return res.status(HTTPStatusCode.Ok).json({ isSuccess: true, books: await this.bookRepo.get() });
    }

    async updateBooks(req: Request, res: Response) {
        const { book } = req.body;
        const id = parseInt(req.params.id);

        if (!book || !id) {
            return res.status(HTTPStatusCode.BadRequest).json({ isSuccess: false, reasonForFailure: 'invalid inputs' });
        }

        const data = await this.bookRepo.update(id, book);
        return res.status(HTTPStatusCode.Ok).json({ isSuccess: true, messageOnSuccess: 'Book updated successfully!', book: await this.bookRepo.find(id) });
    }

    async getBookById(req: Request, res: Response) {
        const id = parseInt(req.params.id);

        if (!id) {
            return res.status(HTTPStatusCode.BadRequest).json({ isSuccess: false, reasonForFailure: 'invalid inputs' });
        }

        const data = await this.bookRepo.find(id);
        return res.status(HTTPStatusCode.Ok).json({ isSuccess: true, book: data });
    }

}