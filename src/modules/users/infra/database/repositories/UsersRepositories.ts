import { IPaginateUser } from "@modules/users/domain/models/IPaginateUser";
import { Repository } from "typeorm";
import { AppDataSource } from "@shared/infra/typeorm/data-source";
import { User } from "../entities/User";
import { ICreateUSer } from "@modules/users/domain/models/ICreateUser";
import { IUser } from "@modules/users/domain/models/IUser";
import { IUsersRepository } from "@modules/users/domain/repositories/IUserRepositories";

export type SearchParams = {
  page: number;
  skip: number;
  take: number;
};

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(User);
  }

  public async create({ name, email, password }: ICreateUSer): Promise<IUser> {
    const user = this.ormRepository.create({ name, email, password });

    await this.ormRepository.save(user);

    return user as IUser;
  }

  public async save(user: User): Promise<void> {
    await this.ormRepository.save(user);
  }

  public async findAll({
    page,
    skip,
    take,
  }: SearchParams): Promise<IPaginateUser> {
    const [users, count] = await this.ormRepository
      .createQueryBuilder()
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const result = {
      per_page: take,
      total: count,
      current_page: page,
      data: users,
    };

    return result as IPaginateUser;
  }

  public async findByName(name: string): Promise<IUser | null> {
    const user = await this.ormRepository.findOneBy({
      name,
    });

    return user as IUser;
  }

  public async findById(id: number): Promise<IUser | null> {
    const user = await this.ormRepository.findOneBy({
      id,
    });

    return user as IUser;
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.ormRepository.findOneBy({
      email,
    });

    return user as IUser;
  }
}

export default UsersRepository;
