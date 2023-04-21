const moment = require('moment-jalaali');
const axios = require('axios');
const config = require ('../bin/config')
/**
 * @description get symbols history
 * @returns {Promise<string>}
 */
exports.getHistory = async () => {
  const symbolList = await config.mongoDb.collection("symbolList").find({}).toArray();
  for (const symbol of symbolList) {
    try {
      await getSymbolHistory(symbol.symbol)
    } catch (err) {
      console.log(err.message)
    }
  }
  return true;
}

/**
 * @description set start&end date for each symbol
 * @param symbol
 * @returns {Promise<unknown>}
 */
async function getSymbolHistory(symbol) {
  const lastData = await config.mongoDb.collection("symbolHistory").find({symbol}).sort({"date": -1}).limit(1).toArray();
  const startDate = lastData[0]?.date || Math.floor(new Date('2009.01.01').getTime() / 1000)
  const endDate = Math.floor(new Date().getTime() / 1000)
  return new Promise(async (resolve, reject) => {
    for (let page = 1; ; page++) {
      try {

        if (await nobitexHistory( symbol,startDate,endDate,page) < 499) break;// اگر تعداد کندل ها بیش از 499 باشن بایستی page بعدی را هم بگیریم
      } catch (e) {
        reject(e)
      }
    }
    resolve(true)
  })

}

/**
 * @description get cryptoCurrency history from nobitex history
 * @param symbol symbolName
 * @param startDate
 * @param endDate
 * @param page pageNum
 * @returns {Promise<unknown>}
 */
async function nobitexHistory(symbol,startDate,endDate,page) {
  return new Promise((resolve, reject) => {
    const obj = {
      method: 'get',
      url: `https://api.nobitex.ir/market/udf/history?symbol=${symbol}&resolution=D&from=${startDate}&to=${endDate}&page=${page}`,
    };
    axios(obj)
      .then(async function (response) {
        let data = response.data;
        const dataLength = data?.t?.length || 0;
        for (let i = 0; i < dataLength; i++) {
          const output = {
            symbol,
            date: data.t[i],
            openPrice: data.o[i],
            highPrice: data.h[i],
            lowPrice: data.l[i],
            closePrice: data.c[i],
            volume: data.v[i],
            jalaaliDate: moment(new Date(data.t[i] * 1000)).format('jYYYY/jMM/jDD'),
          }
          await config.mongoDb.collection("symbolHistory").updateOne(
            {symbol: output.symbol, date: output.date},
            {$set: output},
            {upsert: true})
        }
        console.log(symbol, '==>', dataLength, ' fetched')
        resolve(dataLength)
      })
      .catch(function (error) {
        reject(error);
      })
  })

}

/**
 *
 * @description get cryptoCurrency list from nobitex state
 * @returns {Promise<any>}
 */
exports.getList = () => {
  return new Promise((resolve, reject) => {
    const config = {
      method: 'get',
      url: 'https://api.nobitex.ir/market/stats?srcCurrency=btc,eth,etc,usdt,ada,bch,ltc,bnb,eos,xlm,xrp,trx,doge,uni,link,dai,dot,shib,aave,ftm,matic,axs,mana,sand,avax,usdc,gmt,mkr,sol,atom,grt,bat,near,ape,qnt,chz,xmr,egala,busd,algo,hbar,1inch,yfi,flow,snx,enj,crv,fil,wbtc,ldo,dydx,apt,mask,comp,bal,lrc,lpt,ens,sushi,api3,one,glm,pmn,dao,cvc,nmr,storj,snt,ant,zrx,slp,egld,imx,blur,100k_floki,1b_babydoge&dstCurrency=irt,usdt'
    };
    axios(config)
      .then(async function (response) {
        let data = response.data.stats;
        let result = [];
        for (let item of Object.keys(data)) {
          const symbol = item.replace('-', '').toUpperCase();
          item = data[item]
          const output = {
            symbol,
            highPrice: item.dayHigh,
            lowPrice: item.dayLow,
            openPrice: item.dayOpen,
            closePrice: item.dayClose,
            lastPrice: item.latest,
            changePrice: item.dayChange,
            volumeDst: item.volumeDst,
            volumeSrc: item.volumeSrc,
            bestBuy: item.bestBuy,
            bestSell: item.bestSell,
            isClosed: item.isClosed
          }

          await Config.mongoDb.collection("symbolList").updateOne(
            {symbol: output.symbol},
            {$set: output},
            {upsert: true})
          result.push(output)
        }
        resolve(true)

      })
      .catch(function (error) {
        reject(error)
      });
  })

}