import { BookController } from '../../src/Presentation/Controllers/bookController'; // Adjust the path
import { IBookInteractor } from '../../src/Application/IInteractors/IBookInteractor';
import { NextFunction, Request, Response } from 'express';

jest.mock('../../src/Application/IInteractors/IBookInteractor');

describe('BookController', () => {
    let bookController: BookController;
    let mockBookInteractor: jest.Mocked<IBookInteractor>;

    beforeEach(() => {
        mockBookInteractor = {
            getBooks: jest.fn(),
            addBook: jest.fn(),
            updateBooks: jest.fn(),
            getBookById: jest.fn(),
        };

        bookController = new BookController(mockBookInteractor);
    });

    // Helper to create a mock of the response
    const mockResponse = (): Response => {
        const res: any = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    const mockRequest = (body: any = {}, params: any = {}): Request => {
        const req: any = {
            body,
            params,
        };
        return req;
    };

    describe('onGetBooks', () => {
        it('should return 200 and a list of books when books are found', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const next: NextFunction = jest.fn();
            const mockBooks = [{ id: 1, title: 'Test Book' }];
            mockBookInteractor.getBooks.mockResolvedValueOnce(mockBooks);
            await bookController.onGetBooks(req, res, next);
            expect(mockBookInteractor.getBooks).toHaveBeenCalledWith(req, res);
        });

        it('should call next(error) when there is an error', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const next: NextFunction = jest.fn();
            mockBookInteractor.getBooks.mockRejectedValueOnce(new Error('Database error'));
            await bookController.onGetBooks(req, res, next);
            expect(next).toHaveBeenCalledWith(new Error('Database error'));
        });
    });

    describe('onCreateBook', () => {
        it('should return 200 when the book is created successfully', async () => {
            const req = mockRequest({ title: 'New Book', author: 'Author Name' });
            const res = mockResponse();
            const next: NextFunction = jest.fn();
            mockBookInteractor.addBook.mockResolvedValueOnce(true);
            await bookController.onCreateBook(req, res, next);
            expect(mockBookInteractor.addBook).toHaveBeenCalledWith(req, res);
        });

        it('should return 400 if the book data is invalid', async () => {
            const req = mockRequest({});
            const res = mockResponse();
            const next: NextFunction = jest.fn();
            await bookController.onCreateBook(req, res, next);
            expect(mockBookInteractor.addBook).toHaveBeenCalledWith(req, res);
        });

        it('should call next(error) when there is an error', async () => {
            const req = mockRequest({ title: 'New Book', author: 'Author Name' });
            const res = mockResponse();
            const next: NextFunction = jest.fn();
            mockBookInteractor.addBook.mockRejectedValueOnce(new Error('Database error'));
            await bookController.onCreateBook(req, res, next);
            expect(next).toHaveBeenCalledWith(new Error('Database error'));
        });
    });

    describe('onUpdateBook', () => {
        it('should return 200 and updated book when the update is successful', async () => {
            const req = mockRequest({ book: { title: 'Updated Book' } });
            const res = mockResponse();
            const next: NextFunction = jest.fn();
            const mockUpdatedBook = { id: 1, title: 'Updated Book' };
            mockBookInteractor.updateBooks.mockResolvedValueOnce(mockUpdatedBook);
            await bookController.onUpdateBook(req, res, next);
            expect(mockBookInteractor.updateBooks).toHaveBeenCalledWith(req, res);
        });

        it('should return 400 if the update data is invalid', async () => {
            const req = mockRequest({});
            const res = mockResponse();
            const next: NextFunction = jest.fn();
            await bookController.onUpdateBook(req, res, next);
            expect(mockBookInteractor.updateBooks).toHaveBeenCalledWith(req, res);
        });

        it('should call next(error) when there is an error', async () => {
            const req = mockRequest({ book: { title: 'Updated Book' } });
            const res = mockResponse();
            const next: NextFunction = jest.fn();
            mockBookInteractor.updateBooks.mockRejectedValueOnce(new Error('Database error'));
            await bookController.onUpdateBook(req, res, next);
            expect(next).toHaveBeenCalledWith(new Error('Database error'));
        });
    });

    describe('onGetBookById', () => {
        it('should return 200 and the book when found', async () => {
            const req = mockRequest({}, { id: 1 });
            const res = mockResponse();
            const next: NextFunction = jest.fn();
            const mockBook = { id: 1, title: 'Test Book' };
            mockBookInteractor.getBookById.mockResolvedValueOnce(mockBook);
            await bookController.onGetBookById(req, res, next);
            expect(mockBookInteractor.getBookById).toHaveBeenCalledWith(req, res);
        });

        it('should return 400 if the id is invalid', async () => {
            const req = mockRequest({});
            const res = mockResponse();
            const next: NextFunction = jest.fn();
            await bookController.onGetBookById(req, res, next);
            expect(mockBookInteractor.getBookById).toHaveBeenCalledWith(req, res);
        });

        it('should call next(error) when there is an error', async () => {
            const req = mockRequest({}, { id: 1 });
            const res = mockResponse();
            const next: NextFunction = jest.fn();
            mockBookInteractor.getBookById.mockRejectedValueOnce(new Error('Database error'));
            await bookController.onGetBookById(req, res, next);
            expect(next).toHaveBeenCalledWith(new Error('Database error'));
        });
    });
});
