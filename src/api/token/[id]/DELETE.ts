import { MainkeyAuth } from "$api";
import { config } from "$lib/server/config";
import { db } from "$lib/server/db";
import { Endpoint, error, z } from "sveltekit-api";

export const Param = z.object({
	id: z.string().describe("The token to check"),
});

export const Output = z.object({
	ok: z.boolean().describe("Whether the token was deleted"),
});

export const Error = {
	401: error(401, "Unauthorized"),
	404: error(404, "Token not found"),
};

export default new Endpoint({ Param, Output, Error, Modifier: MainkeyAuth }).handle(
	async ({ id }, { request }) => {
		const mainkey = request.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
		if (!mainkey) {
			throw Error[401];
		}

		const correct = await config.get("mainkey");
		if (mainkey !== correct) {
			throw Error[401];
		}

		const token = await db.deleteFrom("Token").where("Token.id", "=", id).executeTakeFirst();

		if (token.numDeletedRows === 0n) {
			throw Error[404];
		}

		return { ok: true };
	},
);
