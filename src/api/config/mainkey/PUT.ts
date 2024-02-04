import { MainkeyAuth } from "$api";
import { config } from "$lib/server/config";
import { Endpoint, error, z } from "sveltekit-api";

export const Input = z.object({
	mainkey: z.string().min(32).max(256).describe("The new main key to use for the service"),
});

export const Output = z.object({
	message: z.string().describe("A message indicating the success of the operation"),
});

export const Error = {
	401: error(401, "Previous main key does not match"),
};

export default new Endpoint({ Input, Output, Error, Modifier: MainkeyAuth }).handle(
	async (param, { request }) => {
		const mainkey = request.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
		const previous = await config.get("mainkey");
		if (previous && mainkey !== previous) {
			throw Error[401];
		}

		await config.set("mainkey", param.mainkey);

		return { message: "Updated" };
	},
);
