const db = require('../db/userDb')

exports.register = (req, res) => {
  db.register(req.body)
    .then((message) => {
      res.statusCode=200;
      res.json({message})
    })
    .catch((err) => {
      res.statusCode=400;
      res.send(err.message)
    })
}