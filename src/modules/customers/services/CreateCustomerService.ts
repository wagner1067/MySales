import AppError from "@shared/errors/AppError";
import { Customers } from "../database/entities/Customers";
import { customerRepositories } from "../database/repositories/CustomerRepositories";

interface ICreateCustomer {
  name: string;
  email: string;
}

export default class CreateCustomerService {
  public async execute({ name, email }: ICreateCustomer): Promise<Customers> {
    const emailExists = await customerRepositories.findByEmail(email);

    if (emailExists) {
      throw new AppError("Email colocado ja esta em uso.", 409);
    }

    const customer = customerRepositories.create({
      name,
      email,
    });

    await customerRepositories.save(customer);

    return customer;
  }
}
