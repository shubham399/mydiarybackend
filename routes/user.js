const router = require("express").Router();
const users = require('../models/users');
const { check, validationResult } = require('express-validator/check');

router.get("/",function(req,res){
    res.send("UP");
})
router.post("/register",function(req,res){
    req.checkBody("email", "Enter a valid email address.").isEmail();
    
    res.send(register(req.body));
})
router.post("/login",function(req,res){
    res.send(login(req))
})

const register =(state)=>{
     
}
const login = (state) => {
    
}

module.exports = router;