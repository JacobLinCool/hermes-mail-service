# ![icon](./static/hermes-xs.png) Hermes, mail service

Hermes is an open-source edge email sending service, which is designed to be easy to setup and use.

Example: [https://hermes.csie.cool/](https://hermes.csie.cool/)

|                 English                  |                 Chinese                  |
| :--------------------------------------: | :--------------------------------------: |
| ![en](./screenshots/hermes-owner-en.png) | ![zh](./screenshots/hermes-owner-zh.png) |

## Features

### Ease of Use

-   Manage the service through a web UI
-   I18n support (currently, English and Chinese)

### Secure

-   Token-based Authentication
-   Address and Domain Allowlist
-   Auto Expiration

## Getting Started

> First, you need to have a domain managed by Cloudflare.

1. [Fork the repository](https://github.com/JacobLinCool/hermes-mail-service/fork)
2. Setup the [Cloudflare Pages](https://pages.cloudflare.com/) for your forked repository
3. Binding a D1 database to your Cloudflare Pages project as `D1`
4. Open the setup page in your browser!

All of the above can be done in the browser! No need to install anything.

> It uses Mailchannels under the hood, so you also need to setup the [Domain Lockdown](https://community.cloudflare.com/t/introducing-mailchannels-domain-lockdown/523913) before sending emails.
> (Adding `_mailchannels` TXT record with value `v=mc1 cfid=your-hermes.pages.dev` to your domain)

## API Usage

Once you have generated a token, you can use the API to send emails.

See [OpenAPI documentation](hhttps://api-spec.pages.dev/rapidoc?url=https%3A%2F%2Fhermes.csie.cool%2Fapi%2Fopenapi.json) for more information.

## Credits

The icon is based on Boxicons [https://boxicons.com/](https://boxicons.com/).
