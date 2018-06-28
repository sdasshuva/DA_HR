var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Payment_Method_Table', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'uniquePaymentMethod',
        },
        state: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    }, {
        tableName: 'payment_method',
        underscored: true
    });
};