const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');
dotenv.config();

class Config {
  static initializer() {
    this.nobitexUrl = process.env.NOBITEX_URL;
    return new Promise(async (resolve, reject) => {
      try {
        await this.initMongo();
        resolve(true)
      } catch (e) {
        reject(e.message)
      }
    })
  }

  static async initMongo() {
    return new Promise((resolve, reject)=>{
      const url = process.env.MONGODB_URI;
      let self = this;
      MongoClient.connect(url, function (err, db) {
        if (err) reject(err);
        self.mongoDb = db.db("DCA");
        resolve('mongo connected')
      });
    })

  }
}

module.exports = Config;