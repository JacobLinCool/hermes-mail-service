import { building } from "$app/environment";
import { db } from "./db";

export type ConfigKey =
	| "mainkey"
	| "cors"
	| "save-raw"
	| "dkim_domain"
	| "dkim_selector"
	| "dkim_private_key";

class Config {
	protected cache = new Map<ConfigKey, string | null>();

	public async get(key: ConfigKey): Promise<string | null> {
		if (building) {
			return null;
		}

		if (!this.cache.has(key)) {
			const result = await db
				.selectFrom("Config")
				.select("value")
				.where("Config.key", "=", key)
				.executeTakeFirst();
			this.cache.set(key, result?.value || null);
		}

		return this.cache.get(key) || null;
	}

	public async set(key: ConfigKey, value: string): Promise<boolean> {
		if (building) {
			return true;
		}

		if (this.cache.has(key)) {
			if (this.cache.get(key) === value) {
				return false;
			}
		}

		this.cache.set(key, value);
		const result = await db
			.insertInto("Config")
			.values({ key, value })
			.onConflict((oc) => oc.doUpdateSet({ value }))
			.executeTakeFirst();
		return result.numInsertedOrUpdatedRows === 1n;
	}

	public async delete(key: ConfigKey): Promise<boolean> {
		if (building) {
			return true;
		}

		if (this.cache.has(key)) {
			this.cache.delete(key);
		}

		const result = await db
			.deleteFrom("Config")
			.where("Config.key", "=", key)
			.executeTakeFirst();
		return result.numDeletedRows === 1n;
	}
}

export const config = new Config();
