var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Entry_Type_Table', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'uniqueEntryType',
        },
        state: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    }, {
        tableName: 'entry_type',
        underscored: true,
    });
};