import { Book } from '../../src/Domain/Entities/Book';

describe('Book Class', () => {

    it('should create a Book instance successfully with valid data', () => {
        const bookData = {
            id: 1,
            name: 'Harry Potter and prison of azkaban',
            author: 'J.K Rowling',
            category: 'Novel'
        };

        const book = new Book(bookData);

        expect(book.id).toBe(bookData.id);
        expect(book.name).toBe(bookData.name);
        expect(book.author).toBe(bookData.author);
        expect(book.category).toBe(bookData.category);
    });

    it('should throw an error when ID is invalid (<= 0)', () => {
        const invalidBookData = {
            id: 0,  // Invalid ID
            name: 'Harry Potter and prison of azkaban',
            author: 'J.K Rowling',
            category: 'Novel'
        };

        expect(() => new Book(invalidBookData)).toThrowError('ID must be a positive number');
    });

    it('should throw an error when missing required fields (name, author, category)', () => {
        const invalidBookData1 = {
            id: 1,
            name: '',  // Missing name
            author: 'Test Author',
            category: 'Fiction'
        };

        const invalidBookData2 = {
            id: 1,
            name: 'Test Book',
            author: '',  // Missing author
            category: 'Fiction'
        };

        const invalidBookData3 = {
            id: 1,
            name: 'Test Book',
            author: 'Test Author',
            category: ''  // Missing category
        };

        expect(() => new Book(invalidBookData1)).toThrowError('Name, author, and category are required');
        expect(() => new Book(invalidBookData2)).toThrowError('Name, author, and category are required');
        expect(() => new Book(invalidBookData3)).toThrowError('Name, author, and category are required');
    });
});
