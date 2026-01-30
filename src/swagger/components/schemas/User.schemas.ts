export default {
  LoginRequest: {
    type: "object",
    required: ["username", "password"],
    properties: {
      username: {
        type: "string",
        example: "alexandr",
        description: "Username or email",
      },
      password: {
        type: "string",
        example: "StrongPassword123",
      },
    },
  },

  TokenPair: {
    type: "object",
    properties: {
      accessToken: {
        type: "string",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
      refreshToken: {
        type: "string",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
      token_type: {
        type: "string",
        example: "bearer",
      },
    },
  },

  LoginResponse: {
    type: "object",
    properties: {
      tokens: { $ref: "#/components/schemas/TokenPair" },
      data: {
        type: "object",
        properties: {
          user_id: { type: "string", example: "e58ed763-928c-4155-bee9-fdbaaadc15f3" },
          username: { type: "string", example: "alexandr" },
          mail: { type: "string", example: "alex@mail.com" },
          cards: {
            type: "array",
            items: { $ref: "#/components/schemas/Card" },
          },
        },
      },
    },
  },

  RegisterRequest: {
    type: "object",
    required: ["username", "mail", "password"],
    properties: {
      username: { type: "string", example: "alexandr" },
      mail: { type: "string", example: "alex@mail.com" },
      password: { type: "string", example: "StrongPassword123" },
    },
  },

  RegisterResponse: {
    type: "object",
    properties: {
      user: {
        type: "object",
        properties: {
          user_id: { type: "string", example: "e58ed763-928c-4155-bee9-fdbaaadc15f3" },
          username: { type: "string", example: "alexandr" },
          mail: { type: "string", example: "alex@mail.com" },
          created_at: {
            type: "string",
            format: "date-time",
            example: "2026-01-30T10:15:30.000Z",
          },
        },
      },
    },
  },

  ConfirmEmailResponse: {
    type: "object",
    properties: {
      message: { type: "string", example: "Email successfully confirmed" },
    },
  },

  DeleteUserResponse: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "User successfully deleted",
      },
    },
  },

  ChangePasswordRequest: {
    type: "object",
    required: ["oldPassword", "newPassword"],
    properties: {
      oldPassword: {
        type: "string",
        example: "OldPassword123",
        description: "Current password of the user",
      },
      newPassword: {
        type: "string",
        example: "NewStrongPassword456",
        description: "New password to replace the old one",
      },
    },
  },

  ChangePasswordResponse: {
    type: "object",
    properties: {
      code: {
        type: "string",
        example: "PASSWORD_CHANGED",
      },
      message: {
        type: "string",
        example: "Password changed successfully",
      },
    },
  },

  DeleteCardResponse: {
    type: "object",
    properties: {
      message: { type: "string", example: "Card successfully deleted" },
    },
  },
};
