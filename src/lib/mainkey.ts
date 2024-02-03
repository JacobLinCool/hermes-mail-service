export async function encode(raw: string): Promise<string> {
	const encoded = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
	const hash = Array.from(new Uint8Array(encoded))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return hash;
}
