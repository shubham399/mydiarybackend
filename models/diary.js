'use strict';
module.exports = (sequelize, Sequelize) => {
  var Task = sequelize.define('Task', {
    title: Sequelize.TEXT
  });

  return Task;
};