import AppError from "@shared/errors/AppError";
import { Customers } from "../infra/database/entities/Customers";
import { IUpdateCustomer } from "../domain/models/IUpdateCustomer";
import { ICustomersRepository } from "../domain/repositories/ICustomersRepositories";
import { inject, injectable } from "tsyringe";

@injectable()
export default class UpdateCustomerService {
  constructor(
    @inject("CustomersRepository")
    private readonly customerRepositories: ICustomersRepository,
  ) {}

  public async execute({
    id,
    name,
    email,
  }: IUpdateCustomer): Promise<Customers> {
    const customer = await this.customerRepositories.findById(id);

    if (!customer) {
      throw new AppError("Cliente nao encontrado", 404);
    }

    const customerExists = await this.customerRepositories.findByEmail(email);

    if (customerExists && email !== customer.email) {
      throw new AppError("Email ja cadastrado", 409);
    }

    customer.name = name;
    customer.email = email;

    await this.customerRepositories.save(customer);

    return customer;
  }
}
