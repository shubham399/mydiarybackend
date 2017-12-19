var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var redis = require("redis");
const diaryRouter = require("./routes/diary")
var helmet = require('helmet')
app.use(helmet())
// const redisurl =process.env.REDIS_URL;
// var client = redis.createClient({url:redisurl});
// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('UP')
});
app.use("/diary", diaryRouter);
app.listen(process.env.PORT, () => console.log('Example app listening on port '+ process.env.PORT))