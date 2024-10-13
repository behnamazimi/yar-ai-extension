import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";
const { version } = packageJson;

// Convert from Semver (example: 0.1.0)
const [major, minor, patch] = version
  .replace(/[^\d.]+/g, "")
  // split into version parts
  .split(/[.]/);

export default defineManifest(async (env) => ({
    manifest_version: 3,
    version: `${major}.${minor}.${patch}`,
    version_name: version,
    name: env.mode === "development" ? "YarAI [DEV]" : "YarAI",
    action: { default_popup: "popup.html" },
    background: {
      service_worker: "src/scripts/background.ts",
      type: "module",
    },
    content_scripts: [
      {
        run_at: "document_start",
        matches: ["<all_urls>"],
        js: ["src/ui/content/main.tsx"],
      },
    ],
  }));
