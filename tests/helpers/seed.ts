import { randomUUID } from "crypto";
import request from "supertest";
import { Express } from "express";

interface CreateCustomerData {
  name: string;
  email: string;
}

interface CreateProductData {
  name: string;
  price: number;
  quantity: number;
}

export async function createCustomerViaApi(
  app: Express,
  token: string,
  data?: Partial<CreateCustomerData>,
) {
  const response = await request(app)
    .post("/customers")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: data?.name ?? "Order Customer",
      email: data?.email ?? `customer-${randomUUID()}@example.com`,
    });

  return response.body;
}

export async function createProductViaApi(
  app: Express,
  data?: Partial<CreateProductData>,
) {
  const response = await request(app).post("/products").send({
    name: data?.name ?? `Product ${randomUUID()}`,
    price: data?.price ?? 100,
    quantity: data?.quantity ?? 10,
  });

  return response.body;
}
