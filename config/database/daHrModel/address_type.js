var Sequelize = require('sequelize');

module.exports = function(sequelize){
    return sequelize.define('Address_Type_Table', {
        name: { type: Sequelize.STRING }
    },{
        tableName: 'address_type',
        underscored: true
    });
};
