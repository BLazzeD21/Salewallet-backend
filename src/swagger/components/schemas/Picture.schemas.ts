export default {
  UploadPictureRequest: {
    type: "object",
    required: ["name", "file"],
    properties: {
      name: {
        type: "string",
        example: "my-cool-picture",
        description: "Unique name for the picture",
      },
      file: {
        type: "string",
        format: "binary",
        description: "Image file in PNG or JPEG format",
      },
    },
  },

  Picture: {
    type: "object",
    properties: {
      picture_id: {
        type: "string",
        example: "e58ed763-928c-4155-bee9-fdbaaadc15f3",
      },
      name: { type: "string", example: "my-cool-picture" },
      path: {
        type: "string",
        example: "/public/suggestions/my-cool-picture.png",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        example: "2026-01-30T12:00:00.000Z",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2026-01-30T12:00:00.000Z",
      },
    },
  },

  UploadPictureResponse: {
    type: "object",
    properties: {
      picture: {
        $ref: "#/components/schemas/Picture",
      },
    },
  },

  DeletePictureRequest: {
    type: "object",
    required: ["path"],
    properties: {
      path: {
        type: "string",
        example: "/public/suggestions/my-cool-picture.png",
        description: "Relative path to the picture file",
      },
    },
  },

  DeletePictureResponse: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "Deletion completed successfully",
      },
      deletedFromDisk: {
        type: "boolean",
        example: true,
      },
      deletedFromDatabase: {
        type: "boolean",
        example: true,
      },
    },
  },
};
