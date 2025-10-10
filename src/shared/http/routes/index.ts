import productsRoutes from "@modules/products/routes/ProductRoutes";
import { Router } from "express";

const routes = Router();

routes.get("/health", (req, res) => {
  return res.json({ message: "Olá Dev, Eu sou Wagner!" });
});

routes.use("/products", productsRoutes);

export default routes;
