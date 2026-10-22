import { test } from "node:test";
import assert from "node:assert/strict";
import { createDeckId } from "../src/lib/id.ts";
test("set creation works without secure-context randomUUID", () => {
  const ids = Array.from({ length: 1000 }, () => createDeckId(undefined));
  assert.equal(new Set(ids).size, 1000);
  assert.ok(ids.every((id) => id.startsWith("custom-")));
});
