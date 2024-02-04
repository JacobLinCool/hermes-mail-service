import GetToken from "$api/token/[id]/GET";
import GetRecords from "$api/token/[id]/records/GET";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (evt) => {
	const token = await GetToken.default(evt.params, evt);
	const { records } = await GetRecords.default(evt.params, evt);
	return { token, records };
};
