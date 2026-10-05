// @ts-check
import { defineConfig } from "astro/config";

// The AskRune site: a static build served by Cloudflare (wrangler.jsonc). English at /, Turkish at /tr/.
export default defineConfig({
  site: "https://askrune.app",
  build: { format: "directory" },
  // The dev toolbar sat over the page in previews; the site is checked as it will look live.
  devToolbar: { enabled: false },
});
