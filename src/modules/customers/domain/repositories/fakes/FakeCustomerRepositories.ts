import { Customers } from "@modules/customers/infra/database/entities/Customers";
import { ICreateCustomer } from "../../models/ICreateUser";
import { ICustomer } from "../../models/ICustomer";
import { ICustomersRepository, Pagination } from "../ICustomersRepositories";

export default class FakeCustomersRepository implements ICustomersRepository {
  private customers: Customers[] = [];

  public async create({ name, email }: ICreateCustomer): Promise<Customers> {
    const customer = new Customers();

    customer.id = this.customers.length + 1;
    customer.name = name;
    customer.email = email;

    this.customers.push(customer);

    return customer;
  }

  public async save(customer: Customers): Promise<Customers> {
    const findIndex = this.customers.findIndex(
      (findCustomer) => findCustomer.id === customer.id,
    );

    this.customers[findIndex] = customer;

    return customer;
  }

  public async remove(customer: Customers): Promise<void> {
    const index = this.customers.findIndex((c) => c.id === customer.id);
    if (index !== -1) {
      this.customers.splice(index, 1);
    }
  }

  public async findAll(): Promise<Customers[] | undefined> {
    return this.customers;
  }

  public async findByName(name: string): Promise<Customers[]> {
    const customers = this.customers.filter(
      (customer) => customer.name === name,
    );
    return customers;
  }

  public async findById(id: number): Promise<Customers | null> {
    const customer = this.customers.find((customer) => customer.id === id);
    return customer as Customers | null;
  }

  public async findByEmail(email: string): Promise<Customers | null> {
    const customer = this.customers.find(
      (customer) => customer.email === email,
    );
    return customer as Customers | null;
  }

  findAndCount(pagination: Pagination): Promise<[ICustomer[], number]> {
    throw new Error("Method not implemented.");
  }
}
