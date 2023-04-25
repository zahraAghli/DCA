const us = require('underscore');
const config = require('../bin/config');
const request = require('request');
/**
 *
 * @description get cryptoCurrency list from nobitex state
 * @returns {Promise<any>}
 */
exports.addOrder = async () => {
  let symbolList = await config.mongoDb.collection("symbolList").find().toArray();
  symbolList = us.groupBy(symbolList, 'symbol');
  const users = await config.mongoDb.collection("user").find().toArray();
  for (const user of users) {
    for (const symbol of user.favorite) {
      let lastTrade = await config.mongoDb.collection("trade").find({
        symbol: symbol,
        user: user.username
      }).sort({date: -1}).limit(1).toArray();
      const symbolInfo = symbolList[symbol][0];
      if (lastTrade.length) {
        const changePricePercent = (symbolInfo.lastPrice - lastTrade.price) / lastTrade.price;
        if (changePricePercent >= symbolInfo.takeProfit) {
          //takeProfit
          const price = symbolInfo.lastPrice - lastTrade.price;
          const amount = price / symbolInfo.lastPrice;
          await nobitexOrder(symbol, user.token, 'sell', symbolInfo.lastPrice, amount)
        } else if (-1 * changePricePercent > symbolInfo.stopLoss) {
          //goingDown
          const price = symbolInfo.lastPrice;
          const amount = 0.1*user.asset / symbolInfo.lastPrice;
          await nobitexOrder(symbol, user.token, 'buy', price, amount)
        }
      }
      else {
        //first trade
        const price = symbolInfo.lastPrice;
        const amount = (0.1*user.asset / symbolInfo.lastPrice).toFixed(2);
        await nobitexOrder(symbol, user.token, 'buy', price, amount)
      }
    }
  }


}

/**
 * Create a market buy order
 * @param {string} symbol
 * @param {string} quantity
 * @param {string} quoteOrderQty
 */
async function nobitexOrder(symbol, token, type, price, amount) {
  return new Promise(resolve => {
    const index = symbol.search(/IRT|USDT$/)
    try {
      const params = {
        srcCurrency: symbol.substr(0,index),
        dstCurrency: symbol.substr(index),
        type,
        mode: 'default',
        execution: 'limit',//or market
        price,
        amount
      }
      const url = `${config.nobitexUrl}/market/orders/add`;
      const options = {
        method: 'POST',
        url,
        headers: {'Authorization': `Token ${token}`},
        formData: params
      };
      request(options, async function (error, response) {
        if (error) console.error(error);
        resolve(JSON.parse(response.body))//save to trade
      });

    } catch (error) {
      console.error(error);
    }
  })


}