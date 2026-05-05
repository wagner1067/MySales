import AppError from "@shared/errors/AppError";
import { User } from "../infra/database/entities/User";
import { usersRepositories } from "../infra/database/repositories/UsersRepositories";

interface IshowProfile {
  user_id: number;
}

export default class ShowProfileService {
  async execute({ user_id }: IshowProfile): Promise<User> {
    const user = await usersRepositories.findById(user_id);

    if (!user) {
      throw new AppError("User does not exist", 404);
    }
    return user;
  }
}
