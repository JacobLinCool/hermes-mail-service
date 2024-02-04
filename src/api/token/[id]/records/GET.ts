import { db } from "$lib/server/db";
import type { UsageRecord } from "$lib/server/db/schema";
import { Endpoint, error, z } from "sveltekit-api";

export const Param = z.object({
	id: z.string().describe("The token to check"),
});

export const Output = z.object({
	records: z.array(
		z.object({
			token: z.string().describe("The token ID"),
			timestamp: z.number().describe("The timestamp of the record"),
			from: z.string().describe("The source of the record"),
			to: z.string().describe("The destination of the record"),
			subject: z.string().describe("The subject of the record"),
			raw: z.string().nullable().describe("The raw data of the send request"),
		}),
	),
}) satisfies z.ZodSchema<{ records: UsageRecord[] }>;

export const Error = {
	404: error(404, "Token not found"),
};

export default new Endpoint({ Param, Output, Error }).handle(async ({ id }) => {
	const records = await db
		.selectFrom("UsageRecord")
		.selectAll()
		.where("UsageRecord.token", "=", id)
		.orderBy("UsageRecord.timestamp", "desc")
		.limit(10)
		.execute();

	return { records };
});
