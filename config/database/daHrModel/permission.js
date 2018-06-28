var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Permission_Table', {
        name: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'permission',
        underscored: true
    });
};