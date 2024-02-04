import { config } from "$lib/server/config";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
	const mainkey = cookies.get("mainkey");
	const correct = await config.get("mainkey");
	if (mainkey === correct) {
		redirect(302, "/admin");
	}
};
