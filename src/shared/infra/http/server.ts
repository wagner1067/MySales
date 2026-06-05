import "reflect-metadata";
import express from "express";
import cors from "cors";
import { errors } from "celebrate";
import "@shared/containers";

import routes from "./routes";
import ErrorHandleMiddleware from "@shared/middlewares/ErrorHandleMiddleware";
import { AppDataSource } from "@shared/infra/typeorm/data-source";
import rateLimiter from "@shared/middlewares/rateLimiter";

const startServer = async () => {
  await AppDataSource.initialize();
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(rateLimiter);
  app.use(routes);
  app.use(errors());
  app.use(ErrorHandleMiddleware.handleError);

  console.log("Conectado com sucesso ao banco de dados!");

  return app;
};

const appPromise = startServer();

if (process.env.NODE_ENV !== "test") {
  appPromise
    .then((app) => {
      app.listen(3333, () => {
        console.log("Servidor rodando na porta 3333");
      });
    })
    .catch((error) => {
      console.error("Falha na conexão com banco de dados:", error);
    });
}

export default appPromise;
