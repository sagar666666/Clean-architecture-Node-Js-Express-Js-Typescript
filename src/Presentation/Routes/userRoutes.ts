import express from "express";
import { container } from "../InversionOfControl/DIContainer";
import { UserController } from "../Controllers/userController";
import { INTERFACE_TYPE } from "../../Domain/Constants/app-constants";

const userRouter = express.Router();

const controller = container.get<UserController>(
    INTERFACE_TYPE.UserController
  );

  userRouter.post('/User/AddUser', controller.onAddUser.bind(controller));
  export default userRouter;