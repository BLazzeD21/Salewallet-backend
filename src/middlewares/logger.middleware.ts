import type { NextFunction, Request, Response } from "express";

import { logger } from "@/config";

export const loggerMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const start = Date.now();

  const originalSend = response.send;
  const originalJson = response.json;

  response.send = function (...args) {
    response.__loggedStatus = response.statusCode;
    return originalSend.apply(this, args);
  };

  response.json = function (...args) {
    response.__loggedStatus = response.statusCode;
    return originalJson.apply(this, args);
  };

  response.on("finish", () => {
    let ip = request.ip;
    if (ip.startsWith("::ffff:")) ip = ip.replace("::ffff:", "");

    const status = response.__loggedStatus || response.statusCode || 200;

    logger.info({
      method: request.method,
      url: request.originalUrl,
      status,
      duration: `${Date.now() - start}ms`,
      ip,
    });
  });

  next();
};
