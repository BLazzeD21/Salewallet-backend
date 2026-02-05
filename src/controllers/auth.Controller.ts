import type { Request, Response } from "express";

import { sendError } from "@/utils";

import { AuthService } from "@/services/auth";

const service = new AuthService();

export class AuthController {
  login = async (request: Request, response: Response) => {
    try {
      const result = await service.login(request.body);

      return response.status(200).json(result);
    } catch (error) {
      sendError(error, response);
    }
  };

  register = async (request: Request, response: Response) => {
    try {
      const result = await service.register(request.body);

      return response.status(201).json(result);
    } catch (error) {
      sendError(error, response);
    }
  };

  refresh = async (req: Request, res: Response) => {
    try {
      const result = await service.refresh(req.headers.authorization);

      return res.status(200).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  confirmEmail = async (request: Request, response: Response) => {
    try {
      response.header("Access-Control-Allow-Origin", "*");

      const { userId } = request.params;
      const { token } = request.query as { token?: string };

      const html = await service.confirmEmail({ userId, token: token ?? "" });

      return response.status(200).format({
        "application/json": () => {
          response.json({ message: "Email successfully confirmed" });
        },
        "text/html": () => {
          response.send(html);
        },
        default: () => {
          response.status(406).send("Not Acceptable");
        },
      });
    } catch (error) {
      sendError(error, response);
    }
  };

  deleteUser = async (request: Request, response: Response) => {
    try {
      const userId = request.user.userId;
      const { password } = request.body;

      const result = await service.deleteUser({ userId, password });

      return response.status(200).json(result);
    } catch (error) {
      sendError(error, response);
    }
  };

  changePassword = async (request: Request, response: Response) => {
    try {
      const userId = request.user.userId;

      const { oldPassword, newPassword } = request.body;

      const result = await service.changePassword({
        userId,
        oldPassword,
        newPassword,
      });

      return response.status(200).json(result);
    } catch (error) {
      sendError(error, response);
    }
  };
}
