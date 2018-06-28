var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Experience_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: {
                model: "employee",
                key: "id"
            }
        },
        organization: {
            type: Sequelize.STRING
        },
        designation: {
            type: Sequelize.INTEGER,
            references: {
                model: "designation",
                key: "id"
            }
        },
        start_date: {
            type: Sequelize.DATE
        },
        end_date: {
            type: Sequelize.DATE
        }
    }, {
        tableName: 'experience',
        underscored: true
    });
};