var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Work_Time_Table', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'uniqueWorkTime',
        },
        in_time: {
            type: Sequelize.DATE
        },
        out_time: {
            type: Sequelize.DATE
        },
        in_hour: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        in_minute: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        in_late_allowed_minute: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        in_bonus_late_allowed_minute: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        out_hour: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        out_minute: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        out_late_allowed_minute: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        out_bonus_late_allowed_minute: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }, {
        tableName: 'work_time',
        underscored: true
    });
};