import request from "supertest";
import { Express } from "express";
import { authenticate } from "../helpers/authenticate";
import {
  cleanupDatabase,
  setupIntegrationTest,
  teardownIntegrationTest,
} from "../helpers/setupIntegrationTest";

describe("Integration Tests", () => {
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

  describe("Create User", () => {
    it("should be able to create a new user", async () => {
      const response = await request(app).post("/users").send({
        name: "John Doe",
        email: "jhondoe@example.com",
        password: "123456",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body.email).toBe("jhondoe@example.com");
    });

    it("should not be able to create a user with an existing email", async () => {
      await request(app).post("/users").send({
        name: "John Doe",
        email: "jhondoeduplicate@example.com",
        password: "123456",
      });

      const response = await request(app).post("/users").send({
        name: "Jane Doe",
        email: "jhondoeduplicate@example.com",
        password: "654321",
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        "message",
        "Email address already used.",
      );
    });
  });

  describe("Create Customer", () => {
    it("should be able to create a new customer", async () => {
      const token = await authenticate(app);

      const response = await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "John Doe",
          email: "customer@example.com",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe("John Doe");
      expect(response.body.email).toBe("customer@example.com");
    });

    it("should not be able to create a customer with an existing email", async () => {
      const token = await authenticate(app);

      await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "John Doe",
          email: "duplicate@example.com",
        });

      const response = await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Jane Doe",
          email: "duplicate@example.com",
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        "message",
        "Email colocado ja esta em uso.",
      );
    });

    it("should not be able to create a customer without authentication", async () => {
      const response = await request(app).post("/customers").send({
        name: "John Doe",
        email: "customer@example.com",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "JWT token is missing");
    });
  });

  describe("List Customers", () => {
    it("should be able to list customers with pagination", async () => {
      const token = await authenticate(app);

      await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Customer 1", email: "c1@example.com" });

      await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Customer 2", email: "c2@example.com" });

      const response = await request(app)
        .get("/customers?page=1&limit=10")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.total).toBe(2);
      expect(response.body.current_page).toBe(1);
      expect(response.body.per_age).toBe(10);
      expect(response.body.total_pages).toBe(1);
      expect(response.body.next_page).toBeNull();
      expect(response.body.prev_page).toBeNull();
    });

    it("should return an empty list when there are no customers", async () => {
      const token = await authenticate(app);

      const response = await request(app)
        .get("/customers")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });

    it("should not be able to list customers without authentication", async () => {
      const response = await request(app).get("/customers");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "JWT token is missing");
    });
  });

  describe("Show Customer", () => {
    it("should be able to show the details of a specific customer", async () => {
      const token = await authenticate(app);

      const createResponse = await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "John Doe",
          email: "show@example.com",
        });

      const customerId = createResponse.body.id;

      const response = await request(app)
        .get(`/customers/${customerId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(customerId);
      expect(response.body.name).toBe("John Doe");
      expect(response.body.email).toBe("show@example.com");
    });

    it("should not be able to show a non-existing customer", async () => {
      const token = await authenticate(app);

      const response = await request(app)
        .get("/customers/999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Cliente nao encontrado");
    });

    it("should not be able to show a customer without authentication", async () => {
      const response = await request(app).get("/customers/1");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "JWT token is missing");
    });
  });

  describe("Update Customer", () => {
    it("should be able to update a customer", async () => {
      const token = await authenticate(app);

      const createResponse = await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "John Doe",
          email: "update@example.com",
        });

      const customerId = createResponse.body.id;

      const response = await request(app)
        .patch(`/customers/${customerId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "John Updated",
          email: "updated@example.com",
        });

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(customerId);
      expect(response.body.name).toBe("John Updated");
      expect(response.body.email).toBe("updated@example.com");
    });

    it("should not be able to update a non-existing customer", async () => {
      const token = await authenticate(app);

      const response = await request(app)
        .patch("/customers/999")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Ghost",
          email: "ghost@example.com",
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Cliente nao encontrado");
    });

    it("should not be able to update customer email to one already in use", async () => {
      const token = await authenticate(app);

      await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Customer A",
          email: "a@example.com",
        });

      const createResponse = await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Customer B",
          email: "b@example.com",
        });

      const customerId = createResponse.body.id;

      const response = await request(app)
        .patch(`/customers/${customerId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Customer B",
          email: "a@example.com",
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("message", "Email ja cadastrado");
    });

    it("should not be able to update a customer without authentication", async () => {
      const response = await request(app).patch("/customers/1").send({
        name: "John Updated",
        email: "updated@example.com",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "JWT token is missing");
    });
  });

  describe("Delete Customer", () => {
    it("should be able to delete a customer", async () => {
      const token = await authenticate(app);

      const createResponse = await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "John Doe",
          email: "delete@example.com",
        });

      const customerId = createResponse.body.id;

      const deleteResponse = await request(app)
        .delete(`/customers/${customerId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(deleteResponse.status).toBe(204);

      const showResponse = await request(app)
        .get(`/customers/${customerId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(showResponse.status).toBe(404);
      expect(showResponse.body).toHaveProperty(
        "message",
        "Cliente nao encontrado",
      );
    });

    it("should not be able to delete a non-existing customer", async () => {
      const token = await authenticate(app);

      const response = await request(app)
        .delete("/customers/999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Customer nao encontrado");
    });

    it("should not be able to delete a customer without authentication", async () => {
      const response = await request(app).delete("/customers/1");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "JWT token is missing");
    });
  });
});
