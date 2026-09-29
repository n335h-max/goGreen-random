function hashSeed(seed) {
  let hash = 2166136261;
  for (const character of String(seed)) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return hash >>> 0;
}

export function createSeededRandom(seed) {
  let state = hashSeed(seed);
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function assertPushSafe({ branch, remote, confirmed }) {
  if (!confirmed) throw new Error("Refusing to push without explicit confirmation. Re-run with --yes after reviewing the preview.");
  if (!branch || ["main", "master"].includes(branch)) throw new Error("Refusing to push from the default branch. Create a dedicated experiment branch first.");
  if (!remote || !/^https?:\/\/github\.com[:/]|^git@github\.com:/i.test(remote)) throw new Error("Refusing to push without a GitHub origin remote.");
}

export function renderCalendar(dates, endDate = new Date()) {
  const selected = new Set(dates.map((date) => date.toISOString().slice(0, 10)));
  const end = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 27 - start.getUTCDay());
  const rows = ["Sun Mon Tue Wed Thu Fri Sat"];

  for (let week = 0; week < 5; week += 1) {
    let row = "";
    for (let day = 0; day < 7; day += 1) {
      const date = new Date(start);
      date.setUTCDate(start.getUTCDate() + week * 7 + day);
      row += selected.has(date.toISOString().slice(0, 10)) ? "#" : ".";
    }
    rows.push(row);
  }
  return rows.join("\n");
}
