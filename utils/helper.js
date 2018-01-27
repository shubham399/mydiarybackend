const uuidv4 = require('uuid/v4');
const getuuid = () => {
  return uuidv4();
}

const cleanrecord = (rec, cleankeys) => {
  for (i of cleankeys)
    delete rec[i];
  return rec;
}

exports.getuuid = getuuid;
exports.clean = cleanrecord;
