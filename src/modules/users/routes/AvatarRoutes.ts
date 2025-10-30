import { Router } from "express";
import UserAvatarControllers from "../controllers/UserAvatarControllers";
import multer from "multer";
import uploadConfig from "@config/upload";
import AuthMiddleware from "@shared/middlewares/authMiddleware";

const avatarRouter = Router();
const userAvatarController = new UserAvatarControllers();
const upload = multer(uploadConfig);

avatarRouter.patch(
  "/",
  AuthMiddleware.execute,
  upload.single("avatar"),
  userAvatarController.update,
);

export default avatarRouter;
