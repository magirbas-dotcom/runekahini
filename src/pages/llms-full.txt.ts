import type { APIRoute } from "astro";

import { llmsFull } from "../ai";

export const GET: APIRoute = () => new Response(llmsFull(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
