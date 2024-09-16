import { injectable } from "inversify";
import { IUserRepository } from "../IRepositories/IUserRepository";
import { PrismaClient } from "@prisma/client";

@injectable()
export class UserRepository implements IUserRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async getUserById(id: string): Promise<any> {
        return await this.prisma.user.findUnique({
            where: {
                id
            }
        });
    }

    async getUser(userName: string, password: string): Promise<any> {
        return await this.prisma.user.findFirst({
            where: {
                AND: [
                    { UserName: { equals: userName } },
                    { Password: { equals: password } }
                ]
            }
        });
    }
}