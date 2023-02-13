import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { json, error } from "@sveltejs/kit";
import JWT from "@tsndr/cloudflare-worker-jwt";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, fetch, platform }) => {
	const body = await request.json();

	try {
		const { from, to, subject, content } = z
			.object({
				from: z.object({ email: z.string().email(), name: z.string().min(1).max(100) }),
				to: z.array(z.string().email()),
				subject: z.string().min(1).max(100),
				content: z.string().min(1).max(10000),
			})
			.parse(body);

		const jwt = request.headers.get("authorization")?.replace("Bearer ", "") ?? "";
		const valid = await JWT.verify(jwt, platform?.env?.MAIN_KEY ?? "key");
		if (!valid) {
			throw error(401, "Unauthorized");
		}
		const { allowlist } = JWT.decode(jwt).payload as { allowlist: string[] };
		const allowed = allowlist.map((x) => new RegExp(x)).some((x) => x.test(from.email));
		if (!allowed) {
			throw error(403, "Forbidden");
		}

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

		return json(await response.json());
	} catch (err) {
		if (err instanceof z.ZodError) {
			throw error(400, fromZodError(err).message);
		}
		console.error(err);
		throw error(500, "Internal Server Error");
	}
};
