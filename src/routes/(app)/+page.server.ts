import { healthcheck } from "$api/healthcheck/GET";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	try {
		await healthcheck();
	} catch {
		redirect(302, "/setup");
	}
};
