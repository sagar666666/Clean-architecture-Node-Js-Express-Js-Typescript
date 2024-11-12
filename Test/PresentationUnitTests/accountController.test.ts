import { AccountController } from '../../src/Presentation/Controllers/accountController';
import { IAccountInteractor } from '../../src/Application/IInteractors/IAccountInteractor';
import { Request, Response, NextFunction } from 'express';

// Mock the IAccountInteractor
const mockAccountInteractor = {
    login: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
};

describe('AccountController', () => {
    let accountController: AccountController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        accountController = new AccountController(mockAccountInteractor as unknown as IAccountInteractor);
        req = { body: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    describe('onLogin', () => {
        it('should call login method of AccountInteractor', async () => {
            mockAccountInteractor.login.mockResolvedValueOnce({
                isSuccess: true,
                accessToken: 'access_token',
                refreshToken: 'refresh_token',
            });

            req.body = { userName: 'test', password: 'password' };
            await accountController.onLogin(req as Request, res as Response, next);
            expect(mockAccountInteractor.login).toHaveBeenCalledWith(req, res);
        });

        it('should handle error if login fails', async () => {
            mockAccountInteractor.login.mockRejectedValueOnce(new Error('Login failed'));
            req.body = { userName: 'test', password: 'wrong_password' };
            await accountController.onLogin(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(new Error('Login failed'));
        });
    });

    describe('refreshToken', () => {
        it('should call refreshToken method of AccountInteractor', async () => {
            mockAccountInteractor.refreshToken.mockResolvedValueOnce({
                isSuccess: true,
                accessToken: 'new_access_token',
                refreshToken: 'new_refresh_token',
            });

            req.body = { refreshToken: 'refresh_token' };

            await accountController.refreshToken(req as Request, res as Response, next);

            expect(mockAccountInteractor.refreshToken).toHaveBeenCalledWith(req, res);
        });

        it('should handle missing refresh token', async () => {
            req.body = {};
            await accountController.refreshToken(req as Request, res as Response, next);
        });

        it('should handle error if refresh token fails', async () => {
            mockAccountInteractor.refreshToken.mockRejectedValueOnce(new Error('Refresh failed'));
            req.body = { refreshToken: 'invalid_refresh_token' };
            await accountController.refreshToken(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(new Error('Refresh failed'));
        });
    });

    describe('logout', () => {
        it('should call logout method of AccountInteractor', async () => {
            mockAccountInteractor.logout.mockResolvedValueOnce({
                isSuccess: true,
                messageOnSuccess: 'Logged out successfully.',
            });

            req.body = { userId: 'user123' };
            await accountController.logout(req as Request, res as Response, next);
            expect(mockAccountInteractor.logout).toHaveBeenCalledWith(req, res);
        });

        it('should handle missing userId', async () => {
            req.body = {};
            await accountController.logout(req as Request, res as Response, next);
        });

        it('should handle error if logout fails', async () => {
            mockAccountInteractor.logout.mockRejectedValueOnce(new Error('Logout failed'));
            req.body = { userId: 'user123' };
            await accountController.logout(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(new Error('Logout failed'));
        });
    });
});
