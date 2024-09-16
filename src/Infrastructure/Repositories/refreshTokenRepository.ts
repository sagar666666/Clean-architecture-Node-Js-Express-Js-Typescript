import { injectable } from "inversify";
import { IRefreshTokenRepository } from "../IRepositories/IRefreshTokenRepository";
import { PrismaClient } from "@prisma/client";

@injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
    private prisma: PrismaClient;

    constructor() {
        this, this.prisma = new PrismaClient();
    }

    async deleteRefreshTokensForUser(userId: string): Promise<any> {
      return await this.prisma.refreshToken.deleteMany({
        where:{
            userId,
        }
      });
    }

    async deleteRefreshToken(id: string): Promise<any> {
        return await this.prisma.refreshToken.update({
            where: {
                id,
            },
            data: {
                revoked: true
            }
        });
    }

    async addRefreshTokenToDb(jti: string, hashedRefreshToken: string, userId: string): Promise<any> {
        return await this.prisma.refreshToken.create({
            data: {
                id: jti,
                hashedToken: hashedRefreshToken,
                userId
            },
        });
    }

    async findRefreshTokenById(id: string) {
        return await this.prisma.refreshToken.findUnique({
            where: {
                id,
            },
        });
    }
}