import { BookRepository } from '../../../src/Infrastructure/Repositories/bookRepository';
import { Book } from '../../../src/Domain/Entities/Book';
import { PrismaClient, Book as PrismaBook } from '@prisma/client';

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        book: {
            create: jest.fn(),
            update: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
        },
    };

    return {
        PrismaClient: jest.fn(() => mockPrisma),
    };
});

describe('BookRepository', () => {
    let bookRepository: BookRepository;
    let prismaMock: any;

    beforeEach(() => {
        prismaMock = new PrismaClient();
        bookRepository = new BookRepository();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new book', async () => {
            const newBookData = new Book({
                id: 1,
                name: 'New Book',
                author: 'Author Name',
                category: 'Fiction',
            });

            prismaMock.book.create.mockResolvedValue(newBookData);
            const createdBook = await bookRepository.create(newBookData);
            expect(prismaMock.book.create).toHaveBeenCalledWith({
                data: newBookData,
            });

            expect(createdBook).toEqual(newBookData);
        });
    });

    describe('update', () => {
        it('should update an existing book', async () => {
            const updatedBookData = new Book({
                id: 1,
                name: 'Updated Book',
                author: 'Updated Author',
                category: 'Non-Fiction',
            });

            const existingBook = {
                id: 1,
                name: 'Old Book',
                author: 'Old Author',
                category: 'Old Category',
            };

            prismaMock.book.findUnique.mockResolvedValue(existingBook);
            prismaMock.book.update.mockResolvedValue(updatedBookData);
            const updatedBook = await bookRepository.update(1, updatedBookData);
            expect(updatedBook).toEqual(updatedBookData);
        });
    });


    describe('find', () => {
        it('should find a book by id', async () => {
            const foundBookData = new Book({
                id: 1,
                name: 'Found Book',
                author: 'Author Name',
                category: 'Fiction',
            });

            prismaMock.book.findUnique.mockResolvedValue({
                id: 1,
                name: 'Found Book',
                author: 'Author Name',
                category: 'Fiction',
            });

            const foundBook = await bookRepository.find(1);

            expect(prismaMock.book.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(foundBook).toEqual(foundBookData);
        });

        it('should return null if the book is not found', async () => {
            prismaMock.book.findUnique.mockResolvedValue(null);
            const foundBook = await bookRepository.find(1);
            expect(prismaMock.book.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(foundBook).toBeNull();
        });
    });

    describe('get', () => {
        it('should return an array of books', async () => {
            const booksData = [
                new Book({
                    id: 1,
                    name: 'Book 1',
                    author: 'Author 1',
                    category: 'Category 1',
                }),
                new Book({
                    id: 2,
                    name: 'Book 2',
                    author: 'Author 2',
                    category: 'Category 2',
                }),
            ];

            prismaMock.book.findMany.mockResolvedValue([
                { id: 1, name: 'Book 1', author: 'Author 1', category: 'Category 1' },
                { id: 2, name: 'Book 2', author: 'Author 2', category: 'Category 2' },
            ]);

            const books = await bookRepository.get();
            expect(prismaMock.book.findMany).toHaveBeenCalled();
            expect(books).toEqual(booksData);
        });
    });
});
