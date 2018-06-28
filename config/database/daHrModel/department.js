var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Department_Table', {
        name: {
            type: Sequelize.STRING,
            unique: 'uniqueDepartmentName',
        }
    }, {
        tableName: 'department',
        underscored: true
    });
};