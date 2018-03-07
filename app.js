var express = require("express");
const app = express();
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
  app.use(helmet());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(validator());
  app.use(apiauthMiddleware);
  app.use("/diary", sessionauth);
  app.use("/users/otp", sessionauth);
  app.use(morgan(`:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]`));
}

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

models.sequelize.sync({
  force: config.resetdb
}).then(()=>{
initmiddleware();
initroutes();
startserver();  
});

