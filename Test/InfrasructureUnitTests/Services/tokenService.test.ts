import { JwtTokenService } from '../../../src/Infrastructure/TokenService/JwtTokenService';
import * as jwt from 'jsonwebtoken';
import { createHash } from 'crypto';
import config from '../../../config.json';
import { User } from '../../../src/Domain/Entities/User';

jest.mock('jsonwebtoken');
jest.mock('crypto');

describe('JwtTokenService', () => {
    let jwtTokenService: JwtTokenService;
    let signMock: jest.Mock;
    let verifyMock: jest.Mock;
    let createHashMock: jest.Mock;

    beforeEach(() => {
        jwtTokenService = new JwtTokenService();
        signMock = jwt.sign as jest.Mock;
        verifyMock = jwt.verify as jest.Mock;
        createHashMock = createHash as jest.Mock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('issueAccessToken', () => {
        it('should issue an access token correctly', () => {
            const user = new User({ id: '1234', firstName: 'Sagar', lastName: 'Mohite', email: 'mohitesagar12@gmail.com', userName: 'sagar.mohite', password: 'test@123', updatedAt: new Date(), createdAt: new Date() });  // Mock user
            const mockAccessToken = 'mockAccessToken';
            signMock.mockReturnValue(mockAccessToken);
            const token = jwtTokenService.issueAccessToken(user);
            expect(signMock).toHaveBeenCalledWith(
                { userId: user.id },
                config.jwt.jwtSecret,
                { expiresIn: config.jwt.jwtAccessTokenExpirationSeconds }
            );
            expect(token).toBe(mockAccessToken);
        });
    });

    describe('issueRefreshToken', () => {
        it('should issue a refresh token correctly', () => {
            const user = new User({ id: '1234', firstName: '', lastName: '', email: 'mohitesagar12@gmail.com', userName: 'sagar.mohite', password: 'test@123', updatedAt: new Date(), createdAt: new Date() });  // Mock user
            const idRefreshToken = 'mockRefreshTokenId';
            const mockRefreshToken = 'mockRefreshToken';
            signMock.mockReturnValue(mockRefreshToken);
            const token = jwtTokenService.issueRefreshToken(user, idRefreshToken);
            expect(signMock).toHaveBeenCalledWith(
                { userId: user.id, idRefreshToken },
                config.jwt.jwtSecret,
                { expiresIn: config.jwt.jwtRefreshTokenExpirationSeconds }
            );
            expect(token).toBe(mockRefreshToken);
        });
    });

    describe('verifyRefreshToken', () => {
        it('should verify a refresh token correctly', () => {
            const refreshToken = 'mockRefreshToken';
            const decodedToken = { userId: '1234', idRefreshToken: 'mockRefreshTokenId' };
            verifyMock.mockReturnValue(decodedToken);
            const result = jwtTokenService.verifyRefreshToken(refreshToken);
            expect(verifyMock).toHaveBeenCalledWith(refreshToken, config.jwt.jwtSecret);
            expect(result).toBe(decodedToken);
        });
    });

    describe('hashedToken', () => {
        it('should return the hashed token correctly', () => {
            const token = 'mockToken';
            const mockHashedToken = 'mockHashedToken';
            createHashMock.mockReturnValue({
                update: jest.fn().mockReturnThis(),
                digest: jest.fn().mockReturnValue(mockHashedToken)
            });
            const result = jwtTokenService.hashedToken(token);
            expect(createHashMock).toHaveBeenCalledWith('sha512');
            expect(result).toBe(mockHashedToken);
        });
    });
});
