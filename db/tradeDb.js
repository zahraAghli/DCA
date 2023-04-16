const moment = require('moment-jalaali');
const MongoClient = require('mongodb').MongoClient;
const us = require('underscore');
const url = "mongodb://zahra.aghli:d0b34lSSHas4Yc43VS@127.0.0.1:27017/admin";
let dbo;
MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  dbo = db.db("DCA");
})

/**
 *
 * @description get cryptoCurrency list from nobitex state
 * @returns {Promise<any>}
 */
exports.addOrder = async () => {
  let symbolList = await dbo.collection("symbolList").find().toArray();
  symbolList = us.groupBy(symbolList, 'symbol');
  const users = await dbo.collection("user").find().toArray();
  for (const user of users) {
    for (const symbol of user.favorite) {
      let lastTrade = await dbo.collection("trade").find({
        symbol: symbol,
        user: user.username
      }).sort({date: -1}).limit(1).toArray();
      if (lastTrade) {
        const symbolInfo = symbolList[symbol][0];
        const changePricePercent = (symbolInfo.lastPrice - lastTrade.price) / lastTrade.price;
        if (changePricePercent >= symbolInfo.takeProfit) {
          //takeProfit
          const price = symbolInfo.lastPrice - lastTrade.price;
          const amount = price / symbolInfo.lastPrice;
          nobitexOrder(symbol, user.token, 'sell', price, amount)
        } else if (-1 * changePricePercent > symbolInfo.stopLoss) {
          //goingDown
          const price = symbolInfo.lastPrice;
          const amount = lastTrade.value / symbolInfo.lastPrice;
          nobitexOrder(symbol, user.token, 'buy', price, amount)
        }
      } else {
        //first trade
        const price = symbolInfo.lastPrice;
        const amount = 0.1*user.assert / symbolInfo.lastPrice;
        nobitexOrder(symbol, user.token, 'buy', price, amount)
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

    const res = symbol.match(/USDT|IRT/)
    try {
      const params = {
        srcCurrency: res[0],
        dstCurrency: res[1],
        type,
        mode: 'default',
        execution: 'limit',//or market
        price,
        amount,
      }
      const url = `https://api.nobiltex.ir/market/orders/add`;
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