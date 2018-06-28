var Sequelize = require('sequelize');

module.exports = function(sequelize){
  return sequelize.define('Accounts_Type_Table', {
    name: {
			type: Sequelize.STRING,
      allowNull: false,
			unique: 'uniqueAccountsType',
    },
    state: { 
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },{
    tableName: 'accounts_type',
    underscored: true
  });
};