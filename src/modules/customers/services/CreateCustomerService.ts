import AppError from "@shared/errors/AppError";
import { Customers } from "../infra/database/entities/Customers";
import { ICreateCustomer } from "../domain/models/ICreateUser";
import { ICustomersRepository } from "../domain/repositories/ICustomersRepositories";

export default class CreateCustomerService {
  constructor(private readonly customerRepositories: ICustomersRepository) {}

  public async execute({ name, email }: ICreateCustomer): Promise<Customers> {
    const emailExists = await this.customerRepositories.findByEmail(email);

    if (emailExists) {
      throw new AppError("Email colocado ja esta em uso.", 409);
    }

    const customer = await this.customerRepositories.create({
      name,
      email,
    });

    return customer;
  }
}
