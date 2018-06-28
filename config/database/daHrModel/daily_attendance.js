var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Daily_Attendance_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: {
                model: "employee",
                key: "id"
            },
            allowNull: false,
            unique: 'uniqueDailyAttendance',
        },
        day: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: 'uniqueDailyAttendance',
        },
        month: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: 'uniqueDailyAttendance',
        },
        year: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: 'uniqueDailyAttendance',
        },
        work_time: {
            type: Sequelize.INTEGER,
            references: {
                model: "work_time",
                key: "id"
            },
            allowNull: false,
            unique: 'uniqueDailyAttendance',
        },
        in_hour: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        in_minute: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        in_late_minute: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        in_status: {
            type: Sequelize.INTEGER,
            references: {
                model: "attend_status",
                key: "id"
            },
            allowNull: false,
        },
        out_hour: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        out_minute: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        out_late_minute: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        out_status: {
            type: Sequelize.INTEGER,
            references: {
                model: "attend_status",
                key: "id"
            },
            allowNull: false,
        },
        attend_status: {
            type: Sequelize.INTEGER,
            references: {
                model: "attend_status",
                key: "id"
            },
            allowNull: false,
        },
        working_minute: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        overtime: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        break_minute: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0,
            allowNull: false,
        },
    }, {
        tableName: 'daily_attendance',
        underscored: true,
        // indexes: [
        //   {
        //     unique: true,
        //     fields: ['employee', 'year', 'month']
        //   }
        // ]
    });
};