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
  redis.setex(userID+"_totpsecret",data.secret,2*60);
  if(env != "production")
  callback({error:false,dataurl:dataurl,secret:data.secret});
  else
  callback({error:false,dataurl:dataurl});
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
  const session = req.get("X-SESSION-KEY");
  const res = constants.LOGIN;
  var val = jwt.verify(session,config.jwtKey);
  console.log(JSON.stringify(val,true));
  redis.get(val.session+"_totpsecret",(err,reply)=>{
    console.log("REDIS:"+reply);
    console.error("Error:"+err);
    if(reply !=null){
      val.is2faverifed = true;
      res.SESSION_KEY = jwt.sign(val,config.jwtKey);
      if(val.rememberme !== undefined && val.rememberme)
        {
          res.SESSION_KEY = jwt.sign(val,config.jwtKey,{ expiresIn: config.loginTtl});
        }
      callback(res);
    }else{
      callback(response.E01);
    }
  })
}


exports.genrate = genrate;
exports.verify = verify;
exports.enable = enable;
exports.disable = disable;
