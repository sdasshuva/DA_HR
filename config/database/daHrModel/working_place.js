var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Working_Place_Table', {
        name: {
            type: Sequelize.STRING
        },
        employee_id: {
            type: Sequelize.INTEGER
        },
    }, {
        tableName: 'working_place',
        underscored: true
    });
};