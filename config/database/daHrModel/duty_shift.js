var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Duty_Shift_Table', {
        name: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'duty_shift',
        underscored: true
    });
};