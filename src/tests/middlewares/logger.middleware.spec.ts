import type { NextFunction, Request, Response } from "express";

import { logger } from "@/config";

import { loggerMiddleware } from "@/middlewares/logger.middleware";

jest.mock("@/config", () => ({
  logger: {
    info: jest.fn(),
  },
}));

describe("loggerMiddleware", () => {
  let request: Partial<Request>;
  let response: Partial<Response> & {
    send: jest.Mock;
    json: jest.Mock;
    on: jest.Mock;
    statusCode?: number;
    __loggedStatus?: number;
  };
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    request = {
      method: "GET",
      originalUrl: "/test",
      ip: "::ffff:127.0.0.1",
    };

    response = {
      send: jest.fn().mockImplementation(function () {
        return this;
      }),
      json: jest.fn().mockImplementation(function () {
        return this;
      }),
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === "finish") {
          callback();
        }
        return this;
      }),
      statusCode: 200,
    };

    next = jest.fn();
  });

  it("calls next()", () => {
    loggerMiddleware(request as Request, response as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it("overwrites send and json to set __loggedStatus", () => {
    loggerMiddleware(request as Request, response as Response, next);

    response.send();
    expect(response.__loggedStatus).toBe(200);

    response.json();
    expect(response.__loggedStatus).toBe(200);
  });

  it("calls logger.info with correct data after finish", () => {
    loggerMiddleware(request as Request, response as Response, next);

    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: "/test",
        status: 200,
        ip: "127.0.0.1",
        duration: expect.stringMatching(/\d+ms/),
      }),
    );
  });

  it("removes ::ffff: prefix from IP", () => {
    Object.defineProperty(request, "ip", {
      value: "::ffff:192.168.0.1",
      writable: true,
    });

    loggerMiddleware(request as Request, response as Response, next);

    expect(logger.info).toHaveBeenCalledWith(expect.objectContaining({ ip: "192.168.0.1" }));
  });
});
