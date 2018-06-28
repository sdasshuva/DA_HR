var Sequelize = require('sequelize');

module.exports = function(sequelize){
    return sequelize.define('Blood_Group_Table', {
        name: { type: Sequelize.STRING },
        name_bangla: { type: Sequelize.STRING }
    },{
        tableName: 'blood_group',
        underscored: true
    });
};
