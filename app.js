var express = require('express')
const app = express()
const bodyParser = require('body-parser');
const diaryRouter = require("./routes/diary")
const userRouter = require("./routes/user")
const helmet = require('helmet')
const models = require('./models');
const validator = require('express-validator');
const apiauthMiddleware = require("./middlewares/apiauth")
const sessionauth = require("./middlewares/sessionauth")
const initmiddleware = () => {
  app.use(helmet());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(validator());
  app.use(apiauthMiddleware);
  app.use("/diary", sessionauth);
}

const initroutes = () => {
  app.get('/', function(req, res) {
    res.send('UP')
  });
  app.use("/diary", diaryRouter);
  app.use("/users", userRouter);
}

const startserver = () => {
  app.listen(process.env.PORT, () => console.log('Example app listening on port ' + process.env.PORT))
}

models.sequelize.sync();
initmiddleware();
initroutes();
startserver();
