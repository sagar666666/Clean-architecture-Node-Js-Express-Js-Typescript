import express from "express";
import { BookController } from "../Controllers/bookController";
import { INTERFACE_TYPE } from "../../Domain/Constants/app-constants";
import { container } from "../InversionOfControl/DIContainer";

const bookRouter = express.Router();

const controller = container.get<BookController>(
  INTERFACE_TYPE.BookController
);

bookRouter.get("/books", controller.onGetBooks.bind(controller));
bookRouter.post("/books", controller.onCreateBook.bind(controller));
bookRouter.put("/books/:id", controller.onUpdateBook.bind(controller));
bookRouter.get("/books/:id", controller.onGetBookById.bind(controller));

export default bookRouter;