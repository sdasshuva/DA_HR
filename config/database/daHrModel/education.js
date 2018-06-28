var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Education_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: {
                model: "employee",
                key: "id"
            }
        },
        exam_name: {
            type: Sequelize.STRING
        },
        major: {
            type: Sequelize.STRING
        },
        pass_year: {
            type: Sequelize.DATE
        }
    }, {
        tableName: 'education',
        underscored: true
    });
};