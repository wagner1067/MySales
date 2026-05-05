import { User } from "../infra/database/entities/User";
import { usersRepositories } from "../infra/database/repositories/UsersRepositories";

export default class ListUsersService {
  async execute(): Promise<User[]> {
    const users = await usersRepositories.find();
    return users;
  }
}
