import fs from "node:fs";
import path from "node:path";

function parseDotEnv(contents: string): Record<string, string> {
  const out: Record<string, string> = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq === -1) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Unescape common sequences for double-quoted values
    value = value.replace(/\\n/g, "\n");

    out[key] = value;
  }

  return out;
}

export function loadEnvOnce(): void {
  // Don't override existing environment variables
  const candidatePaths = [
    // Current process directory (usually artifacts/api-server during local dev)
    path.resolve(process.cwd(), ".env"),
    // Workspace root .env when running from artifacts/api-server
    path.resolve(process.cwd(), "..", "..", ".env"),
    // Built runtime fallback from dist/lib -> api-server/.env
    path.resolve(__dirname, "..", "..", ".env"),
    // Built runtime fallback from dist/lib -> workspace root .env
    path.resolve(__dirname, "..", "..", "..", "..", ".env"),
  ];

  for (const p of candidatePaths) {
    try {
      if (!fs.existsSync(p)) continue;
      const raw = fs.readFileSync(p, "utf8");
      const parsed = parseDotEnv(raw);
      for (const [k, v] of Object.entries(parsed)) {
        if (process.env[k] === undefined) process.env[k] = v;
      }
      return;
    } catch {
      // ignore
    }
  }
}

