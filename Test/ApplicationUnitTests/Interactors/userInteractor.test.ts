import { UserInteractor } from '../../../src/Application/Interactors/userInteractor';
import { Request, Response } from 'express';
import { IUserRepository } from '../../../src/Infrastructure/IRepositories/IUserRepository';
import { IMailer } from '../../../src/Infrastructure/Interfaces/IMailer';
import { HTTPStatusCode } from '../../../src/Domain/Enums/httpStatusCode';

jest.mock('../../../config.json', () => ({
    addUserMailToList: 'mohitesagar12@gmail.com',
}));

const mockUserRepository: jest.Mocked<IUserRepository> = {
    addUser: jest.fn(),
    getUser: jest.fn(),
    getUserById: jest.fn()
};

const mockMailer: jest.Mocked<IMailer> = {
    sendMail: jest.fn(),
};

const createMockRequest = (body: any): Request => ({
    body,
} as Request);

const createMockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('UserInteractor.addUser', () => {
    let userInteractor: UserInteractor;

    beforeEach(() => {
        userInteractor = new UserInteractor(mockUserRepository, mockMailer);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add a user and send an email successfully', async () => {
        const req = createMockRequest({
            id: '3F9C1D58-47F4-4F38-9C3A-96174613B20F',
            firstName: 'Sagar',
            lastName: 'Mohite',
            email: 'mohitesagar12@gmail.com',
            createdAt: new Date(),
            updatedAt: new Date(),
            password: 'Test@123',
            userName: 'sagar.mohite',
        });
        const res = createMockResponse();

        (mockUserRepository.addUser as jest.Mock).mockResolvedValue(req.body);
        await userInteractor.addUser(req, res);

        expect(mockUserRepository.addUser).toHaveBeenCalledWith(expect.objectContaining({
            id: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            userName: req.body.userName,
        }));

        expect(mockMailer.sendMail).toHaveBeenCalledWith(
            'mohitesagar12@gmail.com',
            `User: Sagar Mohite added successfully.`,
            'New user added notification'
        );
        expect(res.status).toHaveBeenCalledWith(HTTPStatusCode.Ok);
        expect(res.json).toHaveBeenCalledWith({
            isSuccess: true,
            messageOnSuccess: 'User added successfully!',
        });
    });

    it('should return 500 if adding a user fails', async () => {
        const req = createMockRequest({
            id: '3F9C1D58-47F4-4F38-9C3A-96174613B20F',
            firstName: 'Sagar',
            lastName: 'Mohite',
            email: 'mohitesagar12@gmail.com',
            createdAt: new Date(),
            updatedAt: new Date(),
            password: 'Test@123',
            userName: 'sagar.mohite',
        });
        const res = createMockResponse();

        (mockUserRepository.addUser as jest.Mock).mockRejectedValue(new Error('Database error'));

        await userInteractor.addUser(req, res);

        expect(res.status).toHaveBeenCalledWith(HTTPStatusCode.InternalServerError);
        expect(res.json).toHaveBeenCalledWith({
            isSuccess: false,
            reasonForFailure: 'Failed to add user or send email notification',
        });
    });

    it('should return 500 if sending an email fails', async () => {
        const req = createMockRequest({
            id: '3F9C1D58-47F4-4F38-9C3A-96174613B20F',
            firstName: 'Sagar',
            lastName: 'Mohite',
            email: 'mohitesagar12@gmail.com',
            createdAt: new Date(),
            updatedAt: new Date(),
            password: 'Test@123',
            userName: 'sagar.mohite',
        });
        const res = createMockResponse();

        (mockUserRepository.addUser as jest.Mock).mockResolvedValue(req.body);
        (mockMailer.sendMail as jest.Mock).mockRejectedValue(new Error('Email service error'));

        await userInteractor.addUser(req, res);

        expect(mockUserRepository.addUser).toHaveBeenCalled();
        expect(mockMailer.sendMail).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(HTTPStatusCode.InternalServerError);
        expect(res.json).toHaveBeenCalledWith({
            isSuccess: false,
            reasonForFailure: 'Failed to add user or send email notification',
        });
    });
});
