<script lang="ts">
	import { goto } from "$app/navigation";
	import { encode } from "$lib/mainkey";
	import { create } from "hermes-mail";
	import { page } from "$app/stores";

	const client = create({ baseUrl: $page.url.origin });

	let mainkey = "";
	let err = "";

	let inprogress = false;
	async function auth() {
		if (inprogress) {
			return;
		}
		inprogress = true;

		const { response, data, error } = await client.POST("/api/auth", {
			body: {
				mainkey: await encode(mainkey),
			},
		});
		if (!response.ok) {
			err = "Network error";
			inprogress = false;
			return;
		}

		if (data?.ok) {
			await goto("/admin", { replaceState: true });
		} else if (error) {
			err = error.message;
		}
		inprogress = false;
	}
</script>

<main class="w-full">
	<div class="card form-control mx-auto my-10 w-full max-w-xs">
		<h2 class="mb-6 text-center text-2xl font-bold">Log In</h2>
		<label class="label" for="mainkey">
			<span class="label-text">Main Key</span>
		</label>
		<input
			type="password"
			id="mainkey"
			name="mainkey"
			placeholder="Enter your key"
			class="input input-bordered w-full max-w-xs"
			required
			disabled={inprogress}
			bind:value={mainkey}
		/>
		<button class="btn btn-primary mt-4 w-full" disabled={inprogress} on:click={auth}>
			Log in
		</button>
		{#if err}
			<p class="text-error">
				{err}
			</p>
		{/if}
	</div>
</main>
