import { Router } from "express";

const routes = Router();

routes.get("/health", (req, res) => {
  return res.json({ message: "Olá Dev, Eu sou Wagner!" });
});

export default routes;
