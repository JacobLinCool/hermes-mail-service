import { config } from "$lib/server/config";
import { Endpoint, z, type RouteModifier } from "sveltekit-api";

export const Input = z.object({
	mainkey: z.string().describe("The main key"),
});

export const Output = z.object({
	ok: z.boolean().describe("Indicates if the main key is correct"),
});

export const Modifier: RouteModifier = (c) => {
	c.description =
		"Check if the main key is correct, and set a cookie if it is. Should only use this endpoint with management tools.";
	return c;
};

export default new Endpoint({ Input, Output }).handle(async (param, { cookies }) => {
	const mainkey = param.mainkey;
	const previous = await config.get("mainkey");
	if (previous && mainkey !== previous) {
		return { ok: false };
	}

	cookies.set("mainkey", mainkey, {
		path: "/",
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
		secure: true,
	});
	return { ok: true };
});
