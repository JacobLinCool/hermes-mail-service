<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { page } from "$app/stores";
	import Icon from "@iconify/svelte";
	import { create } from "hermes-mail";

	const client = create({ baseUrl: $page.url.origin });

	export let data;

	const tokens = data.tokens;

	const copy = async (text: string) => {
		await navigator.clipboard.writeText(text);
		alert("Copied to clipboard!");
	};

	const date = (timestamp: number) => new Date(timestamp).toLocaleString();

	async function revoke(id: string) {
		const confirmed = confirm("Are you sure you want to revoke this token?");
		if (confirmed) {
			const { response } = await client.DELETE("/api/token/{id}", {
				params: { path: { id } },
			});
			if (response.ok) {
				await invalidateAll();
			} else {
				alert("Failed to revoke token");
			}
		}
	}
</script>

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th>ID</th>
				<th>scope</th>
				<th>created</th>
				<th>expires</th>
				<th>revoked</th>
				<th>usage</th>
			</tr>
		</thead>
		<tbody>
			{#each tokens as token (token.id)}
				<tr class="hover">
					<th
						><input
							class="input input-bordered input-primary input-xs cursor-copy"
							readonly
							value={token.id}
							on:click={() => copy(token.id)}
						/></th
					>
					<td>{token.scope}</td>
					<td>{date(token.created)}</td>
					<td>{date(token.expires)}</td>
					<td>
						{#if token.revoked}
							<span class="text-error">{date(token.revoked)}</span>
						{:else}
							<button
								class="btn btn-outline btn-error btn-xs"
								on:click={() => revoke(token.id)}>Revoke</button
							>
						{/if}
					</td>
					<td>
						<a href="/token/{token.id}"><Icon icon="mdi:list-box" class="icon" /></a>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
