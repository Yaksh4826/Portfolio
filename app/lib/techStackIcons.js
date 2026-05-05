import fs from "node:fs";
import path from "node:path";

let cachedNames = null;
let cachedSet = null;

function loadIconNames() {
  if (cachedNames && cachedSet) {
    return { names: cachedNames, set: cachedSet };
  }

  const bundlePath = path.join(process.cwd(), "node_modules", "tech-stack-icons", "dist", "index.js");
  const source = fs.readFileSync(bundlePath, "utf8");
  const matcher = /[\{,]"?([a-z0-9-]+)"?:\{svg:/g;

  const names = [];
  const set = new Set();
  let match;
  while ((match = matcher.exec(source))) {
    const key = match[1];
    if (!set.has(key)) {
      set.add(key);
      names.push(key);
    }
  }

  cachedNames = names;
  cachedSet = set;
  return { names, set };
}

export function isValidTechStackIconName(iconName) {
  if (typeof iconName !== "string") return false;
  const key = iconName.trim().toLowerCase();
  if (!key) return false;
  return loadIconNames().set.has(key);
}

export function searchTechStackIconNames(query, limit = 24) {
  const q = typeof query === "string" ? query.trim().toLowerCase() : "";
  const safeLimit = Math.max(1, Math.min(Number(limit) || 24, 50));
  const { names } = loadIconNames();

  if (!q) {
    return names.slice(0, safeLimit);
  }

  const startsWith = [];
  const contains = [];
  for (const name of names) {
    if (name.startsWith(q)) {
      startsWith.push(name);
    } else if (name.includes(q)) {
      contains.push(name);
    }
    if (startsWith.length + contains.length >= safeLimit) break;
  }

  return [...startsWith, ...contains].slice(0, safeLimit);
}
