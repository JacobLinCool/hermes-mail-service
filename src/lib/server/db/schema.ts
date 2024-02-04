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

export interface Database {
	Config: Config;
	Token: Token;
	UsageRecord: UsageRecord;
}
