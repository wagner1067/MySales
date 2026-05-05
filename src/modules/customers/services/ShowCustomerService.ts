import AppError from "@shared/errors/AppError";
import { Customers } from "../infra/database/entities/Customers";
import { customerRepositories } from "../infra/database/repositories/CustomerRepositories";
import { IShowCustomer } from "../domain/models/IShowCustomer";

export default class ShowCustomerService {
  public async execute({ id }: IShowCustomer): Promise<Customers> {
    const customer = await customerRepositories.findById(id);
    if (!customer) {
      throw new AppError("Cliente nao encontrado", 404);
    }
    return customer;
  }
}
