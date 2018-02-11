const router = require("express").Router();
const user = require("../services/users");
const validate = require("../utils/helper.js").validate;
const resp = require("../utils/constants").responses;

var err = resp.EC;
router.get("/", function(req, res) {
  user.senduserdetails(req, (val) => {
    res.send(val);
  })
})

router.post("/register", function(req, res) {
  const uservalid  = validate(req.body.username,/^[a-z][a-z0-9]+$/i,4)
  const passwordvalid = validate(req.body.password,null,6);
  const emailvalidator = validate(req.body.email,/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,0);
  if(uservalid == -1)
    {
      err.message = "USERNAME MUST BE MORE THAN 4 CHARACTER"
      res.send(err);
      return;
    }
  if(uservalid == -2){
    err.message = "USERNAME CAN CONTAIN ONLY LETTER AND NUMBERS"
      res.send(err);
      return;
  }
   if(passwordvalid == -1)
    {
      err.message = "PASSWORD MUST BE MORE THAN 6 CHARACTER"
      res.send(err);
      return;
    }
  if(emailvalidator == -2){
    err.message = "USERNAME CAN CONTAIN ONLY LETTER AND NUMBERS"
      res.send(resp.E02);
      return;
  }
    user.register(req.body, (val) => {
      res.send(val);
    });

})

router.post("/login", function(req, res) {
   const uservalid  = validate(req.body.username,/^[a-z][a-z0-9]+$/i,4)
   const passwordvalid = validate(req.body.password,null,6);
    if(uservalid == -1)
    {
      err.message = "USERNAME MUST BE MORE THAN 4 CHARACTER"
      res.send(err);
      return;
    }
  if(uservalid == -2){
    err.message = "USERNAME CAN CONTAIN ONLY LETTER AND NUMBERS"
      res.send(err);
      return;
  }
   if(passwordvalid == -1)
    {
      err.message = "PASSWORD MUST BE MORE THAN 6 CHARACTER"
      res.send(err);
      return;
    }
    user.login(req.body, (val) => {
      res.send(val);
    });
 
})

router.post("/initforgotpassword", function(req, res) {
    const emailvalidator = validate(req.body.email,/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,0);
    if(emailvalidator ==-2)
    {
      res.send(resp.E02);
      return;
    }
  user.forgotpasswordinit(req.body, (val) => {
    res.send(val);
  });
});

router.post("/forgotpassword", function(req, res) {
  const otpvalid = validate(req.body.otp,/^[0-9]{4}$/,4);
  const cpasswordvalid = validate(req.body.confirm_password,null,6);
  const passwordvalid = validate(req.body.password,null,6);
  if(otpvalid == -2){
    res.send(resp.E08);
    return;
  }
   if(passwordvalid == -1)
    {
      err.message = "PASSWORD MUST BE MORE THAN 6 CHARACTER"
      res.send(err);
      return;
    }
     if(cpasswordvalid == -1)
    {
      err.message = "PASSWORD MUST BE MORE THAN 6 CHARACTER"
      res.send(err);
      return;
    }
    user.forgotpassword(req.body, (val) => {
      res.send(val);
    });

});

router.get("/logout", function(req, res) {
  var sessionkey = req.get("X-SESSION-KEY");
    user.logout(sessionkey, (val) => {
      res.send(val);
    });
})

module.exports = router;
