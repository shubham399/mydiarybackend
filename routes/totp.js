const router = require("express").Router();
const totp = require("../services/totp.js");
const validate = require("../utils/helper.js").validate;
const resp = require("../utils/constants").responses;

var err = resp.EC;
router.get("/", function(req, res) {
  totp.genrate(req,(val)=>{
  res.send(val);  
  })
  
});
router.post("/verify", function(req, res) {
  totp.verify(req,(val)=>{
  res.send(val);  
  })
  
});
router.post("/enable",function(req,res){
  totp.enable(req,(val)=>{
    res.send(val);
  })
})
router.get("/disable",function(req,res){
  totp.disable(req,(val)=>{
    res.send(val);
  })
})

module.exports = router;
