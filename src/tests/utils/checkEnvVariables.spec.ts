import { logger } from "@/config";

import { checkEnvVariables } from "@/utils/checkEnvVariables";

jest.mock("@/config", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe("checkEnvVariables", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();

    process.env = {
      ...ORIGINAL_ENV,
      PORT: "3000",
      DB_HOST: "localhost",
      DB_USER: "user",
      DB_PASSWORD: "pass",
      DB_NAME: "db",
      DB_PORT: "5432",
      DOMAIN: "https://example.com",
      SMTP_HOST: "smtp.example.com",
      SMTP_PORT: "587",
      SMTP_USERNAME: "smtp-user",
      SMTP_PASSWORD: "smtp-pass",
      FROM_EMAIL_USERNAME: "no-reply@example.com",
      AUTH_SECRET: "secret",
      AUTH_SECRET_EXPIRES_IN: "3600",
      AUTH_REFRESH_SECRET: "refresh",
      AUTH_REFRESH_SECRET_EXPIRES_IN: "7200",
    };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("passes validation when all required environment variables are present and valid", () => {
    checkEnvVariables();

    expect(logger.info).toHaveBeenCalledWith("All environment variables have been checked");
  });

  it("exits the process when a required environment variable is missing", () => {
    delete process.env.DB_HOST;

    const exitSpy = jest.spyOn(process, "exit").mockImplementation((() => {}) as never);

    checkEnvVariables();

    expect(logger.error).toHaveBeenCalledWith(
      "Missing required environment variables:",
      expect.stringContaining("DB_HOST"),
    );
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
  });

  it("exits the process when PORT is not a number", () => {
    process.env.PORT = "not-a-number";

    const exitSpy = jest.spyOn(process, "exit").mockImplementation((() => {}) as never);

    checkEnvVariables();

    expect(logger.error).toHaveBeenCalledWith("PORT must be a number");
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
  });

  it("exits the process when DOMAIN is not a valid URL", () => {
    process.env.DOMAIN = "invalid-url";

    const exitSpy = jest.spyOn(process, "exit").mockImplementation((() => {}) as never);

    checkEnvVariables();

    expect(logger.error).toHaveBeenCalledWith("DOMAIN must be a valid URL");
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
  });
});
