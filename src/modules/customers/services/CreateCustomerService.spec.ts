import { customerMock } from "../domain/factories/customerFactory";
import "reflect-metadata";
import CreateCustomerService from "./CreateCustomerService";
import FakeCustomersRepository from "../domain/repositories/fakes/FakeCustomerRepositories";
import AppError from "@shared/errors/AppError";

let fakeCustomersRepository: FakeCustomersRepository;
let createCustomer: CreateCustomerService;

describe("CreateCustomerService", () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    createCustomer = new CreateCustomerService(fakeCustomersRepository);
  });

  it("should create a new customer", async () => {
    const customer = await createCustomer.execute(customerMock);

    expect(customer).toHaveProperty("id");
    expect(customer.name).toBe("John Doe");
    expect(customer.email).toBe("L1U8o@example.com");
  });

  it("should not create a customer with an existing email", async () => {
    await createCustomer.execute(customerMock);

    await expect(createCustomer.execute(customerMock)).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
