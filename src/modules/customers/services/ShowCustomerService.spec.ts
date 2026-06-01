import AppError from "@shared/errors/AppError";
import ShowCustomerService from "./ShowCustomerService"; 
import { ICustomersRepository } from "../domain/repositories/ICustomersRepositories";
import { fakeCustomer } from "../domain/factories/customerFactory";

describe("ShowCustomerService", () => {
  let mockCustomersRepository: jest.Mocked<ICustomersRepository>;
  let showCustomerService: ShowCustomerService;

  beforeEach(() => {
    mockCustomersRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<ICustomersRepository>;

    showCustomerService = new ShowCustomerService(mockCustomersRepository);
  });

  it("should be able to show the details of a specific customer", async () => {

    mockCustomersRepository.findById.mockResolvedValue(fakeCustomer);

    const customer = await showCustomerService.execute({ id: 1 });

    expect(mockCustomersRepository.findById).toHaveBeenCalledWith(1); 
    expect(customer).toEqual(fakeCustomer); 
    expect(customer.name).toBe("John Doe");
  });

  it("should not be able to show a non-existing customer", async () => {
    mockCustomersRepository.findById.mockResolvedValue(null);

    await expect(
      showCustomerService.execute({ id: 999 })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await showCustomerService.execute({ id: 999 });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).message).toBe("Cliente nao encontrado");
      expect((error as AppError).statusCode).toBe(404);
    }
  });
});