import { healthcheck } from "$api/healthcheck/GET";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	let ok = false;
	try {
		await healthcheck();
		ok = true;
	} catch {}

	if (ok) {
		redirect(301, "/");
	}
};
