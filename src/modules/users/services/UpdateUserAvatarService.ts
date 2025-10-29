import AppError from "@shared/errors/AppError";
import { User } from "../database/entities/User";
import { usersRepositories } from "../database/repositories/UsersRepositories";
import path from "path";
import uploadConfig from "@config/upload";
import fs from "fs";

interface IUpdateUserAvatar {
  userId: number;
  avatarFilename: string;
}

export default class UpdateUserAvatarService {
  async execute({ userId, avatarFilename }: IUpdateUserAvatar): Promise<User> {
    const user = await usersRepositories.findById(userId);

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;
    await usersRepositories.save(user);

    return user;
  }
}
