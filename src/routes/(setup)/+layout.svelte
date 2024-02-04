<script lang="ts">
	import { t } from "svelte-i18n";
	import "../styles.css";
</script>

<svelte:head>
	<title>{$t("hermes-mail-service")}</title>
	<meta name="description" content={$t("hermes-description")} />
</svelte:head>

<slot />
