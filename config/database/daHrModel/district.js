var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('District_Table', {
        name: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'district',
        underscored: true
    });
};