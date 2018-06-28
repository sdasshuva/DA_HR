var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Address_Table', {
        employee: {
            type: Sequelize.INTEGER,
            references: {
                model: "employee",
                key: "id"
            }
        },
        address_type: {
            type: Sequelize.INTEGER,
            references: {
                model: "address_type",
                key: "id"
            }
        },
        village: {
            type: Sequelize.INTEGER,
            references: {
                model: "village",
                key: "id"
            }
        },
        post_office: {
            type: Sequelize.INTEGER,
            references: {
                model: "post_office",
                key: "id"
            }
        },
        police_station: {
            type: Sequelize.INTEGER,
            references: {
                model: "police_station",
                key: "id"
            }
        },
        district: {
            type: Sequelize.INTEGER,
            references: {
                model: "district",
                key: "id"
            }
        }
    }, {
        tableName: 'address',
        underscored: true
    });
};