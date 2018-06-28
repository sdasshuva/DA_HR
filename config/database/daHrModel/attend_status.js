var Sequelize = require('sequelize');

module.exports = function(sequelize){
  return sequelize.define('Attend_Status_Table', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'uniqueAttendStatus',
    },
    short: {
			type: Sequelize.STRING,
      allowNull: false,
    },
    state: { 
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },{
    tableName: 'attend_status',
    underscored: true
  });
};