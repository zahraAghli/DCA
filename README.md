

# Nobitex DCA (Dollar-Cost-Averaging) Bot

This bot allows you to sit back and relax while it automatically invests in cryptocurrency on the Nobitex exchange for you. The bot allows you to set up recurring buys for any cryptocurrency supported on the exchange at any interval you want. Both fiat to crypto and crypto to crypto purchases supported.


---
## Contents

- [Nobitex DCA (Dollar-Cost-Averaging) Bot](#nobitex-dca-dollar-cost-averaging-bot)
  - [v2.0.0 breaking changes](#v200-breaking-changes)
  - [Contents](#contents)
  - [Setup](#setup)
    - [Generate API keys](#generate-api-keys)
    - [Create the project](#create-the-project)
  - [Configure the bot](#configure-the-bot)
    - [Environment Variables (.env)](#environment-variables-env)
  - [Running the bot](#running-the-bot)
  - 


### Create the project

[Node.js](https://nodejs.org) v16 or higher required.

```bash
git clone https://github.com/zahraAghli/DCA.git
npm install
```

## Configure the project

All the required settings needs to be set using Environment Variables or `.env` file.

Rename the `env.example` to `.env` file for a quick bootstrap.


### Environment Variables (.env)

These are all the supported settings:

| Name             | Description                                                                                  |           Required            |
| ---------------- | -------------------------------------------------------------------------------------------- | :---------------------------: |           |
| MONGODB_URI      | If using MongoDb Atlas this is the connection string                                         |              YES               |

## Running the project

Use this command to start the bot: `npm run start`. The program must stay running, and it will execute the buy orders at the defined schedules using cron jobs.