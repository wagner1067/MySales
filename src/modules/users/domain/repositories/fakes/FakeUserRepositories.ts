import { IUsersRepository } from "../IUserRepositories";
import { IUser } from "../../models/IUser";
import { IPaginateUser } from "../../models/IPaginateUser";
import { User } from "@modules/users/infra/database/entities/User";
import { ICreateUSer } from "../../models/ICreateUser";

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class FakeUserRepository implements IUsersRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<IUser | null> {
    return this.users.find((user) => user.email === email) as IUser;
  }

  public async create(userData: ICreateUSer): Promise<IUser> {
    const user = new User();

    user.id = this.users.length + 1;
    user.name = userData.name;
    user.email = userData.email;
    user.password = userData.password;

    this.users.push(user);

    return user as IUser;
  }

  public async save(user: User): Promise<void> {
    const findIndex = this.users.findIndex(
      (findUser) => findUser.email === user.email,
    );

    if (findIndex !== -1) {
      this.users[findIndex] = user;
    } else {
      this.users.push(user);
    }
  }

  findAll({
    page,
    skip,
    take,
  }: {
    page: number;
    skip: number;
    take: number;
  }): Promise<IPaginateUser> {
    throw new Error("Method not implemented.");
  }
  findByName(name: string): Promise<IUser | null> {
    throw new Error("Method not implemented.");
  }
  findById(id: number): Promise<IUser | null> {
    throw new Error("Method not implemented.");
  }
}

export default FakeUserRepository;
