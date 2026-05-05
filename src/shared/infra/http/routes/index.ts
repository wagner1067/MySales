import express, { Router } from "express";
import uploadConfig from "@config/upload";

import customersRouter from "@modules/customers/infra/http/routes/CustomerRoutes";
import ordersRouter from "@modules/orders/infra/http/routes/OrdersRoutes";
import profileRouter from "@modules/users/infra/http/routes/ProfileRoutes";
import passwordRouter from "@modules/users/infra/http/routes/PasswordRoutes";
import avatarRouter from "@modules/users/infra/http/routes/AvatarRoutes";
import sessionRouter from "@modules/users/infra/http/routes/SessionRoutes";
import usersRouter from "@modules/users/infra/http/routes/UserRoutes";
import productsRoutes from "@modules/products/infra/http/routes/ProductRoutes";

const routes = Router();

routes.get("/health", (req, res) => {
  return res.json({ message: "Olá Dev, Eu sou Wagner!" });
});

routes.use("/products", productsRoutes);
routes.use("/users", usersRouter);
routes.use("/sessions", sessionRouter);
routes.use("/avatars", avatarRouter);
routes.use("/files", express.static(uploadConfig.directory));
routes.use("/passwords", passwordRouter);
routes.use("/profiles", profileRouter);
routes.use("/customers", customersRouter);
routes.use("/orders", ordersRouter);

export default routes;
