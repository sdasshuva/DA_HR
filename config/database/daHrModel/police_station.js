var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Police_Station_Table', {
        name: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'police_station',
        underscored: true
    });
};