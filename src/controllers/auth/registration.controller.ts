import type { Request, Response } from "express";

import { RegisterService } from "@/services";

import { sendError } from "@/utils";

const registerService = new RegisterService();

export const registerUser = async (request: Request, response: Response) => {
  try {
    const result = await registerService.register(request.body);
    return response.status(201).json(result);
  } catch (error) {
    sendError(error, response);
  }
};
