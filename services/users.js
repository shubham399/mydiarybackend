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
const senduserdetails = (req, callback) => {
  const session = req.get('X-SESSION-KEY');
  models.User.findOne({
    where: {
      userkey: session
    }
  }).then((val) => {
    val = val.dataValues;
    val = helper.clean(val, ["createdAt", "updatedAt", "id", "password", "userkey", "token"])
    var res = response.USER_DATA;
    res.data = val;
    callback(res);
  }).catch((err) => {
    callback(response.E11);
  })
}

const register = (state, callback) => {
  state["userkey"] = helper.getuuid();
  state.password = crypto.gethash(state.password);
  models.User.create(state).then((val) => {
    var res = response["REGISTERED"];
    if(state.remeberme !=undefined && state.remeberme == true)
      redis.set(val.dataValues.userkey, JSON.stringify(val.dataValues));
    else
      redis.set(val.dataValues.userkey, JSON.stringify(val.dataValues), 'EX', config.loginTtl);
    res.SESSION_KEY = val.dataValues.userkey
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
    res.SESSION_KEY = val.dataValues.userkey
        if(state.remeberme !=undefined && state.remeberme == true)
      redis.set(val.dataValues.userkey, JSON.stringify(val.dataValues));
    else
      redis.set(val.dataValues.userkey, JSON.stringify(val.dataValues), 'EX', config.loginTtl);
    callback(res)
  }).catch((err) => {
    console.log(err);
    callback(response.E01);
  })
}

const logout = (sessionkey, callback) => {
  redis.set(sessionkey, null,'EX',1);
  models.User.update({
    "userkey": helper.getuuid(),
    "token": null
  }, {
    where: {
      "userkey": sessionkey
    }
  }).then((val) => {

    callback(response["LOGOUT"]);
  }).catch((err) => {
    console.error(err);
    callback(response.E05);
  })
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
