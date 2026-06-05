import { AppDataSource } from "../../src/shared/infra/typeorm/data-source";
import appPromise from "../../src/shared/infra/http/server";
import request from "supertest";
import { Express } from "express";

describe("Create User", () => {
  let app: Express;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    app = await appPromise;
  });

  afterEach(async () => {
    if (AppDataSource.isInitialized) {
      const entities = AppDataSource.entityMetadatas;

      for (const entity of entities) {
        const repository = AppDataSource.getRepository(entity.name);
        await repository.query(`DELETE FROM ${entity.tableName}`);
      }
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

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
