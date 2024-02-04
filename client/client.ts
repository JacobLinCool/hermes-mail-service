import type { paths } from "./api";
import client from "./openapi-fetch";

export type Client = typeof client<paths>;

export function create(...args: Parameters<Client>) {
	return client<paths>(...args);
}

export type { paths } from "./api";
