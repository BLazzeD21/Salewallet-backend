import { isValidUUID } from "@/utils/isValidUUID";

describe("isValidUUID", () => {
  it("returns true for a valid UUID", () => {
    const uuid = "550e8400-e29b-41d4-a716-446655440000";

    const result = isValidUUID(uuid);

    expect(result).toBe(true);
  });

  it("returns true for a valid UUID with uppercase letters", () => {
    const uuid = "550E8400-E29B-41D4-A716-446655440000";

    const result = isValidUUID(uuid);

    expect(result).toBe(true);
  });

  it.each([
    "not-a-uuid",
    "550e8400e29b41d4a716446655440000",
    "550e8400-e29b-41d4-a716-44665544",
    "550e8400-e29b-41d4-a716-44665544000000",
    "550e8400-e29b-41d4-a716-44665544zzzz",
    "550e8400-e29b-41d4-a716",
  ])("returns false for invalid UUID: %s", (uuid) => {
    const result = isValidUUID(uuid);

    expect(result).toBe(false);
  });
});
