const router = require("express").Router();
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