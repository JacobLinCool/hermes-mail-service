import { CONFIG } from "$lib/server/config";
import { $t } from "$lib/server/t";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { json, error } from "@sveltejs/kit";
import JWT from "@tsndr/cloudflare-worker-jwt";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const body = await request.json().catch(() => ({}));

		const { key } = z
			.object({
				key: z.string().min(1).max(1000),
			})
			.parse(body);

		const KEY = CONFIG.MAIN_KEY ?? platform?.env?.MAIN_KEY ?? "key";
		if (key !== KEY) {
			throw error(401, await $t("errors.invalid-main-key"));
		}

		if (!platform?.env?.STORE) {
			throw error(500, await $t("errors.missing-env"));
		}

		const { keys } = await platform.env.STORE.list({ prefix: "jwt:", limit: 1000 });

		return json({ keys });
	} catch (err) {
		if (err instanceof z.ZodError) {
			throw error(400, fromZodError(err).message);
		}
		if (err && typeof err === "object" && "status" in err) {
			throw err;
		}
		console.error(err);
		throw error(500, await $t("errors.internal-server-error"));
	}
};
