var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Leave_Type_Table', {
        name: {
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.FLOAT
        }
    }, {
        tableName: 'leave_type',
        underscored: true
    });
};