import { Router } from "express";
import OrdersControllers from "../controller/OrdersControllers";
import AuthMiddleware from "@shared/middlewares/authMiddleware";
import { createOrderValidate, idParamsValidate } from "../schemas/OrderSchemas";

const ordersRouter = Router();
const ordersControllers = new OrdersControllers();

ordersRouter.use(AuthMiddleware.execute);

ordersRouter.get("/:id", idParamsValidate, ordersControllers.show);
ordersRouter.post("/", createOrderValidate, ordersControllers.create);

export default ordersRouter;
