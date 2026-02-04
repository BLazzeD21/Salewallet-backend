import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { verifyAuth } from "@/middlewares";

jest.mock("jsonwebtoken");

describe("verifyAuth middleware", () => {
  let request: Partial<Request>;
  let response: Partial<Response> & { status: jest.Mock; json: jest.Mock };
  let next: NextFunction;

  beforeEach(() => {
    request = { headers: {} };
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("returns 401 if Authorization header is missing", () => {
    verifyAuth(request as Request, response as Response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ message: "Token not found in headers" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 if Authorization header does not start with Bearer", () => {
    request.headers = { authorization: "Token xyz" };

    verifyAuth(request as Request, response as Response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ message: "Token not found in headers" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 if token is missing after Bearer", () => {
    request.headers = { authorization: "Bearer " };

    verifyAuth(request as Request, response as Response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ error: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 if token is invalid", () => {
    request.headers = { authorization: "Bearer invalid-token" };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    verifyAuth(request as Request, response as Response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ message: "Invalid or expired token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next and sets request.user if token is valid", () => {
    request.headers = { authorization: "Bearer valid-token" };
    (jwt.verify as jest.Mock).mockReturnValue({ sub: "user-id-123" });

    verifyAuth(request as Request, response as Response, next);

    expect(next).toHaveBeenCalled();
    expect(request.user).toEqual({ userId: "user-id-123" });
    expect(response.status).not.toHaveBeenCalled();
  });
});
