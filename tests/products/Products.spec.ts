import request from "supertest";
import { Express } from "express";
import {
  cleanupDatabase,
  setupIntegrationTest,
  teardownIntegrationTest,
} from "../helpers/setupIntegrationTest";

describe("Products Integration Tests", () => {
  let app: Express;

  beforeAll(async () => {
    app = await setupIntegrationTest();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await teardownIntegrationTest();
  });

  describe("Create Product", () => {
    it("should be able to create a new product", async () => {
      const response = await request(app).post("/products").send({
        name: "Product Test",
        price: 100.5,
        quantity: 10,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe("Product Test");
      expect(Number(response.body.price)).toBe(100.5);
      expect(response.body.quantity).toBe(10);
    });

    it("should not be able to create a product with an existing name", async () => {
      await request(app).post("/products").send({
        name: "Duplicate Product",
        price: 50,
        quantity: 5,
      });

      const response = await request(app).post("/products").send({
        name: "Duplicate Product",
        price: 80,
        quantity: 3,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "There is already one product with this name",
      );
    });
  });

  describe("List Products", () => {
    it("should be able to list products", async () => {
      await request(app).post("/products").send({
        name: "Product A",
        price: 10,
        quantity: 5,
      });

      await request(app).post("/products").send({
        name: "Product B",
        price: 20,
        quantity: 8,
      });

      const response = await request(app).get("/products");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Show Product", () => {
    it("should be able to show a specific product", async () => {
      const createResponse = await request(app).post("/products").send({
        name: "Show Product",
        price: 35,
        quantity: 4,
      });

      const productId = createResponse.body.id;

      const response = await request(app).get(`/products/${productId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(productId);
      expect(response.body.name).toBe("Show Product");
    });

    it("should not be able to show a non-existing product", async () => {
      const response = await request(app).get("/products/99999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Product not found.");
    });
  });

  describe("Update Product", () => {
    it("should be able to update a product", async () => {
      const createResponse = await request(app).post("/products").send({
        name: "Update Product",
        price: 40,
        quantity: 6,
      });

      const productId = createResponse.body.id;

      const response = await request(app).put(`/products/${productId}`).send({
        name: "Updated Product",
        price: 55,
        quantity: 12,
      });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Updated Product");
      expect(Number(response.body.price)).toBe(55);
      expect(response.body.quantity).toBe(12);
    });

    it("should not be able to update a non-existing product", async () => {
      const response = await request(app).put("/products/99999").send({
        name: "Ghost Product",
        price: 10,
        quantity: 1,
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Product not found.");
    });
  });

  describe("Delete Product", () => {
    it("should be able to delete a product", async () => {
      const createResponse = await request(app).post("/products").send({
        name: "Delete Product",
        price: 15,
        quantity: 2,
      });

      const productId = createResponse.body.id;

      const deleteResponse = await request(app).delete(
        `/products/${productId}`,
      );

      expect(deleteResponse.status).toBe(204);

      const showResponse = await request(app).get(`/products/${productId}`);

      expect(showResponse.status).toBe(404);
      expect(showResponse.body).toHaveProperty("message", "Product not found.");
    });

    it("should not be able to delete a non-existing product", async () => {
      const response = await request(app).delete("/products/99999");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Product not found.");
    });
  });
});
