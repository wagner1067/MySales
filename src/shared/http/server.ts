import "reflect-metadata";
import "express-async-errors";
import express from "express";
import cors from "cors";

import routes from "./routes";
import ErrorHandleMiddleware from "@shared/middlewares/ErrorHandleMiddleware";
import { AppDataSource } from "@shared/typeorm/data-source";

AppDataSource.initialize()
  .then(() => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use(routes);
    app.use(ErrorHandleMiddleware.handleError);

    console.log("Conectado com sucesso ao banco de dados!");

    app.listen(3333, () => console.log("Server is running on port 3333"));
  })
  .catch((error) =>
    console.error("Falha na conexão com bando de dados!", error),
  );
