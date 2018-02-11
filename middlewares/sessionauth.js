const redis = require("../services/redis");
module.exports = function(req, res, next) {
  const session = req.get('X-SESSION-KEY');
  redis.get(session, (err, reply) => {
    console.log("Session:" + reply)
    if (reply == null) {
      res.send({
        "error": true,
        "status": "FAILURE",
        "message": "Invalid SESSION KEY"
      });
      return;
    } else {
      var val = JSON.parse(reply);
      req.body["UserId"] = val.id;
      next();
    }
  });
}
