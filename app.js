var express = require("express");
const app = express();
var cluster = require('cluster');
const bodyParser = require("body-parser");
const diaryRouter = require("./routes/diary");
const userRouter = require("./routes/user");
const helmet = require("helmet");
const models = require("./models");
const validator = require("express-validator");
const apiauthMiddleware = require("./middlewares/apiauth");
const sessionauth = require("./middlewares/sessionauth");
var env = process.env.NODE_ENV || "development";
var morgan = require("morgan");
var config = require("./config/config.js")[env];
const redis = require("./services/redis");
const initmiddleware = () => {
  
  app.use(morgan('dev'))
  app.use(helmet());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(validator());
  app.use(apiauthMiddleware);
  app.use("/diary", sessionauth);
  app.use("/users/otp", sessionauth);

const initroutes = () => {
  app.get("/", function(req, res) {
    res.send("UP");
  });
  app.use("/diary", diaryRouter);
  app.use("/users", userRouter);
}

const startserver = () => {
  app.listen(process.env.PORT, () => console.log("Server Started at " + process.env.PORT));
}

if (cluster.isMaster) {
  var numWorkers = require('os').cpus().length;

  console.log('Master cluster setting up ' + numWorkers + ' workers...');

  for (var i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('online', function(worker) {
    console.log('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {

  app.all('/pid', function(req, res) {
    res.send('process ' + process.pid + ' says hello!').end();
  }) //can be removed
  app.all('/ping',function(req,res){
    const header = req.get("X-PING-KEY");
    const actualkey = process.env.PINGKEY;
    if(header === actualkey)
    res.send('PONG!').end();
    else
      res.status(418).send("GO AWAY!").end();
  });
  models.sequelize.sync({
    force: config.resetdb
  }).then(() => {
    initmiddleware();
    initroutes();
    startserver();
  });
}
