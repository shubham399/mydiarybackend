const env = process.env.NODE_ENV || 'development';
const config = require("../config/config")[env];

module.exports = function(req, res, next) {
  const api = req.get('X-API-KEY');
  console.log(api);
  if (api == config.api_key)
    next()
  else
    res.send({
      "error": true,
      "status": "FAILURE",
      "message": "Invalid API KEY"
    });
}