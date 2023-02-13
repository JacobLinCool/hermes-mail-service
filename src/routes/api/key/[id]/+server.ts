import { CONFIG } from "$lib/server/config";
import { $t } from "$lib/server/t";
import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async ({ request, params, platform }) => {
	try {
		const key = request.headers.get("x-key");
		const jti = params.id;

		const KEY = CONFIG.MAIN_KEY ?? platform?.env?.MAIN_KEY ?? "key";
		if (key !== KEY) {
			throw error(401, await $t("errors.invalid-main-key"));
		}

		if (!platform?.env?.STORE) {
			throw error(500, await $t("errors.missing-env"));
		}

		await platform.env.STORE.delete(`jwt:${jti}`);
		return json({ success: true });
	} catch (err) {
		if (err && typeof err === "object" && "status" in err) {
			throw err;
		}
		console.error(err);
		throw error(500, await $t("errors.internal-server-error"));
	}
};
