// @ts-check
import { defineConfig } from "astro/config";

// The AskRune site: a static build served by Cloudflare (wrangler.jsonc). English at /, Turkish at /tr/.
export default defineConfig({
  site: "https://askrune.app",
  build: { format: "directory" },
});
