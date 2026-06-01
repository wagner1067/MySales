import AppError from "@shared/errors/AppError";
import DeleteCustomerService from "./DeleteCustomerService";
import { ICustomersRepository } from "../domain/repositories/ICustomersRepositories";
import { fakeCustomer } from "../domain/factories/customerFactory";

describe("DeleteCustomerService", () => {
  let mockCustomersRepository: jest.Mocked<ICustomersRepository>;
  let deleteCustomerService: DeleteCustomerService;

  beforeEach(() => {
   
    mockCustomersRepository = {
      findById: jest.fn(),
      remove: jest.fn(),
    
    } as unknown as jest.Mocked<ICustomersRepository>;

    
    deleteCustomerService = new DeleteCustomerService(mockCustomersRepository);
  });

  it("should be able to delete a customer", async () => {

   
    mockCustomersRepository.findById.mockResolvedValue(fakeCustomer as any);
    mockCustomersRepository.remove.mockResolvedValue(undefined as any);

    await deleteCustomerService.execute({ id: 1 });

   
    expect(mockCustomersRepository.findById).toHaveBeenCalledWith(1);
    expect(mockCustomersRepository.remove).toHaveBeenCalledWith(fakeCustomer);
  });

  it("should not be able to delete a non-existing customer", async () => {
   
    mockCustomersRepository.findById.mockResolvedValue(null);

  
    await expect(
      deleteCustomerService.execute({ id: 999 })
    ).rejects.toBeInstanceOf(AppError);

   
    try {
      await deleteCustomerService.execute({ id: 999 });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).message).toBe("Customer nao encontrado");
      expect((error as AppError).statusCode).toBe(404);
    }

    
    expect(mockCustomersRepository.remove).not.toHaveBeenCalled();
  });
});