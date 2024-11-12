import { RefreshToken } from '../../src/Domain/Entities/RefreshToken';

describe('RefreshToken Class', () => {

    //  Valid RefreshToken Creation
    it('should create a RefreshToken instance successfully with valid data', () => {
        const refreshTokenData = {
            id: 'abc123',
            hashedToken: 'hashedTokenValue',
            userId: 'user123',
            revoked: false,
            updatedAt: new Date(),
            createdAt: new Date()
        };

        const refreshToken = new RefreshToken(refreshTokenData);

        // Verify the properties are correctly assigned
        expect(refreshToken.id).toBe(refreshTokenData.id);
        expect(refreshToken.hashedToken).toBe(refreshTokenData.hashedToken);
        expect(refreshToken.userId).toBe(refreshTokenData.userId);
        expect(refreshToken.revoked).toBe(refreshTokenData.revoked);
        expect(refreshToken.updatedAt).toBeInstanceOf(Date);
        expect(refreshToken.createdAt).toBeInstanceOf(Date);
    });
});