var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Salary_Payment_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: {
                model: "employee",
                key: "id"
            },
            allowNull: false,
            unique: 'uniqueSalaryPayment',
        },
        year: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: 'uniqueSalaryPayment',
        },
        month: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: 'uniqueSalaryPayment',
        },
        payment_type: {
            type: Sequelize.INTEGER,
            references: {
                model: "payment_type",
                key: "id"
            },
            allowNull: false,
            unique: 'uniqueSalaryPayment',
        },
        salary_amount: {
            type: Sequelize.FLOAT
        },
        deduct_amount: {
            type: Sequelize.FLOAT
        },
        paid_amount: {
            type: Sequelize.FLOAT
        },
        payment_status: {
            type: Sequelize.INTEGER,
            references: {
                model: "payment_status",
                key: "id"
            }
        },
        user: {
            type: Sequelize.INTEGER,
            references: {
                model: "user",
                key: "id"
            }
        },
    }, {
        tableName: 'salary_payment',
        underscored: true,
    });
};