var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Village_Table', {
        name: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'village',
        underscored: true
    });
};