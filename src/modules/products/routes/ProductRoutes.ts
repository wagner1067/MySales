import { Router } from "express";
import ProductsControllers from "../controllers/ProductsControllers";

const productsRoutes = Router();
const productsControllers = new ProductsControllers();

productsRoutes.get("/", productsControllers.index);
productsRoutes.get("/:id", productsControllers.show);
productsRoutes.post("/", productsControllers.create);
productsRoutes.put("/:id", productsControllers.update);
productsRoutes.delete("/:id", productsControllers.delete);

export default productsRoutes;
