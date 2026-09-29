import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

import { generateRandomDates } from "./random-dates.js";
import { assertPushSafe, createSeededRandom, renderCalendar } from "./safety.js";

function readPositiveInteger(flag, fallback) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return fallback;
  const value = Number(process.argv[index + 1]);
  if (!Number.isInteger(value) || value <= 0) throw new TypeError(`${flag} must be followed by a positive integer`);
  return value;
}

function readText(flag) {
  const index = process.argv.indexOf(flag);
  return index === -1 ? undefined : process.argv[index + 1];
}

function git(args, options = {}) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
    env: { ...process.env, ...options.env },
  });
}

const count = readPositiveInteger("--count", 100);
const days = readPositiveInteger("--days", 365);
const seed = readText("--seed");
const shouldPush = process.argv.includes("--push");
const dates = generateRandomDates({ count, days, random: seed ? createSeededRandom(seed) : undefined });

console.log(dates.map((date) => date.toISOString()).join("\n"));
console.log(`\nPreview calendar:\n${renderCalendar(dates)}`);

if (!shouldPush) {
  console.log(`\nDry run: ${dates.length} random dates. Add --push --yes only after reviewing the preview on a dedicated branch.`);
  process.exit(0);
}

if (git(["status", "--porcelain"], { capture: true }).trim()) {
  throw new Error("Working tree must be clean before creating contribution commits");
}

const branch = git(["branch", "--show-current"], { capture: true }).trim();
let remote;
try {
  remote = git(["remote", "get-url", "origin"], { capture: true }).trim();
} catch {
  remote = "";
}
assertPushSafe({ branch, remote, confirmed: process.argv.includes("--yes") });
console.log(`Pushing ${dates.length} commits to ${remote} on branch ${branch}.`);

for (const [index, date] of dates.entries()) {
  const timestamp = date.toISOString();
  writeFileSync("data.json", `${JSON.stringify({ sequence: index + 1, date: timestamp }, null, 2)}\n`);
  git(["add", "--", "data.json"]);
  git(["commit", "-m", `chore: activity ${index + 1}`, "--date", timestamp], {
    env: { GIT_COMMITTER_DATE: timestamp },
  });
}

git(["push", "origin", branch]);
console.log(`Created and pushed ${dates.length} randomly dated commits.`);
