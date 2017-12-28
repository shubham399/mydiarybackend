'use strict';
module.exports = (sequelize, Sequelize) => {
  var Users = sequelize.define('user', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    username:{type:Sequelize.STRING,unique:true},
    password:{type:Sequelize.STRING},
    email:{type:Sequelize.STRING,unique:true},
    userkey:{type:Sequelize.STRING,unique:true}
  });

  return Users;
};