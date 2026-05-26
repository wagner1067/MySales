import { container } from "tsyringe";
import ListUserService from "./ListUsersService";
import { IUsersRepository } from "../domain/repositories/IUserRepositories";
import { mockPaginatedUsers } from "../domain/factories/userFactory";

const mockUsersRepository = {
  findAll: jest.fn(),
} as unknown as jest.Mocked<IUsersRepository>;

describe("ListUserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    container.registerInstance("UsersRepository", mockUsersRepository);
  });

  it("should be able to list the users", async () => {
    mockUsersRepository.findAll.mockResolvedValue(mockPaginatedUsers);

    const listUser = container.resolve(ListUserService);

    const users = await listUser.execute({
      page: 1,
      skip: 0,
      take: 10,
    });

    expect(users).toHaveProperty("per_page");
    expect(users).toHaveProperty("total");
    expect(users).toHaveProperty("current_page");
    expect(users).toHaveProperty("data");

    expect(mockUsersRepository.findAll).toHaveBeenCalledWith({
      page: 1,
      skip: 0,
      take: 10,
    });
  });
});
