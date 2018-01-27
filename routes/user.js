const router = require("express").Router();
const user = require("../services/users")
router.get("/", function(req, res) {
  user.senduserdetails(req, (val) => {
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
    user.register(req.body, (val) => {
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
    user.login(req.body, (val) => {
      res.send(val);
    });
  }
})

router.post("/initforgotpassword",function(req,res){
   user.forgotpasswordinit(req.body, (val) => {
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
    user.forgotpassword(req.body, (val) => {
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
    user.logout(sessionkey, (val) => {
      res.send(val);
    });
  }
})

module.exports = router;
