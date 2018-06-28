var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Promotion_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: {
                model: "employee",
                key: "id"
            }
        },
        old_designation: {
            type: Sequelize.INTEGER,
            references: {
                model: "designation",
                key: "id"
            }
        },
        new_designation: {
            type: Sequelize.INTEGER,
            references: {
                model: "designation",
                key: "id"
            }
        },
        month: {
            type: Sequelize.DATE
        },
    }, {
        tableName: 'promotion',
        underscored: true
    });
};