<script lang="ts">
	import { t } from "svelte-i18n";
	import { fade } from "svelte/transition";

	export let key: string;

	let tokens: {
		jti: string;
		allowlist: string[];
		exp: number;
	}[] = [];

	let loading = false;
	async function load() {
		loading = true;
		try {
			const res = await fetch("/api/keys", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ key }),
			});
			if (res.ok) {
				const data = await res.json<{
					keys: {
						name: string;
						expiration: number;
						metadata: { allowlist: string[]; exp: number };
					}[];
				}>();
				tokens = data.keys.map((x) => ({
					jti: x.name.replace("jwt:", ""),
					allowlist: x.metadata.allowlist,
					exp: x.metadata.exp,
				}));
			}
		} finally {
			loading = false;
		}
	}

	async function revoke(jti: string) {
		loading = true;
		try {
			const res = await fetch(`/api/key/${jti}`, {
				method: "DELETE",
				headers: {
					"X-Key": key,
				},
			});
			if (res.ok) {
				tokens = tokens.filter((x) => x.jti !== jti);
			}
		} finally {
			loading = false;
		}
	}
</script>

<div>
	<div class="mb-8 flex flex-row items-center justify-between">
		<h1 class="text-2xl font-bold">{$t("issued-tokens")}</h1>
		<button class="btn-primary btn" on:click={load} disabled={loading}>{$t("refresh")}</button>
	</div>
	{#if tokens.length}
		<div class="flex w-full flex-col gap-4">
			<div class="flex w-full flex-row items-center justify-between gap-2">
				<div class="flex-1 text-sm font-bold">ID</div>
				<div class="flex-1 text-sm font-bold">{$t("allowlist")}</div>
				<div class="flex-1 text-sm font-bold">{$t("ttl")}</div>
				<div class="w-20 text-sm font-bold" />
			</div>
			{#each tokens as key, i (key.jti)}
				<div
					class="flex flex-row items-center justify-between gap-2"
					transition:fade={{ duration: 100, delay: i * 50 }}
				>
					<div class="flex-1 overflow-scroll text-sm">{key.jti}</div>
					<div class="flex-1 text-sm">{key.allowlist}</div>
					<div class="flex-1 text-sm">{new Date(key.exp * 1000).toLocaleString()}</div>
					<button
						class="btn-outline btn-error btn w-20"
						on:click={() => revoke(key.jti)}
						disabled={loading}
					>
						{$t("revoke")}
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
