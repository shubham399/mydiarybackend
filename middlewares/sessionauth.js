const redis = require("../services/redis");
var jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const config = require("../config/config")[env];
module.exports = function(req, res, next) {
  const session = req.get('X-SESSION-KEY');
  try{
    var val = jwt.verify(session,config.jwtKey);
    redis.get(val.session,(err, reply) => {
    if(reply == "true"){
      req.body["UserId"] = val.id;
      next();
      }
      else
      {
        res.send({
        "error": true,
        "status": "FAILURE",
        "message": "Invalid SESSION KEY"
      });
      }
  });
    }
 catch(err){
   console.log(err);
   res.send({
        "error": true,
        "status": "FAILURE",
        "message": "Invalid SESSION KEY"
      });
  }
}
