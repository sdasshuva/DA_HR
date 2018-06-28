var Sequelize = require('sequelize');
var myLogFunc = function(msg, a) {
    // console.log(msg)
    // console.log(a)
}

function connect() {
    var dbName = 'version_101_da_hr';
    var dbUser = (process.env.PWD.toUpperCase().indexOf("DROPBOX") != -1) ? 'root' : 'root';
    var dbPass = (process.env.PWD.toUpperCase().indexOf("DROPBOX") != -1) ? '' : '';
    // var dbPass = (process.env.PWD.toUpperCase().indexOf("DROPBOX") != -1) ? '1234' : 'Bi99#Bo559@mysql';
    var sequelize = new Sequelize(dbName, dbUser, dbPass, {
        host: 'localhost',
        dialect: 'mysql',
        timezone: '+06:00',
        dialectOptions: {
            useUTC: false, //for reading from database
            dateStrings: true,
            typeCast: function(field, next) { // for reading from database
                if (field.type === 'DATETIME') {
                    return field.string()
                }
                return next()
            },
        },
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        logging: (process.env.PWD.toUpperCase().indexOf("DROPBOX") != -1) ? myLogFunc : false,
        operatorsAliases: false
    });

    sequelize.authenticate().then(function(err) {
        if (!err) {
            console.log('Connection has been established successfully.')
        } else {
            console.log('Unable to connect to the database:', err)
        }
    })

    /////*******************#####  RIPS MODELER FILE INCLUDING STARTS  *#####****************/////

    this.bank = require(__dirname + '/daHrModel/bank.js')(sequelize);
    this.attend_status = require(__dirname + '/daHrModel/attend_status.js')(sequelize);
    this.payment_method = require(__dirname + '/daHrModel/payment_method.js')(sequelize);
    this.entry_type = require(__dirname + '/daHrModel/entry_type.js')(sequelize);
    this.voucher_type = require(__dirname + '/daHrModel/voucher_type.js')(sequelize);
    this.accounts_type = require(__dirname + '/daHrModel/accounts_type.js')(sequelize);
    this.accounts_head = require(__dirname + '/daHrModel/accounts_head.js')(sequelize);
    this.sub_head = require(__dirname + '/daHrModel/sub_head.js')(sequelize);
    this.voucher = require(__dirname + '/daHrModel/voucher.js')(sequelize);
    this.voucher_item = require(__dirname + '/daHrModel/voucher_item.js')(sequelize);
    this.payment_type = require(__dirname + '/daHrModel/payment_type.js')(sequelize);
    this.payment_status = require(__dirname + '/daHrModel/payment_status.js')(sequelize);
    this.work_time = require(__dirname + '/daHrModel/work_time.js')(sequelize);
    this.holiday = require(__dirname + '/daHrModel/holiday.js')(sequelize);
    this.adjustment = require(__dirname + '/daHrModel/adjustment.js')(sequelize);
    this.leave_type = require(__dirname + '/daHrModel/leave_type.js')(sequelize);
    this.user = require(__dirname + '/daHrModel/user.js')(sequelize);
    this.permission = require(__dirname + '/daHrModel/permission.js')(sequelize);
    this.police_station = require(__dirname + '/daHrModel/police_station.js')(sequelize);
    this.post_office = require(__dirname + '/daHrModel/post_office.js')(sequelize);
    this.referer = require(__dirname + '/daHrModel/referer.js')(sequelize);
    this.religion = require(__dirname + '/daHrModel/religion.js')(sequelize);
    this.blood_group = require(__dirname + '/daHrModel/blood_group.js')(sequelize);
    this.department = require(__dirname + '/daHrModel/department.js')(sequelize);
    this.designation = require(__dirname + '/daHrModel/designation.js')(sequelize);
    this.district = require(__dirname + '/daHrModel/district.js')(sequelize);
    this.status = require(__dirname + '/daHrModel/status.js')(sequelize);
    this.duty_shift = require(__dirname + '/daHrModel/duty_shift.js')(sequelize);
    this.village = require(__dirname + '/daHrModel/village.js')(sequelize);
    this.section = require(__dirname + '/daHrModel/section.js')(sequelize);
    this.working_place = require(__dirname + '/daHrModel/working_place.js')(sequelize);
    this.address_type = require(__dirname + '/daHrModel/address_type.js')(sequelize);
    this.employee_type = require(__dirname + '/daHrModel/employee_type.js')(sequelize);
    this.employee = require(__dirname + '/daHrModel/employee.js')(sequelize);
    this.month_range = require(__dirname + '/daHrModel/month_range.js')(sequelize);
    this.monthly_attendance = require(__dirname + '/daHrModel/monthly_attendance.js')(sequelize);
    this.daily_attendance = require(__dirname + '/daHrModel/daily_attendance.js')(sequelize);
    this.punch_problem = require(__dirname + '/daHrModel/punch_problem.js')(sequelize);
    this.address = require(__dirname + '/daHrModel/address.js')(sequelize);
    this.attendance = require(__dirname + '/daHrModel/attendance.js')(sequelize);
    this.education = require(__dirname + '/daHrModel/education.js')(sequelize);
    this.experience = require(__dirname + '/daHrModel/experience.js')(sequelize);
    this.salary = require(__dirname + '/daHrModel/salary.js')(sequelize);
    this.leave = require(__dirname + '/daHrModel/leave.js')(sequelize);
    this.bank_account = require(__dirname + '/daHrModel/bank_account.js')(sequelize);
    this.deduction = require(__dirname + '/daHrModel/deduction.js')(sequelize);
    this.promotion = require(__dirname + '/daHrModel/promotion.js')(sequelize);
    this.comparative_salary = require(__dirname + '/daHrModel/comparative_salary.js')(sequelize);
    this.comparative_salary_b = require(__dirname + '/daHrModel/comparative_salary_b.js')(sequelize);
    this.monthly_payment = require(__dirname + '/daHrModel/monthly_payment.js')(sequelize);
    this.salary_payment = require(__dirname + '/daHrModel/salary_payment.js')(sequelize);
    this.overtime_summary = require(__dirname + '/daHrModel/overtime_summary.js')(sequelize);
    this.special_work_time = require(__dirname + '/daHrModel/special_work_time.js')(sequelize);


    /////*******************#####  RIPS OLD MODELER FILE INCLUDING ENDS  #####****************/////


    ////////////////%%%%#####  RIPS OLD TABLE RELATIONSHIP STARTS  #####%%%%////////////////////

    // this.employee.hasOne(this.user, {
    //         as: 'user'
    //     })
    // this.employee.hasOne(this.department, {
    //         as: 'department'
    //     })
    //     .hasOne(this.designation, {
    //         as: 'designation'
    //     })
    //     .hasOne(this.section, {
    //         as: 'section'
    //     })
    //     .hasOne(this.working_place, {
    //         as: 'working_place'
    //     })
    //     .hasOne(this.employee_type, {
    //         as: 'employee_type'
    //     })
    //     .hasOne(this.referer, {
    //         as: 'referer'
    //     })
    //     .hasOne(this.religion, {
    //         as: 'religion'
    //     })
    //     .hasOne(this.blood_group, {
    //         as: 'blood_group'
    //     })
    //     .hasOne(this.work_time, {
    //         as: 'work_time'
    //     })
    //     .hasOne(this.duty_shift, {
    //         as: 'duty_shift'
    //     })
    //     .hasOne(this.status, {
    //         as: 'status'
    //     });
    // this.address
    //     .hasOne(this.employee, {
    //         as: 'employee'
    //     })
    //     .hasOne(this.address_type, {
    //         as: 'address_type'
    //     })
    //     .hasOne(this.village, {
    //         as: 'village'
    //     })
    //     .hasOne(this.post_office, {
    //         as: 'post_office'
    //     })
    //     .hasOne(this.police_station, {
    //         as: 'police_station'
    //     })
    //     .hasOne(this.district, {
    //         as: 'district'
    //     });
    // this.attendance.hasOne(this.employee, {
    //     as: 'employee'
    // });
    // this.education.hasOne(this.employee, {
    //     as: 'employee'
    // });
    // this.experience
    //     .hasOne(this.employee, {
    //         as: 'employee'
    //     })
    //     .hasOne(this.designation, {
    //         as: 'designation'
    //     });
    // this.leave
    //     .hasOne(this.employee, {
    //         as: 'employee'
    //     })
    //     .hasOne(this.leave_type, {
    //         as: 'leave_type'
    //     });
    // this.promotion
    //     .hasOne(this.employee, {
    //         as: 'employee'
    //     })
    //     .hasOne(this.designation, {
    //         as: 'old_designation'
    //     })
    //     .hasOne(this.designation, {
    //         as: 'new_designation'
    //     });
    // this.salary.hasOne(this.employee, {
    //     as: 'employee'
    // });
    // this.monthly_attendance
    //     .hasOne(this.employee, {
    //         as: 'employee'
    //     })
    //     .hasOne(this.month_range, {
    //         as: 'month_range'
    //     });
    // this.daily_attendance
    //     .hasOne(this.employee, {
    //         as: 'employee'
    //     })
    //     .hasOne(this.work_time, {
    //         as: 'work_time'
    //     })
    //     .hasOne(this.attend_status, {
    //         as: 'in_status'
    //     })
    //     .hasOne(this.attend_status, {
    //         as: 'out_status'
    //     })
    //     .hasOne(this.attend_status, {
    //         as: 'attend_status'
    //     });
    // this.bank_account
    //     .hasOne(this.employee, {
    //         as: 'employee'
    //     })
    //     .hasOne(this.bank, {
    //         as: 'bank'
    //     });
    // this.deduction.hasOne(this.employee, {
    //     as: 'employee'
    // });
    // this.section
    //     .hasOne(this.department, {
    //         as: 'department'
    //     })
    //     .hasOne(this.employee_type, {
    //         as: 'employee_type'
    //     });
    // this.comparative_salary
    //     .hasOne(this.section, {
    //         as: 'section'
    //     })
    //     .hasOne(this.status, {
    //         as: 'status'
    //     })
    //     .hasOne(this.payment_method, {
    //         as: 'payment_method'
    //     })
    //     .hasOne(this.employee_type, {
    //         as: 'employee_type'
    //     });
    // this.comparative_salary_b
    //     .hasOne(this.section, {
    //         as: 'section'
    //     })
    //     .hasOne(this.status, {
    //         as: 'status'
    //     })
    //     .hasOne(this.payment_method, {
    //         as: 'payment_method'
    //     })
    //     .hasOne(this.employee_type, {
    //         as: 'employee_type'
    //     });
    // this.punch_problem
    //     .hasOne(this.employee, {
    //         as: 'employee'
    //     })
    //     .hasOne(this.permission, {
    //         as: 'permission'
    //     });
    // this.monthly_payment
    //     .hasOne(this.payment_type, {
    //         as: 'payment_type'
    //     })
    //     .hasOne(this.monthly_attendance, {
    //         as: 'monthly_attendance'
    //     })
    //     .hasOne(this.deduction, {
    //         as: 'deduction'
    //     })
    //     .hasOne(this.payment_status, {
    //         as: 'payment_status'
    //     })
    //     .hasOne(this.user, {
    //         as: 'user'
    //     });
    // this.salary_payment
    //     .hasOne(this.employee, {
    //         as: 'employee'
    //     })
    //     .hasOne(this.payment_type, {
    //         as: 'payment_type'
    //     })
    //     .hasOne(this.payment_status, {
    //         as: 'payment_status'
    //     })
    //     .hasOne(this.user, {
    //         as: 'user'
    //     });
    // this.accounts_head.hasOne(this.accounts_type, {
    //     as: 'accounts_type'
    // });
    // this.sub_head.hasOne(this.accounts_head, {
    //     as: 'accounts_head'
    // });
    // this.voucher_type.hasOne(this.voucher_type, {
    //     as: 'parent'
    // });
    // this.voucher
    //     .hasOne(this.voucher_type, {
    //         as: 'voucher_type'
    //     })
    //     .hasOne(this.payment_method, {
    //         as: 'payment_method'
    //     })
    //     .hasOne(this.user, {
    //         as: 'user'
    //     });
    // this.voucher_item
    //     .hasOne(this.voucher, {
    //         as: 'voucher'
    //     })
    //     .hasOne(this.sub_head, {
    //         as: 'sub_head'
    //     })
    //     .hasOne(this.entry_type, {
    //         as: 'entry_type'
    //     });
    // this.overtime_summary
    //     .hasOne(this.section, {
    //         as: 'section'
    //     })
    //     .hasOne(this.status, {
    //         as: 'status'
    //     });

    /*=========================================================================================================
    =========================================================================================================
    =========================================================================================================*/




    
    this.address.belongsTo(this.employee, {
        foreignKey: 'employee'
    })
    this.address.belongsTo(this.address_type, {
        foreignKey: 'address_type'
    })
    this.address.belongsTo(this.village, {
        foreignKey: 'village'
    })
    this.address.belongsTo(this.post_office, {
        foreignKey: 'post_office'
    })
    this.address.belongsTo(this.police_station, {
        foreignKey: 'police_station'
    })
    this.address.belongsTo(this.district, {
        foreignKey: 'district'
    });
    this.attendance.belongsTo(this.employee, {
        foreignKey: 'employee'
    });
    this.education.belongsTo(this.employee, {
        foreignKey: 'employee'
    });
    this.experience.belongsTo(this.employee, {
        foreignKey: 'employee'
    })
    this.experience.belongsTo(this.designation, {
        foreignKey: 'designation'
    });
    this.leave.belongsTo(this.employee, {
        foreignKey: 'employee'
    })
    this.leave.belongsTo(this.leave_type, {
        foreignKey: 'leave_type'
    });
    this.promotion.belongsTo(this.employee, {
        foreignKey: 'employee'
    })
    this.promotion.belongsTo(this.designation, {
        foreignKey: 'old_designation'
    })
    this.promotion.belongsTo(this.designation, {
        foreignKey: 'new_designation'
    });
    this.salary.belongsTo(this.employee, {
        foreignKey: 'employee'
    });
    this.monthly_attendance.belongsTo(this.employee, {
        foreignKey: 'employee'
    })
    this.monthly_attendance.belongsTo(this.month_range, {
        foreignKey: 'month_range'
    });
    this.daily_attendance.belongsTo(this.employee, {
        foreignKey: 'employee'
    })
    this.daily_attendance.belongsTo(this.work_time, {
        foreignKey: 'work_time'
    })
    this.daily_attendance.belongsTo(this.attend_status, {
        foreignKey: 'in_status'
    })
    this.daily_attendance.belongsTo(this.attend_status, {
        foreignKey: 'out_status'
    })
    this.daily_attendance.belongsTo(this.attend_status, {
        foreignKey: 'attend_status'
    });
    this.bank_account.belongsTo(this.employee, {
        foreignKey: 'employee'
    })
    this.bank_account.belongsTo(this.bank, {
        foreignKey: 'bank'
    });
    this.deduction.belongsTo(this.employee, {
        foreignKey: 'employee'
    });
    this.section.belongsTo(this.department, {
        foreignKey: 'department'
    })
    this.section.belongsTo(this.employee_type, {
        foreignKey: 'employee_type'
    });
    this.comparative_salary.belongsTo(this.section, {
        foreignKey: 'section'
    })
    this.comparative_salary.belongsTo(this.status, {
        foreignKey: 'status'
    })
    this.comparative_salary.belongsTo(this.payment_method, {
        foreignKey: 'payment_method'
    })
    this.comparative_salary.belongsTo(this.employee_type, {
        foreignKey: 'employee_type'
    });
    this.comparative_salary_b.belongsTo(this.section, {
        foreignKey: 'section'
    })
    this.comparative_salary_b.belongsTo(this.status, {
        foreignKey: 'status'
    })
    this.comparative_salary_b.belongsTo(this.payment_method, {
        foreignKey: 'payment_method'
    })
    this.comparative_salary_b.belongsTo(this.employee_type, {
        foreignKey: 'employee_type'
    });
    this.punch_problem.belongsTo(this.employee, {
        foreignKey: 'employee'
    })
    this.punch_problem.belongsTo(this.permission, {
        foreignKey: 'permission'
    });
    this.monthly_payment.belongsTo(this.payment_type, {
        foreignKey: 'payment_type'
    })
    this.monthly_payment.belongsTo(this.monthly_attendance, {
        foreignKey: 'monthly_attendance'
    })
    this.monthly_payment.belongsTo(this.deduction, {
        foreignKey: 'deduction'
    })
    this.monthly_payment.belongsTo(this.payment_status, {
        foreignKey: 'payment_status'
    })
    this.monthly_payment.belongsTo(this.user, {
        foreignKey: 'user'
    });
    this.salary_payment.belongsTo(this.employee, {
        foreignKey: 'employee'
    })
    this.salary_payment.belongsTo(this.payment_type, {
        foreignKey: 'payment_type'
    })
    this.salary_payment.belongsTo(this.payment_status, {
        foreignKey: 'payment_status'
    })
    this.salary_payment.belongsTo(this.user, {
        foreignKey: 'user'
    });
    this.accounts_head.belongsTo(this.accounts_type, {
        foreignKey: 'accounts_type'
    });
    this.sub_head.belongsTo(this.accounts_head, {
        foreignKey: 'accounts_head'
    });
    this.voucher_type.belongsTo(this.voucher_type, {
        foreignKey: 'parent'
    });
    this.voucher.belongsTo(this.voucher_type, {
        foreignKey: 'voucher_type'
    })
    this.voucher.belongsTo(this.payment_method, {
        foreignKey: 'payment_method'
    })
    this.voucher.belongsTo(this.user, {
        foreignKey: 'user'
    });
    this.voucher_item.belongsTo(this.voucher, {
        foreignKey: 'voucher'
    })
    this.voucher_item.belongsTo(this.sub_head, {
        foreignKey: 'sub_head'
    })
    this.voucher_item.belongsTo(this.entry_type, {
        foreignKey: 'entry_type'
    });
    this.deduction.belongsTo(this.employee, {
        foreignKey: 'employee'
    });
    this.overtime_summary.belongsTo(this.section, {
        foreignKey: 'section'
    })
    this.overtime_summary.belongsTo(this.status, {
        foreignKey: 'status'
    });
    this.employee.belongsTo(this.user, {
        foreignKey: 'user'
    })
    this.employee.belongsTo(this.department, {
        foreignKey: 'department'
    })
    this.employee.belongsTo(this.designation, {
        foreignKey: 'designation'
    })
    this.employee.belongsTo(this.section, {
        foreignKey: 'section'
    })
    this.employee.belongsTo(this.working_place, {
        foreignKey: 'working_place'
    })
    this.employee.belongsTo(this.employee_type, {
        foreignKey: 'employee_type'
    })
    this.employee.belongsTo(this.referer, {
        foreignKey: 'referer'
    })
    this.employee.belongsTo(this.religion, {
        foreignKey: 'religion'
    })
    this.employee.belongsTo(this.blood_group, {
        foreignKey: 'blood_group'
    })
    this.employee.belongsTo(this.work_time, {
        foreignKey: 'work_time'
    })
    this.employee.belongsTo(this.duty_shift, {
        foreignKey: 'duty_shift'
    })
    this.employee.belongsTo(this.status, {
        foreignKey: 'status'
    });
    this.designation.belongsTo(this.section, {
        foreignKey: 'section'
    });
    this.special_work_time.belongsTo(this.work_time, {
        foreignKey: 'work_time'
    });



    ////////////////%%%%#####  RIPS TABLE RELATIONSHIP ENDS  #####%%%%////////////////////
    // if (process.env.PWD.toUpperCase().indexOf("DROPBOX") != -1) {
        sequelize.sync({
            force: false
        }).then(function(d) {
            if (!d) {
                console.log('An error occurred while creating the table:', d)
            } else {
                console.log('It worked!')
            }
        })
    // }

}

module.exports.connect = connect;