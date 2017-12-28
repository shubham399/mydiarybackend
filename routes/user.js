const router = require("express").Router();
const models = require('../models');
const helper = require("../utils/helper");
const  env   = process.env.NODE_ENV || 'development';
const config = require("../config/config")[env];
router.use(function (req, res, next) {
  const api = req.get('X-API-KEY');
  console.log(api);
  if(api ==config.api_key)
  next()
  else
    res.send({"error":true,"message":"Invalid API KEY"});
});
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
router.get("/logout",function(req,res){
    var sessionkey=req.get("X-SESSION-KEY");
    var errors = req.validationErrors();
  if (errors) {
    res.send({status:"Already LoggedOut"});
    return;
  } else {
    logout(sessionkey,(val)=>{
        res.send(val);
    });
  }
})
const register =(state,callback)=>{
    state["userkey"]=helper.getuuid();
    state.password = helper.gethash(state.password);
    models.User.create(state).then((val)=>{
         callback({"error":false,"status":"SUCCESS","desc":"User Register Successfully"})}
    ).catch((err)=>{
        callback({error:true,"message":"Something Went Wrong"});
    })
}
const login = (state,callback) => {
    state.password = helper.gethash(state.password);
    models.User.findOne({ where: {username: state.username,password:state.password} }).then((val)=>{
        
         callback({"error":false,status:"SUCCESS","sessionkey":val.dataValues.userkey})}
    ).catch((err)=>{
        callback({"error":true,"message":"Invalid Username or Password"});
    })
}

const logout = (sessionkey,callback)=>{
    models.User.update({"userkey":helper.getuuid()},{ where: {"userkey":sessionkey}}).then((val)=>{
        
         callback({"error":false,"status:"SUCCESS","message":"LoggedOut Successful"})}
    ).catch((err)=>{
        callback({"error":true,"message":"Something Went Wrong"});
    })
}

module.exports = router;