const models = require('../models');
const helper = require("../utils/helper");
const crypto = require("../utils/crypto");
const env = process.env.NODE_ENV || 'development';
const config = require("../config/config")[env];
const mailer = require("../utils/mailer");
var moment = require('moment');
const redis = require("../services/redis")
const min = config.forgotexpiry
const forgotpasswordcontent = require("../utils/constants").forgotpasswordcontent
const response = require("../utils/constants").responses
var jwt = require('jsonwebtoken');

const senduserdetails = (req, callback) => {
  const session = req.get('X-SESSION-KEY');
  try{
    var val = jwt.verify(session,config.jwtKey);
    redis.get(val.session,(err, reply) => {
    if(reply == "true"){
    val = helper.clean(val, ["id","session", "iat","exp", "rememberme"])
     var res = response.USER_DATA;
    res.data = val;
    callback(res);
      }
      else
      {
        callback(response.E11);
      }
  });
    }
 catch(err){
   console.log(err);
    callback(response.E11);
  }
}

const register = (state, callback) => {
  state["userkey"] = helper.getuuid();
  state.password = crypto.gethash(state.password);
  models.User.create(state).then((val) => {
    var res = response["REGISTERED"];
    val.dataValues["rememberme"] = false;
    val.dataValues["session"]=val.dataValues.userkey;
    val.dataValues = helper.clean(val.dataValues, ["createdAt", "updatedAt", "password", "userkey", "token"])
    redis.set(val.dataValues.session,true);
    res.SESSION_KEY = jwt.sign(val.dataValues,config.jwtKey,{ expiresIn: config.loginTtl})
    callback(res)
  }).catch((err) => {
    if (err.errors[0].path == "username")
      callback(response["E03"]);
    else if (err.errors[0].path == "email")
      callback(response["E04"]);
    else
      callback(response.E05)
  })
}

const login = (state, callback) => {
  state.password = crypto.gethash(state.password);
  models.User.findOne({
    where: {
      username: state.username,
      password: state.password
    }
  }).then((val) => {
    var res = response["LOGIN"];
    val.dataValues["rememberme"]= state.rememberme;
    val.dataValues["session"]=val.dataValues.userkey;
    val.dataValues = helper.clean(val.dataValues, ["createdAt", "updatedAt", "password", "userkey", "token"]);
    redis.set(val.dataValues.session,true);
    if(state.rememberme)
    res.SESSION_KEY = jwt.sign(val.dataValues,config.jwtKey);
    else
    res.SESSION_KEY = jwt.sign(val.dataValues,config.jwtKey,{ expiresIn: config.loginTtl})
    callback(res)
  }).catch((err) => {
    console.log(err);
    callback(response.E01);
  })
}

const logout = (sessionkey, callback) => {
  try{
  var val = jwt.verify(sessionkey,config.jwtKey);
  redis.set(val.session,false);
  models.User.update({
    "userkey": helper.getuuid(),
    "token": null
  }, {
    where: {
      "userkey": val.session
    }
  }).then((val) => {

    callback(response["LOGOUT"]);
  }).catch((err) => {
    console.error(err);
    callback(response.E05);
  })
  }
  catch(err){
    console.error(err);
    callback(response.E05);
  }
}
const forgotpasswordinit = (state, callback) => {
  models.User.findOne({
    where: {
      email: state.email,
    }
  }).then((val) => {
    if (val.dataValues.email == state.email) {
      const otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
      var forgotpasswordcontenttemp = forgotpasswordcontent.replace(/####/g, otp)
      forgotpasswordcontenttemp = forgotpasswordcontenttemp.replace(/@@@@/, val.dataValues.username)
      forgotpasswordcontenttemp = forgotpasswordcontenttemp.replace(/%%%%/, min)
      const subject = "Request to reset your myDiary password"
      mailer.sendmail(state.email, subject, forgotpasswordcontenttemp)
      models.User.update({
        "token": crypto.gethash(otp)
      }, {
        where: {
          "email": state.email
        }
      }).then((val) => {
        callback(response.INITIED)
      }).catch((err) => {
        console.error(err);
        callback(response.E05)
      })
    } else {
      callback(response.E02)
    }
  }).catch((err) => {
    console.error(err);
    callback(response.E02)
  })
}


const forgotpassword = (state, callback) => {
  var now = moment();
  const currentTime = now;
  if (state.password === state.confirm_password) {
    models.User.findOne({
      where: {
        token: crypto.gethash(state.otp)
      }
    }).then((val) => {
      val = val.dataValues;
      let id = val.id;
      var lastupdatetime = moment(val.updatedAt);
      var duration = moment.duration(currentTime.diff(lastupdatetime));
      var dif = duration.asMinutes()
      if (dif > min) {
        models.User.update({
          token: null
        }, {
          where: {
            id: id
          }
        })
        callback(response["E10"]);
      } else {
        models.User.update({
          password: crypto.gethash(state.password),
          token: null
        }, {
          where: {
            id: id
          }
        }).then((val) => {
          callback(response["CHANGE_SUCCESS"]).catch((err) => {
            console.error(err);
            callback(response.E05)
          })
        })
      }
    }).catch((err) => {
      console.error(err);
      callback(response["E08"]);
    });
  } else {
    callback(response["E09"]);
  }
}
exports.senduserdetails = senduserdetails;
exports.login = login;
exports.logout = logout;
exports.register = register;
exports.forgotpassword = forgotpassword;
exports.forgotpasswordinit = forgotpasswordinit;
