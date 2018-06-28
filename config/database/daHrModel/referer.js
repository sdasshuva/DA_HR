var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Referer_Table', {
        name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        contact_no: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'referer',
        underscored: true
    });
};