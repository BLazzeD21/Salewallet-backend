import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyAuth = (request: Request, response: Response, next: NextFunction) => {
  const header = request.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return response.status(401).json({ message: "Token not found in headers" });
  }

  const accessToken = header.split(" ")[1];

  if (!accessToken) {
    return response.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(accessToken, process.env.AUTH_SECRET);

    request.user = {
      id: payload.sub as string,
    };

    next();
  } catch {
    return response.status(401).json({ message: "Invalid or expired token" });
  }
};
