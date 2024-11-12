import { RefreshToken } from "../../Domain/Entities/RefreshToken";

export interface IRefreshTokenRepository{
    addRefreshTokenToDb(jti:string, hashedRefreshToken:string, userId:string):Promise<any>;
    findRefreshTokenById(jt:string):Promise<RefreshToken|null>;
    deleteRefreshToken(id:string):Promise<any>;
    deleteRefreshTokensForUser(userId:string):Promise<any>;
}