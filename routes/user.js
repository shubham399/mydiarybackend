const router = require("express").Router();
const models = require('../models');
const helper = require("../utils/helper");
router.get("/",function(req,res){
    res.send("UP");
})
router.post("/register",function(req,res){
    req.checkBody("password", "Password must contain a number.").isLength({ min: 5 }).matches(/\d/);
    req.checkBody("username", "Enter a valid Username").isLength({ min: 3 });
    var errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    register(req.body,(val)=>{
        res.send(val);
    });
  }
    
})
router.post("/login",function(req,res){
    req.checkBody("password", "Password must contain a number.").isLength({ min: 5 }).matches(/\d/);
    req.checkBody("username", "Enter a valid Username").isLength({ min: 3 });
    var errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    login(req.body,(val)=>{
        res.send(val);
    });
  }
})
router.post("/logout",function(req,res){
      req.checkBody("sessionkey", "Already LoggedOut").isLength({ min: 1 });
    var errors = req.validationErrors();
  if (errors) {
    res.send({status:"LOGGEDOUT"});
    return;
  } else {
    logout(req.body,(val)=>{
        res.send(val);
    });
  }
})
const register =(state,callback)=>{
    state["userkey"]=helper.getuuid();
    state.password = helper.gethash(state.password);
    models.User.create(state).then((val)=>{
         callback({"status":"SUCCESS","desc":"User Register Successfully"})}
    ).catch((err)=>{
        callback(err);
    })
     
}
const login = (state,callback) => {
    state.password = helper.gethash(state.password);
    models.User.findOne({ where: {username: state.username,password:state.password} }).then((val)=>{
        
         callback({status:"SUCCESS","sessionkey":val.dataValues.userkey})}
    ).catch((err)=>{
        callback({"error":true,"message":"Invalid Username or Password"});
    })
}

const logout = (state,callback)=>{
    models.User.update({"userkey":helper.getuuid()},{ where: {"userkey":state.sessionkey}}).then((val)=>{
        
         callback({status:"SUCCESS","message":"LoggedOut Successful"})}
    ).catch((err)=>{
        callback({"error":true,"message":"Something Went Wrong"});
    })
}

module.exports = router;