const models = require('../models');
const helper = require("../utils/helper");
const env = process.env.NODE_ENV || 'development';
const config = require("../config/config")[env];
module.exports = function(req, res, next) {
  const session = req.get('X-SESSION-KEY');
  models.User.findOne({
    where: {
      userkey: session
    }
  }).then((val) => {
    req.body["UserId"] = val.dataValues.id;
    next()
  }).catch((err) => {
    res.send({
      "error": true,
      "status": "FAILURE",
      "message": "Invalid SESSION KEY"
    });
  })

}
