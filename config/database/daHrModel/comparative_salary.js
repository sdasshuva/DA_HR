var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Comparative_Salary_Table', {
        date: {
            type: Sequelize.DATE
        },
        section: {
            type: Sequelize.INTEGER,
            references: {
                model: "section",
                key: "id"
            }
        },
        status: {
            type: Sequelize.INTEGER,
            references: {
                model: "status",
                key: "id"
            }
        },
        employee_type: {
            type: Sequelize.INTEGER,
            references: {
                model: "employee_type",
                key: "id"
            }
        },
        payment_method: {
            type: Sequelize.INTEGER,
            references: {
                model: "payment_method",
                key: "id"
            }
        },
        employee_count: {
            type: Sequelize.INTEGER
        },
        salary_amount: {
            type: Sequelize.FLOAT
        },
        ot_amount: {
            type: Sequelize.FLOAT
        },
    }, {
        tableName: 'comparative_salary',
        underscored: true
    });
};