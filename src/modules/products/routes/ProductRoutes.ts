import { Router } from "express";
import ProductsControllers from "../controllers/ProductsControllers";
import {
  idParamsValidation,
  createProductSchema,
  updateProductSchema,
} from "../schemas/ProductSchemas";
const productsRoutes = Router();
const productsControllers = new ProductsControllers();

productsRoutes.get("/", productsControllers.index);
productsRoutes.get("/:id", idParamsValidation, productsControllers.show);
productsRoutes.post("/", createProductSchema, productsControllers.create);
productsRoutes.put("/:id", updateProductSchema, productsControllers.update);
productsRoutes.delete("/:id", idParamsValidation, productsControllers.delete);

export default productsRoutes;
