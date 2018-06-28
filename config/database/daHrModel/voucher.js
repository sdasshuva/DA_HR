var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Voucher_Table', {
        date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        manual_voucher_no: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        ref_no: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        pay_to: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        pay_by: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        voucher_type: {
            type: Sequelize.INTEGER,
            references: {
                model: "voucher_type",
                key: "id"
            },
            allowNull: false,
        },
        gross_amount: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        payment_method: {
            type: Sequelize.INTEGER,
            references: {
                model: "payment_method",
                key: "id"
            },
            allowNull: false,
            defaultValue: 1,
        },
        check_no: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        comments: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        user: {
            type: Sequelize.INTEGER,
            references: {
                model: "user",
                key: "id"
            },
            allowNull: false,
        },
        state: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    }, {
        tableName: 'voucher',
        underscored: true
    });
};