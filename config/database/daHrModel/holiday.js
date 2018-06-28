var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Holiday_Table', {
        reason: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.INTEGER
        },
        date: {
            type: Sequelize.DATE
        }
    }, {
        tableName: 'holiday',
        underscored: true
    });
};