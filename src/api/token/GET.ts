import { MainkeyAuth } from "$api";
import { config } from "$lib/server/config";
import { db } from "$lib/server/db";
import type { Token } from "$lib/server/db/schema";
import { Endpoint, error, z } from "sveltekit-api";

export const Query = z.object({
	offset: z.number().int().nonnegative().default(0).describe("The number of tokens to skip"),
	limit: z.number().int().nonnegative().default(10).describe("The number of tokens to take"),
	order: z
		.enum(["asc", "desc"])
		.optional()
		.default("desc")
		.describe("The order to sort the tokens"),
	sort: z
		.enum(["scope", "created", "expires"])
		.optional()
		.default("created")
		.describe("The field to sort the tokens by"),
});

export const Output = z.object({
	tokens: z
		.array(
			z.object({
				id: z.string().describe("The token ID"),
				scope: z.string().describe("The token scope"),
				created: z.number().describe("The token creation date"),
				expires: z.number().describe("The token expiration date"),
			}),
		)
		.describe("The tokens"),
}) satisfies z.ZodSchema<{ tokens: Token[] }>;

export const Error = {
	401: error(401, "Unauthorized"),
	404: error(404, "Token not found"),
};

export default new Endpoint({ Query, Output, Error, Modifier: MainkeyAuth }).handle(
	async (param, { request }) => {
		const mainkey = request.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
		if (!mainkey) {
			throw Error[401];
		}

		const correct = await config.get("mainkey");
		if (mainkey !== correct) {
			throw Error[401];
		}

		const tokens = await db
			.selectFrom("Token")
			.selectAll()
			.limit(param.limit)
			.offset(param.offset)
			.orderBy(`Token.${param.sort}`, param.order)
			.execute();

		return { tokens };
	},
);
