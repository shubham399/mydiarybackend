'use strict';
const Users = require("./users");
module.exports = (sequelize, Sequelize) => {
  var Diary = sequelize.define('diary', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    title:{type:Sequelize.STRING},
    note:{type:Sequelize.TEXT},
    });

  return Diary;
};