import { injectable } from "inversify";
import { IBookRepository } from "../IRepositories/IBookRepository";
import { Book as BookModel, PrismaClient } from "@prisma/client"
import { Book } from "../../Domain/Entities/Book";
import 'reflect-metadata';

@injectable()
export class BookRepository implements IBookRepository {

    private prisma:PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(book: Book): Promise<Book> {
        return await this.prisma.book.create({ data: book });
    }

    async update(id: number, book: Book): Promise<any> {
        return await this.prisma.book.update({
            where: {
                id: id,
            },
            data: {
                name: book.name,
                author: book.author,
                category: book.category
            }
        });
    }

    async find(identifier: number): Promise<Book|null> {
        const book = await this.prisma.book.findUnique({
            where: {
                id: identifier,
            },
        });

        if (!book) {
            return null;
        }

        return this.toEntity(book);
    }

    async get(): Promise<Book[]> {
        const books = await this.prisma.book.findMany();
        return Array.isArray(books) ? books.map(this.toEntity) : [];
    }

    toEntity(book: BookModel): Book {
        return new Book({
            id: book.id,
            name: book.name,
            author: book.author,
            category: book.category
        });
    }
}