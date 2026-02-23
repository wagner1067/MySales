import AppError from "@shared/errors/AppError";
import { Customers } from "../database/entities/Customers";
import { customerRepositories } from "../database/repositories/CustomerRepositories";

interface IUpdateCustomer {
  id: number;
  name: string;
  email: string;
}

export default class UpdateCustomerService {
  public async execute({
    id,
    name,
    email,
  }: IUpdateCustomer): Promise<Customers> {
    const customer = await customerRepositories.findById(id);

    if (!customer) {
      throw new AppError("Cliente nao encontrado", 404);
    }

    const customerExists = await customerRepositories.findByEmail(email);

    if (customerExists && email !== customer.email) {
      throw new AppError("Email ja cadastrado", 409);
    }

    customer.name = name;
    customer.email = email;

    await customerRepositories.save(customer);

    return customer;
  }
}
