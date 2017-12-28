const router = require("express").Router();
const models = require('../models');
const helper = require("../utils/helper");
const  env   = process.env.NODE_ENV || 'development';
const config = require("../config/config")[env];
router.use(function (req, res, next) {
  const api = req.get('X-API-KEY');
  const session = req.get('X-SESSION-KEY');
  if(api ==config.api_key)
  {
     models.User.findOne({ where: {userkey:session} }).then((val)=>{
     req.body["UserId"]=val.dataValues.id;
     next()         
     }).catch((err)=>{
         res.send({"error":true,"message":"Invalid SESSION KEY"});
     })

  }
  else
    res.send({"error":true,"message":"Invalid API KEY"});
});
router.get("/",function(req,res){
    getall(req.body,(val)=>{
        res.send(val);
    })
});
router.post("/",function(req,res){
    req.checkBody("title", "Enter a Title").isLength({ min: 1});
    req.checkBody("note", "Enter a Note").isLength({ min: 1});
    var errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    addrecord(req.body,(val)=>{
        res.send(val);
    });
  }
})
router.delete("/:id",function(req,res){
 req.body["id"] =req.params.id;
    deleterecord(req.body,(val)=>{
        res.send(val);
    });
})
router.patch("/:id",function(req,res){
      req.body["id"] =req.params.id;
    updaterecord(req.body,(val)=>{
        res.send(val);
    });
})

const addrecord = (state,callback) =>{
   models.Diary.create(state).then((val)=>{
         callback({"id":val.id,"status":"SUCCESS","desc":"User Register Successfully"})}
    ).catch((err)=>{
        callback({error:true,"message":"Something Went Wrong"});
    })
}

const deleterecord = (state,callback) =>{
   models.Diary.delete
}

const updaterecord = (value,callback) =>{
    console.log(value);
    models.Diary.update({title:value.title,note:value.note},{ where: {"id":value.id}}).then((val)=>{
        callback({"status":"SUCCESS","message":"Data Updated","value":val})
    }).catch((err)=>{
        callback(err);
    })
}
const getall = (state,callback) =>{
    // callback(state);
     models.Diary.findAll({where:{UserId:state.UserId}}).then((val)=>{
         callback(val);
     }).catch((err)=>{
         callback({error:true,"message":"Something Went Wrong","uid":state.UserId});
     })
}

module.exports = router;