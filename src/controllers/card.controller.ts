import type { Request, Response } from "express";

import { sendError } from "@/utils";

import { CardService } from "@/services/card";

const service = new CardService();

export class CardController {
  create = async (request: Request, response: Response) => {
    try {
      const { userId } = request.user;
      const body = request.body;

      const result = await service.create({ userId, ...body });
      return response.status(201).json(result);
    } catch (error) {
      sendError(error, response);
    }
  };

  getCards = async (request: Request, response: Response) => {
    try {
      const { userId } = request.user;

      const result = await service.getCards(userId);

      return response.status(200).json(result);
    } catch (error) {
      sendError(error, response);
    }
  };

  delete = async (request: Request, response: Response) => {
    try {
      const { userId } = request.user;
      const { cardId } = request.params;

      const result = await service.delete({ userId, cardId });

      return response.status(200).json(result);
    } catch (error) {
      sendError(error, response);
    }
  };

  update = async (request: Request, response: Response) => {
    try {
      const { userId } = request.user;
      const { cardId } = request.params;

      const result = await service.update({ userId, cardId, ...request.body });
      return response.status(200).json(result);
    } catch (error) {
      sendError(error, response);
    }
  };
}
