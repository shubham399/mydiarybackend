const router = require("express").Router();
const models = require('../models');
const helper = require("../utils/helper");
const env = process.env.NODE_ENV || 'development';
const config = require("../config/config")[env];
const mailer = require("../utils/mailer");

router.get("/", function(req, res) {
  senduserdetails(req, (val) => {
    res.send(val);
  })
})

router.post("/register", function(req, res) {
  req.checkBody("password", "Password must contain a number.").isLength({
    min: 5
  }).matches(/\d/);
  req.checkBody("username", "Enter a valid Username").isLength({
    min: 3
  });
  var errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    register(req.body, (val) => {
      res.send(val);
    });
  }
})

router.post("/login", function(req, res) {
  req.checkBody("password", "Password must contain a number.").isLength({
    min: 5
  }).matches(/\d/);
  req.checkBody("username", "Enter a valid Username").isLength({
    min: 3
  });
  var errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    login(req.body, (val) => {
      res.send(val);
    });
  }
})

router.post("/forgotpassword",function(req,res){
   forgotpasswordinit(req.body, (val) => {
      res.send(val);
    });
});
router.get("/logout", function(req, res) {
  var sessionkey = req.get("X-SESSION-KEY");
  var errors = req.validationErrors();
  if (errors) {
    res.send({
      error: true,
      "status": "FAILURE",
      message: "Already LoggedOut"
    });
    return;
  } else {
    logout(sessionkey, (val) => {
      res.send(val);
    });
  }
})

const senduserdetails = (req, callback) => {
  const session = req.get('X-SESSION-KEY');
  models.User.findOne({
    where: {
      userkey: session
    }
  }).then((val) => {
    val = val.dataValues;
    delete val["createdAt"];
    delete val["updatedAt"];
    delete val["id"];
    delete val["password"];
    delete val["userkey"];
    callback({
      "error": false,
      "status": "SUCCESS",
      "data": val
    });
  }).catch((err) => {
    callback({
      error: true,
      "status": "FAILURE",
      "message": "Login to View User Details"
    });
  })
}

const register = (state, callback) => {
  state["userkey"] = helper.getuuid();
  state.password = helper.gethash(state.password);
  models.User.create(state).then((val) => {
    callback({
      "error": false,
      "status": "SUCCESS",
      "desc": "User Register Successfully",
      "SESSION_KEY": val.dataValues.userkey
    })
  }).catch((err) => {
    callback({
      error: true,
      "status": "FAILURE",
      "message": "Something Went Wrong"
    });
  })
}

const login = (state, callback) => {
  state.password = helper.gethash(state.password);
  models.User.findOne({
    where: {
      username: state.username,
      password: state.password
    }
  }).then((val) => {

    callback({
      "error": false,
      "status": "SUCCESS",
      "SESSION_KEY": val.dataValues.userkey
    })
  }).catch((err) => {
    callback({
      "error": true,
      "status": "FAILURE",
      "message": "Invalid Username or Password"
    });
  })
}

const logout = (sessionkey, callback) => {
  models.User.update({
    "userkey": helper.getuuid()
  }, {
    where: {
      "userkey": sessionkey
    }
  }).then((val) => {

    callback({
      "error": false,
      "status": "SUCCESS",
      "message": "LoggedOut Successful"
    })
  }).catch((err) => {
    callback({
      "error": true,
      "status": "FAILURE",
      "message": "Something Went Wrong"
    });
  })
}
const forgotpasswordinit = (state,callback) =>{
  models.User.findOne({
    where: {
      email: state.email,
    }
  }).then((val)=>{
    if(val.dataValues.email == state.email){
  const token = helper.gethash(helper.getuuid());
  mailer.sendmail(state.email,"Reset Your Password","<html><body>Please Click on the Link to Reset your password :<a href='"+config.host+"/forgotpassword/"+token+"'>Click here</a> or copy the <b>URL</b> If it doesnot work "+config.host+"/forgotpassword/"+token+"</body></html>")
   models.User.update({
    "token": token
  }, {
    where: {
      "email": state.email
    }
  }).then((val)=>{
    callback({
      "error": false,
      "status": "SUCCESS",
      "message": "ForgotPassword Initiated"
    })
  }).catch((err)=>{
    callback({
      "error": true,
      "status": "FAILURE",
      "message": "ForgotPassword Initiatation failed"
    })
  })
    }
    else
    {
       callback({
      "error": true,
      "status": "FAILURE",
      "message": "Email Doesnot exisit"
    })
    }
}).catch((err)=>{
    callback({
      "error": true,
      "status": "FAILURE",
      "message": "Email Doesnot exisit"
    })
})
}

module.exports = router;
