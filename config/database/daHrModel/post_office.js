var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Post_Office_Table', {
        name: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'post_office',
        underscored: true
    });
};