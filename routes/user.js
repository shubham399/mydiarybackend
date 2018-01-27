const router = require("express").Router();
const models = require('../models');
const helper = require("../utils/helper");
const env = process.env.NODE_ENV || 'development';
const config = require("../config/config")[env];
const mailer = require("../utils/mailer");

const forgotpasswordcontent = `<html><body><p><span style="background-color: #ccffff;"></span></p>
<h1 style="color: #5e9ca0; text-align: center;"><span style="background-color: #ffffff;"><span style="color: #000000;">Please use: #### as the OTP to reset your password</span> </span></h1>
<p style="text-align: center;"><span style="background-color: #ffffff;"><span style="color: #000000;">Please use #### as a&nbsp; OTP. It will be valid for next 30mins. and try not to forget it next time ;)</span></span></p>
<p>&nbsp;</p>
<p>&nbsp;</p></body></html>`;
router.get("/", function(req, res) {
  senduserdetails(req, (val) => {
    res.send(val);
  })
})

router.post("/register", function(req, res) {
  req.checkBody("password", "Password must be greater than 6  characters").isLength({
    min: 5
  }).matches(/^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i);
  req.checkBody("username", "Enter a valid Username").isLength({
    min: 3
  }).matches(/^[a-z]+$/i);
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
  req.checkBody("password","Password must be greater than 6  characters").isLength({
    min: 5
  }).matches(/^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i);
  req.checkBody("username", "Enter a valid Username").isLength({
    min: 3
  }).matches(/^[a-z]+$/i);
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

router.post("/initforgotpassword",function(req,res){
   forgotpasswordinit(req.body, (val) => {
      res.send(val);
    });
});

router.post("/forgotpassword",function(req,res){
  req.checkBody("otp","Please Provide the OTP").isLength({
    min:4,
    max:4
  }).matches(/\d/);
  req.checkBody("password", "Password must be greater than 6  characters").isLength({
    min: 6
  })
  req.checkBody("confirm_password", "Password must be greater than 6  characters").isLength({
    min: 6
  })
  var errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    forgotpassword(req.body, (val) => {
      res.send(val);
    });
  }
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
    val=helper.clean(val,["createdAt","updatedAt","id","password","userkey"])
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
    console.log(val.dataValues.email)
    if(val.dataValues.email == state.email){
  const otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  const forgotpasswordcontenttemp = forgotpasswordcontent.replace(/####/g,otp)
  const subject = "Please use: #### as the OTP to reset your diary password".replace(/####/g,otp)
  mailer.sendmail(state.email,subject,forgotpasswordcontenttemp)
   models.User.update({
    "token": otp
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

const forgotpassword = (state,callback) =>{
  models.User.findOne({where: {token:state.otp}}).then((val)=>{
    val=val.dataValues;
    const now = new Date();
    callback({
      data:val,
      now:now,
      time:now.getTime(),
      epochTime: new Date(0)
      })
}).catch((err)=>{
     callback({
      "error": true,
      "status": "FAILURE",
      "message": "Invalid OTP"
    })
});
}
module.exports = router;
