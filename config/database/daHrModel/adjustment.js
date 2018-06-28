var Sequelize = require('sequelize');

module.exports = function(sequelize){
    return sequelize.define('Adjustment_Table', {
        reason: { type: Sequelize.STRING },
        date: { type: Sequelize.DATE }
    },{
        tableName: 'adjustment',
        underscored: true
    });
};
