import { browser } from "$app/environment";
import "$lib/i18n";
import { locale } from "svelte-i18n";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ data }) => {
	if (browser) {
		await locale.set(window.navigator.language);
	}

	return data;
};
