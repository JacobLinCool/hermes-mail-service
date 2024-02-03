import { config } from "$lib/server/config";
import { check } from "$lib/server/db";
import { error as e } from "@sveltejs/kit";
import { Endpoint, error, z } from "sveltekit-api";

export const Output = z.object({
	message: z.string().describe("A message indicating the health of the service, always 'OK'"),
});

export const Error = {
	503: error(503, "Service unavailable, some configuration is missing"),
};

export async function healthcheck() {
	const err = await check();
	if (err) {
		e(503, `Database check failed: ${err}`);
	}

	const mainkey = await config.get("mainkey");
	if (!mainkey) {
		e(503, "Main key is not set");
	}

	return { message: "OK" };
}

export default new Endpoint({ Output, Error }).handle(healthcheck);
