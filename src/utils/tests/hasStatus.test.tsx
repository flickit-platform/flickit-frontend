import { expect, test } from "vitest";
import hasStatus from "../has-status";

test("has status must return boolean", () => {
  expect(hasStatus("GOOD")).toBe(true);
});
