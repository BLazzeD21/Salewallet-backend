import type { Request, Response } from "express";

import { LoginService } from "@/services";

import { sendError } from "@/utils";

const authService = new LoginService();

export const loginController = async (request: Request, response: Response) => {
  try {
    const result = await authService.login(request.body);
    return response.status(200).json(result);
  } catch (error) {
    sendError(error, response);
  }
};
