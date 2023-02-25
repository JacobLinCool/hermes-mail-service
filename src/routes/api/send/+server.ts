import { CONFIG } from "$lib/server/config";
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
				content: z
					.string()
					.min(1)
					.max(100_000)
					.or(
						z.object({
							template: z.string().min(1).max(100),
							params: z.record(z.string().max(1_000)).optional(),
						}),
					),
			})
			.parse(body);

		const jwt = request.headers.get("authorization")?.replace("Bearer ", "") ?? "";
		if (!jwt) {
			throw error(401, await $t("errors.no-jwt"));
		}
		const valid = await JWT.verify(jwt, CONFIG.MAIN_KEY ?? platform?.env?.MAIN_KEY ?? "key");
		if (!valid) {
			throw error(401, await $t("errors.invalid-jwt"));
		}
		const { jti, allowlist } = JWT.decode(jwt).payload as { jti: string; allowlist: string[] };
		const allowed = allowlist.map((x) => new RegExp(x)).some((x) => x.test(from.email));
		if (!allowed) {
			throw error(403, await $t("errors.not-allowed"));
		}
		if (CONFIG.ALWAYS_CHECK ?? platform?.env?.ALWAYS_CHECK) {
			const stored = await platform?.env?.STORE.get(`jwt:${jti}`);
			if (!stored) {
				throw error(401, await $t("errors.invalid-jwt"));
			}
		}

		let rendered_template = "";
		if (typeof content === "object") {
			try {
				const search = new URLSearchParams();
				for (const [key, value] of Object.entries(content.params ?? {})) {
					search.append(key, value);
				}
				const res = await fetch(`/template/${content.template}?${search}`);

				if (!res.ok) {
					throw new Error();
				}

				rendered_template = await res.text();
			} catch {
				throw error(500, await $t("errors.template-render-failed"));
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
						value: rendered_template || content,
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
