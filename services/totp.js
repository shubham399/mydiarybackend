const models = require("../models");
const helper = require("../utils/helper");
const crypto = require("../utils/crypto");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
var moment = require("moment");
const redis = require("../services/redis")
const forgotpasswordcontent = require("../utils/constants").forgotpasswordcontent
const response = require("../utils/constants").responses
var jwt = require("jsonwebtoken");
var totp = require("../utils/totp");
const constants = require("../utils/constants").responses;

const genrate = (req,callback) =>{
  const userID = req.body.UserId;
  var data = totp.genrateSecret();  
  console.log("SECREt"+data.secret);
  console.log(data.otpauthUrl);
  var dataurl = totp.toDataUrl(data.otpauthUrl)
  console.log(dataurl);
  redis.set(userID+"_totpsecret",data.secret);
  callback({error:false,dataurl:dataurl,secret:data.secret});
}

const enable = (req,callback) =>{
  const userID = req.body.UserId;
  redis.get(userID+"_totpsecret",(err,reply)=>{
    console.log("Err:"+err);
    console.log("reply:"+reply);
    if(reply!=null)
      {
        console.log(req.body.token);
//         redis.set(userID+"_totpsecret","null");
        if(totp.verify(reply,req.body.token)){
            console.log("VERIFY PASSED");
           models.User.update({totpsecret:reply,isotpenabled:true},{where:{id:userID}})
             .then((val)=>{
             console.log(val);
             callback({error:false,status:"SUCCESS",message:"2FA Enabled"});
           })
             .catch((err)=>{
             console.error("Error:"+err);
             callback(constants.E08);
           });
        }
        else
           callback(constants.E08);
      }
    else{
      callback(constants.E14);
    }
    
  })
}
const disable = (req,callback) => {
   const userID = req.body.UserId;
   models.User.update({totpsecret:null,isotpenabled:false},{where:{id:userID}})
  .then((val)=>{
     console.log(val);
     callback({error:false,status:"SUCCESS",message:"2FA Disabled"})
   })
  .catch((err)=>{
      console.error("Erorr:"+err);
     callback(constants.E14);
   })
}
const verify = (req,callback) =>{
  const sessionval = req.body.Session;
  const session = req.get("X-SESSION-KEY");
  redis.get(sessionval+"_totpsecret",(err,reply)=>{
    callback("Verify Working");
  })
}


exports.genrate = genrate;
exports.verify = verify;
exports.enable = enable;
exports.disable = disable;