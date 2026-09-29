import assert from "node:assert/strict";
import test from "node:test";

import { assertPushSafe, createSeededRandom, renderCalendar } from "./safety.js";

test("requires explicit confirmation and a non-default branch before pushing", () => {
  assert.throws(
    () => assertPushSafe({ branch: "experiment/green", remote: "https://github.com/example/repo.git", confirmed: false }),
    /--yes/i,
  );
  assert.throws(
    () => assertPushSafe({ branch: "main", remote: "https://github.com/example/repo.git", confirmed: true }),
    /default branch/i,
  );
  assert.doesNotThrow(() => assertPushSafe({ branch: "experiment/green", remote: "https://github.com/example/repo.git", confirmed: true }));
});

test("seeded randomness produces repeatable previews", () => {
  const first = createSeededRandom("demo");
  const second = createSeededRandom("demo");
  assert.deepEqual([first(), first(), first()], [second(), second(), second()]);
});

test("renders a compact calendar preview", () => {
  const output = renderCalendar([
    new Date("2026-09-20T12:00:00.000Z"),
    new Date("2026-09-21T12:00:00.000Z"),
  ], new Date("2026-09-21T12:00:00.000Z"));
  assert.match(output, /Sun Mon Tue Wed Thu Fri Sat/);
  assert.match(output, /#/);
});
