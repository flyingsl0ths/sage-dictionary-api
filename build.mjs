import esbuild from "esbuild";
import pursPlugin from "esbuild-plugin-purescript";
import copyStaticFiles from "esbuild-copy-static-files";

await esbuild
	.build({
		entryPoints: ["index.js"],
		bundle: true,
		minify: true,
		outdir: "dist",
		plugins: [
			// allow importing Purescript modules in JavaScript files.
			pursPlugin(),
			// copy everything under `static` to `dist`.
			copyStaticFiles({ src: "./static", dest: "./dist" }),
		],
		platform: "node",
		target: ["node23.9.0"],
		logLevel: "debug",
	})
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
