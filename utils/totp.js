var speakeasy = require("speakeasy");
var qr = require("qr-image");

const verify =(secret,token)=>{
 return speakeasy.totp.verify({
        secret : secret,
        encoding : "base32",
        token : token
      })
}
const genrateSecret = () =>{
  var secretObj = speakeasy.generateSecret();
  var url = speakeasy.otpauthURL({ secret: secretObj.ascii, label: 'MyDiary' });
  return {
    secret : secretObj.base32,
    otpauthUrl : url
  };
}
const toDataUrl = (key) =>{
  var format = "data:image/png;base64,";
  var base64Data = qr.imageSync(key, { type : 'png' }).toString('base64');
  return format.concat(base64Data);
}

exports.verify=verify;
exports.genrateSecret=genrateSecret;
exports.toDataUrl=toDataUrl;
