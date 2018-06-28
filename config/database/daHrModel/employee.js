var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Employee_Table', {
        user: {
            type: Sequelize.INTEGER,
            references: {
                model: "user",
                key: "id"
            }
        },
        photo: {
            type: Sequelize.STRING
        },
        grade: {
            type: Sequelize.INTEGER
        },
        designation: {
            type: Sequelize.INTEGER,
            references: {
                model: "designation",
                key: "id"
            }
        },
        department: {
            type: Sequelize.INTEGER,
            references: {
                model: "department",
                key: "id"
            }
        },
        section: {
            type: Sequelize.INTEGER,
            references: {
                model: "section",
                key: "id"
            }
        },
        working_place: {
            type: Sequelize.INTEGER,
            references: {
                model: "working_place",
                key: "id"
            }
        },
        employee_type: {
            type: Sequelize.INTEGER,
            references: {
                model: "employee_type",
                key: "id"
            }
        },
        date_of_birth: {
            type: Sequelize.DATE
        },
        date_of_join: {
            type: Sequelize.DATE
        },
        date_of_release: {
            type: Sequelize.DATE
        },
        card_issue: {
            type: Sequelize.DATE
        },
        card_expire: {
            type: Sequelize.DATE
        },
        address: {
            type: Sequelize.TEXT
        },
        address_bangla: {
            type: Sequelize.TEXT
        },
        referer: {
            type: Sequelize.INTEGER,
            references: {
                model: "referer",
                key: "id"
            }
        },
        national_id: {
            type: Sequelize.STRING
        },
        gender: {
            type: Sequelize.INTEGER
        },
        religion: {
            type: Sequelize.INTEGER,
            references: {
                model: "religion",
                key: "id"
            }
        },
        marital_status: {
            type: Sequelize.INTEGER
        },
        contact_no: {
            type: Sequelize.STRING
        },
        blood_group: {
            type: Sequelize.INTEGER,
            references: {
                model: "blood_group",
                key: "id"
            }
        },
        remarks: {
            type: Sequelize.STRING
        },
        duty_shift: {
            type: Sequelize.INTEGER,
            references: {
                model: "duty_shift",
                key: "id"
            }
        },
        work_time: {
            type: Sequelize.INTEGER,
            references: {
                model: "work_time",
                key: "id"
            }
        },
        payment_method: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        status: {
            type: Sequelize.INTEGER,
            references: {
                model: "status",
                key: "id"
            }
        },
    }, {
        tableName: 'employee',
        underscored: true
    });
};