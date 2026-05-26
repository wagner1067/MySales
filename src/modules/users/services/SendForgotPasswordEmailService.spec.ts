import { sendEmail } from "@config/email";
import { IUsersRepository } from "../domain/repositories/IUserRepositories";
import { IUserTokensRepository } from "../domain/repositories/IUserTokensRepository";
import { container } from "tsyringe";
import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";
import AppError from "@shared/errors/AppError";
import { userFake, userTokenFake } from "../domain/factories/userFactory";
jest.mock("@config/email", () => ({
  sendEmail: jest.fn(),
}));

const mockUsersRepository = {
  findByEmail: jest.fn(),
} as unknown as jest.Mocked<IUsersRepository>;

const mockUserTokensRepository = {
  generate: jest.fn(),
} as unknown as jest.Mocked<IUserTokensRepository>;

describe("SendForgotPasswordEmailService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    container.registerInstance("UsersRepository", mockUsersRepository);
    container.registerInstance(
      "UserTokensRepository",
      mockUserTokensRepository,
    );
  });

  it("should be able to send a forgot password email", async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(userFake);

    mockUserTokensRepository.generate.mockResolvedValue(userTokenFake as any);

    const sendForgotPasswordEmail = container.resolve(
      SendForgotPasswordEmailService,
    );

    await expect(
      sendForgotPasswordEmail.execute({
        email: "john@example.com",
      }),
    ).resolves.not.toThrow();

    expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
      "john@example.com",
    );

    expect(mockUserTokensRepository.generate).toHaveBeenCalledWith(
      "user-id-123",
    );

    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "john@example.com",
        subject: "My Sales Recovery Password",
        body: expect.stringContaining("generated-token-123"),
      }),
    );
  });

  it("should not be able to send email if user does not exist", async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(null);

    const sendForgotPasswordEmail = container.resolve(
      SendForgotPasswordEmailService,
    );

    await expect(
      sendForgotPasswordEmail.execute({
        email: "non-existing@example.com",
      }),
    ).rejects.toEqual(new AppError("User not exists.", 404));

    expect(mockUserTokensRepository.generate).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
