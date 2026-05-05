import { IPagination } from "@shared/interface/pagination.interface";
import { customerRepositories } from "../infra/database/repositories/CustomerRepositories";
import { Customers } from "../infra/database/entities/Customers";
import { IPaginationCustomer } from "../domain/models/IPaginationCustomer";

export default class ListCustomerService {
  async execute(
    page: number = 1,
    limit: number = 10,
  ): Promise<IPagination<Customers>> {
    const [data, total] = await customerRepositories.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });

    const totalPages = Math.ceil(total / limit);
    return {
      data,
      total,
      per_age: limit,
      current_page: page,
      total_pages: totalPages,
      next_page: page < totalPages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
    } as IPaginationCustomer;
  }
}
