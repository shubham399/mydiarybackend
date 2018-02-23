const redis = require("../services/redis");
var jwt = require("jsonwebtoken");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const response = require("../utils/constants").responses
module.exports = function(req, res, next) {
  const session = req.get("X-SESSION-KEY");
  try{
    var val = jwt.verify(session,config.jwtKey);
    console.log("SESSION AUTH:"+JSON.stringify(val));
    redis.get(val.session,(err, reply) => {
    if(reply){
      req.body["UserId"] = reply;
      next();
      }
      else
      {
        console.log("Error:"+err);
        res.send(response.E12);
      }
  });
    }
 catch(err){
   console.log("Error:"+err);
   res.send(response.E12);
  }
}
