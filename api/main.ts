// deno-lint-ignore-file no-explicit-any
import { Hono } from "hono";
import type { Word } from "./word.ts";

const app = new Hono();

const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

function findPhonetic(phonoetics: any[]): string {
  if (phonoetics.length === 0) return "";

  let result = "";
  for (const ph of phonoetics) {
    if (ph.text) {
      result = ph.text;
      break;
    }
  }

  return result;
}

function extractExamples(meanings: any[]): string[] {
  const examples: string[] = [];
  for (const meaning of meanings) {
    for (const definition of meaning.definitions) {
      if (definition.example) {
        examples.push(definition.example);
      }
    }
  }
  return examples;
}

function parseWord(word: any): Word {
  return {
    word: word.word,
    pronounciation: word.phonetic ?? findPhonetic(word.phonetics),
    definition: word.meanings[0].definitions[0].definition,
    synonyms: word.meanings[0].synonyms,
    antonyms: word.meanings[0].antonyms,
    sentences: extractExamples(word.meanings),
  };
}

app.get("/:word", async (c) => {
  const word = c.req.param("word");
  const response = await fetch(`${BASE_URL}${word}`);

  if (response.status !== 200) {
    return new Response("Not found", { status: 404 });
  }

  const json = await response.json();
  const info = parseWord(json[0]);

  return c.json(info);
});

Deno.serve(app.fetch);
