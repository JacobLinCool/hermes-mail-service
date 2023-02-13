<script lang="ts">
	import { t } from "svelte-i18n";
</script>

<p>{$t("select-a-mode-to-start")}</p>

<div class="divider" />

<div class="prose text-primary">
	<h1 class="text-primary">{$t("hermes-mail-service")}</h1>

	<p>
		{$t("hermes-description")}
	</p>

	<p>{$t("you-can-use-it-to-send-emails-from-your-own-domain-managed-by-cloudflare")}</p>

	<p>{$t("the-setup-is-very-easy-and-all-steps-can-be-done-directly-in-your-browser")}</p>

	<ol>
		<li>
			<a
				href="https://github.com/JacobLinCool/hermes-mail-service/fork"
				target="_blank"
				rel="noreferrer"
				class="link-primary link"
			>
				{$t("fork-the-repository")}
			</a>
		</li>
		<li>{$t("setup-the-cloudflare-pages")}</li>
		<li>{$t("bind-a-kv-namespace")}</li>
		<li>{$t("set-environment-variable")}</li>
	</ol>

	<p>
		{$t(
			"after-you-have-completed-the-setup-you-can-generate-a-token-and-use-it-to-send-emails-through-the-api",
		)}
	</p>
</div>
