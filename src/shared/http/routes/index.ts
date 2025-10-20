import productsRoutes from "@modules/products/routes/ProductRoutes";
import usersRouter from "@modules/users/routes/UserRoutes";
import { Router } from "express";

const routes = Router();

routes.get("/health", (req, res) => {
  return res.json({ message: "Olá Dev, Eu sou Wagner!" });
});

routes.use("/products", productsRoutes);
routes.use("/users", usersRouter);

export default routes;
