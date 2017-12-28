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
router.post("/",function(req,res){
    let output = addrecord(req.body);
    res.send(output);
})
router.delete("/:id",function(req,res){
    req.body.id = req.params.id;
    let output = deleterecord(req.body);
    res.send(output);
})
router.patch("/:id",function(req,res){
    req.body.id = req.params.id;
    let output = updaterecord(req.body);
    res.send(output);
})

const addrecord = (value) =>{
     return {"error":false,"result":"Need to Complete the Function","reqdata":value}
}

const deleterecord = (value) =>{
   return {"error":false,"result":"Need to Complete the Function","reqdata":value}
}

const updaterecord = (value) =>{
    return {"error":false,"result":"Need to Complete the Function","reqdata":value}
}

module.exports = router;