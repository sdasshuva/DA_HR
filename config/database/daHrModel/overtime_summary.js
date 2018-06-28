var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Overtime_Summary_Table', {
        month: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: 'uniqueOvertimeSummary',
        },
        year: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: 'uniqueOvertimeSummary',
        },
        section: {
            type: Sequelize.INTEGER,
            references: {
                model: "section",
                key: "id"
            },
            allowNull: false,
            unique: 'uniqueOvertimeSummary',
        },
        overtime: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
            unique: 'uniqueOvertimeSummary',
        },
        status: {
            type: Sequelize.INTEGER,
            references: {
                model: "status",
                key: "id"
            },
            allowNull: false,
            unique: 'uniqueOvertimeSummary',
        },
        amount: {
            type: Sequelize.FLOAT
        },
    }, {
        tableName: 'overtime_summary',
        underscored: true,
    });
};