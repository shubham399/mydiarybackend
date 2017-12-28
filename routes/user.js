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
        
         callback(val.dataValues)}
    ).catch((err)=>{
        callback(err);
    })
}

module.exports = router;