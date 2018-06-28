var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Accounts_Head_Table', {
        accounts_type: {
            type: Sequelize.INTEGER,
            references: {
                model: "accounts_type",
                key: "id"
            },
            allowNull: false,
            unique: 'uniqueAccountsHead',
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'uniqueAccountsHead',
        },
        state: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    }, {
        tableName: 'accounts_head',
        underscored: true
    });
};