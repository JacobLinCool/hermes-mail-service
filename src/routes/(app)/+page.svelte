<script lang="ts">
	import { t } from "svelte-i18n";
</script>

<div class="h-full w-full overflow-auto px-4 py-10">
	<div class="flex min-h-full w-full flex-col items-center justify-start gap-2">
		<div class="flex w-full max-w-3xl flex-row-reverse">
			<a class="btn" href="/admin">{$t("i-am-owner")}</a>
		</div>
		<div
			class="w-full max-w-3xl rounded-lg border border-primary p-8 text-primary shadow transition-all hover:shadow-md"
		>
			<div class="prose text-primary">
				<h1 class="text-primary">{$t("hermes-mail-service")}</h1>

				<p>
					{$t("hermes-description")}
				</p>

				<p>
					{$t("you-can-use-it-to-send-emails-from-your-own-domain-managed-by-cloudflare")}
				</p>

				<p>
					{$t(
						"the-setup-is-very-easy-and-all-steps-can-be-done-directly-in-your-browser",
					)}
				</p>

				<ol>
					<li>
						<a
							href="https://github.com/JacobLinCool/hermes-mail-service/fork"
							target="_blank"
							rel="noreferrer"
							class="link link-primary"
						>
							{$t("fork-the-repository")}
						</a>
					</li>
					<li>{$t("setup-the-cloudflare-pages")}</li>
					<li>{$t("bind-a-d1-database")}</li>
				</ol>

				<p>
					{$t(
						"after-you-have-completed-the-setup-you-can-generate-a-token-and-use-it-to-send-emails-through-the-api",
					)}
				</p>
			</div>
		</div>
	</div>
</div>
