import { config } from "$lib/server/config";
import { check, init } from "$lib/server/db";
import type { Handle } from "@sveltejs/kit";
import { locale } from "svelte-i18n";

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.request.headers.get("accept-language")?.split(",")[0] || "en";
	await locale.set(lang);

	if (event.url.pathname === "/") {
		const error = await check();
		if (error) {
			console.error("Database Health Check:", error);
			console.error("Try to initialize the database ...");
			await init();
			console.error("Database initialized");
		}
	}

	// if the request does not have an Authorization header,
	// check for a mainkey cookie and use it as the Authorization header if it exists
	if (!event.request.headers.has("Authorization")) {
		const mainkey = event.cookies.get("mainkey");
		if (mainkey) {
			event.request.headers.set("Authorization", `Bearer ${mainkey}`);
		}
	}

	const res = await resolve(event);

	const cors = await config.get("cors");
	if (cors) {
		const res2 = new Response(res.body, res);
		res2.headers.set("Access-Control-Allow-Origin", cors);
		res2.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
		res2.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
		return res2;
	}

	return res;
};
