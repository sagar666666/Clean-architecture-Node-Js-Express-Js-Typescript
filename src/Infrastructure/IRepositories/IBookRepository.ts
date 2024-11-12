import { Book } from "../../Domain/Entities/Book";


export interface IBookRepository{
    create(book:Book):Promise<Book>;

    update(id:number, book:Book):Promise<Book>;

    find(id:number):Promise<Book|null>;

    get():Promise<Book[]>;
}