import express from "express";
import { container } from "../InversionOfControl/DIContainer";
import { INTERFACE_TYPE } from "../../Domain/Constants/app-constants";
import { AccountController } from "../Controllers/accountController";

const accountRouter = express.Router();

const controller = container.get<AccountController>(
    INTERFACE_TYPE.AccountController
);

accountRouter.post('/account/login', controller.onLogin.bind(controller));
accountRouter.post('/account/refreshToken', controller.refreshToken.bind(controller));
accountRouter.post('/account/logout', controller.logout.bind(controller));

export default accountRouter;