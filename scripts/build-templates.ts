import fs from "node:fs";
import path from "node:path";

const templates = fs
	.readdirSync("templates")
	.filter((file) => file.endsWith(".html") || file.endsWith(".svelte"));
const out = path.normalize("src/routes/(template)/template");

for (const template of templates) {
	const content = fs.readFileSync(path.join("templates", template), "utf-8");
	const dir = path.join(out, template.replace(/\.(html|svelte)$/, ""));
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	fs.writeFileSync(
		path.join(dir, "+page.svelte"),
		content.trimStart().startsWith("<script")
			? content
			: `<script> export let data; </script>\n` + content,
	);
	console.log("Wrote", path.join(dir, "+page.svelte"));
}
