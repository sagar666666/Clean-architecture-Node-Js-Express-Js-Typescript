export interface IRefreshTokenRepository{
    addRefreshTokenToDb(jti:string, hashedRefreshToken:string, userId:string):Promise<any>;
    findRefreshTokenById(jt:string):Promise<any>;
    deleteRefreshToken(id:string):Promise<any>;
    deleteRefreshTokensForUser(userId:string):Promise<any>;
}