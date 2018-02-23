const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const response = require("../utils/constants").responses;

module.exports = function(req, res, next) {
  if (req.path == "/")
    next();
  else {
    const api = req.get("X-API-KEY");
    if (api == config.api_key)
      next()
    else
      res.send(response.E13);
  }
}
