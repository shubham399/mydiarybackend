const env = process.env.NODE_ENV || "development";
const redisURL = require("../config/config")[env].redisURL;
var redis = require("redis");
const client = redis.createClient(redisURL);

const set = function(key, value) {
  return client.set(key, value, redis.print);
}
const get = function(key, cb) {
  client.get(key, cb);
}
const clean = () =>{
  client.end(true);
}
exports.redis = client;
exports.set = set;
exports.get = get;
exports.clean = clean;
