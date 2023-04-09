

# Nobitex DCA (Dollar-Cost-Averaging) Bot

This bot allows you to sit back and relax while it automatically invests in cryptocurrency on the Nobitex exchange for you. The bot allows you to set up recurring buys for any cryptocurrency supported on the exchange at any interval you want. Both fiat to crypto and crypto to crypto purchases supported.


---
## Contents

- [Binance DCA (Dollar-Cost-Averaging) Bot](#binance-dca-dollar-cost-averaging-bot)
  - [v2.0.0 breaking changes](#v200-breaking-changes)
  - [Contents](#contents)
  - [Setup](#setup)
    - [Generate API keys](#generate-api-keys)
    - [Create the project](#create-the-project)
  - [Configure the bot](#configure-the-bot)
    - [Trades.js file](#tradesjs-file)
      - [Trades object](#trades-object)
    - [Environment Variables (.env)](#environment-variables-env)
  - [Running the bot](#running-the-bot)
  - 


### Create the project

[Node.js](https://nodejs.org) v13 or higher required.

```bash
git clone https://github.com/lukeliasi/binance-dca-bot.git](https://github.com/zahraAghli/DCA.git
cd DCA
npm install
```

## Configure the bot

All the required settings needs to be set using Environment Variables or `.env` file. The trades you want to make can be configured in a `trades.js` file in the root or with environment variables.

Rename the `env.example` to `.env` file for a quick bootstrap.

### Trades.js file

Configure the `trades.js` file in the root, you can uncomment and edit the provided example file.

**NB:** you may also define trades as an Environment Variables (see section below).

#### Trades object

| Parameter                     | Description                                                                                                                                                                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `asset`                       | The asset you want to buy                                                                                                                                                                                                                                                |
| `currency`                    | The currency you want to use to buy the asset. E.g: "USD", "GBP", "BTC" etc...                                                                                                                                                                                           |
| `quoteOrderQty` or `quantity` | Use `quoteOrderQty` for the amount you want to spend/invest or alternatively you can set `quantity` to buy a set amount of the asset regardless of price. Note [Binance trading rules](https://www.binance.com/en/trade-rule) pairs have minimum and maximum order sizes |
| `schedule`                    | A cron expression to set when the buy order should execute for this asset. See [Crontab.guru](https://crontab.guru/) for help setting up schedules. You can omit this `schedule` parameter and the buy order will execute immediately                                    |


### Environment Variables (.env)

**NB:** `TRADES` environment variable has priority over the `trades.js` file values.

These are all the supported settings:

| Name             | Description                                                                                  |           Required            |
| ---------------- | -------------------------------------------------------------------------------------------- | :---------------------------: |
| NOBITEX_TOKEN      | Your Nobitex token                                                                         |              YES              |
| SENDGRID_SECRET  | SendGrid API key for the bot to send you email notifications when buy orders are executed    |              NO               |
| SENDGRID_FROM    | If using SendGrid notifications this is the sender email address                             |              NO               |
| SENDGRID_TO      | If using SendGrid notifications this is the recipient email address                          |              NO               |
| TELEGRAM_TOKEN   | If using Telegram notifications this value is the BotFather's generated token                |              NO               |
| TELEGRAM_CHAT_ID | If using Telegram notifications this value is the chat identifier to which send notification |              NO               |
| MONGODB_URI      | If using MongoDb Atlas this is the connection string                                         |              NO               |
## Running the bot

Use this command to start the bot: `npm run start`. The program must stay running, and it will execute the buy orders at the defined schedules using cron jobs.
