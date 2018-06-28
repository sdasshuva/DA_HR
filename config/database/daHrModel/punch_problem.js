var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Punch_Problem_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: {
                model: "employee",
                key: "id"
            }
        },
        date: {
            type: Sequelize.DATE
        },
        time: {
            type: Sequelize.STRING
        },
        reason: {
            type: Sequelize.STRING
        },
        permission: {
            type: Sequelize.INTEGER,
            references: {
                model: "permission",
                key: "id"
            }
        }
    }, {
        tableName: 'punch_problem',
        underscored: true
    });
};