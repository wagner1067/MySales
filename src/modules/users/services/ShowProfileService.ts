import AppError from "@shared/errors/AppError";
import { IUsersRepository } from "../domain/repositories/IUserRepositories";
import { inject, injectable } from "tsyringe";
import { User } from "../infra/database/entities/User";

interface IRequest {
  user_id: number;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}
  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    return user;
  }
}

export default ShowProfileService;
