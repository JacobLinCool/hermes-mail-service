# Hermes, mail service

Hermes is a open-source edge email sending service, which is designed to be easy to setup and use.

Example: [https://hermes.csie.cool/](https://hermes.csie.cool/)

| English | Chinese |
|:-------------------------:|:-------------------------:|
|![en](https://i.imgur.com/TcMvBQn.png)|![](https://i.imgur.com/9NYRba9.png)|

## Features

- [x] Easy to Setup - You only need a browser to setup the service
- [x] Token-based authentication - Use allowlist and TTL to control the access
- [x] Web UI - Control the service from the anywhere
- [x] I18n - The web UI supports multiple languages (currently, English and Chinese)

## Getting Started

> First, you need to have a domain that is managed by Cloudflare.

1. Fork the repository
2. Setup the [Cloudflare Pages](https://pages.cloudflare.com/) for your forked repository
3. Binding a KV namespace to your Cloudflare Pages project
4. Set the `MAIN_KEY` environment variable in your Cloudflare Pages project

All of the above can be done in the browser! No need to install anything.

## API Usage

Once you have generated a token, you can use the API to send emails.

See [examples](./examples/) for more details.
