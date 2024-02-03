import { MainkeyAuth } from "$api";
import { config, type ConfigKey } from "$lib/server/config";
import { Endpoint, error, z } from "sveltekit-api";

type Key = Exclude<ConfigKey, "mainkey">;

export const Param = z.object({
	key: z
		.enum<Key, [Key, ...Key[]]>(["cors", "save-raw"])
		.describe("The configuration key to set"),
});

export const Input = z.object({
	value: z.string().max(1024).describe("The new value to set for the configuration key"),
});

export const Output = z.object({
	message: z.string().describe("A message indicating the success of the operation"),
});

export const Error = {
	401: error(401, "Unauthorized"),
};

export default new Endpoint({ Param, Input, Output, Error, Modifier: MainkeyAuth }).handle(
	async (param, { request }) => {
		const mainkey = request.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
		if (!mainkey) {
			throw Error[401];
		}

		const correct = await config.get("mainkey");
		if (mainkey !== correct) {
			throw Error[401];
		}

		await config.set(param.key, param.value);

		return { message: "Updated" };
	},
);
