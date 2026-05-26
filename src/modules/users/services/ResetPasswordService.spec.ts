import { container } from "tsyringe";
import { IUsersRepository } from "../domain/repositories/IUserRepositories";
import { IUserTokensRepository } from "../domain/repositories/IUserTokensRepository";
import { IUser } from "../domain/models/IUser";
import ResetPasswordService from "./ResetPasswordService";
import AppError from "@shared/errors/AppError";
import { userFake, userTokenFake } from "../domain/factories/userFactory";

const mockUsersRepository = {
  findById: jest.fn(),
  save: jest.fn(),
} as unknown as jest.Mocked<IUsersRepository>;

const mockUserTokensRepository = {
  findByToken: jest.fn(),
} as unknown as jest.Mocked<IUserTokensRepository>;

jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password_mock"),
}));

describe("ResetPasswordService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    container.registerInstance("UsersRepository", mockUsersRepository);
    container.registerInstance(
      "UserTokensRepository",
      mockUserTokensRepository,
    );
  });

  it("should be able to reset the password", async () => {
    mockUserTokensRepository.findByToken.mockResolvedValue(
      userTokenFake as any,
    );
    mockUsersRepository.findById.mockResolvedValue(userFake);
    mockUsersRepository.save.mockResolvedValue(undefined);
    const resetPassword = container.resolve(ResetPasswordService);

    await expect(
      resetPassword.execute({
        token: "valid-token",
        password: "new_password_123",
      }),
    ).resolves.not.toThrow();

    expect(mockUsersRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        password: "hashed_password_mock",
      }),
    );
  });

  it("should not be able to reset password with a non-existing token", async () => {
    mockUserTokensRepository.findByToken.mockResolvedValue(null);

    const resetPassword = container.resolve(ResetPasswordService);

    await expect(
      resetPassword.execute({
        token: "invalid-token",
        password: "any_password",
      }),
    ).rejects.toEqual(new AppError("User token not exists.", 404));
  });

  it("should not be able to reset password with a non-existing user", async () => {
    mockUserTokensRepository.findByToken.mockResolvedValue(
      userTokenFake as any,
    );

    mockUsersRepository.findById.mockResolvedValue(null);

    const resetPassword = container.resolve(ResetPasswordService);

    await expect(
      resetPassword.execute({
        token: "valid-token",
        password: "any_password",
      }),
    ).rejects.toEqual(new AppError("User not exists.", 404));
  });

  it("should not be able to reset password if the token is expired", async () => {
    const threeHoursAgo = new Date();
    threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);

    const expiredTokenFake = {
      id: "token-id",
      token: "expired-token",
      user_id: "user-id",
      created_at: threeHoursAgo,
    };

    const userFake = {
      id: "user-id",
      email: "user@example.com",
    } as unknown as IUser;

    mockUserTokensRepository.findByToken.mockResolvedValue(
      expiredTokenFake as any,
    );
    mockUsersRepository.findById.mockResolvedValue(userFake);

    const resetPassword = container.resolve(ResetPasswordService);

    await expect(
      resetPassword.execute({
        token: "expired-token",
        password: "any_password",
      }),
    ).rejects.toEqual(new AppError("Token expired.", 401));
  });
});
