import { config } from "$lib/server/config";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
	const mainkey = cookies.get("mainkey");
	const correct = await config.get("mainkey");
	if (mainkey !== correct) {
		redirect(302, "/login");
	}
};
