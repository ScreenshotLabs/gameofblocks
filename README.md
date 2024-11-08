# Gameofblock

Gameofblock tap-to-earn telegram mini-app.

## Tech Stack

- [Next.js](https://nextjs.org/) - framework
- [TypeScript](https://www.typescriptlang.org/) - language
- [TON Connect](https://docs.ton.org/develop/dapps/ton-connect/overview)
- [Telegram apps SDK](https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/2-x)
- [Node telegram bot api](https://github.com/yagop/node-telegram-bot-api)
- [Tailwind](https://tailwindcss.com/) - CSS
- [PostgreSQL](https://vercel.com/storage/postgres) - database
- [Turborepo](https://turbo.build/repo) - monorepo
- [Resend](https://resend.com/) - emails
- [Vercel](https://vercel.com/) - deployments

## Apps and Packages

The apps directory contains the code for:

- app: Telegram mini-app
- bot: Telegram bot nodejs application
- contracts: Cairo contracts used by TMA
- deployer: Scripts for deploying contract on sepolia and mainnet

The packages directory contains the code for:

- ui: UI component library.
- tooling: A collection of configs used by apps and packages.

The tooling directory contains configs for:
- eslint
- github
- prettier
- tailwind
- typescript

## Development

### Install

Install dependencies

```bash
pnpm install
```

Set up environment variables

```bash
cp .env.example .env
```

Start mini-app

```
pnpm dev -f @gameofblocks/app
```

### Run inside telegram

Before you start, make sure you have already created a Telegram Bot. Here is
a [comprehensive guide](https://docs.telegram-mini-apps.com/platform/creating-new-app)
on how to do it.

- Start app
- Use ngrok for tunneling
- Create Telegram bot
- Create Telegram mini-app

### Scripts

This project contains the following scripts:

- `dev`. Runs the application in development mode.
- `dev:https`. Runs the application in development mode using self-signed SSL
  certificate.
- `build`. Builds the application for production.
- `start`. Starts the Next.js server in production mode.
- `lint`. Runs [eslint](https://eslint.org/) to ensure the code quality meets
  the required
  standards.

## Contributing

We love our contributors! Here's how you can contribute:

- [Open an issue](https://github.com/ScreenshotLabs/gameofblocks/issues) if you believe you've encountered a bug.
- Make a [pull request](https://github.com/ScreenshotLabs/gameofblocks/pull) to add new features/make quality-of-life improvements/fix bugs.

## Useful Links

- [Platform documentation](https://docs.telegram-mini-apps.com/)
- [@telegram-apps/sdk-react documentation](https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk-react)
- [Telegram developers community chat](https://t.me/devs)
