export const CONFIG: Config = {
	$DATE: 0,
};

export interface Config {
	/** This is used to check the cache status of the config */
	$DATE: number;
	/** This is the main key used to sign JWTs */
	MAIN_KEY?: string;
	/** Enable CORS? */
	CORS?: string;
	/** Default TTL for JWTs */
	DEFAULT_TTL?: number;
	/** If this is set, it will always check if the JWT is in the KV namespace before sending the email? */
	ALWAYS_CHECK?: boolean;
}
