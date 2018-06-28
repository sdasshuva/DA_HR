var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Salary_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: {
                model: "employee",
                key: "id"
            }
        },
        amount: {
            type: Sequelize.FLOAT
        },
        approve_date: {
            type: Sequelize.DATE
        }
    }, {
        tableName: 'salary',
        underscored: true
    });
};