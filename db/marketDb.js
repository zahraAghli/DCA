let https = require('https');
let q = require('q');
let us = require('underscore');
let moment = require('moment-jalaali');
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://zahra.aghli:d0b34lSSHas4Yc43VS@127.0.0.1:27017/admin";
let dbo;
let async = require('async');
let cheerio = require('cheerio');
let axios = require('axios');

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  dbo = db.db("DCA");
})

exports.getHistory = async () => {
  const symbolList = await dbo.collection("symbolList").find({}).toArray();
  for (const symbol of symbolList) {
    try {
      await getSymbolHistory(symbol.symbol)
    } catch (err) {
      console.log(err.message)
    }
  }
  return "get all history"
}


async function getSymbolHistory(symbol) {
  const lastData = await dbo.collection("symbolHistory").find({symbol}).sort({"date": -1}).limit(1).toArray();
  return new Promise(async (resolve, reject) => {
    let insertCount = 0;
    for (let page = 1; ; page++) {
      try {
        const startDate = lastData[0]?.date || Math.floor(new Date('2009.01.01').getTime() / 1000)
        const endDate = Math.floor(new Date().getTime() / 1000)
        const config = {
          method: 'get',
          url: `https://api.nobitex.ir/market/udf/history?symbol=${symbol}&resolution=D&from=${startDate}&to=${endDate}&page=${page}`,
        };
        insertCount += await nobitexHistory(config, symbol);
      } catch (e) {
        console.log(e.message)
      }
    }
    console.log(symbol, '==>', insertCount)
    resolve(insertCount)
  })

}

function nobitexHistory(config, symbol) {
  return new Promise((resolve, reject) => {
    let insertCount = 0;
    axios(config)
      .then(async function (response) {
        if (response?.data?.s !== 'ok') resolve(0);//not work
        let data = response.data;
        for (let i = 0; i < data.t.length; i++) {

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
          const res = await dbo.collection("symbolHistory").updateOne(
            {symbol: output.symbol, date: output.date},
            {$set: output},
            {upsert: true})
          insertCount += res.upsertedCount

        }
        resolve(insertCount)
      })
      .catch(function (error) {
        reject(error);
      })
  })

}

/**
 *
 * @description گرفتن جزئیات نماد ها از stocklist
 * @returns {Promise<any>}
 */
exports.getList = () => {
  const defer = q.defer();
  const config = {
    method: 'get',
    url: 'https://api.nobitex.ir/market/stats?srcCurrency=btc,eth,etc,usdt,ada,bch,ltc,bnb,eos,xlm,xrp,trx,doge,uni,link,dai,dot,shib,aave,ftm,matic,axs,mana,sand,avax,usdc,gmt,mkr,sol,atom,grt,bat,near,ape,qnt,chz,xmr,egala,busd,algo,hbar,1inch,yfi,flow,snx,enj,crv,fil,wbtc,ldo,dydx,apt,mask,comp,bal,lrc,lpt,ens,sushi,api3,one,glm,pmn,dao,cvc,nmr,storj,snt,ant,zrx,slp,egld,imx,blur,100k_floki,1b_babydoge&dstCurrency=irt,usdt'
  };
  axios(config)
    .then(function (response) {
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
        result.push(output)
        dbo.collection("symbolList").updateOne({
            symbol: output.symbol
          },
          {
            $set: output
          },
          {
            upsert: true
          }, function (err, res) {
            if (err) throw err;

          });
      }
      defer.resolve(result.length)

    })
    .catch(function (error) {
      console.log(error);
      defer.reject(error)
    });


  return defer.promise
}