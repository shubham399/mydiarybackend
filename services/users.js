const models = require('../models');
const helper = require("../utils/helper");
const crypto = require("../utils/crypto");
const env = process.env.NODE_ENV || 'development';
const config = require("../config/config")[env];
const mailer = require("../utils/mailer");
var moment = require('moment');
const min = config.forgotexpiry
const forgotpasswordcontent = require("../utils/constants").forgotpasswordcontent
const senduserdetails = (req, callback) => {
  const session = req.get('X-SESSION-KEY');
  models.User.findOne({
    where: {
      userkey: session
    }
  }).then((val) => {
    val = val.dataValues;
    val=helper.clean(val,["createdAt","updatedAt","id","password","userkey","token"])
    callback({
      "error": false,
      "status": "SUCCESS",
      "data": val
    });
  }).catch((err) => {
    callback({
      error: true,
      "status": "FAILURE",
      "message": "Login to View User Details"
    });
  })
}

const register = (state, callback) => {
  console.log("In Register....");
  console.log(state);
  state["userkey"] = helper.getuuid();
  console.log("After userkey....");
  console.log(state);
  state.password = crypto.gethash(state.password);
  console.log("After Passowrd....");
  console.log(state);
  models.User.create(state).then((val) => {
    callback({
      "error": false,
      "status": "SUCCESS",
      "desc": "User Register Successfully",
      "SESSION_KEY": val.dataValues.userkey
    })
  }).catch((err) => {
    callback({
      error: true,
      "status": "FAILURE",
      "message": "Something Went Wrong"
    });
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

    callback({
      "error": false,
      "status": "SUCCESS",
      "SESSION_KEY": val.dataValues.userkey
    })
  }).catch((err) => {
    callback({
      "error": true,
      "status": "FAILURE",
      "message": "Invalid Username or Password"
    });
  })
}

const logout = (sessionkey, callback) => {
  models.User.update({
    "userkey": helper.getuuid()
  }, {
    where: {
      "userkey": sessionkey
    }
  }).then((val) => {

    callback({
      "error": false,
      "status": "SUCCESS",
      "message": "LoggedOut Successful"
    })
  }).catch((err) => {
    callback({
      "error": true,
      "status": "FAILURE",
      "message": "Something Went Wrong"
    });
  })
}
const forgotpasswordinit = (state,callback) =>{
  models.User.findOne({
    where: {
      email: state.email,
    }
  }).then((val)=>{
    if(val.dataValues.email == state.email){
  const otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  var forgotpasswordcontenttemp = forgotpasswordcontent.replace(/####/g,otp)
  forgotpasswordcontenttemp =forgotpasswordcontenttemp.replace(/@@@@/,val.dataValues.username)
  forgotpasswordcontenttemp = forgotpasswordcontenttemp.replace(/%%%%/,min)
  const subject = "Request to reset your myDiary password"
  mailer.sendmail(state.email,subject,forgotpasswordcontenttemp)
   models.User.update({
    "token": crypto.gethash(otp)
  }, {
    where: {
      "email": state.email
    }
  }).then((val)=>{
    callback({
      "error": false,
      "status": "SUCCESS",
      "message": "ForgotPassword Initiated"
    })
  }).catch((err)=>{
    callback({
      "error": true,
      "status": "FAILURE",
      "message": "ForgotPassword Initiatation failed"
    })
  })
    }
    else
    {
       callback({
      "error": true,
      "status": "FAILURE",
      "message": "Email Doesnot exisit"
    })
    }
}).catch((err)=>{
    callback({
      "error": true,
      "status": "FAILURE",
      "message": "Email Doesnot exisit"
    })
})
}

const forgotpassword = (state,callback) =>{
    var now = moment();
    const currentTime=now;
    if(state.password === state.confirm_password){
  models.User.findOne({where: {token:crypto.gethash(state.otp)}}).then((val)=>{
    val=val.dataValues;
    let id=val.id;
    var lastupdatetime=moment(val.updatedAt);
    var duration = moment.duration(currentTime.diff(lastupdatetime));
    var dif = duration.asMinutes()
    if(dif>min)
    {
      models.User.update({token:null},{where:{id:id}})
    callback({
      "error": true,
      "status": "FAILURE",
      "message": "OTP Expired Please Regenrate an OTP"
      })
    }
    else
    {
      models.User.update({password:crypto.gethash(state.password),token:null},{where:{id:id}}).then((val)=>{
             callback({
      "error": false,
      "status": "SUCCESS",
      "message": "password updated"
      }).catch((err)=>{
      callback({
      "error": true,
      "status": "FAILURE",
      "message": "Something went wrong"
    })
      })
      })
    }
}).catch((err)=>{
     callback({
      "error": true,
      "status": "FAILURE",
      "message": "Invalid OTP"
    })
});
}
else{
     callback({
      "error": true,
      "status": "FAILURE",
      "message": "Password Doesnot match"
    })
}
}
exports.senduserdetails = senduserdetails;
exports.login =login;
exports.logout = logout;
exports.register = register;
exports.forgotpassword = forgotpassword;
exports.forgotpasswordinit = forgotpasswordinit;
