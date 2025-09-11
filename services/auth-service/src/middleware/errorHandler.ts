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
    new winston.transports.File({ filename: "logs/error.log" })
  ],
});

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error({
    message: err.message || "Internal Server Error",
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.body,
    ip: req.ip,
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong!",
  });
};
