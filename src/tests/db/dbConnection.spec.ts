import { sequelize } from "@/config";

describe("PostgreSQL connection", () => {
  it("should connect to the database successfully", async () => {
    try {
      await sequelize.authenticate();
    } catch (error) {
      throw new Error(`Database connection failed: ${error}`);
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
