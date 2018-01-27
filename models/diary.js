'use strict';
module.exports = (sequelize, Sequelize) => {
  var Diary = sequelize.define('Diary', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING
    },
    note: {
      type: Sequelize.TEXT
    },
  });
  Diary.associate = function(models) {
    models.Diary.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Diary;
};
