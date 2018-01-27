const router = require("express").Router();
const models = require('../models');
const crypto = require("../utils/crypto");
const helper = require("../utils/helper");
const env = process.env.NODE_ENV || 'development';
const config = require("../config/config")[env];

router.get("/",function(req,res){
    getall(req.body,(val)=>{
        res.send(val);
    })
});

router.get("/:id", function(req, res) {
  req.body["id"] = req.params.id;
  getone(req.body, (val) => {
    res.send(val);
  })
});

router.post("/", function(req, res) {
  req.checkBody("title", "Enter a Title").isLength({
    min: 1
  });
  req.checkBody("note", "Enter a Note").isLength({
    min: 1
  });
  var errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    addrecord(req.body, (val) => {
      res.send(val);
    });
  }
})

router.delete("/:id", function(req, res) {
  req.body["id"] = req.params.id;
  deleterecord(req.body, (val) => {
    res.send(val);
  });
})

router.patch("/:id", function(req, res) {
  req.body["id"] = req.params.id;
  updaterecord(req.body, (val) => {
    res.send(val);
  });
})

const addrecord = (state, callback) => {
  state.note = crypto.encrypt(state.note,state.UserId)
  models.Diary.create(state).then((val) => {
    callback({
      "error": false,
      "data": {
        "id": val.id,
        "status": "SUCCESS",
        "desc": "Record Created Successfully"
      }
    })
  }).catch((err) => {
    callback({
      error: true,
      "status": "FAILURE",
      "message": "Something Went Wrong"
    });
  })
}

const deleterecord = (state, callback) => {
  models.Diary.destroy({
    where: {
      id: state.id
    }
  }).then((val) => {
    if (val)
      callback({
        "error": false,
        "status": "SUCCESS",
        "message": "Data Deleted"
      })
    else
      callback({
        "error": true,
        "status": "FAILURE",
        "message": "Data Not Found"
      })
  }).catch((err) => {
    callback({
      error: true,
      "status": "FAILURE",
      "message": "Something Went Wrong"
    });
  })
}

const updaterecord = (value, callback) => {
  models.Diary.update({
    title: value.title,
    note: crypto.encrypt(value.note,value.UserId)
  }, {
    where: {
      "id": value.id
    }
  }).then((val) => {

    if (val[0])
      callback({
        "error": false,
        "status": "SUCCESS",
        "message": "Data Updated"
      })
    else
      callback({
        "error": true,
        "status": "FAILURE",
        "message": "Data Not Found"
      })
  }).catch((err) => {
   callback({
      error: true,
      "status": "FAILURE",
      "message": "Something Went Wrong"
    });
  })
}

const getall = (state, callback) => {
  models.Diary.findAll({
    where: {
      UserId: state.UserId
    }
  }).then((val) => {
    val = val.map(function(x) {
      x = x.dataValues;
      x.note = crypto.decrypt(x.note,x.userId);
      x = helper.clean(x,["createdAt","updateAt","userId"])
    })
    callback({
      "error": false,
      "data": val
    });
  }).catch((err) => {
    callback({
      error: true,
      "status": "FAILURE",
      "message": "Something Went Wrong"
    });
  })
}

const getone = (state, callback) => {
  models.Diary.findOne({
    where: {
      UserId: state.UserId,
      id: state.id
    }
  }).then((val) => {
    if (val.dataValues == [] || val.dataValues == null)
      callback({
        "error": false,
        "data": val
      });
    val = val.dataValues;
    val.note = crypto.decrypt(val.note,val.UserId);
    val = helper.clean(val,["createdAt","updateAt","UserId"])
    callback({
      "error": false,
      "data": val
    });
  }).catch((err) => {
    callback({
      error: true,
      "status": "FAILURE",
      "message": "Something Went Wrong"
    });
  })
}

module.exports = router;
