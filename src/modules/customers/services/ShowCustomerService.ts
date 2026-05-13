import AppError from "@shared/errors/AppError";
import { Customers } from "../infra/database/entities/Customers";
import { IShowCustomer } from "../domain/models/IShowCustomer";
import { ICustomersRepository } from "../domain/repositories/ICustomersRepositories";
import { inject, injectable } from "tsyringe";

@injectable()
export default class ShowCustomerService {
  constructor(
    @inject("CustomersRepository")
    private readonly customerRepositories: ICustomersRepository,
  ) {}

  public async execute({ id }: IShowCustomer): Promise<Customers> {
    const customer = await this.customerRepositories.findById(id);
    if (!customer) {
      throw new AppError("Cliente nao encontrado", 404);
    }
    return customer;
  }
}
