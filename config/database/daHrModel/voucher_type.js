var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Voucher_Type_Table', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'uniqueVoucherType',
        },
        parent: {
            type: Sequelize.INTEGER,
            references: {
                model: "voucher_type",
                key: "id"
            },
            allowNull: true,
        },
        state: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    }, {
        tableName: 'voucher_type',
        underscored: true
    });
};