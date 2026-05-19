import "reflect-metadata";
import CreateCustomerService from "./CreateCustomerService";
import FakeCustomersRepository from "../domain/repositories/fakes/FakeCustomerRepositories";
import AppError from "@shared/errors/AppError";

describe("CreateCustomerService", () => {
  it("should create a new customer", async () => {
    const fakeCustomersRepository = new FakeCustomersRepository();
    const createCustomer = new CreateCustomerService(fakeCustomersRepository);

    const customer = await createCustomer.execute({
      name: "John Doe",
      email: "L1U8o@example.com",
    });

    expect(customer).toHaveProperty("id");
    expect(customer.name).toBe("John Doe");
    expect(customer.email).toBe("L1U8o@example.com");
  });

  it("should not create a customer with an existing email", async () => {
    const fakeCustomersRepository = new FakeCustomersRepository();
    const createCustomer = new CreateCustomerService(fakeCustomersRepository);

    await createCustomer.execute({
      name: "John Doe",
      email: "L1U8o@example.com",
    });

    await expect(
      createCustomer.execute({
        name: "John Doe",
        email: "L1U8o@example.com",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
