const redis = require("../services/redis");
var jwt = require("jsonwebtoken");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const response = require("../utils/constants").responses;
module.exports = function(req, res, next) {
  const session = req.get("X-SESSION-KEY");
  try{
    var val = jwt.verify(session,config.jwtKey);
    console.log("SESSION AUTH:"+JSON.stringify(val));
    console.log(req.originalUrl)
    if((val.isotpenabled && req.originalUrl == "/users/otp/verify") ||(val.isotpenabled && val.is2faverifed) || !val.isotpenabled)
    redis.get(val.session,(err, reply) => {
    if(reply){
      req.body["UserId"] = reply;
      req.body["session"] = val.session; 
      next();
      }
      else
      {
        console.error("Erorr:"+err);
        res.send(response.E12);
      }
  });
   else{
    res.send(response.E12);  
   }
    }
 catch(err){
   console.log("Error:"+err);
   res.send(response.E12);
  }
}
