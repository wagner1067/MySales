import { hash } from "bcrypt";
import FakeUserRepository from "../domain/repositories/fakes/FakeUserRepositories";
import CreateUserService from "./CreateUserService";
import AppError from "@shared/errors/AppError";
import { userMock } from "../domain/factories/userFactory";

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

let fakeUserRepository: FakeUserRepository;
let createUserService: CreateUserService;

describe("CreateUserService", () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    createUserService = new CreateUserService(fakeUserRepository);
  });

  it("should be able to create a new user", async () => {
    (hash as jest.Mock).mockResolvedValue("hashed-password");

    const user = await createUserService.execute(userMock);
    expect(user).toHaveProperty("id");
    expect(user.name).toBe(userMock.name);
    expect(user.email).toBe(userMock.email);
  });

  it("should not be able to create a user with an existing email", async () => {
    await createUserService.execute(userMock);

    await expect(createUserService.execute(userMock)).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it("should hash the password before saving the user", async () => {
    const hashSpy = jest
      .spyOn(require("bcrypt"), "hash")
      .mockResolvedValue("hashed-password");

    await createUserService.execute(userMock);

    expect(hashSpy).toHaveBeenCalledWith(userMock.password, 8);
  });
});
