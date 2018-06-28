var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Designation_Table', {
        section: {
            type: Sequelize.INTEGER,
            references: {
                model: "section",
                key: "id"
            }
        },
        name: {
            type: Sequelize.STRING
        },
        name_bangla: {
            type: Sequelize.STRING
        },
        attendance_bonus: {
            type: Sequelize.INTEGER
        }
    }, {
        tableName: 'designation',
        underscored: true
    });
};