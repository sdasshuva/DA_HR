var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Deduction_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: {
                model: "employee",
                key: "id"
            }
        },
        month: {
            type: Sequelize.DATE
        }, /////////// It Need To Be Deleted
        // d_month: {
        //     type: Sequelize.INTEGER
        // }, /////////// It Need To Be month and get data from month
        // d_year: {
        //     type: Sequelize.INTEGER
        // }, /////////// It Need To Be year and get data from month
        advance: {
            type: Sequelize.FLOAT
        },
        medical: {
            type: Sequelize.FLOAT
        },
        stamp: {
            type: Sequelize.FLOAT
        },
        ait: {
            type: Sequelize.FLOAT
        },
        lunch_out: {
            type: Sequelize.FLOAT
        },
        others: {
            type: Sequelize.FLOAT
        },
        overtime: {
            type: Sequelize.INTEGER
        },
        excess_overtime: {
            type: Sequelize.INTEGER
        },
    }, {
        tableName: 'deduction',
        underscored: true
    });
};