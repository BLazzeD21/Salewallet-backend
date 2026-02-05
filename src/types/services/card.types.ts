import type { CardAttributes } from "@/types";

export interface CreateCardRequest extends Omit<CardAttributes, "user_id" | "card_id" | "added_at"> {
  userId: string;
}

export interface CardData extends Omit<CardAttributes, "user_id"> {}

export interface CreateCardResponse {
  card: CardData;
}

export interface GetCardsResponse {
  user_id: string;
  cards: CardData[];
}

export interface DeleteCardRequest {
  userId: string;
  cardId: string;
}

export interface DeleteCardResponse {
  message: string;
}

export interface UpdateCardRequest {
  userId: string;
  cardId: string;
  name?: string;
  description?: string;
  color?: string;
  card_number?: string;
  barcode?: string;
  barcode_type?: string;
  qr_data?: string;
}

export interface UpdateCardResponse {
  message: string;
  data: CardData;
}
