var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Employee_Type_Table', {
        name: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'employee_type',
        underscored: true
    });
};