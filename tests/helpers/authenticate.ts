import { randomUUID } from "crypto";
import request from "supertest";
import { Express } from "express";

export async function authenticate(app: Express): Promise<string> {
  const email = `test-${randomUUID()}@example.com`;

  const createResponse = await request(app).post("/users").send({
    name: "Test User",
    email,
    password: "123456",
  });

  if (createResponse.status !== 200) {
    throw new Error(
      `Failed to create test user: ${JSON.stringify(createResponse.body)}`,
    );
  }

  const session = await request(app).post("/sessions").send({
    email,
    password: "123456",
  });

  if (!session.body.token) {
    throw new Error(
      `Failed to authenticate test user: ${JSON.stringify(session.body)}`,
    );
  }

  return session.body.token;
}
