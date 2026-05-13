import AppError from "@shared/errors/AppError";
import { ICustomersRepository } from "../domain/repositories/ICustomersRepositories";
import { inject, injectable } from "tsyringe";

interface IDeleteCustomer {
  id: number;
}

@injectable()
export default class DeleteCustomerService {
  constructor(
    @inject("CustomersRepository")
    private readonly customerRepositories: ICustomersRepository,
  ) {}

  public async execute({ id }: IDeleteCustomer): Promise<void> {
    const customer = await this.customerRepositories.findById(id);

    if (!customer) {
      throw new AppError("Customer nao encontrado", 404);
    }
    await this.customerRepositories.remove(customer);
  }
}
