import request from "supertest";
import { Express } from "express";
import { authenticate } from "../helpers/authenticate";
import {
  cleanupDatabase,
  setupIntegrationTest,
} from "../helpers/setupIntegrationTest";
import { createCustomerViaApi, createProductViaApi } from "../helpers/seed";

describe("Orders Integration Tests", () => {
  let app: Express;

  beforeAll(async () => {
    app = await setupIntegrationTest();
  });

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe("Create Order", () => {
    it("should be able to create a new order", async () => {
      const token = await authenticate(app);
      const customer = await createCustomerViaApi(app, token);
      const product = await createProductViaApi(app, {
        name: "Order Product",
        price: 100,
        quantity: 10,
      });

      const response = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${token}`)
        .send({
          customer_id: String(customer.id),
          products: [{ id: product.id, quantity: 2 }],
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body.customer.id).toBe(customer.id);
      expect(response.body.order_products).toHaveLength(1);
      expect(response.body.order_products[0].quantity).toBe(2);

      const updatedProduct = await request(app).get(`/products/${product.id}`);

      expect(updatedProduct.body.quantity).toBe(8);
    });

    it("should not be able to create an order with a non-existing customer", async () => {
      const token = await authenticate(app);
      const product = await createProductViaApi(app);

      const response = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${token}`)
        .send({
          customer_id: "99999",
          products: [{ id: product.id, quantity: 1 }],
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        "Could not find any customer with the given id.",
      );
    });

    it("should not be able to create an order with a non-existing product", async () => {
      const token = await authenticate(app);
      const customer = await createCustomerViaApi(app, token);

      const response = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${token}`)
        .send({
          customer_id: String(customer.id),
          products: [{ id: "99999", quantity: 1 }],
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        "Could not find any products with the given ids.",
      );
    });

    it("should not be able to create an order with insufficient stock", async () => {
      const token = await authenticate(app);
      const customer = await createCustomerViaApi(app, token);
      const product = await createProductViaApi(app, {
        name: "Low Stock Product",
        price: 50,
        quantity: 2,
      });

      const response = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${token}`)
        .send({
          customer_id: String(customer.id),
          products: [{ id: product.id, quantity: 5 }],
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toContain("The quantity is not available");
    });

    it("should not be able to create an order without authentication", async () => {
      const response = await request(app)
        .post("/orders")
        .send({
          customer_id: "1",
          products: [{ id: "1", quantity: 1 }],
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "JWT token is missing");
    });
  });

  describe("Show Order", () => {
    it("should be able to show a specific order", async () => {
      const token = await authenticate(app);
      const customer = await createCustomerViaApi(app, token);
      const product = await createProductViaApi(app);

      const createResponse = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${token}`)
        .send({
          customer_id: String(customer.id),
          products: [{ id: product.id, quantity: 1 }],
        });

      const orderId = createResponse.body.id;

      const response = await request(app)
        .get(`/orders/${orderId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(orderId);
      expect(response.body.customer.id).toBe(customer.id);
    });

    it("should not be able to show a non-existing order", async () => {
      const token = await authenticate(app);

      const response = await request(app)
        .get("/orders/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Order not found.");
    });

    it("should not be able to show an order without authentication", async () => {
      const response = await request(app).get("/orders/1");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "JWT token is missing");
    });
  });
});
