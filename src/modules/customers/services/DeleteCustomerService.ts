import AppError from "@shared/errors/AppError";
import { ICustomersRepository } from "../domain/repositories/ICustomersRepositories";

interface IDeleteCustomer {
  id: number;
}

export default class DeleteCustomerService {
  constructor(private readonly customerRepositories: ICustomersRepository) {}

  public async execute({ id }: IDeleteCustomer): Promise<void> {
    const customer = await this.customerRepositories.findById(id);

    if (!customer) {
      throw new AppError("Cliente nao encontrado", 404);
    }
    await this.customerRepositories.remove(customer);
  }
}
