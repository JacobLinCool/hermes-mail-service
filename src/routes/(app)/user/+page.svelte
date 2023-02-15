<script lang="ts">
	import { t } from "svelte-i18n";
	import { fade } from "svelte/transition";
	import { decode } from "@tsndr/cloudflare-worker-jwt";

	let jwt = "";

	let is_jwt = false;
	let exp: Date;
	let allowlist: string[] = [];
	function check() {
		try {
			const result = decode(jwt).payload;
			is_jwt = true;
			allowlist = result.allowlist;
			exp = new Date((result.exp || 0) * 1000);
		} catch {
			is_jwt = false;
		}
	}
</script>

<div>
	<h1 class="mb-2 text-3xl font-bold uppercase text-primary">{$t("user-mode")}</h1>

	<div class="form-control my-2 w-full">
		<label class="label" for="">
			<span class="label-text text-primary">{$t("token")}</span>
		</label>
		<input
			type="text"
			bind:value={jwt}
			on:keyup={check}
			placeholder={$t("user-jwt")}
			class="input-bordered input-primary input w-full text-primary"
		/>
	</div>

	<div class="divider" />

	{#if jwt}
		{#if is_jwt}
			<div
				class="w-full rounded-xl border border-success p-6"
				transition:fade={{ duration: 100 }}
			>
				<p class="font-bold">{$t("allowlist")}</p>

				{#each allowlist as email}
					<p class="my-2">{email}</p>
				{/each}

				<div class="divider" />

				<p class="font-bold">{$t("ttl")}</p>

				<p class="my-2">{exp.toLocaleString()}</p>
			</div>
		{:else}
			<div
				class="w-full rounded-xl border border-error p-6"
				transition:fade={{ duration: 100 }}
			>
				<span>{$t("invalid-token")}</span>
			</div>
		{/if}
	{/if}
</div>
