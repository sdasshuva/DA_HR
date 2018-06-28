var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Month_Range_Table', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'uniqueMonthRange',
        },
        desciption: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'month_range',
        underscored: true,
    });
};