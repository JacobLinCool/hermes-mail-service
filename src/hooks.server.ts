import { $t } from "$lib/server/t";
import { locale } from "svelte-i18n";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.request.headers.get("accept-language")?.split(",")[0];
	if (lang) {
		locale.set(lang);
	}

	if (!event.platform?.env?.STORE) {
		return new Response(
			JSON.stringify({
				message: await $t("errors.missing-env"),
			}),
			{ status: 500 },
		);
	}

	return resolve(event);
};
