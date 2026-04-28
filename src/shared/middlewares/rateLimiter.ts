import AppError from "@shared/errors/AppError";
import { Request, Response, NextFunction } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis"; // Mudamos para ioredis

// O ioredis conecta automaticamente
const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASS || undefined,
  // Opção importante para evitar erros durante reconexão
  enableOfflineQueue: false,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "ratelimit",
  points: 10, // 5 requisições permitidas por segundo
  duration: 5, // Período de 5 segundos para resetar os pontos
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const key = request.ip || "127.0.0.1";

    await limiter.consume(key);

    return next();
  } catch (err: any) {
    if (err.remainingPoints !== undefined) {
      throw new AppError("Too many requests", 429);
    }

    console.error("Rate Limiter Técnico:", err.message || err);
    return next();
  }
}
