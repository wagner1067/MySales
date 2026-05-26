import { container } from "tsyringe";
import { IUsersRepository } from "../domain/repositories/IUserRepositories";
import { User } from "../infra/database/entities/User";
import { userFake, userWithAvatarFake } from "../domain/factories/userFactory";
import AppError from "@shared/errors/AppError";
import fs from "fs";
import UpdateUserAvatarService from "./UpdateUserAvatarService";

jest.mock("fs", () => {
  const originalFs = jest.requireActual("fs");
  return {
    ...originalFs,
    promises: {
      ...originalFs.promises,
      stat: jest.fn(),
      unlink: jest.fn(),
    },
  };
});

const mockUsersRepository = {
  findById: jest.fn(),
  save: jest.fn(),
} as unknown as jest.Mocked<IUsersRepository>;

describe("UpdateUserAvatarService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    container.registerInstance("UsersRepository", mockUsersRepository);
  });

  it("should be able to update user avatar", async () => {
    mockUsersRepository.findById.mockResolvedValue(userFake);
    mockUsersRepository.save.mockResolvedValue(undefined);

    const updateAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateAvatar.execute({
      userId: 1,
      avatarFileName: "new_avatar.jpg",
    });

    expect(user.avatar).toBe("new_avatar.jpg");
    expect(mockUsersRepository.save).toHaveBeenCalledWith(userFake);
  });

  it("should not be able to update avatar of a non-existing user", async () => {
    mockUsersRepository.findById.mockResolvedValue(null);

    const updateAvatar = container.resolve(UpdateUserAvatarService);

    await expect(
      updateAvatar.execute({
        userId: 999,
        avatarFileName: "avatar.jpg",
      }),
    ).rejects.toEqual(new AppError("User not found.", 404));
  });

  it("should delete old avatar when updating to a new one", async () => {
    mockUsersRepository.findById.mockResolvedValue(userWithAvatarFake);
    mockUsersRepository.save.mockResolvedValue(undefined);

    (fs.promises.stat as jest.Mock).mockResolvedValue(true);

    (fs.promises.unlink as jest.Mock).mockResolvedValue(undefined);

    const updateAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateAvatar.execute({
      userId: 1,
      avatarFileName: "new_avatar.jpg",
    });

    expect(fs.promises.stat).toHaveBeenCalled();
    expect(fs.promises.unlink).toHaveBeenCalled();

    expect(user.avatar).toBe("new_avatar.jpg");
    expect(mockUsersRepository.save).toHaveBeenCalledWith(userWithAvatarFake);
  });
});
