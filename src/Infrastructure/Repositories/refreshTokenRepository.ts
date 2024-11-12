import { injectable } from "inversify";
import { IRefreshTokenRepository } from "../IRepositories/IRefreshTokenRepository";
import { PrismaClient, RefreshToken as RefreshTokenModel } from "@prisma/client";
import { RefreshToken } from "../../Domain/Entities/RefreshToken";
import 'reflect-metadata';

@injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
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

    async findRefreshTokenById(id: string):Promise<RefreshToken|null> {
        const refreshToken =  await this.prisma.refreshToken.findUnique({
            where: {
                id,
            },
        });
        
        if (!refreshToken) {
            return null;
        }

        return this.toEntity(refreshToken);
    }

    toEntity(refreshToken: RefreshTokenModel): RefreshToken {
        return new RefreshToken({
            id: refreshToken.id,
            hashedToken: refreshToken.hashedToken,
            userId: refreshToken.userId,
            revoked: refreshToken.revoked,
            updatedAt: refreshToken.updatedAt,
            createdAt: refreshToken.createdAt,
        });
    }
}