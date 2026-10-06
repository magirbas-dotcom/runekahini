// The Markdown twin of this guide page, for AI search and answer engines (src/ai.ts).
import type { APIRoute } from "astro";

import { historyMd, markdown } from "../../../ai";

export const GET: APIRoute = () => markdown(historyMd("tr"));
