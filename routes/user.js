const router = require("express").Router();
const models = require('../models');
const helper = require("../utils/helper");
const crypto = require("../utils/crypto");
const env = process.env.NODE_ENV || 'development';
const config = require("../config/config")[env];
const mailer = require("../utils/mailer");
var moment = require('moment');
const min = config.forgotexpiry
const forgotpasswordcontent = `<!DOCTYPE html><html><head>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
</head>
<body>
<div class="container">
<h2 style="font-size: 20px; font-weight: bold; margin: 0;">Reset Email Request</h2>
<p>We received a request to reset the myDiary password for username <strong>@@@@</strong>.</p>
<p>Please use <strong>####</strong> as a OTP to Reset your password.Your OTP will expire in <strong>%%%% </strong>mins.</p>
<p>Try to Remember your password next time ;) well incase you forgot we got you covered</p>
<p>If you didn't make this request, feel free to ignore this email.</p>
</div>
  </body>
</html>`;
router.get("/", function(req, res) {
  senduserdetails(req, (val) => {
    res.send(val);
  })
})

router.post("/register", function(req, res) {
  req.checkBody("password", "Password must be greater than 6  characters").isLength({
    min: 6
  });
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
    min: 6
  })
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
    val=helper.clean(val,["createdAt","updatedAt","id","password","userkey","token"])
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
  const otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  var forgotpasswordcontenttemp = forgotpasswordcontent.replace(/####/g,otp)
  forgotpasswordcontenttemp =forgotpasswordcontenttemp.replace(/@@@@/,val.dataValues.username)
  forgotpasswordcontenttemp = forgotpasswordcontenttemp.replace(/%%%%/,min)
  const subject = "Request to reset your myDiary password"
  mailer.sendmail(state.email,subject,forgotpasswordcontenttemp)
   models.User.update({
    "token": helper.gethash(otp)
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
    var now = moment();
    const currentTime=now;
    if(state.password === state.confirm_password){
  models.User.findOne({where: {token:helper.gethash(state.otp)}}).then((val)=>{
    val=val.dataValues;
    let id=val.id;
    var lastupdatetime=moment(val.updatedAt);
    var duration = moment.duration(currentTime.diff(lastupdatetime));
    var dif = duration.asMinutes()
    if(dif>min)
    {
      models.User.update({token:null},{where:{id:id}})
    callback({
      "error": true,
      "status": "FAILURE",
      "message": "OTP Expired Please Regenrate an OTP"
      })   
    }
    else
    {
      models.User.update({password:helper.gethash(state.password),token:null},{where:{id:id}}).then((val)=>{
             callback({
      "error": false,
      "status": "SUCCESS",
      "message": "password updated"
      }).catch((err)=>{
      callback({
      "error": true,
      "status": "FAILURE",
      "message": "Something went wrong"
    })   
      })  
      })
    }
}).catch((err)=>{
     callback({
      "error": true,
      "status": "FAILURE",
      "message": "Invalid OTP"
    })
});
}
else{
     callback({
      "error": true,
      "status": "FAILURE",
      "message": "Password Doesnot match"
    })
}
}
module.exports = router;
