import AppError from "@shared/errors/AppError";
import { customerRepositories } from "../database/repositories/CustomerRepositories";

interface IDeleteCustomer {
  id: number;
}

export default class DeleteCustomerService {
  public async execute({ id }: IDeleteCustomer): Promise<void> {
    const customer = await customerRepositories.findById(id);

    if (!customer) {
      throw new AppError("Cliente nao encontrado", 404);
    }
    await customerRepositories.remove(customer);
  }
}
