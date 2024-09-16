import { Book } from "@prisma/client";

export interface IBookRepository{
    create(book:Book):Promise<any>;

    update(id:number, book:Book):Promise<any>;

    find(id:number):Promise<any>;

    get():Promise<any>;
}