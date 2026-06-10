import "reflect-metadata";
import { AppDataSource } from "../src/shared/infra/typeorm/data-source";

export default async function globalTeardown(): Promise<void> {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
}
