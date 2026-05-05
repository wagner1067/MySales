import { Router } from "express";
import SessionControllers from "../controllers/SessionControllers";
import sessionSchema from "../schemas/SessionSchema";

const sessionRouter = Router();
const sessionsController = new SessionControllers();

sessionRouter.post("/", sessionSchema, sessionsController.create);

export default sessionRouter;
