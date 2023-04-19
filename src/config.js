//const MongoClient = require('mongodb').MongoClient;
//let dbo;

class Config {

  static initMongo() {
    // return new Promise((resolve, reject) => {
    //   const url = "mongodb://zahra.aghli:d0b34lSSHas4Yc43VS@127.0.0.1:27017/admin";
    //   console.log(url)
    //   MongoClient.connect(url, function (err, db) {
    //     if (err) reject(err);
    //     console.log('db', db)
    //     dbo = db.db("DCA");
    //     Config.mongoDb =  db.db("DCA");
    //     resolve(true)
    //   });
    // })

  }
}

Config.mongoDb = null
module.exports = Config;