const db = require('../db/tradeDb')

exports.addOrder = (req, res) => {
  db.addOrder()
    .then((message) => {
      res.statusCode=200;
      res.json({message})
    })
    .catch((err) => {
      res.statusCode=400;
      res.send(err.message)
    })
}