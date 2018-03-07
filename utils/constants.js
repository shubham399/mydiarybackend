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

const responses = {
  "E01": {
    "error": true,
    "status": "FAILURE",
    "message": "INVALID USERNAME OR PASSWORD"
  },
  "E02": {
    "error": true,
    "status": "FAILURE",
    "message": "INVALID EMAIL"
  },
  "E03": {
    "error": true,
    "status": "FAILURE",
    "message": "USERNAME ALREADY REGISTERED"
  },
  "E04": {
    "error": true,
    "status": "FAILURE",
    "message": "EMAIL ALREADY REGISTERED"
  },
  "E05": {
    "error": true,
    "status": "FAILURE",
    "message": "SOMETHING WENT WRONG"
  },
  "E06": {
    "error": true,
    "status": "FAILURE",
    "message": "PASSWORD MUST BE MORE THAN 6 CHARACTER"
  },
  "E07": {
    "error": false,
    "status": "SUCCESS",
    "message": "ALREADY LOGGEDOUT"
  },
  "E08": {
    "error": true,
    "status": "FAILURE",
    "message": "Invalid OTP"
  },
  "E09": {
    "error": true,
    "status": "FAILURE",
    "message": "Password Doesnot match"
  },
  "E10": {
    "error": true,
    "status": "FAILURE",
    "message": "OTP Expired Please Regenrate an OTP"
  },
  "E11": {
    error: true,
    "status": "FAILURE",
    "message": "LOGIN TO PERFORM THIS ACTION"
  },
  "E12":{
        "error": true,
        "status": "FAILURE",
        "message": "Invalid SESSION KEY"
      },
  "E13":{
        "error": true,
        "status": "FAILURE",
        "message": "Invalid API KEY"
      },
    "E14":{
        "error": true,
        "status": "FAILURE",
        "message": "UNABLE TO ENABLE/DISBALE 2FA"
      },
  "EC": {
    error: true,
    "status": "FAILURE",
    "message": "{ERROR}"
  },
  "REGISTERED": {
    "error": false,
    "status": "SUCCESS",
    "message": "USER REGISTERED SUCCESSFULLY",
    "SESSION_KEY": "{session}"
  },
  "LOGIN": {
    "error": false,
    "status": "SUCCESS",
    "message": "USER LOGIN SUCCESSFULLY",
    "SESSION_KEY": "{session}"
  },
  "LOGOUT": {
    "error": false,
    "status": "SUCCESS",
    "message": "LOGOUT SUCCESSFUL"
  },
  "USER_DATA": {
    "error": false,
    "status": "SUCCESS",
    "message": "USERDATA",
    "data": "{data}"
  },
  "CHANGE_SUCCESS": {
    "error": false,
    "status": "SUCCESS",
    "message": "PASSWORD UPDATED"
  },
  "INITIED": {
    "error": false,
    "status": "SUCCESS",
    "message": "ForgotPassword Initiated"
  }
}


exports.forgotpasswordcontent = forgotpasswordcontent;
exports.responses = responses;
