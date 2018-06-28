var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Leave_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: {
                model: "employee",
                key: "id"
            }
        },
        leave_type: {
            type: Sequelize.INTEGER,
            references: {
                model: "leave_type",
                key: "id"
            }
        },
        date: {
            type: Sequelize.DATE
        },
        status: {
            type: Sequelize.INTEGER
        }
    }, {
        tableName: 'leave',
        underscored: true
    });
};