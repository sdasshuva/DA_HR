var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Monthly_Payment_Table', {
        payment_type: {
            type: Sequelize.INTEGER,
            references: {
                model: "payment_type",
                key: "id"
            },
            allowNull: false,
            unique: 'uniqueMonthlyPayment',
        },
        monthly_attendance: {
            type: Sequelize.INTEGER,
            references: {
                model: "monthly_attendance",
                key: "id"
            },
            allowNull: false,
            unique: 'uniqueMonthlyPayment',
        },
        salary: {
            type: Sequelize.FLOAT
        },
        deduction: {
            type: Sequelize.INTEGER,
            references: {
                model: "deduction",
                key: "id"
            }
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
        tableName: 'monthly_payment',
        underscored: true,
    });
};