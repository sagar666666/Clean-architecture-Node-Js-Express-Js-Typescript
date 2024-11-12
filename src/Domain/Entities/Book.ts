export class Book {
    public id: number;
    public name: string;
    public author: string;
    public category: string;

    constructor(book: {
        id: number;
        name: string;
        author: string;
        category: string;
    }) {
        if (book.id <= 0) {
            throw new Error('ID must be a positive number');
        }
        if (!book.name || !book.author || !book.category) {
            throw new Error('Name, author, and category are required');
        }

        this.id = book.id;
        this.name = book.name;
        this.author = book.author;
        this.category = book.category;
    }
}
