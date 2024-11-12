import { Request, Response } from "express";
import { IUserInteractor } from "../IInteractors/IUserInteractor";
import { HTTPStatusCode } from "../../Domain/Enums/httpStatusCode";
import { inject, injectable } from "inversify";
import 'reflect-metadata';
import { INTERFACE_TYPE } from "../../Domain/Constants/app-constants";
import { IUserRepository } from "../../Infrastructure/IRepositories/IUserRepository";
import { User } from "../../Domain/Entities/User";
import { IMailer } from "../../Infrastructure/Interfaces/IMailer";
import config from "../../../config.json"

@injectable()
export class UserInteractor implements IUserInteractor {
    private readonly userRepo: IUserRepository;
    private readonly mailer: IMailer;
    constructor(@inject(INTERFACE_TYPE.UserRepository) userRepo: IUserRepository, @inject(INTERFACE_TYPE.Mailer) mailer: IMailer) {
        this.userRepo = userRepo;
        this.mailer = mailer;
    }
    async addUser(request: Request, response: Response) {
        if (!request.body) {
            return response.status(HTTPStatusCode.BadRequest).json({ isSuccess: false, reasonForFailure: 'invalid inputs' });
        }

        const user = request.body;
        const userToAdd = new User({ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, createdAt: new Date(user.createdAt), updatedAt: new Date(user.updatedAt), password: user.password, userName: user.userName });
        try {
            // Add user to the repository
            await this.userRepo.addUser(userToAdd);

            // Send a notification email
            await this.mailer.sendMail(
                config.addUserMailToList,
                `User: ${userToAdd.firstName} ${userToAdd.lastName} added successfully.`,
                'New user added notification'
            );

            return response.status(HTTPStatusCode.Ok).json({
                isSuccess: true,
                messageOnSuccess: 'User added successfully!',
            });
        } catch (error) {
            return response.status(HTTPStatusCode.InternalServerError).json({
                isSuccess: false,
                reasonForFailure: 'Failed to add user or send email notification',
            });
        }
    }
}