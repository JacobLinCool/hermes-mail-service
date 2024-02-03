import { DB } from "sveltekit-db";
import type { Database } from "./schema";

export const db = DB<Database>();

/**
 * Checks if the required tables exist in the database.
 * @returns A string containing the error, or null if no error was found.
 */
export async function check(): Promise<string | null> {
	const tables = await db.introspection.getTables();
	const names = tables.map((table) => table.name);
	const expected = ["Config", "Token", "UsageRecord"] satisfies (keyof Database)[];
	const missing = expected.filter((name) => !names.includes(name));

	if (missing.length) {
		return `Missing tables: ${missing.join(", ")}`;
	}

	return null;
}

export async function init() {
	await db.schema
		.createTable("Config")
		.ifNotExists()
		.addColumn("key", "text", (col) => col.primaryKey())
		.addColumn("value", "text", (col) => col.notNull())
		.execute();

	await db.schema
		.createTable("Token")
		.ifNotExists()
		.addColumn("id", "text", (col) => col.primaryKey())
		.addColumn("scope", "text", (col) => col.notNull())
		.addColumn("created", "integer", (col) => col.notNull())
		.addColumn("expires", "integer", (col) => col.notNull())
		.execute();

	await db.schema
		.createTable("UsageRecord")
		.ifNotExists()
		.addColumn("token", "text", (col) => col.references("Token.id"))
		.addColumn("timestamp", "integer", (col) => col.notNull())
		.addColumn("subject", "text", (col) => col.notNull())
		.addColumn("from", "text", (col) => col.notNull())
		.addColumn("to", "text", (col) => col.notNull())
		.addColumn("raw", "text")
		.execute();

	await db.schema
		.createIndex("TokenDate")
		.ifNotExists()
		.on("Token")
		.columns(["created", "expires"])
		.execute();

	await db.schema
		.createIndex("UsageRecordToken")
		.ifNotExists()
		.on("UsageRecord")
		.columns(["token"])
		.execute();

	await db.schema
		.createIndex("UsageRecordTimestamp")
		.ifNotExists()
		.on("UsageRecord")
		.columns(["timestamp desc"])
		.execute();
}
