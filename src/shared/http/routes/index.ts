import productsRoutes from "@modules/products/routes/ProductRoutes";
import avatarRouter from "@modules/users/routes/AvatarRoutes";
import sessionRouter from "@modules/users/routes/SessionRoutes";
import usersRouter from "@modules/users/routes/UserRoutes";
import { Router } from "express";

const routes = Router();

routes.get("/health", (req, res) => {
  return res.json({ message: "Olá Dev, Eu sou Wagner!" });
});

routes.use("/products", productsRoutes);
routes.use("/users", usersRouter);
routes.use("/sessions", sessionRouter);
routes.use("/avatars", avatarRouter);

export default routes;
