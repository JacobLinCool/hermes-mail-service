<script lang="ts">
	export let data;

	const token = data.token;
	const records = data.records;

	const date = (timestamp: number) => new Date(timestamp).toLocaleString();
</script>

<main class="p-4">
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title">Token Summary</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<strong>ID:</strong>
					{token.id}
				</div>
				<div>
					<strong>Scope:</strong>
					{token.scope}
				</div>
				<div>
					<strong>Created:</strong>
					{date(token.created)}
				</div>
				<div>
					<strong>Expires:</strong>
					{date(token.expires)}
				</div>
				<div>
					<strong>Revoked:</strong>
					<span class:text-error={token.revoked}>
						{token.revoked ? `Revoked at ${date(token.revoked)}` : "Not Revoked"}
					</span>
				</div>
			</div>
		</div>
	</div>

	<div class="divider"></div>

	<div class="space-y-2">
		<h3 class="text-lg font-semibold">Recent Usage</h3>
		{#each records as record (record.timestamp)}
			<div class="collapse collapse-arrow rounded-box border border-base-300 bg-base-100">
				<input type="checkbox" />
				<div class="collapse-title text-xl font-medium">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div>
							<strong>Timestamp:</strong>
							{date(record.timestamp)}
						</div>
						<div>
							<strong>From:</strong>
							{record.from}
						</div>
						<div>
							<strong>To:</strong>
							{record.to}
						</div>
					</div>
				</div>
				<div class="collapse-content">
					<p><strong>Subject:</strong> {record.subject}</p>
					{#if record.raw}
						<pre><code>{record.raw}</code></pre>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</main>
