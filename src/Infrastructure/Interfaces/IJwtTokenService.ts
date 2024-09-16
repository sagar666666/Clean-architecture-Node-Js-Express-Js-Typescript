import { User } from "@prisma/client";

export interface IJwtTokenService{
    issueAccessToken(user: User):string;
    issueRefreshToken(user:User, idRefreshToken:string):string;
    verifyRefreshToken(refreshToken:string);
    hashedToken(token:string):string;
}