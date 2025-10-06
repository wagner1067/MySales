import AppError from "@shared/errors/AppError";
import { Request, Response, NextFunction } from "express";

export default class ErrorHandleMiddleware {
  public static handleError(
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        type: "error",
        message: error.message,
      });
    }
    return res.status(500).json({
      type: "error",
      message: "Internal server error",
    });
  }
}
