import { injectable, inject } from "inversify";
import { IAccountInteractor } from "../IInteractors/IAccountInteractor";
import { INTERFACE_TYPE } from "../../Domain/Constants/app-constants";
import { IJwtTokenService } from "../../Infrastructure/Interfaces/IJwtTokenService";
import { Request, Response } from "express";
import { IUserRepository } from "../../Infrastructure/IRepositories/IUserRepository";
import { IRefreshTokenRepository } from "../../Infrastructure/IRepositories/IRefreshTokenRepository";
import { UUIDService } from "../../Infrastructure/UUID/uuidService";
import { IuuidService } from "../../Infrastructure/Interfaces/IuuidService";
import { HTTPStatusCode } from "../../Domain/Enums/httpStatusCode";
import 'reflect-metadata';

@injectable()
export class AccountInteractor implements IAccountInteractor {

    private userRepo: IUserRepository;
    private tokenService: IJwtTokenService;
    private refreshTokenRepo: IRefreshTokenRepository;
    private uuid: IuuidService;

    constructor(@inject(INTERFACE_TYPE.UserRepository) userRepo: IUserRepository, @inject(INTERFACE_TYPE.JwtTokenService) tokenService: IJwtTokenService,
        @inject(INTERFACE_TYPE.RefreshTokenRepository) refreshTokenRepo: IRefreshTokenRepository, @inject(INTERFACE_TYPE.uuidService) uuidService: UUIDService) {
        this.userRepo = userRepo;
        this.tokenService = tokenService;
        this.refreshTokenRepo = refreshTokenRepo;
        this.uuid = uuidService;
    }

    async login(request: Request, response: Response) {
        const { userName, password } = request.body;

        if (userName || password) {
            let user = await this.userRepo.getUser(userName, password);

            if (user != null) {
                // Generate token
                const idRefreshToken = this.uuid.getNewId();
                let accessToken = this.tokenService.issueAccessToken(user);
                let refreshToken = this.tokenService.issueRefreshToken(user, idRefreshToken);
                await this.refreshTokenRepo.addRefreshTokenToDb(idRefreshToken, this.tokenService.hashedToken(refreshToken), user.id);
                return response.status(HTTPStatusCode.Ok).json({ isSuccess: true, accessToken: accessToken, refreshToken: refreshToken });
            }
            else {
                return response.status(HTTPStatusCode.Forbidden).json({ isSuccess: false, resonForFailure: 'Invalid username or password' });
            }
        }
        else {
            return response.status(HTTPStatusCode.BadRequest).json({ isSuccess: false, reasonForFailure: 'email and password should be required' })
        }
    }

    async refreshToken(request: Request, response: Response) {
        const { refreshToken } = request.body;
        if (!refreshToken) {
            return response.status(HTTPStatusCode.BadRequest).json({ isSuccess: false, reasonForFailure: 'Missing refresh token' });
        }

        try {
            const payload = this.tokenService.verifyRefreshToken(refreshToken);
            const savedRefreshToken = await this.refreshTokenRepo.findRefreshTokenById(payload.jti);

            if (!savedRefreshToken || savedRefreshToken.revoked === true) {
                return response.status(HTTPStatusCode.Unauthorized).json({ isSuccess: false, reasonForFailure: 'Unauthorized' });
            }

            const hashedToken = this.tokenService.hashedToken(refreshToken);
            if (hashedToken !== savedRefreshToken!.hashedToken) {
                return response.status(HTTPStatusCode.Unauthorized).json({ isSuccess: false, reasonForFailure: 'Unauthorized' });
            }

            const user = await this.userRepo.getUserById(payload.userId);

            if (!user) {
                return response.status(HTTPStatusCode.Unauthorized).json({ isSuccess: false, reasonForFailure: 'Unauthorized' });
            }

            await this.refreshTokenRepo.deleteRefreshToken(savedRefreshToken!.id);
            const idRefreshToken = this.uuid.getNewId();
            let newAccessToken = this.tokenService.issueAccessToken(user!);
            let newRefreshToken = this.tokenService.issueRefreshToken(user!, idRefreshToken);
            await this.refreshTokenRepo.addRefreshTokenToDb(idRefreshToken, this.tokenService.hashedToken(refreshToken), user!.id);
            return response.status(HTTPStatusCode.Ok).json({ isSuccess: true, accessToken: newAccessToken, refreshToken: newRefreshToken });
        }
        catch (error: any) {
            return response.status(HTTPStatusCode.Unauthorized).json({ isSuccess: false, reasonForFailure: error.message });
        }
    }

    async logout(request: Request, response: Response) {
        const { userId } = request.body;

        if (!userId) {
            return response.status(HTTPStatusCode.BadRequest).json({ isSuccess: false, reasonForFailure: 'user id should be required' });
        }

        const user = await this.userRepo.getUserById(userId);

        if (!user) {
            return response.status(HTTPStatusCode.Forbidden).json({ isSuccess: false, resonForFailure: 'Invalid user id' });
        }

        // revoke all tokens
        await this.refreshTokenRepo.deleteRefreshTokensForUser(user.id);
        return response.status(HTTPStatusCode.Ok).json({ isSuccess: true, messageOnSuccess: 'Logged out successfully.' });
    }
}