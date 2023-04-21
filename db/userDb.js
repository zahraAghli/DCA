const config= require('../bin/config')

/**
 *
 * @description get cryptoCurrency list from nobitex state
 * @returns {Promise<any>}
 */
exports.register = async ({username, password, token, favorite,asset}) => {
  const user = {
    username,
    password,
    token,
    favorite,
    asset
  }
  const res = await config.mongoDb.collection("user").updateOne(
    {username: user.username},
    {$set: user},
    {upsert: true})
  if (res.upsertedCount)return 'Add user successfully'
  else return 'Duplicate username';
}
