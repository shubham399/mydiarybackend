const router = require("express").Router();
const users = require('../models/users');
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
    register(req.body,(code,val)=>{
        res.status(code);
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
    users.create(state).then((val)=>{
        callback(200,{"status":"SUCCESS","desc":"User Register Successfully"})}
    ).catch((err)=>{
        callback(400,err);
    })
     
}
const login = (state) => {
    
}

module.exports = router;