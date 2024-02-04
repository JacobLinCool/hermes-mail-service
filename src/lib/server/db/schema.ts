export interface Config {
	key: string;
	value: string;
}

export interface Token {
	id: string;
	scope: string;
	created: number;
	expires: number;
	revoked: number | null;
}

export interface UsageRecord {
	token: string;
	timestamp: number;
	from: string;
	to: string;
	subject: string;
	raw: string | null;
}

interface sqlite_master {
	name: string;
	type: string;
	// ... others not used
}

export interface Database {
	Config: Config;
	Token: Token;
	UsageRecord: UsageRecord;
	sqlite_master: sqlite_master;
}
