var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Special_Work_Time_Table', {
        work_time: {
            type: Sequelize.INTEGER,
            references: {
                model: "work_time",
                key: "id"
            }
        },
        from_date: {
            type: Sequelize.DATE
        },
        to_date: {
            type: Sequelize.DATE
        },
        reason: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'special_work_time',
        underscored: true
    });
};