import AppError from "@shared/errors/AppError";
import { User } from "../database/entities/User";
import { usersRepositories } from "../database/repositories/UsersRepositories";
import { compare, hash } from "bcrypt";

interface IUpdateProfile {
  user_id: number;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

export default class UpdateProfileService {
  async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IUpdateProfile): Promise<User> {
    const user = await usersRepositories.findById(user_id);

    if (!user) {
      throw new AppError("Usuario nao encontrado", 404);
    }

    if (email) {
      const userUpdateEmail = await usersRepositories.findByEmail(email);

      if (userUpdateEmail && userUpdateEmail.id !== user_id) {
        throw new AppError("Email ja cadastrado", 409);
      }

      user.email = email;
    }

    if (password && !old_password) {
      throw new AppError("Senha antiga nao informada");
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("Senha antiga nao confere");
      }

      user.password = await hash(password, 10);
    }

    if (name) {
      user.name = name;
    }

    await usersRepositories.save(user);

    return user;
  }
}
