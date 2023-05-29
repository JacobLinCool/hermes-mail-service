<script lang="ts">
	export let data: Record<string, string>;
	const icon = data.icon ?? "https://hermes.csie.cool/hermes.png";
	const greeting = data.greeting ?? "Hello, My Friend!";
	const main = data.main ?? "Try Hermes, an open-source edge email sending service.";
	const body =
		data.body ??
		"Hermes is designed to be easy to setup and use. It is a simple and lightweight service that can be deployed in a few minutes.";
	const link = data.link ?? "More,https://github.com/JacobLinCool/hermes-mail-service";
	const footer =
		data.footer ??
		"GitHub,https://github.com/JacobLinCool/hermes-mail-service;Demo,https://hermes.csie.cool";

	const [link_name, link_url] = link.split(",");
	const footers = footer.split(";").map((f) => f.split(","));

	function create_ld(): string {
		return `<${"script"} type=3D"application/ld+json">${JSON.stringify([
			{
				"@context": "http://schema.org",
				"@type": "EmailMessage",
				potentialAction: {
					"@type": "ViewAction",
					target: link_url,
					url: link_url,
					name: link_name,
				},
				description: main,
				publisher: {
					"@type": "Organization",
					name: "Hermes Mail Service",
					url: "https://hermes.csie.cool",
				},
			},
		])}</${"script"}>`;
	}
</script>

<head>
	<meta name="x-apple-disable-message-reformatting" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
	<meta name="color-scheme" content="light dark" />
	<meta name="supported-color-schemes" content="light dark" />
	<!--[if mso]>
			<noscript>
				<xml>
					<o:OfficeDocumentSettings xmlns:o="urn:schemas-microsoft-com:office:office">
						<o:PixelsPerInch>96</o:PixelsPerInch>
					</o:OfficeDocumentSettings>
				</xml>
			</noscript>
			<style>
				td,
				th,
				div,
				p,
				a,
				h1,
				h2,
				h3,
				h4,
				h5,
				h6 {
					font-family: "Segoe UI", sans-serif;
					mso-line-height-rule: exactly;
				}
			</style>
		<![endif]-->
	<title>{main}</title>
	<style>
		@keyframes spin {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}
		@keyframes button-pop {
			0% {
				transform: scale(var(--btn-focus-scale, 0.95));
			}
			40% {
				transform: scale(1.02);
			}
			100% {
				transform: scale(1);
			}
		}
		@keyframes checkmark {
			0% {
				background-position-y: 5px;
			}
			50% {
				background-position-y: -2px;
			}
			100% {
				background-position-y: 0;
			}
		}
		@keyframes progress-loading {
			50% {
				left: 107%;
			}
		}
		@keyframes radiomark {
			0% {
				box-shadow: 0 0 0 12px hsl(var(--b1)) inset, 0 0 0 12px hsl(var(--b1)) inset;
			}
			50% {
				box-shadow: 0 0 0 3px hsl(var(--b1)) inset, 0 0 0 3px hsl(var(--b1)) inset;
			}
			100% {
				box-shadow: 0 0 0 4px hsl(var(--b1)) inset, 0 0 0 4px hsl(var(--b1)) inset;
			}
		}
		@keyframes rating-pop {
			0% {
				transform: translateY(-0.125em);
			}
			40% {
				transform: translateY(-0.125em);
			}
			100% {
				transform: translateY(0);
			}
		}
		td {
			white-space: nowrap;
			padding: 1rem;
			vertical-align: middle;
		}
		tbody,
		tfoot :where(tr:not(:last-child) :where(th, td)) {
			border-bottom-width: 1px;
			--tw-border-opacity: 1;
			border-color: hsl(var(--b2, var(--b1)) / var(--tw-border-opacity));
		}
		tfoot :where(th, td) {
			--tw-bg-opacity: 1;
			background-color: hsl(var(--b2, var(--b1)) / var(--tw-bg-opacity));
			font-size: 0.75rem;
			line-height: 1rem;
			font-weight: 700;
			text-transform: uppercase;
		}
		.table :where(tbody th, tbody td) {
			--tw-bg-opacity: 1;
			background-color: hsl(var(--b1) / var(--tw-bg-opacity));
		}
		td:first-child {
			border-top-left-radius: 0.5rem;
		}
		td:last-child {
			border-top-right-radius: 0.5rem;
		}
		td:first-child {
			border-bottom-left-radius: 0.5rem;
		}
		td:last-child {
			border-bottom-right-radius: 0.5rem;
		}
		@keyframes toast-pop {
			0% {
				transform: scale(0.9);
				opacity: 0;
			}
			100% {
				transform: scale(1);
				opacity: 1;
			}
		}
		:root {
			color-scheme: light dark;
		}
		.hover-bg-purple-500:hover {
			background-color: #a855f7 !important;
		}
		.hover-text-decoration-underline:hover {
			text-decoration: underline;
		}
		@media (max-width: 600px) {
			.sm-w-full {
				width: 100% !important;
			}
			.sm-px-6 {
				padding-left: 24px !important;
				padding-right: 24px !important;
			}
			.sm-py-8 {
				padding-top: 32px !important;
				padding-bottom: 32px !important;
			}
			.sm-leading-8 {
				line-height: 32px !important;
			}
		}
	</style>
</head>
<body
	style="
			-webkit-font-smoothing: antialiased;
			word-break: break-word;
			margin: 0;
			width: 100%;
			background-color: #f8fafc;
			padding: 0;
		"
>
	<div style="display: none">
		{main}
		{body}
	</div>
	<div role="article" aria-roledescription="email" aria-label={main} lang="en">
		<table
			style="
					width: 100%;
					font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
				"
			cellpadding="0"
			cellspacing="0"
			role="presentation"
		>
			<tr>
				<td align="center" style="background-color: #f8fafc">
					<table
						class="sm-w-full"
						style="width: 600px"
						cellpadding="0"
						cellspacing="0"
						role="presentation"
					>
						<tr>
							<td class="sm-py-8 sm-px-6" style="padding: 48px; text-align: center">
								<a href={link_url}>
									<img
										src={icon}
										width="70"
										alt="icon"
										style="
												border: 0;
												max-width: 100%;
												vertical-align: middle;
											"
									/>
								</a>
							</td>
						</tr>
						<tr>
							<td align="center" class="sm-px-6">
								<table
									style="width: 100%"
									cellpadding="0"
									cellspacing="0"
									role="presentation"
								>
									<tr>
										<td
											class="sm-px-6"
											style="
													border-radius: 4px;
													background-color: #fff;
													padding: 48px;
													text-align: left;
													font-size: 16px;
													line-height: 24px;
													color: hsl(var(--bc));
													box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
												"
										>
											<p>{greeting}</p>
											<p
												class="sm-leading-8"
												style="
														margin: 0;
														margin-bottom: 24px;
														font-size: 24px;
														font-weight: 600;
														color: hsl(var(--bc));
													"
											>
												{main}
											</p>
											<p style="margin: 0; margin-bottom: 24px">
												{body}
											</p>
											{#if link_name}
												<div style="line-height: 100%">
													<a
														href={link_url}
														class="hover-bg-purple-500"
														style="
															text-decoration: none;
															display: inline-block;
															border-radius: 4px;
															background-color: #7e22ce;
															padding-left: 16px;
															padding-right: 16px;
															padding-top: 14px;
															padding-bottom: 14px;
															text-align: center;
															font-size: 16px;
															font-weight: 600;
															color: #fff;
															transition-property: all;
															transition-timing-function: cubic-bezier(
																0.4,
																0,
																0.2,
																1
															);
															transition-duration: 150ms;
														"
													>
														<!--[if mso]>
															<i
																style="
																	mso-text-raise: 30px;
																	letter-spacing: 24px;
																"
																>&#8202;</i
															>
														<![endif]-->
														<span style="mso-text-raise: 16px"
															>{link_name}</span
														>
														<!--[if mso]>
															<i style="letter-spacing: 24px"
																>&#8202;</i
															>
														<![endif]-->
													</a>
												</div>
											{/if}
										</td>
									</tr>
									<!-- svelte-ignore a11y-no-interactive-element-to-noninteractive-role -->
									<tr role="separator">
										<td style="height: 48px" />
									</tr>
									<tr>
										<td
											style="
													padding-left: 24px;
													padding-right: 24px;
													text-align: center;
													font-size: 12px;
													color: #475569;
												"
										>
											<p style="cursor: default">
												{#each footers as footer, i}
													<a
														href={footer[1]}
														target="_blank"
														rel="noreferrer"
														class="hover-text-decoration-underline"
														style="
														text-decoration: none;
														color: #7e22ce;
													">{footer[0]}</a
													>
													{#if i !== footers.length - 1}
														・
													{/if}
												{/each}
											</p>
											<p style="margin: 0; font-style: italic">
												Send via <a
													href="https://github.com/JacobLinCool/hermes-mail-service"
													target="_blank"
													rel="noreferrer"
													class="hover-text-decoration-underline"
													style="
														text-decoration: none;
														color: #7e22ce;
													">Hermes</a
												>. An open-source edge email sending service.
											</p>
										</td>
									</tr>
									<!-- svelte-ignore a11y-no-interactive-element-to-noninteractive-role -->
									<tr role="separator">
										<td style="height: 24px" />
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</div>
</body>

{@html create_ld()}
