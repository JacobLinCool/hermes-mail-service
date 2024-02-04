import { db } from "$lib/server/db";
import type { Token } from "$lib/server/db/schema";
import { Endpoint, error, z } from "sveltekit-api";

export const Param = z.object({
	id: z.string().describe("The token to check"),
});

export const Output = z.object({
	id: z.string().describe("The token ID"),
	scope: z.string().describe("The token scope"),
	created: z.number().describe("The token creation date"),
	expires: z.number().describe("The token expiration date"),
	revoked: z.number().nullable().describe("The token revocation date"),
}) satisfies z.ZodSchema<Token>;

export const Error = {
	404: error(404, "Token not found"),
};

export default new Endpoint({ Param, Output, Error }).handle(async ({ id }) => {
	const token = await db
		.selectFrom("Token")
		.selectAll()
		.where("Token.id", "=", id)
		.executeTakeFirst();

	if (!token) {
		throw Error[404];
	}

	return token;
});
