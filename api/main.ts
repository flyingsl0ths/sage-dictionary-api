import { Hono } from "hono";
import { parseWord } from "./word.ts";

const app = new Hono();

app.get("/:word", async (c) => {
  const word = c.req.param("word");

  const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

  const response = await fetch(`${BASE_URL}${word}`);

  if (response.status !== 200) {
    return new Response("Not found", { status: 404 });
  }

  const json = await response.json();

  const info = parseWord(json[0]);

  if (!info) {
    return new Response("Not enough info", { status: 404 });
  }

  return c.json(info);
});

Deno.serve(app.fetch);
