var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Status_Table', {
        name: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'status',
        underscored: true
    });
};