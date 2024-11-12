import { injectable } from "inversify";
import { IUserRepository } from "../IRepositories/IUserRepository";
import { PrismaClient, User as UserModel } from "@prisma/client";
import { User } from "../../Domain/Entities/User";
import 'reflect-metadata';

@injectable()
export class UserRepository implements IUserRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async getUserById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                id
            }
        });

        if (!user) {
            return null;
        }

        return this.toEntity(user);
    }

    async getUser(userName: string, password: string): Promise<any> {
        const user = await this.prisma.user.findFirst({
            where: {
                AND: [
                    { userName: { equals: userName } },
                    { password: { equals: password } }
                ]
            }
        });
        
        if (!user) {
            return null;
        }

        return this.toEntity(user);
    }

    toEntity(user: UserModel): User {
        return new User({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userName: user.userName,
            password: user.password,
            updatedAt: user.updatedAt,
            createdAt: user.createdAt,
        });
    }
}