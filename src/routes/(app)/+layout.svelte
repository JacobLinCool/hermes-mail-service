<script lang="ts">
	import { t } from "svelte-i18n";
	import "./styles.css";
</script>

<svelte:head>
	<title>{$t("hermes-mail-service")}</title>
	<meta name="description" content={$t("hermes-description")} />
</svelte:head>

<div class="h-full w-full overflow-auto px-4 py-10">
	<div class="flex min-h-full w-full flex-col items-center justify-start gap-2">
		<div class="flex w-full max-w-3xl flex-row-reverse">
			<div class="dropdown-end dropdown">
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<label tabindex="0" class="btn m-1" for="">{$t("mode")}</label>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<ul
					tabindex="0"
					class="dropdown-content menu rounded-box w-40 bg-base-100 p-2 shadow"
				>
					<li><a href="/user">{$t("i-am-user")}</a></li>
					<li><a href="/owner">{$t("i-am-owner")}</a></li>
				</ul>
			</div>
		</div>
		<div
			class="w-full max-w-3xl rounded-lg border border-primary p-8 text-primary shadow transition-all hover:shadow-md"
		>
			<slot />
		</div>
	</div>
</div>
