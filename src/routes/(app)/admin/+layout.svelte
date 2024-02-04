<script>
	import Icon from "@iconify/svelte";
	let opened = false;
</script>

<div class="drawer">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content m-4 flex flex-col items-center justify-center">
		<!-- Page content here -->
		<label for="my-drawer" class="btn btn-outline btn-primary drawer-button">
			<Icon icon="mdi:menu" class="h-6 w-6" />
		</label>
	</div>
	<div class="drawer-side z-50">
		<label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
			<li>
				<a href="/admin/tokens">
					<Icon icon="mdi:key-chain" class="h-6 w-6" /> Tokens
				</a>
			</li>
			<li>
				<a href="/admin/issue">
					<Icon icon="mdi:key-plus" class="h-6 w-6" /> Issue Token
				</a>
			</li>
		</ul>
	</div>
</div>

<slot />
