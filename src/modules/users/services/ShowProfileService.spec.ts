import { container } from "tsyringe";
import { IUsersRepository } from "../domain/repositories/IUserRepositories";
import { userFake } from "../domain/factories/userFactory";
import ShowProfileService from "./ShowProfileService";
import AppError from "@shared/errors/AppError";

const mockUsersRepository = {
  findById: jest.fn(),
} as unknown as jest.Mocked<IUsersRepository>;

describe("ShowProfileService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    container.registerInstance("UsersRepository", mockUsersRepository);
  });

  it("should be able to show the user profile", async () => {
    mockUsersRepository.findById.mockResolvedValue(userFake);

    const showProfile = container.resolve(ShowProfileService);

    const profile = await showProfile.execute({
      user_id: 1,
    });

    expect(profile).toHaveProperty("id");
    expect(profile.name).toBe("John Doe");
    expect(profile.email).toBe("john@example.com");
    expect(mockUsersRepository.findById).toHaveBeenCalledWith(1);
  });

  it("should not be able to show the profile of a non-existing user", async () => {
    mockUsersRepository.findById.mockResolvedValue(null);

    const showProfile = container.resolve(ShowProfileService);

    await expect(
      showProfile.execute({
        user_id: 999,
      }),
    ).rejects.toEqual(new AppError("User not found.", 404));

    expect(mockUsersRepository.findById).toHaveBeenCalledWith(999);
  });
});
