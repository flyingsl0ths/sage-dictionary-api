import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { parseWord } from "./word.js";

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

const server = serve(app);

process.on("SIGINT", () => {
	server.close();
	process.exit(0);
});

process.on("SIGTERM", () => {
	server.close((err) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		process.exit(0);
	});
});
