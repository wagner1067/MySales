import AppError from "@shared/errors/AppError";
import UpdateCustomerService from "./UpdateCustomerService"; 
import { ICustomersRepository } from "../domain/repositories/ICustomersRepositories";
import { Customers } from "../infra/database/entities/Customers";
import { anotherCustomer, currentCustomer } from "../domain/factories/customerFactory";

describe("UpdateCustomerService", () => {
  let mockCustomersRepository: jest.Mocked<ICustomersRepository>;
  let updateCustomerService: UpdateCustomerService;

  beforeEach(() => {
    mockCustomersRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<ICustomersRepository>;

    updateCustomerService = new UpdateCustomerService(mockCustomersRepository);
  });

  it("should be able to update a customer successfully", async () => {

    mockCustomersRepository.findById.mockResolvedValue(currentCustomer);
    mockCustomersRepository.findByEmail.mockResolvedValue(null);
    mockCustomersRepository.save.mockResolvedValue(currentCustomer);

    const updatedCustomer = await updateCustomerService.execute({
      id: 1,
      name: "John New Name",
      email: "john.new@example.com",
    });

    expect(mockCustomersRepository.findById).toHaveBeenCalledWith(1);
    expect(mockCustomersRepository.findByEmail).toHaveBeenCalledWith("john.new@example.com");
    expect(mockCustomersRepository.save).toHaveBeenCalledWith(currentCustomer);
    expect(updatedCustomer.name).toBe("John New Name");
    expect(updatedCustomer.email).toBe("john.new@example.com");
  });

  it("should not be able to update a non-existing customer", async () => {
    mockCustomersRepository.findById.mockResolvedValue(null);

    await expect(
      updateCustomerService.execute({
        id: 999,
        name: "Ghost Name",
        email: "ghost@example.com",
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await updateCustomerService.execute({ id: 999, name: "Ghost", email: "g@mail.com" });
    } catch (error) {
      expect((error as AppError).message).toBe("Cliente nao encontrado");
      expect((error as AppError).statusCode).toBe(404);
    }
  });

  it("should not be able to update customer email to an already used email by another customer", async () => {

    mockCustomersRepository.findById.mockResolvedValue(currentCustomer);
    mockCustomersRepository.findByEmail.mockResolvedValue(anotherCustomer);

    await expect(
      updateCustomerService.execute({
        id: 1,
        name: "John Changed",
        email: "jack.duplicate@example.com",
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await updateCustomerService.execute({
        id: 1,
        name: "John Changed",
        email: "jack.duplicate@example.com",
      });
    } catch (error) {
      expect((error as AppError).message).toBe("Email ja cadastrado");
      expect((error as AppError).statusCode).toBe(409);
    }

    expect(mockCustomersRepository.save).not.toHaveBeenCalled();
  });

  it("should be able to update customer details keeping their own email", async () => {
    const currentCustomer = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
  } as Customers;

    mockCustomersRepository.findById.mockResolvedValue(currentCustomer);
    mockCustomersRepository.findByEmail.mockResolvedValue(currentCustomer);
    mockCustomersRepository.save.mockResolvedValue(currentCustomer);

    const updatedCustomer = await updateCustomerService.execute({
      id: 1,
      name: "John Only Name Changed",
      email: "john@example.com",
    });

    expect(updatedCustomer.name).toBe("John Only Name Changed");
    expect(mockCustomersRepository.save).toHaveBeenCalled();
  });
});