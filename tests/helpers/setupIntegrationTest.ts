import { AppDataSource } from "../../src/shared/infra/typeorm/data-source";
import appPromise from "../../src/shared/infra/http/server";
import { Express } from "express";

export async function setupIntegrationTest(): Promise<Express> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  return appPromise;
}

export async function cleanupDatabase(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    return;
  }

  for (const entity of AppDataSource.entityMetadatas) {
    const repository = AppDataSource.getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.tableName}`);
  }
}

export async function teardownIntegrationTest(): Promise<void> {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
}
