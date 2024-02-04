<script lang="ts">
	import { create } from "hermes-mail";
	import { page } from "$app/stores";
	import type { Token } from "$lib/server/db/schema";

	const client = create({ baseUrl: $page.url.origin });

	let scope = "^[a-zA-Z0-9._-]+@[^@]+$";
	// 30 days from now
	let expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 16);

	let issuing = false;
	let err = "";
	let token: Token | null = null;
	async function issue() {
		if (issuing) {
			return;
		}
		issuing = true;
		err = "";

		const { response, data } = await client.POST("/api/token", {
			body: { scope, expires: new Date(expires).getTime() },
		});
		if (!response.ok) {
			err = "Network error";
			issuing = false;
			return;
		}

		if (data) {
			token = data;
		} else {
			err = "Failed to issue token";
		}
		issuing = false;
	}
</script>

<div class="form-control mx-auto my-10 w-full max-w-xs">
	<h2 class="mb-6 text-center text-2xl font-bold">Issue Token</h2>
	<label class="label" for="">
		<span class="label-text">Scope</span>
	</label>
	<input
		type="text"
		bind:value={scope}
		placeholder="Enter scope"
		class="input input-bordered w-full max-w-xs"
		disabled={issuing}
	/>

	<label class="label" for="">
		<span class="label-text">Expires</span>
	</label>
	<input
		type="datetime-local"
		bind:value={expires}
		class="input input-bordered w-full max-w-xs"
		disabled={issuing}
	/>

	{#if err}
		<div class="alert alert-error mt-4 shadow-lg">
			<div>{err}</div>
		</div>
	{/if}

	<button type="button" class="btn btn-primary mt-4 w-full" on:click={issue} disabled={issuing}>
		{#if issuing}
			<div class="loading">Issuing...</div>
		{:else}
			Issue Token
		{/if}
	</button>

	{#if token}
		<div class="alert alert-success mt-4 shadow-lg">
			<div>Token issued successfully!</div>
			<div class="mt-2">
				<strong>ID:</strong>
				{token.id}
			</div>
		</div>
	{/if}
</div>
