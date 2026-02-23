import { Customers } from "../database/entities/Customers";
import { customerRepositories } from "../database/repositories/CustomerRepositories";

export default class ListCustomerService {
  async execute(): Promise<Customers[]> {
    const customers = await customerRepositories.find();
    return customers;
  }
}
