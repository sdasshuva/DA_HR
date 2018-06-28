var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Religion_Table', {
        name: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'religion',
        underscored: true
    });
};