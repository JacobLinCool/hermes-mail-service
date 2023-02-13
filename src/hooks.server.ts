import { t, locale, waitLocale } from "svelte-i18n";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.request.headers.get("accept-language")?.split(",")[0];
	if (lang) {
		locale.set(lang);
	}

	if (!event.platform?.env?.STORE) {
		return new Response(
			JSON.stringify({
				message: await T("errors.missing-env"),
			}),
			{ status: 500 },
		);
	}

	return resolve(event);
};

async function T(key: string): Promise<string> {
	await waitLocale();

	return await new Promise((resolve) => {
		const unsubscribe = t.subscribe((x) => {
			resolve(x(key));
			setImmediate(() => unsubscribe());
		});
	});
}
