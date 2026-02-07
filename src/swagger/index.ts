import swaggerJSDoc from "swagger-jsdoc";

import packageJson from "../../package.json" with { type: "json" };
import parameters from "./components/parameters";
import cardSchemas from "./components/schemas/Card.schemas";
import errorSchemas from "./components/schemas/Error.schemas";
import pictureSchemas from "./components/schemas/Picture.schemas";
import userSchemas from "./components/schemas/User.schemas";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
    },
    servers: [
      {
        url: `${process.env.DOMAIN}/api/v1`,
        description: "Production server",
      },
      {
        url: `http://localhost:${process.env.PORT || 3000}/api/v1`,
        description: "Local development server",
      },
    ],
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
        ...pictureSchemas,
      },
      parameters,
    },
  },
  apis: ["./build/routes/**/*.js", "./build/controllers/**/*.js"],
  tags: [
    {
      name: "User",
      description: "User authentication and profile operations",
    },
    {
      name: "Card",
      description: "Card management",
    },
    {
      name: "Pictures",
      description: "Picture upload and retrieval",
    },
  ],
};

export default swaggerJSDoc(options);
