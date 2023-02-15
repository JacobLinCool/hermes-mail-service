import { waitLocale, t } from "svelte-i18n";

export async function $t(key: string): Promise<string> {
	await waitLocale();

	return await new Promise((resolve) => {
		const unsubscribe = t.subscribe((x) => {
			resolve(x(key));
			setTimeout(() => unsubscribe(), 0);
		});
	});
}
