import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../domain/repositories/IUserRepositories";
import { IPaginateUser } from "../domain/models/IPaginateUser";
import { SearchParams } from "../infra/database/repositories/UsersRepositories";
@injectable()
class ListUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}
  public async execute({
    page,
    skip,
    take,
  }: SearchParams): Promise<IPaginateUser> {
    const users = this.usersRepository.findAll({ page, skip, take });
    return users;
  }
}

export default ListUserService;
