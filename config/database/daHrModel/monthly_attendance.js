var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Monthly_Attendance_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: {
                model: "employee",
                key: "id"
            },
            allowNull: false,
            unique: 'uniqueMonthlyAttendance',
        },
        month_range: {
            type: Sequelize.INTEGER,
            references: {
                model: "month_range",
                key: "id"
            },
            allowNull: false,
            unique: 'uniqueMonthlyAttendance',
        },
        year: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: 'uniqueMonthlyAttendance',
        },
        month: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: 'uniqueMonthlyAttendance',
        },
        present_days: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        absent_days: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        overtime: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        excess_overtime: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        in_late: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        out_late: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        bonus: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0,
            allowNull: false,
        },
    }, {
        tableName: 'monthly_attendance',
        underscored: true,
        // indexes: [
        //   {
        //     unique: true,
        //     fields: ['employee', 'year', 'month']
        //   }
        // ]
    });
};