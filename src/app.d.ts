import type { KVNamespace } from "@cloudflare/workers-types";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface Platform {
			env?: {
				// We use this KV namespace to store JWTs
				STORE: KVNamespace;
				// Fall back to this key if the MAIN_KEY is not set in the config
				MAIN_KEY: string;
				// Fall back to this value if the ALWAYS_CHECK is not set in the config
				ALWAYS_CHECK?: string;
			};
		}
	}
}

export {};
