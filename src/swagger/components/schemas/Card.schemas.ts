export default {
  Card: {
    type: "object",
    properties: {
      card_id: { type: "string", example: "e58ed763-928c-4155-bee9-fdbaaadc15f3" },
      card_number: { type: "string", example: "1234 5678 9012 3456" },
      name: { type: "string", example: "My Card" },
      description: { type: "string", example: "Loyalty card" },
      color: { type: ["string", "null"], example: "#FF5733" },
      barcode: { type: "string", example: "0123456789" },
      barcode_type: { type: "string", example: "EAN-13" },
      qr_data: { type: "string", example: "https://example.com/qr" },
      added_at: {
        type: "string",
        format: "date-time",
        example: "2026-01-30T10:15:30.000Z",
      },
    },
  },

  CreateCardRequest: {
    type: "object",
    required: ["card_number", "name", "barcode", "barcode_type", "qr_data"],
    properties: {
      card_number: { type: "string", example: "1234-5678-9012-3456" },
      name: { type: "string", example: "My Card" },
      description: { type: "string", example: "Optional description" },
      color: { type: ["string", "null"], example: "#ff0000" },
      barcode: { type: "string", example: "1234567890" },
      barcode_type: { type: "string", example: "CODE128" },
      qr_data: { type: "string", example: "https://example.com" },
    },
  },

  CreateCardResponse: {
    type: "object",
    properties: {
      card: { $ref: "#/components/schemas/Card" },
    },
  },

  UserCardsResponse: {
    type: "object",
    properties: {
      user_id: { type: "string", example: "user_123" },
      cards: {
        type: "array",
        items: { $ref: "#/components/schemas/Card" },
      },
    },
  },

  UpdateCardRequest: {
    type: "object",
    properties: {
      name: { type: "string", example: "Updated Card Name" },
      description: { type: "string", example: "Updated description" },
      color: { type: ["string", "null"], example: "#00ff00" },
      card_number: { type: "string", example: "1234-5678-9012-3456" },
      barcode: { type: "string", example: "9876543210" },
      barcode_type: { type: "string", example: "CODE128" },
      qr_data: { type: "string", example: "https://updated.com" },
    },
  },

  UpdateCardResponse: {
    type: "object",
    properties: {
      message: { type: "string", example: "Card updated successfully" },
      data: { $ref: "#/components/schemas/Card" },
    },
  },
};
