const crypto = require("crypto");
const env = process.env.NODE_ENV || "development";
const salt = require("../config/config")[env].salt
const gethash = (message) => {
  const hash = crypto.createHash("sha256");
  return hash.update(message+"|"+salt).digest("base64");
}

const encrypt = (message, secret) => {
  const cipher = crypto.createCipher("aes192", secret);
  let encrypted = cipher.update(message, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

const decrypt = (message, secret) => {
  const decipher = crypto.createDecipher("aes192", secret);
  let decrypted = decipher.update(message, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted
}

exports.gethash = gethash;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
