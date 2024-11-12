import * as express from "express";
import * as bookRouter from "./bookRoutes";
import * as accountRouter from "./accountRoutes";
import * as userRouter from "./userRoutes";

let masterRouter = express.Router();
masterRouter.use(bookRouter.default);
masterRouter.use(accountRouter.default);
masterRouter.use(userRouter.default);
export = masterRouter;