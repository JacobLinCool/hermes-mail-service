<script lang="ts">
	import { t } from "svelte-i18n";
	import Tokens from "./Tokens.svelte";

	let key = "";
	let allowlist = "^.*@csie.cool$";
	let ttl = 60 * 60 * 24;

	let test_email = "";
	let result = "";
	function test() {
		const target = test_email.trim();

		if (!target) {
			result = "";
			return;
		}

		if (!allowlist.trim()) {
			return;
		}

		const regex = allowlist
			.split(",")
			.map((x) => x.trim())
			.map((x) => new RegExp(x));
		const match = regex.find((x) => x.test(target));
		if (match) {
			result = $t("matched", { values: { match: match.source } });
		} else {
			result = $t("no-match");
		}
	}

	let running = false;
	let jwt = "";
	let error = "";
	async function submit() {
		running = true;

		try {
			const res = await fetch("/api/key", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					key,
					allowlist: allowlist
						.split(",")
						.map((x) => x.trim())
						.filter((x) => x),
					ttl: Number(ttl),
				}),
			});
			if (res.ok) {
				const data = await res.json<{ jwt: string }>();
				jwt = data.jwt;
				error = "";
				prompt($t("token-created"), jwt);
			} else {
				throw new Error("Error " + res.status + ": " + (await res.text()));
			}
		} catch (err) {
			if (err instanceof Error) {
				error = err.message;
			} else {
				throw err;
			}
		} finally {
			running = false;
		}
	}
</script>

<div>
	<h1 class="mb-2 text-3xl font-bold uppercase text-primary">{$t("owner-mode")}</h1>

	<div class="form-control my-2 w-full">
		<label class="label" for="">
			<span class="label-text text-primary">{$t("main-key")}</span>
		</label>
		<input
			type="password"
			bind:value={key}
			placeholder={$t("owners-main-key")}
			class="input-bordered input-primary input w-full text-primary"
		/>
	</div>

	<div class="divider" />

	<div class="form-control my-2 w-full">
		<label class="label" for="">
			<span class="label-text text-primary">{$t("allowlist")}</span>
			<span class="label-text-alt text-primary">{$t("saperate-each-email-with-a-comma")}</span
			>
		</label>
		<input
			type="text"
			bind:value={allowlist}
			placeholder={$t("regexp-allowlist")}
			class="input-bordered input-primary input w-full text-primary"
			on:keyup={test}
		/>
		<label class="label" for="">
			<span class="label-text" />
			<span class="label-text-alt text-secondary">
				{$t("senders-email-must-match-the-allowlist-to-be-allowed-to-send-emails")}
			</span>
		</label>
	</div>

	<div class="form-control my-2 w-full">
		<label class="label" for="">
			<span class="label-text-alt">{$t("test-allowlist")}</span>
		</label>
		<input
			type="text"
			bind:value={test_email}
			placeholder={$t("test-email")}
			class="input-bordered input-primary input w-full"
			on:keyup={test}
		/>
		<label class="label" for="">
			<span class="label-text">{result}</span>
		</label>
	</div>

	<div class="form-control my-2 w-full">
		<label class="label" for="">
			<span class="label-text text-primary">{$t("ttl")}</span>
			<span class="label-text-alt text-primary">{$t("unit-seconds")}</span>
		</label>
		<input
			type="number"
			bind:value={ttl}
			placeholder={$t("regexp-allowlist")}
			class="input-bordered input-primary input w-full text-primary"
			on:keyup={test}
		/>
		<label class="label" for="">
			<span class="label-text" />
			<span class="label-text-alt text-secondary">
				{$t("ttl-range")}
			</span>
		</label>
	</div>

	<div class="divider" />

	<div class="form-control my-2 w-full">
		<button class="btn-primary btn" on:click={submit} disabled={running}>
			{$t("create-token")}
		</button>
	</div>

	{#if jwt}
		<div class="break-all text-primary">
			{jwt}
		</div>
	{/if}

	{#if error}
		<div class="break-all text-error">
			{error}
		</div>
	{/if}

	<div class="divider" />

	<Tokens {key} />
</div>
