import Router from "express";
import CustomersControllers from "../controllers/CustomersControllers";
import AuthMiddleware from "@shared/middlewares/authMiddleware";
import {
  createCustomerSchema,
  idParamsValidate,
  updateCustomerSchema,
} from "../schemas/CustomerSchema";

const customersRouter = Router();
const customersControllers = new CustomersControllers();

customersRouter.use(AuthMiddleware.execute);

customersRouter.get("/", customersControllers.index);
customersRouter.get("/:id", idParamsValidate, customersControllers.show);
customersRouter.post("/", createCustomerSchema, customersControllers.Create);
customersRouter.patch(
  "/:id",
  idParamsValidate,
  updateCustomerSchema,
  customersControllers.update,
);
customersRouter.delete("/:id", idParamsValidate, customersControllers.delete);

export default customersRouter;
