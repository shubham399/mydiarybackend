"use strict";
module.exports = (sequelize, Sequelize) => {
  var User = sequelize.define("User", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      unique: true
    },
    password: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      unique: true
    },
    userkey: {
      type: Sequelize.STRING,
      unique: true
    },
    token: {
      type: Sequelize.STRING,
      defaultValue: null
    }
  });
  User.associate = function(models) {
    models.User.hasMany(models.Diary);
  };
  return User;
};
