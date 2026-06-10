import request from "supertest";
import { Express } from "express";
import { authenticate } from "../helpers/authenticate";
import {
  cleanupDatabase,
  setupIntegrationTest,
  teardownIntegrationTest,
} from "../helpers/setupIntegrationTest";

describe("Users Integration Tests", () => {
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
        email: "duplicate@example.com",
        password: "123456",
      });

      const response = await request(app).post("/users").send({
        name: "Jane Doe",
        email: "duplicate@example.com",
        password: "654321",
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        "message",
        "Email address already used.",
      );
    });
  });

  describe("Session", () => {
    it("should be able to authenticate with valid credentials", async () => {
      await request(app).post("/users").send({
        name: "Session User",
        email: "session@example.com",
        password: "123456",
      });

      const response = await request(app).post("/sessions").send({
        email: "session@example.com",
        password: "123456",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user.email).toBe("session@example.com");
    });

    it("should not be able to authenticate with wrong password", async () => {
      await request(app).post("/users").send({
        name: "Session User",
        email: "wrongpass@example.com",
        password: "123456",
      });

      const response = await request(app).post("/sessions").send({
        email: "wrongpass@example.com",
        password: "wrong-password",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        "message",
        "Incorrect email/password combination.",
      );
    });

    it("should not be able to authenticate with non-existing user", async () => {
      const response = await request(app).post("/sessions").send({
        email: "ghost@example.com",
        password: "123456",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        "message",
        "Incorrect email/password combination.",
      );
    });
  });

  describe("List Users", () => {
    it("should be able to list users with authentication", async () => {
      const token = await authenticate(app);

      await request(app).post("/users").send({
        name: "Listed User",
        email: "listed@example.com",
        password: "123456",
      });

      const response = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it("should not be able to list users without authentication", async () => {
      const response = await request(app).get("/users");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "JWT token is missing");
    });
  });

  describe("Profile", () => {
    it("should be able to show authenticated user profile", async () => {
      const email = "profile@example.com";

      await request(app).post("/users").send({
        name: "Profile User",
        email,
        password: "123456",
      });

      const session = await request(app).post("/sessions").send({
        email,
        password: "123456",
      });

      const response = await request(app)
        .get("/profiles")
        .set("Authorization", `Bearer ${session.body.token}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(email);
      expect(response.body.name).toBe("Profile User");
    });

    it("should be able to update authenticated user profile", async () => {
      const email = "updateprofile@example.com";

      await request(app).post("/users").send({
        name: "Old Name",
        email,
        password: "123456",
      });

      const session = await request(app).post("/sessions").send({
        email,
        password: "123456",
      });

      const response = await request(app)
        .patch("/profiles")
        .set("Authorization", `Bearer ${session.body.token}`)
        .send({
          name: "New Name",
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("New Name");
      expect(response.body.email).toBe(email);
    });

    it("should not be able to show profile without authentication", async () => {
      const response = await request(app).get("/profiles");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "JWT token is missing");
    });
  });
});
