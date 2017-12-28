const router = require("express").Router();
const models = require('../models');
const helper = require("../utils/helper");
router.get("/",function(req,res){
    res.send("UP");
})
router.post("/register",function(req,res){
    req.checkBody("email", "Enter a valid email address.").isEmail();
    req.sanitizeBody("username");
    req.sanitizeBody("password");
    var errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    register(req.body,(val)=>{
        console.log("---CALLBACK ----");
        res.send(val);
    });
  }
    
})
router.post("/login",function(req,res){
    res.send(login(req))
})

const register =(state,callback)=>{
    state["userkey"]=helper.getuuid();
    state.password = helper.gethash(state.password);
    models.Users.create(state).then((val)=>{
        console.log("---REGISTER SUCCESS----Reaching Here")
        callback({"status":"SUCCESS","desc":"User Register Successfully"})}
    ).catch((err)=>{
        console.log("---REGISTER FAILURE----Reaching Here")
        callback(err);
    })
     
}
const login = (state) => {
    
}

module.exports = router;