import { $t } from "$lib/server/t";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { error } from "@sveltejs/kit";
import JWT from "@tsndr/cloudflare-worker-jwt";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, fetch, platform }) => {
	try {
		const body = await request.json().catch(() => ({}));

		const { from, to, subject, content } = z
			.object({
				from: z.object({ email: z.string().email(), name: z.string().min(1).max(100) }),
				to: z.array(z.string().email()),
				subject: z.string().min(1).max(100),
				content: z.string().min(1).max(100_000),
			})
			.parse(body);

		const jwt = request.headers.get("authorization")?.replace("Bearer ", "") ?? "";
		if (!jwt) {
			throw error(401, await $t("errors.no-jwt"));
		}
		const valid = await JWT.verify(jwt, platform?.env?.MAIN_KEY ?? "key");
		if (!valid) {
			throw error(401, await $t("errors.invalid-jwt"));
		}
		const { jti, allowlist } = JWT.decode(jwt).payload as { jti: string; allowlist: string[] };
		const allowed = allowlist.map((x) => new RegExp(x)).some((x) => x.test(from.email));
		if (!allowed) {
			throw error(403, await $t("errors.not-allowed"));
		}
		if (platform?.env?.ALWAYS_CHECK) {
			const stored = await platform?.env?.STORE.get(jti);
			if (!stored) {
				throw error(401, await $t("errors.invalid-jwt"));
			}
		}

		// API reference: https://api.mailchannels.net/tx/v1/documentation
		const req = new Request("https://api.mailchannels.net/tx/v1/send", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				from,
				personalizations: to.map((email) => ({ to: [{ email }] })),
				subject,
				content: [
					{
						type: "text/html",
						value: content,
					},
				],
			}),
		});

		const response = await fetch(req);

		return response;
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
