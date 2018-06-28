var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Bank_Account_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: {
                model: "employee",
                key: "id"
            },
            unique: true
        },
        bank: {
            type: Sequelize.INTEGER,
            references: {
                model: "bank",
                key: "id"
            },
            unique: true
        },
        branch_code: {
            type: Sequelize.INTEGER
        },
        account_type: {
            type: Sequelize.INTEGER
        },
        account_no: {
            type: Sequelize.INTEGER
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0,
            allowNull: false,
        },
    }, {
        tableName: 'bank_account',
        underscored: true
    });
};