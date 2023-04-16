const MongoClient = require('mongodb').MongoClient;
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
exports.register = async ({username, password, token, favorite}) => {
  const user = {
    username,
    password,
    token,
    favorite
  }
  const res = await dbo.collection("user").updateOne(
    {username: user.username},
    {$set: user},
    {upsert: true})
  if (res.upsertedCount)return 'Add user successfully'
  else return 'Duplicate username';
}
