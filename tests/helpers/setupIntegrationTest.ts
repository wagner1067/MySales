import Redis from "ioredis";
import cacheConfig from "../../src/config/cache";
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

  const tableNames = AppDataSource.entityMetadatas
    .map((entity) => `"${entity.tableName}"`)
    .join(", ");

  if (tableNames.length > 0) {
    await AppDataSource.query(
      `TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE`,
    );
  }

  await clearRedisCache();
}

async function clearRedisCache(): Promise<void> {
  const client = new Redis(cacheConfig.config.redis);

  try {
    await client.flushdb();
  } finally {
    await client.quit();
  }
}

export async function teardownIntegrationTest(): Promise<void> {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
}
