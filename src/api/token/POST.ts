import { MainkeyAuth } from "$api";
import { config } from "$lib/server/config";
import { db } from "$lib/server/db";
import type { Token } from "$lib/server/db/schema";
import { generate_token_id } from "$lib/server/token";
import { Endpoint, error, z } from "sveltekit-api";

export const Input = z.object({
	scope: z.string().min(1).max(1000).describe("The token scope"),
	expires: z.number().nonnegative().describe("The token expiration date"),
}) satisfies z.ZodSchema<Omit<Token, "id" | "created">>;

export const Output = z.object({
	id: z.string().describe("The token ID"),
	scope: z.string().describe("The token scope"),
	created: z.number().describe("The token creation date"),
	expires: z.number().describe("The token expiration date"),
}) satisfies z.ZodSchema<Token>;

export const Error = {
	400: error(400, "Bad Request"),
	401: error(401, "Unauthorized"),
};

export default new Endpoint({ Input, Output, Error, Modifier: MainkeyAuth }).handle(
	async (param, { request }) => {
		const mainkey = request.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
		if (!mainkey) {
			throw Error[401];
		}

		const correct = await config.get("mainkey");
		if (mainkey !== correct) {
			throw Error[401];
		}

		try {
			new RegExp(param.scope);
		} catch {
			throw Error[400];
		}

		const token: Token = {
			id: generate_token_id(),
			created: Date.now(),
			...param,
		};

		const result = await db.insertInto("Token").values(token).executeTakeFirst();

		if (result.numInsertedOrUpdatedRows === 0n) {
			throw Error[400];
		}

		return token;
	},
);
