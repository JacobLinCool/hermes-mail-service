import { dev } from "$app/environment";
import { CONFIG } from "$lib/server/config";
import { $t } from "$lib/server/t";
import { locale } from "svelte-i18n";
import type { Handle } from "@sveltejs/kit";

const CONFIG_MAX_TTL = 1000 * 60 * 5;

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.request.headers.get("accept-language")?.split(",")[0] || "en";
	locale.set(lang);

	if (event.url.pathname.startsWith("/template")) {
		return resolve(event);
	}

	if (!dev) {
		if (!event.platform?.env?.STORE) {
			return new Response(
				JSON.stringify({
					message: await $t("errors.missing-env"),
				}),
				{ status: 500 },
			);
		}

		if (CONFIG.$DATE + CONFIG_MAX_TTL < Date.now()) {
			const config = await event.platform.env.STORE.get("app:config", "json");
			if (!config) {
				return new Response(
					JSON.stringify({
						message: await $t("errors.config-not-set"),
					}),
					{ status: 500 },
				);
			}
			Object.assign(CONFIG, config);
			CONFIG.$DATE = Date.now();
		}
	}

	const res = await resolve(event);

	if (CONFIG.CORS) {
		const res2 = new Response(res.body, res);
		res2.headers.set("Access-Control-Allow-Origin", CONFIG.CORS);
		res2.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
		res2.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
		return res2;
	}

	return res;
};
