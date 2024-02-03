import { TokenAuth } from "$api";
import { config } from "$lib/server/config";
import { db } from "$lib/server/db";
import { Endpoint, error, z } from "sveltekit-api";

export const ContentItem = z.object({
	type: z
		.enum(["text/plain", "text/html"])
		.describe("The mime type of the content you are including in your email"),
	value: z
		.string()
		.max(200_000)
		.describe(
			"The actual content of the specified mime type that you are including in the message",
		),
});

export const EmailAddress = z
	.object({
		email: z.string().email(),
		name: z.string().optional(),
	})
	.or(
		z
			.string()
			.email()
			.transform((email) => ({ email, name: undefined })),
	);

export const CustomHeaders = z
	.record(z.string())
	.describe(
		"A JSON object containing key/value pairs of header names and the value to substitute for them.\nThe Key/value pairs must be strings. You must ensure these are properly encoded if they\ncontain unicode characters. Must not be one of the reserved headers (received, dkim-signature,\nContent-Type, Content-Transfer-Encoding, To, From, Subject, Reply-To, CC, BCC).",
	);

export const Personalization = z.object({
	to: z.array(EmailAddress).min(1).max(1000),
	from: EmailAddress.optional(),
	bcc: z.array(EmailAddress).max(1000).optional(),
	cc: z.array(EmailAddress).max(1000).optional(),
	headers: CustomHeaders.optional(),
	reply_to: EmailAddress.optional(),
	subject: z.string().optional(),
});

export const Input = z.object({
	from: EmailAddress,
	personalizations: z.array(Personalization).min(1).max(1000),
	subject: z.string().min(1).max(200),
	content: z.array(ContentItem),
	headers: CustomHeaders.optional(),
	reply_to: EmailAddress.optional(),
});

export const Output = z.object({
	ok: z.boolean(),
	error: z.string().optional(),
});

export const Error = {
	"Bad Request": error(400, "Bad Request"),
	"Invalid Token": error(401, "Invalid Token"),
	"Not Permitted": error(403, "Sender Address / Domain Not Permitted"),
};

export default new Endpoint({ Input, Output, Error, Modifier: TokenAuth }).handle(
	async (param, { request }) => {
		const authorization = request.headers.get("authorization")?.replace("Bearer ", "") ?? "";
		if (!authorization) {
			throw Error["Invalid Token"];
		}

		const token = await db
			.selectFrom("Token")
			.selectAll()
			.where("Token.id", "=", authorization)
			.executeTakeFirst();
		if (!token) {
			throw Error["Invalid Token"];
		}

		const allow = new RegExp(token.scope).test(param.from.email);
		if (!allow) {
			throw Error["Not Permitted"];
		}

		const save_raw = await config.get("save-raw");

		const froms = new Set(
			param.personalizations.flatMap((p) => p.from?.email ?? param.from.email),
		);
		const tos = new Set(param.personalizations.flatMap((p) => p.to.map((t) => t.email)));

		await db
			.insertInto("UsageRecord")
			.values({
				token: token.id,
				timestamp: Date.now(),
				subject: param.subject,
				from: [...froms].join(", "),
				to: [...tos].join(", "),
				raw: save_raw ? JSON.stringify(param) : null,
			})
			.executeTakeFirst();

		const req = new Request("https://api.mailchannels.net/tx/v1/send", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(param),
		});

		const res = await fetch(req);
		if (!res.ok) {
			return {
				ok: false,
				error: `MailChannels API ${res.status} ${res.statusText}: ${await res.text()}`,
			};
		}

		return { ok: true };
	},
);
