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
				// This is the main key used to sign JWTs
				MAIN_KEY: string;
				// If this is set, it will always check if the JWT is in the KV namespace before sending the email
				ALWAYS_CHECK?: string;
			};
		}
	}
}

export {};
