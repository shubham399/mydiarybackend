var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var redis = require("redis");
const diaryRouter = require("./routes/diary")
var helmet = require('helmet')
var models = require('./models');
const initmiddleware = () =>{
    models.sync();
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
}

// const redisurl =process.env.REDIS_URL;
// var client = redis.createClient({url:redisurl});
const initroutes = () =>{
    app.get('/', function (req, res) {
  res.send('UP')
});
app.use("/diary", diaryRouter);
}

const startserver = () =>{
app.listen(process.env.PORT, () => console.log('Example app listening on port '+ process.env.PORT))    
}
initmiddleware();
initroutes();
startserver();
