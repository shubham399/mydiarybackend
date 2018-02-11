const env = process.env.NODE_ENV || "development"
const redisURL = require("../config/config")[env].redisURL;
var redis = require("redis");
console.log(redisURL)
const client = redis.createClient(redisURL);

exports.redis = client;