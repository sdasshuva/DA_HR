var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Attendance_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: {
                model: "employee",
                key: "id"
            }
        },
        punch_time: {
            type: Sequelize.DATE
        },
        type: {
            type: Sequelize.INTEGER
        }
    }, {
        tableName: 'attendance',
        underscored: true
    });
};