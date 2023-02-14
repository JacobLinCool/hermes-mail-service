import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, params, fetch }) => {
	const target = new URL(`/template/${params.id}`, url.origin);
	url.searchParams.forEach((value, key) => target.searchParams.set(key, value));

	const res = await fetch(target);
	const text = await res.text();

	return json({ html: text });
};
