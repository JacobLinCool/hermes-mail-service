import ListTokens from "$api/token/GET";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (req) => {
	const query = req.url.searchParams;
	const offset = parseInt(query.get("offset") || "0");
	const limit = parseInt(query.get("limit") || "100");

	const { tokens } = await ListTokens.default(
		{ offset, limit, order: "desc", sort: "created" },
		req,
	);

	return { tokens };
};
