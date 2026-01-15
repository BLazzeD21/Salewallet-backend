import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.1.0",
  info: {
    title: "Salewallet API",
    version: "0.0.1",
    description: "Документация API для Salewallet",
  },
  servers: [
    {
      url: "/api/v1",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./build/routes/*.js", "./build/controllers/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
