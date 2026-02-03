export default {
  UserIdParam: {
    name: "userId",
    in: "path",
    required: true,
    schema: {
      type: "string",
      format: "uuid",
    },
    description: "User ID (UUID)",
  },

  TokenQuery: {
    name: "token",
    in: "query",
    required: true,
    schema: {
      type: "string",
    },
    description: "Verification token",
  },

  CardIdParam: {
    name: "cardId",
    in: "path",
    required: true,
    schema: {
      type: "string",
      format: "uuid",
    },
    description: "Card ID (UUID)",
  },

  PictureName: {
    name: "name",
    in: "query",
    required: true,
    schema: {
      type: "string",
    },
    description: "Image name",
  },
};
