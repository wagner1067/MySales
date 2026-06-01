import { Customers } from "@modules/customers/infra/database/entities/Customers";

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