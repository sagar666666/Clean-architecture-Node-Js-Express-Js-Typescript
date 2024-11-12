import { BookInteractor } from "../../../src/Application/Interactors/bookInteractor";
import { IBookRepository } from "../../../src/Infrastructure/IRepositories/IBookRepository";
import { IMailer } from "../../../src/Infrastructure/Interfaces/IMailer";
import { Request, Response } from "express";
import { HTTPStatusCode } from "../../../src/Domain/Enums/httpStatusCode";
import { Book } from "../../../src/Domain/Entities/Book";

// Mock dependencies
const bookRepoMock: jest.Mocked<IBookRepository> = {
    create: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
};

const mailerMock: jest.Mocked<IMailer> = {
    sendMail: jest.fn(),
};

const bookInteractor = new BookInteractor(bookRepoMock, mailerMock);

describe("BookInteractor", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe("addBook", () => {
        it("should return Ok if book is added successfully", async () => {
            mockRequest.body = { name: "New Book", author: "Author Name",id:1,category:'Test category' };
            const book = new Book(mockRequest.body);

            bookRepoMock.create.mockResolvedValue(book);

            await bookInteractor.addBook(mockRequest as Request, mockResponse as Response);

            expect(bookRepoMock.create).toHaveBeenCalledWith(book);
            expect(mockResponse.status).toHaveBeenCalledWith(HTTPStatusCode.Ok);
            expect(mockResponse.json).toHaveBeenCalledWith({
                isSuccess: true,
                messageOnSuccess: "Book added successfully!",
            });
        });

        it("should return BadRequest if book data is invalid", async () => {
            mockRequest.body = null; // Invalid input

            await bookInteractor.addBook(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(HTTPStatusCode.BadRequest);
            expect(mockResponse.json).toHaveBeenCalledWith({
                isSuccess: false,
                reasonForFailure: "invalid inputs",
            });
        });
    });

    describe("getBooks", () => {
        it("should return Ok and list of books", async () => {
            const mockBooks = [
                new Book({ name: "Book 1", author: "Author 1", id: 1, category: 'category 1' }),
                new Book({ name: "Book 2", author: "Author 2", id: 2, category: 'category 2' }),
            ];
            bookRepoMock.get.mockResolvedValue(mockBooks);

            await bookInteractor.getBooks(mockRequest as Request, mockResponse as Response);

            expect(bookRepoMock.get).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(HTTPStatusCode.Ok);
            expect(mockResponse.json).toHaveBeenCalledWith({
                isSuccess: true,
                books: mockBooks,
            });
        });
    });

    describe("updateBooks", () => {
        it("should return Ok and updated book if valid data is provided", async () => {
            const updatedBook = new Book({ name: "Updated Book", author: "Updated Author", id:1, category:'category 1' });
            const id = 1;
            mockRequest.body = { book: updatedBook };
            mockRequest.params = { id: `${id}` };

            bookRepoMock.update.mockResolvedValue(updatedBook);
            bookRepoMock.find.mockResolvedValue(updatedBook);

            await bookInteractor.updateBooks(mockRequest as Request, mockResponse as Response);

            expect(bookRepoMock.update).toHaveBeenCalledWith(id, updatedBook);
            expect(mockResponse.status).toHaveBeenCalledWith(HTTPStatusCode.Ok);
            expect(mockResponse.json).toHaveBeenCalledWith({
                isSuccess: true,
                messageOnSuccess: "Book updated successfully!",
                book: updatedBook,
            });
        });

        it("should return BadRequest if invalid data is provided", async () => {
            mockRequest.body = {}; // Invalid input
            mockRequest.params = { id: "1" };

            await bookInteractor.updateBooks(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(HTTPStatusCode.BadRequest);
            expect(mockResponse.json).toHaveBeenCalledWith({
                isSuccess: false,
                reasonForFailure: "invalid inputs",
            });
        });
    });

    describe("getBookById", () => {
        it("should return Ok and book if valid id is provided", async () => {
            const id = 1;
            const mockBook = new Book({ name: "Book 1", author: "Author 1", id: 1, category: 'unknown' });
            mockRequest.params = { id: `${id}` };

            bookRepoMock.find.mockResolvedValue(mockBook);

            await bookInteractor.getBookById(mockRequest as Request, mockResponse as Response);

            expect(bookRepoMock.find).toHaveBeenCalledWith(id);
            expect(mockResponse.status).toHaveBeenCalledWith(HTTPStatusCode.Ok);
            expect(mockResponse.json).toHaveBeenCalledWith({
                isSuccess: true,
                book: mockBook,
            });
        });

        it("should return BadRequest if id is missing or invalid", async () => {
            mockRequest.params = { id: "invalid" };

            await bookInteractor.getBookById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(HTTPStatusCode.BadRequest);
            expect(mockResponse.json).toHaveBeenCalledWith({
                isSuccess: false,
                reasonForFailure: "invalid inputs",
            });
        });
    });
});
