import type { Request, Response, NextFunction } from "express";
import winston from "winston";

const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    // You can add file transport if needed
    new winston.transports.File({ filename: 'error.log' })
  ],
});

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error({
    message: err.message || err,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
  });
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: err,
  });
};
