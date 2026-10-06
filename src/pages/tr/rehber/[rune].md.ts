// The Markdown twin of a rune's page, for AI search and answer engines (src/ai.ts).
import type { APIRoute } from "astro";

import { markdown, runeMd } from "../../../ai";
import { runes } from "../../../guide";

export function getStaticPaths() {
  return runes.map((r) => ({ params: { rune: r.name.toLowerCase() }, props: { name: r.name } }));
}

export const GET: APIRoute = ({ props }) => markdown(runeMd("tr", props.name as string));
