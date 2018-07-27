const models = require("../models");
const crypto = require("../utils/crypto");
const helper = require("../utils/helper");
const response = require("../utils/constants").responses
const addrecord = (state, callback) => {
  state.note = crypto.encrypt(state.note, state.UserId)
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
    console.error("Erorr:"+err);
    callback(response.E05);
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
    console.error("Erorr:"+err);
    callback(response.E05);
  })
}

const updaterecord = (value, callback) => {
  models.Diary.update({
    title: value.title,
    note: crypto.encrypt(value.note, value.UserId)
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
    console.error("Erorr:"+err);
    callback(response.E05);
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
      x.note = crypto.decrypt(x.note, x.UserId);
      x = helper.clean(x, ["createdAt", "updatedAt", "UserId"])
      return x;
    })
    callback({
      "error": false,
      "data": val
    });
  }).catch((err) => {
    console.error("Erorr:"+err);
    callback(response.E05);
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
    val.note = crypto.decrypt(val.note, val.UserId);
    val = helper.clean(val, ["createdAt", "updatedAt", "UserId"])
    callback({
      "error": false,
      "data": val
    });
  }).catch((err) => {
     console.error("Erorr:"+err);
    callback(response.E05);
  })
}

exports.addrecord = addrecord;
exports.deleterecord = deleterecord;
exports.updaterecord = updaterecord;
exports.getall = getall;
exports.getone = getone;
