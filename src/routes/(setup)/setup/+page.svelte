<script lang="ts">
	import { goto } from "$app/navigation";
	import { encode } from "$lib/mainkey";
	import { create } from "hermes-mail";
	import { page } from "$app/stores";

	const client = create({ baseUrl: $page.url.origin });

	let mainkey = "";
	let cors = false;
	let save_raw = false;
	let error = "";

	async function setup() {
		error = "";

		if (mainkey.length === 0) {
			error = "Main Key is required";
			return;
		}

		const encoded = await encode(mainkey);
		const res1 = await client.PUT("/api/config/mainkey", {
			headers: { Authorization: `Bearer ${encoded}` },
			body: { mainkey: encoded },
		});
		if (!res1.response.ok) {
			error = "Failed to save main key";
			return;
		}

		const res2 = await client.PUT("/api/config/{key}", {
			params: { path: { key: "cors" } },
			headers: { Authorization: `Bearer ${encoded}` },
			body: { value: cors ? "*" : "" },
		});
		if (!res2.response.ok) {
			error = "Failed to save CORS setting";
			return;
		}

		const res3 = await client.PUT("/api/config/{key}", {
			params: { path: { key: "save-raw" } },
			headers: { Authorization: `Bearer ${encoded}` },
			body: { value: save_raw ? "true" : "" },
		});
		if (!res3.response.ok) {
			error = "Failed to save Save Raw Request setting";
			return;
		}

		await goto("/", { invalidateAll: true });
	}
</script>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content flex-col lg:flex-row-reverse">
		<div class="ml-4 text-center lg:text-left">
			<h1 class="text-5xl font-bold">Setup</h1>
			<p class="py-6">Complete your new Hermes Mail Service installation.</p>
			{#if error}
				<div class="alert alert-error">{error}</div>
			{/if}
		</div>
		<div class="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
			<form class="card-body">
				<div class="form-control">
					<label class="label" for="">
						<span class="label-text">Main Key</span>
					</label>
					<input
						type="password"
						class="input input-bordered"
						required
						bind:value={mainkey}
					/>
					<label class="label" for="">
						<span class="label-text-alt">
							Main Key is used to manage the tokens. Please keep it safe and do not
							share it with anyone.
						</span>
					</label>
				</div>
				<div class="form-control">
					<label class="label" for="">
						<span class="label-text">Enable CORS</span>
					</label>
					<input type="checkbox" class="toggle" bind:checked={cors} />
					<label class="label" for="">
						<span class="label-text-alt">
							Enable Cross-Origin Resource Sharing (CORS) to allow the frontend from
							different domain to access the API.
						</span>
					</label>
				</div>
				<div class="form-control">
					<label class="label" for="">
						<span class="label-text">Save Raw Request</span>
					</label>
					<input type="checkbox" class="toggle" bind:checked={save_raw} />
					<label class="label" for="">
						<span class="label-text-alt">
							Basic informations are always recorded. Enable this option to save the
							full sending requests.
						</span>
					</label>
				</div>
				<div class="form-control mt-6">
					<button class="btn btn-primary" on:click={setup}>Configure and Start</button>
				</div>
			</form>
		</div>
	</div>
</div>
