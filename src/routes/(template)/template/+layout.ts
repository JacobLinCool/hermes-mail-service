import type { LayoutLoad } from "./$types";

export const csr = false;

export const load: LayoutLoad = async ({ url }) => {
	const params = Object.fromEntries(url.searchParams.entries());

	return { ...params };
};
