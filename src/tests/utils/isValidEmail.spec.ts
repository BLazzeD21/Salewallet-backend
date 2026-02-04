import { isValidEmail } from "@/utils";

describe("isValidEmail", () => {
  it("returns true for a valid email address", () => {
    const correctEmail = "salewallet@gmail.com";

    const result = isValidEmail(correctEmail);

    expect(result).toBe(true);
  });

  it.each(["salewalletgmail.com"])("returns false for invalid email: %s", (email) => {
    const result = isValidEmail(email);

    expect(result).toBe(false);
  });
});
