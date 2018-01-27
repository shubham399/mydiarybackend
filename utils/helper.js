const uuidv4 = require('uuid/v4');
const crypto = require('crypto');
const getuuid =() =>{
    return uuidv4();
}
const gethash=(message) =>{
    const hash = crypto.createHash('sha256');
    return hash.update(message).digest("base64");
}

const cleanrecord = (rec,cleankeys) =>
{
    for(i of cleankeys)
        delete rec[i];
    return rec;
}
exports.getuuid = getuuid;
exports.gethash = gethash;
exports.clean = cleanrecord;