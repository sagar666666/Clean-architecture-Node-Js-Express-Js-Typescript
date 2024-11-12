export class RefreshToken {
    public id: string;
    public hashedToken: string;
    public userId: string;
    public revoked: boolean;
    public updatedAt: Date;
    public createdAt: Date;

    constructor(refreshToken: {
        id: string;
        hashedToken: string;
        userId: string;
        revoked: boolean;
        updatedAt: Date;
        createdAt: Date;
    }) {
        this.id = refreshToken.id;
        this.hashedToken = refreshToken.hashedToken;
        this.userId = refreshToken.userId;
        this.updatedAt = refreshToken.updatedAt;
        this.createdAt = refreshToken.createdAt;
        this.revoked = refreshToken.revoked;
    }
}