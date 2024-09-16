import { injectable } from "inversify";
import { IBookRepository } from "../IRepositories/IBookRepository";
import { PrismaClient } from '@prisma/client'

@injectable()
export class BookRepository implements IBookRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(book: any): Promise<any> {
        return await this.prisma.book.create({data:book});
    }

    async update(id: number, book: any): Promise<any> {
       return await this.prisma.book.update({
            where: {
                Id: id,
            },
            data: {
                Name:book.Name,
                Author:book.Author,
                Category:book.Category
            }
        });
    }

    async find(identifier: number): Promise<any> {
        return await this.prisma.book.findUnique({
            where: {
                Id: identifier,
            },
        });
    }

    async get(): Promise<any> {
        return await this.prisma.book.findMany();
    }
}