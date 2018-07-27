const uuidv4 = require("uuid/v4");
const getuuid = () => {
  return uuidv4();
}

const cleanrecord = (rec, cleankeys) => {
  for (var i of cleankeys)
    delete rec[i];
  return rec;
}

const InputValidator = (input, regex, length) => {
  if (!input)
    return -1;
  if (input.length < length)
    return -1;
  if (regex != null && !regex.test(input))
    return -2;
  return 0;
}
exports.getuuid = getuuid;
exports.clean = cleanrecord;
exports.validate = InputValidator;
