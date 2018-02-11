const env = process.env.NODE_ENV || "development"
const redisURL = require("../config/config")[env];
var redis = require("redis");
const client = redis.createClient(redisURL);

exports.redis = client;