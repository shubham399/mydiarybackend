const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

module.exports = function(req, res, next) {
  if (req.path == "/")
    next();
  else {
    const api = req.get("X-API-KEY");
    if (api == config.api_key)
      next()
    else
      res.send({
        "error": true,
        "status": "FAILURE",
        "message": "Invalid API KEY"
      });
  }
}
