import { MainkeyAuth } from "$api";
import { config, type ConfigKey } from "$lib/server/config";
import { db } from "$lib/server/db";
import { Endpoint, error, z } from "sveltekit-api";

type Key = Exclude<ConfigKey, "mainkey">;

export const Output = z.object({
	config: z
		.record(z.enum<Key, [Key, ...Key[]]>(["cors", "save-raw"]), z.string().nullable())
		.describe("A map of configuration keys to their values"),
});

export const Error = {
	401: error(401, "Unauthorized"),
};

export default new Endpoint({ Output, Error, Modifier: MainkeyAuth }).handle(
	async (_, { request }) => {
		const mainkey = request.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
		if (!mainkey) {
			throw Error[401];
		}

		const correct = await config.get("mainkey");
		if (mainkey !== correct) {
			throw Error[401];
		}

		const result = await db
			.selectFrom("Config")
			.select(["Config.key", "Config.value"])
			.where("Config.key", "<>", "mainkey")
			.execute();

		return {
			config: Object.fromEntries(result.map((row) => [row.key, row.value])),
		};
	},
);
