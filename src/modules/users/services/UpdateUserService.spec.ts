import { compare } from "bcrypt";
import { IUsersRepository } from "../domain/repositories/IUserRepositories";
import { container } from "tsyringe";
import UpdateProfileService from "./UpdateUserService";
import AppError from "@shared/errors/AppError";
import { User } from "../infra/database/entities/User";
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
  hash: jest.fn().mockResolvedValue("new_hashed_password"),
}));

const mockUsersRepository = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  save: jest.fn(),
} as unknown as jest.Mocked<IUsersRepository>;

describe("UpdateProfileService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    container.registerInstance("UsersRepository", mockUsersRepository);
  });

  it("should be able to update user profile information", async () => {
    const userFake = {
      id: 1,
      name: "Old Name",
      email: "old@example.com",
    } as unknown as User;

    mockUsersRepository.findById.mockResolvedValue(userFake);
    mockUsersRepository.findByEmail.mockResolvedValue(null);
    mockUsersRepository.save.mockResolvedValue(undefined);

    const updateProfile = container.resolve(UpdateProfileService);

    const updatedUser = await updateProfile.execute({
      user_id: 1,
      name: "John Doe",
      email: "john@example.com",
    });

    expect(updatedUser.name).toBe("John Doe");
    expect(updatedUser.email).toBe("john@example.com");
    expect(mockUsersRepository.save).toHaveBeenCalledWith(userFake);
  });

  it("should not be able to update profile if user does not exist", async () => {
    mockUsersRepository.findById.mockResolvedValue(null);

    const updateProfile = container.resolve(UpdateProfileService);

    await expect(
      updateProfile.execute({
        user_id: 999,
        name: "John Doe",
        email: "john@example.com",
      }),
    ).rejects.toEqual(new AppError("User not found."));
  });

  it("should not be able to update email to one that is already taken", async () => {
    const userFake = {
      id: 1,
      name: "User One",
      email: "user1@example.com",
    } as unknown as User;

    const anotherUserFake = {
      id: 2,
      name: "User Two",
      email: "taken@example.com",
    } as unknown as User;

    mockUsersRepository.findById.mockResolvedValue(userFake);

    mockUsersRepository.findByEmail.mockResolvedValue(anotherUserFake);

    const updateProfile = container.resolve(UpdateProfileService);

    await expect(
      updateProfile.execute({
        user_id: 1,
        name: "User One",
        email: "taken@example.com",
      }),
    ).rejects.toEqual(
      new AppError("There is already one user with this email.", 409),
    );
  });

  it("should not be able to update password without providing the old password", async () => {
    const userFake = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
    } as unknown as User;

    mockUsersRepository.findById.mockResolvedValue(userFake);
    mockUsersRepository.findByEmail.mockResolvedValue(null);

    const updateProfile = container.resolve(UpdateProfileService);

    await expect(
      updateProfile.execute({
        user_id: 1,
        name: "John Doe",
        email: "john@example.com",
        password: "new_password_123",
      }),
    ).rejects.toEqual(new AppError("Old password is required."));
  });

  it("should not be able to update password with wrong old password", async () => {
    const userFake = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "current_hashed_password",
    } as unknown as User;

    mockUsersRepository.findById.mockResolvedValue(userFake);
    mockUsersRepository.findByEmail.mockResolvedValue(null);

    (compare as jest.Mock).mockResolvedValue(false);

    const updateProfile = container.resolve(UpdateProfileService);

    await expect(
      updateProfile.execute({
        user_id: 1,
        name: "John Doe",
        email: "john@example.com",
        password: "new_password_123",
        old_password: "wrong_password",
      }),
    ).rejects.toEqual(new AppError("Old password does not match."));
  });

  it("should be able to update password when providing a valid old password", async () => {
    const userFake = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "current_hashed_password",
    } as unknown as User;

    mockUsersRepository.findById.mockResolvedValue(userFake);
    mockUsersRepository.findByEmail.mockResolvedValue(null);
    mockUsersRepository.save.mockResolvedValue(undefined);

    (compare as jest.Mock).mockResolvedValue(true);

    const updateProfile = container.resolve(UpdateProfileService);

    const updatedUser = await updateProfile.execute({
      user_id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "new_password_123",
      old_password: "correct_password",
    });

    expect(updatedUser.password).toBe("new_hashed_password");
    expect(mockUsersRepository.save).toHaveBeenCalledWith(userFake);
  });
});
