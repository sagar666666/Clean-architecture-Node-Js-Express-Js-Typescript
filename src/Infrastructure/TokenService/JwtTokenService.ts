import { injectable } from "inversify";
import { IJwtTokenService } from "../Interfaces/IJwtTokenService";
import * as jwt from "jsonwebtoken";
import config from "../../../config.json";
import { createHash } from "crypto";
import { User } from "@prisma/client";

@injectable()
export class JwtTokenService implements IJwtTokenService {
    issueAccessToken(user: User): string {

        const accessToken = jwt.sign({ userId: user.id }, config.jwt.jwtSecret, {
            expiresIn: config.jwt.jwtAccessTokenExpirationSeconds
        });

        return accessToken;
    }

    issueRefreshToken(user: User, idRefreshToken): string {

        const refreshToken = jwt.sign({ userId: user.id, idRefreshToken }, config.jwt.jwtSecret, {
            expiresIn: config.jwt.jwtRefreshTokenExpirationSeconds
        });

        return refreshToken;
    }

    verifyRefreshToken(refreshToken: string) {
        return jwt.verify(refreshToken, config.jwt.jwtSecret);
    }

    hashedToken(token: string): string {
        return createHash('sha512').update(token).digest('hex');
    }
}