export function generate_token_id() {
	const prefix = "hermes";
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const length = 48;

	const vals = crypto.getRandomValues(new Uint8Array(length));
	const random = Array.from(vals)
		.map((val) => characters[val % characters.length])
		.join("");

	return `${prefix}-${random}`;
}
