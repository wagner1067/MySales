import { AppDataSource } from "@shared/typeorm/data-source";
import { Customers } from "../entities/Customers";

export const customerRepositories = AppDataSource.getRepository(
  Customers,
).extend({
  async findByname(name: string): Promise<Customers | null> {
    const customer = await this.findOneBy({ name });

    return customer;
  },

  async findById(id: number): Promise<Customers | null> {
    const customer = await this.findOneBy({ id });

    return customer;
  },

  async findByEmail(email: string): Promise<Customers | null> {
    const customer = await this.findOneBy({ email });

    return customer;
  },
});
