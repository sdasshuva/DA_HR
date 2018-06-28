var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Section_Table', {
        department: {
            type: Sequelize.INTEGER,
            references: {
                model: "department",
                key: "id"
            }
        },
        name: {
            type: Sequelize.STRING,
            unique: 'uniqueSectionName'
        },
        name_bangla: {
            type: Sequelize.STRING
        },
        employee_type: {
            type: Sequelize.INTEGER,
            references: {
                model: "employee_type",
                key: "id"
            }
        }
    }, {
        tableName: 'section',
        underscored: true
    });
};