import AppError from "@shared/errors/AppError";
import { Customers } from "../infra/database/entities/Customers";
import { customerRepositories } from "../infra/database/repositories/CustomerRepositories";
import { ICreateCustomer } from "../domain/models/ICreateUser";

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
