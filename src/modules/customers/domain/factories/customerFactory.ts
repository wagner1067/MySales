import { Customers } from "@modules/customers/infra/database/entities/Customers";
import { ICreateCustomer } from "@modules/customers/domain/models/ICreateUser";

export const customerMock = {
  name: "John Doe",
  email: "L1U8o@example.com",
};

export const fakeCustomer = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
} as unknown as Customers;

export  const currentCustomer = {
  id: 1,
  name: "John Old Name",
  email: "john.old@example.com",
} as Customers;

export const anotherCustomer = {
  id: 2,
  name: "Jack Duplicate",
  email: "jack.duplicate@example.com",
} as Customers;

export const makeCustomerData = (overrides?: Partial<ICreateCustomer>): ICreateCustomer => {
  return {
    name: "Cliente Teste",
    email: "cliente@teste.com",
    ...overrides,
  };
};