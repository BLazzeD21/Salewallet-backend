import type { Request, Response } from "express";

import { sendError } from "@/utils";

import { PictureService } from "@/services/picture";

const service = new PictureService();

export class PictureController {
  search = async (request: Request, response: Response) => {
    try {
      const result = await service.search(request.query as { name: string });

      return response.status(200).json(result);
    } catch (error) {
      sendError(error, response);
    }
  };

  delete = async (request: Request, response: Response) => {
    try {
      const result = await service.delete(request.body);

      return response.status(200).json({
        message: "Deletion completed successfully",
        ...result,
      });
    } catch (error) {
      sendError(error, response);
    }
  };

  upload = async (request: Request, response: Response) => {
    try {
      const result = await service.upload({
        file: request.file,
        name: request.body.name,
      });

      return response.status(201).json(result);
    } catch (error) {
      sendError(error, response);
    }
  };
}
