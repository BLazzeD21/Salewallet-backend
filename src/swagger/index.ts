import swaggerJSDoc from "swagger-jsdoc";

import parameters from "./components/parameters";
import cardSchemas from "./components/schemas/Card.schemas";
import errorSchemas from "./components/schemas/Error.schemas";
import userSchemas from "./components/schemas/User.schemas";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "SaleWallet API",
      version: "1.0.0",
      description: "API documentation for SaleWallet",
    },
    servers: [{ url: "https://salewallet.blazzed.tech/api/v1" }, { url: "http://localhost:5500/api/v1" }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ...userSchemas,
        ...errorSchemas,
        ...cardSchemas,
      },
      parameters,
    },
  },
  apis: ["./build/routes/**/*.js", "./build/controllers/**/*.js"],
  tags: ["User", "Card", "Pictures"],
};

export default swaggerJSDoc(options);
