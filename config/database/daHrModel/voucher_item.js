var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Voucher_Item_Table', {
        voucher: {
            type: Sequelize.INTEGER,
            references: {
                model: "voucher",
                key: "id"
            },
            allowNull: false,
        },
        sub_head: {
            type: Sequelize.INTEGER,
            references: {
                model: "sub_head",
                key: "id"
            },
            allowNull: false,
        },
        narration: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        amount: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        entry_type: {
            type: Sequelize.INTEGER,
            references: {
                model: "entry_type",
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
        tableName: 'voucher_item',
        underscored: true
    });
};