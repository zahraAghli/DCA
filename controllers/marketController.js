const request = require('request');
const db = require('../db/marketDb')
exports.history=async (req,res,next)=>{

  const options = {
    'method': 'GET',
    'url': 'https://api.nobitex.ir/market/udf/history?symbol=ETHIRT&resolution=D&from=1552210967&to=1562058167&page=1',
    'headers': {
    }
  };
  request(options, function (error, response) {
    if (error) next(error);
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(response.body)
  });



}
exports.getHistory = (req, res) => {

  db.getHistory()
    .then((result) => {
      res.statusCode=200;
      res.send('Get history successfully')
    })
    .catch((err) => {
      res.statusCode=400;
      res.send(err.message)
    })
}
exports.getList = (req, res) => {
  db.getList()
    .then((result) => {
      res.statusCode=200;
      res.send('Get list successfully')
    })
    .catch((err) => {
      res.statusCode=400;
      res.send(err.message)
    })
}