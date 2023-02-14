<script lang="ts">
	export let data: Record<string, string>;
	const name = data.name || "User";
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-2">
	<div class="prose flex max-w-md flex-col justify-center">
		<h1 class="text-xl">Hello, {name}!</h1>
		<p class="text-lg">
			I am Hermes. <br />
			I am an open-source edge email sending service, which is designed to be easy to setup and
			use.
		</p>

		<a
			class="btn-outline btn"
			href="https://github.com/JacobLinCool/hermes-mail-service"
			target="_blank"
			rel="noreferrer"
		>
			Start using Hermes
		</a>
	</div>
</div>
