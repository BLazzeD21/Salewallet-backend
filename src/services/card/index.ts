import type {
  CreateCardRequest,
  CreateCardResponse,
  DeleteCardRequest,
  DeleteCardResponse,
  GetCardsRequest,
  GetCardsResponse,
  UpdateCardRequest,
  UpdateCardResponse,
} from "@/types";

import { createCard } from "./createCard.service";
import { deleteCard } from "./deleteCard.service";
import { getCards } from "./getCards.service";
import { updateCard } from "./updateCard.service";

class CardService {
  create!: (request: CreateCardRequest) => Promise<CreateCardResponse>;
  getCards!: (request: GetCardsRequest) => Promise<GetCardsResponse>;
  delete!: (request: DeleteCardRequest) => Promise<DeleteCardResponse>;
  update!: (request: UpdateCardRequest) => Promise<UpdateCardResponse>;
}

CardService.prototype.create = createCard;
CardService.prototype.getCards = getCards;
CardService.prototype.delete = deleteCard;
CardService.prototype.update = updateCard;

export { CardService };
