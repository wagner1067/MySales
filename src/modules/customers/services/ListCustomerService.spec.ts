import ListCustomerService from "./ListCustomerService"; 
import { ICustomersRepository } from "../domain/repositories/ICustomersRepositories";
import { Customers } from "../infra/database/entities/Customers";

describe("ListCustomerService", () => {
  let mockCustomersRepository: jest.Mocked<ICustomersRepository>;
  let listCustomerService: ListCustomerService;

  const fakeCustomers = [
    { id: 1, name: "Customer 1", email: "c1@mail.com" },
    { id: 2, name: "Customer 2", email: "c2@mail.com" },
  ] as Customers[];

  beforeEach(() => {
    mockCustomersRepository = {
      findAndCount: jest.fn(),
    } as unknown as jest.Mocked<ICustomersRepository>;

    listCustomerService = new ListCustomerService(mockCustomersRepository);
  });

  it("should be able to list customers with pagination (first page)", async () => {
    mockCustomersRepository.findAndCount.mockResolvedValue([fakeCustomers, 15]);

    const result = await listCustomerService.execute(1, 2);

    expect(mockCustomersRepository.findAndCount).toHaveBeenCalledWith({
      take: 2,
      skip: 0,
    });

    expect(result.data).toEqual(fakeCustomers);
    expect(result.total).toBe(15);
    expect(result.current_page).toBe(1);
    expect(result.total_pages).toBe(8); 
    expect(result.next_page).toBe(2);   
    expect(result.prev_page).toBeNull();
  });

  it("should calculate correct next and previous pages when on a middle page", async () => {
    mockCustomersRepository.findAndCount.mockResolvedValue([fakeCustomers, 15]);

    const result = await listCustomerService.execute(2, 5);

    expect(mockCustomersRepository.findAndCount).toHaveBeenCalledWith({
      take: 5,
      skip: 5,
    });

    expect(result.current_page).toBe(2);
    expect(result.total_pages).toBe(3); 
    expect(result.next_page).toBe(3);
    expect(result.prev_page).toBe(1);  
  });

  it("should return next_page as null when on the last page", async () => {
    mockCustomersRepository.findAndCount.mockResolvedValue([fakeCustomers, 15]);

    const result = await listCustomerService.execute(3, 5);

    expect(result.current_page).toBe(3);
    expect(result.total_pages).toBe(3);
    expect(result.next_page).toBeNull(); 
    expect(result.prev_page).toBe(2);  
  });

  it("should use default parameters when page and limit are not provided", async () => {
    mockCustomersRepository.findAndCount.mockResolvedValue([fakeCustomers, 2]);

    await listCustomerService.execute();

    expect(mockCustomersRepository.findAndCount).toHaveBeenCalledWith({
      take: 10,
      skip: 0,
    });
  });
});