import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";
import { ILogRepository } from "../IRepositories/ILogRepository";

@injectable()
export class LogRepository implements ILogRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }
    error() {
        throw new Error("Method not implemented.");
    }
    info() {
        throw new Error("Method not implemented.");
    }
    warning() {
        throw new Error("Method not implemented.");
    }
}