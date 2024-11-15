import { AccountInteractor } from '../../../src/Application/Interactors/AccountInteracor';
import { IJwtTokenService } from '../../../src/Infrastructure/Interfaces/IJwtTokenService';
import { IUserRepository } from '../../../src/Infrastructure/IRepositories/IUserRepository';
import { IRefreshTokenRepository } from '../../../src/Infrastructure/IRepositories/IRefreshTokenRepository';
import { IuuidService } from '../../../src/Infrastructure/Interfaces/IuuidService';
import { HTTPStatusCode } from '../../../src/Domain/Enums/httpStatusCode';
import { User } from '../../../src/Domain/Entities/User';
import { Request, Response, NextFunction } from "express";
import { RefreshToken } from '../../../src/Domain/Entities/RefreshToken';

jest.mock('../../../src/Infrastructure/Interfaces/IJwtTokenService');
jest.mock('../../../src/Infrastructure/IRepositories/IUserRepository');
jest.mock('../../../src/Infrastructure/IRepositories/IRefreshTokenRepository');
jest.mock('../../../src/Infrastructure/Interfaces/IuuidService');

describe('AccountInteractor', () => {
    let accountInteractor: AccountInteractor;
    let userRepoMock: jest.Mocked<IUserRepository> = {
        getUser: jest.fn().mockResolvedValue({ id: 'user-id', userName: 'testuser', password: 'password' }), // Mock async method
        getUserById: jest.fn().mockResolvedValue({ id: 'user-id', userName: 'testuser', password: 'password' }),
        addUser:jest.fn().mockResolvedValue({ id: 'user-id', userName: 'testuser', password: 'password' })
    };

    let tokenServiceMock: jest.Mocked<IJwtTokenService> = {
        issueAccessToken: jest.fn().mockReturnValue("access-token"),
        issueRefreshToken: jest.fn().mockReturnValue("refresh-token"),
        hashedToken: jest.fn().mockReturnValue("hashed-token"),
        verifyRefreshToken: jest.fn().mockReturnValue({ userId: 'user-id', jti: 'refresh-token-id' } ),
    };

    let refreshTokenRepoMock: jest.Mocked<IRefreshTokenRepository> = {
        addRefreshTokenToDb: jest.fn().mockResolvedValue(undefined),
        deleteRefreshTokensForUser: jest.fn().mockResolvedValue(undefined),
        deleteRefreshToken: jest.fn().mockResolvedValue(undefined),
        findRefreshTokenById: jest.fn().mockResolvedValue({ id: 'refresh-token-id', revoked: false, hashedToken: 'hashed-token' }),
    };

    let uuidServiceMock: jest.Mocked<IuuidService> = {
        getNewId: jest.fn().mockReturnValue("new-uuid"),
    };

    beforeEach(() => {
        accountInteractor = new AccountInteractor(
            userRepoMock,
            tokenServiceMock,
            refreshTokenRepoMock,
            uuidServiceMock
        );
    });

    describe('login', () => {
        it('should return access token and refresh token when valid credentials are provided', async () => {
            // Mock the repositories and services
            const mockUser = new User({
                id: 'user-id',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                userName: 'testuser',
                password: 'password123',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            userRepoMock.getUser.mockResolvedValue(mockUser);
            uuidServiceMock.getNewId.mockReturnValue('new-id');
            tokenServiceMock.issueAccessToken.mockReturnValue('access-token');
            tokenServiceMock.issueRefreshToken.mockReturnValue('refresh-token');
            tokenServiceMock.hashedToken.mockReturnValue('hashed-token');
            refreshTokenRepoMock.addRefreshTokenToDb.mockResolvedValue(true);

            const req = { body: { userName: 'testuser', password: 'password123' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis()};

            await accountInteractor.login(req as any, res as any);

            expect(userRepoMock.getUser).toHaveBeenCalledWith('testuser', 'password123');
            expect(tokenServiceMock.issueAccessToken).toHaveBeenCalledWith(mockUser);
            expect(tokenServiceMock.issueRefreshToken).toHaveBeenCalledWith(mockUser, 'new-id');
            expect(refreshTokenRepoMock.addRefreshTokenToDb).toHaveBeenCalledWith('new-id', 'hashed-token', mockUser.id);
            expect(res.status).toHaveBeenCalledWith(HTTPStatusCode.Ok);
            expect(res.json).toHaveBeenCalledWith({
                isSuccess: true,
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
            });
        });

        it('should return error when invalid username or password is provided', async () => {
            userRepoMock.getUser.mockResolvedValue(null);

            const req = { body: { userName: 'wronguser', password: 'wrongpassword' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };

            await accountInteractor.login(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(HTTPStatusCode.Forbidden);
            expect(res.json).toHaveBeenCalledWith({
                isSuccess: false,
                resonForFailure: 'Invalid username or password',
            });
        });

        it('should return error if username or password is missing', async () => {
            const req = { body: {} };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };

            await accountInteractor.login(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(HTTPStatusCode.BadRequest);
            expect(res.json).toHaveBeenCalledWith({
                isSuccess: false,
                reasonForFailure: 'email and password should be required',
            });
        });
    });

    describe("AccountInteractor - logout", () => {
        let mockRequest: Partial<Request>;
        let mockResponse: Partial<Response>;

        beforeEach(() => {
            mockRequest = {
                body: { userId: "user-id" },
            };
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
        });

        it("should return BadRequest if userId is missing", async () => {
            mockRequest.body = {}; // Missing userId

            await accountInteractor.logout(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(HTTPStatusCode.BadRequest);
            expect(mockResponse.json).toHaveBeenCalledWith({
                isSuccess: false,
                reasonForFailure: "user id should be required",
            });
        });

        it("should return Forbidden if user is not found", async () => {
            const mockUserId = "user-id";
            mockRequest.body = { userId: mockUserId };
            userRepoMock.getUserById.mockResolvedValue(null);

            await accountInteractor.logout(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(HTTPStatusCode.Forbidden);
            expect(mockResponse.json).toHaveBeenCalledWith({
                isSuccess: false,
                resonForFailure: "Invalid user id",
            });
        });

        it("should revoke all tokens and return Ok if user is found", async () => {
            const mockUserId = "user-id";
            const mockUser = new User({
                id: mockUserId,
                firstName: 'Sagar',
                lastName: 'Mohite',
                email: 'sagar.mohite@gmail.com',
                userName: 'testuser',
                password: 'KingOfhearts@4147',
                updatedAt: new Date(),
                createdAt: new Date()
            });
            mockRequest.body = { userId: mockUserId };
            userRepoMock.getUserById.mockResolvedValue(mockUser);

            await accountInteractor.logout(mockRequest as Request, mockResponse as Response);

            expect(refreshTokenRepoMock.deleteRefreshTokensForUser).toHaveBeenCalledWith(mockUserId);
            expect(mockResponse.status).toHaveBeenCalledWith(HTTPStatusCode.Ok);
            expect(mockResponse.json).toHaveBeenCalledWith({
                isSuccess: true,
                messageOnSuccess: "Logged out successfully.",
            });
        });
    });

    describe("AccountInteractor - refreshToken", () => {
        let mockRequest: Partial<Request>;
        let mockResponse: Partial<Response>;
        let next: jest.Mock;

        beforeEach(() => {
            mockRequest = {
                body: { refreshToken: "valid-refresh-token" },
            };
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            next = jest.fn();
        });

        it("should return Unauthorized if refreshToken is missing", async () => {
            mockRequest.body = {}; // Missing refresh token

            await accountInteractor.refreshToken(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(HTTPStatusCode.BadRequest);
            expect(mockResponse.json).toHaveBeenCalledWith({
                isSuccess: false,
                reasonForFailure: "Missing refresh token",
            });
        });

        it("should return Unauthorized if refresh token is invalid", async () => {
            const invalidRefreshToken = "invalid-refresh-token";
            mockRequest.body = { refreshToken: invalidRefreshToken };

            tokenServiceMock.verifyRefreshToken.mockImplementationOnce(() => {
                throw new Error("Invalid token");
            });

            await accountInteractor.refreshToken(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(HTTPStatusCode.Unauthorized);
            expect(mockResponse.json).toHaveBeenCalledWith({
                isSuccess: false,
                reasonForFailure: "Invalid token",
            });
        });

        it("should return Unauthorized if refresh token is revoked", async () => {
            const refreshToken = "valid-refresh-token";
            mockRequest.body = { refreshToken };

            const payload = { jti: "token-id", userId: "user-id" };
            tokenServiceMock.verifyRefreshToken.mockReturnValue(payload);

            refreshTokenRepoMock.findRefreshTokenById.mockResolvedValue(new RefreshToken(
                {
                    id: "token-id",
                    revoked: true,
                    hashedToken: 'ddd',
                    userId: 'testuser123',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            ));

            await accountInteractor.refreshToken(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(HTTPStatusCode.Unauthorized);
            expect(mockResponse.json).toHaveBeenCalledWith({
                isSuccess: false,
                reasonForFailure: "Unauthorized",
            });
        });
    });
});