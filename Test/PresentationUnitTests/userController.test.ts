import { UserController } from '../../src/Presentation/Controllers/userController';
import { IUserInteractor } from '../../src/Application/IInteractors/IUserInteractor';
import { Request, Response, NextFunction } from 'express';
import { HTTPStatusCode } from '../../src/Domain/Enums/httpStatusCode';

const mockUserInteractor: jest.Mocked<IUserInteractor> = {
    addUser: jest.fn(),
};

const createMockRequest = (body: any = {}): Request => ({
    body,
} as Request);

const createMockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const createMockNext = (): NextFunction => jest.fn();

describe('UserController.onAddUser', () => {
    let userController: UserController;

    beforeEach(() => {
        userController = new UserController(mockUserInteractor);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call addUser on userInteractor and return response', async () => {
        const req = createMockRequest({ id: '3F9C1D58-47F4-4F38-9C3A-96174613B20F', firstName: 'Sagar', lastName: 'Mohite' });
        const res = createMockResponse();
        const next = createMockNext();
        (mockUserInteractor.addUser as jest.Mock).mockResolvedValueOnce(
            res.status(HTTPStatusCode.Ok).json({ isSuccess: true })
        );

        await userController.onAddUser(req, res, next);
        expect(mockUserInteractor.addUser).toHaveBeenCalledWith(req, res);
        expect(res.status).toHaveBeenCalledWith(HTTPStatusCode.Ok);
        expect(res.json).toHaveBeenCalledWith({ isSuccess: true });
    });

    it('should call next with error if addUser throws an error', async () => {
        const req = createMockRequest({ id: '3F9C1D58-47F4-4F38-9C3A-96174613B20F', firstName: 'Sagar', lastName: 'Mohite'  });
        const res = createMockResponse();
        const next = createMockNext();
        const error = new Error('Add user failed');
        (mockUserInteractor.addUser as jest.Mock).mockRejectedValueOnce(error);
        await userController.onAddUser(req, res, next);
        expect(mockUserInteractor.addUser).toHaveBeenCalledWith(req, res);
        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
    });
});
