var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Sub_Head_Table', {
        accounts_head: {
            type: Sequelize.INTEGER,
            references: {
                model: "accounts_head",
                key: "id"
            },
            allowNull: false,
            unique: 'uniqueSubHead',
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'uniqueSubHead',
        },
        state: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    }, {
        tableName: 'sub_head',
        underscored: true
    });
};