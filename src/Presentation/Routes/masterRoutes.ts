import * as express from "express";
import * as bookRouter from "./bookRoutes";
import * as accountRouter from "./accountRoutes";

let masterRouter = express.Router();
masterRouter.use(bookRouter.default);
masterRouter.use(accountRouter.default);
export = masterRouter;