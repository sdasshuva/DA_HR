module.exports = function() {};

function search_section_list(db, DATA, callback) {
    var search = {};
    if (DATA.id) {
        search.id = DATA.id
    }
    db.section.findAll({
        where: search
    }).complete(function(err, data) {
        callback(data);
    })
}

function getPermission(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    if (QUERY.name) {
        SEARCH.name = QUERY.name;
        findData.where = SEARCH;
    }
    findData.attributes = [
        'id', 'name'
    ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'id';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.permission.findAll(findData).complete(function(err, permissionData) {
        callback(permissionData);
    })
}

function getEmployeeCombo(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    // SEARCH.status = (QUERY.status)?QUERY.status:[1, 2];
    // findData.where = SEARCH;
    findData.include = [{
        model: db.user,
        attributes: [
            'id', 'first_name', 'card_no'
        ]
    }, ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'id';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.order = [
        [SORT, DIR]
    ];
    db.employee.findAll(findData).complete(function(err, empData) {
        async.each(empData, function(emp, cb_emp) {
            var o = {}
            o.id = emp.id;
            o.name = emp.id + '-' +
                (
                    (emp.userTable) ?
                    (
                        (emp.userTable.card_no) ?
                        emp.userTable.card_no :
                        0
                    ) :
                    0
                ) + '-' +
                (
                    (emp.userTable) ?
                    (
                        (emp.userTable.first_name) ?
                        emp.userTable.first_name.toUpperCase() :
                        'NOT GIVEN'
                    ) :
                    'NOT GIVEN'
                );
            returnData.push(o)
            cb_emp();
        }, function(err) {
            if (err) {
                throw err;
            }
            callback(returnData);
        });
    })
}

function getAllEmployeeID(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    if (QUERY.id)
        SEARCH.id = QUERY.id
    if (QUERY.user)
        SEARCH.user = QUERY.user
    if (QUERY.grade)
        SEARCH.grade = QUERY.grade
    if (QUERY.designation)
        SEARCH.designation = QUERY.designation
    if (QUERY.department)
        SEARCH.department = QUERY.department
    if (QUERY.section)
        SEARCH.section = QUERY.section
    if (QUERY.employee_type)
        SEARCH.employee_type = QUERY.employee_type
    if (QUERY.date_of_birth)
        SEARCH.date_of_birth = QUERY.date_of_birth
    if (QUERY.date_of_join)
        SEARCH.date_of_join = QUERY.date_of_join
    if (QUERY.date_of_release)
        SEARCH.date_of_release = QUERY.date_of_release
    if (QUERY.referer)
        SEARCH.referer = QUERY.referer
    if (QUERY.national_id)
        SEARCH.national_id = QUERY.national_id
    if (QUERY.religion)
        SEARCH.religion = QUERY.religion
    if (QUERY.marital_status)
        SEARCH.marital_status = QUERY.marital_status
    if (QUERY.contact_no)
        SEARCH.contact_no = QUERY.contact_no
    if (QUERY.blood_group)
        SEARCH.blood_group = QUERY.blood_group
    if (QUERY.duty_shift)
        SEARCH.duty_shift = QUERY.duty_shift
    if (QUERY.work_time)
        SEARCH.work_time = QUERY.work_time
    if (QUERY.payment_method)
        SEARCH.payment_method = QUERY.payment_method
    if (QUERY.status)
        SEARCH.status = QUERY.status
        // SEARCH.status = (QUERY.status)?QUERY.status:[1,2];
    findData.where = SEARCH;
    findData.attributes = [
        'id'
    ];
    db.employee.findAll(findData).complete(function(err, empData) {
        async.each(empData, function(emp, cb_emp) {
            var e = {};
            e.id = emp.id;
            returnData.push(e)
            cb_emp();
        }, function(err) {
            if (err) {
                throw err;
            }
            callback(returnData);
        });
    })
}

function getEmployeeID(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    if (QUERY.id)
        SEARCH.id = QUERY.id
    if (QUERY.user)
        SEARCH.user = QUERY.user
    if (QUERY.grade)
        SEARCH.grade = QUERY.grade
    if (QUERY.designation)
        SEARCH.designation = QUERY.designation
    if (QUERY.department)
        SEARCH.department = QUERY.department
    if (QUERY.section)
        SEARCH.section = QUERY.section
    if (QUERY.employee_type)
        SEARCH.employee_type = QUERY.employee_type
    if (QUERY.date_of_birth)
        SEARCH.date_of_birth = QUERY.date_of_birth
    if (QUERY.date_of_join)
        SEARCH.date_of_join = QUERY.date_of_join
    if (QUERY.date_of_release)
        SEARCH.date_of_release = QUERY.date_of_release
    if (QUERY.referer)
        SEARCH.referer = QUERY.referer
    if (QUERY.national_id)
        SEARCH.national_id = QUERY.national_id
    if (QUERY.religion)
        SEARCH.religion = QUERY.religion
    if (QUERY.marital_status)
        SEARCH.marital_status = QUERY.marital_status
    if (QUERY.contact_no)
        SEARCH.contact_no = QUERY.contact_no
    if (QUERY.blood_group)
        SEARCH.blood_group = QUERY.blood_group
    if (QUERY.duty_shift)
        SEARCH.duty_shift = QUERY.duty_shift
    if (QUERY.work_time)
        SEARCH.work_time = QUERY.work_time
    if (QUERY.payment_method)
        SEARCH.payment_method = QUERY.payment_method
    if (QUERY.status)
        SEARCH.status = QUERY.status
        // SEARCH.status = (QUERY.status)?QUERY.status:[1,2];
    findData.where = SEARCH;
    findData.attributes = [
        'id'
    ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'id';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.employee.findAll(findData).complete(function(err, empData) {
        async.each(empData, function(emp, cb_emp) {
            var e = {};
            e.id = emp.id;
            returnData.push(e)
            cb_emp();
        }, function(err) {
            if (err) {
                throw err;
            }
            callback(returnData);
        });
    })
}

function getEmployee(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    if (QUERY.id)
        SEARCH.id = QUERY.id
    if (QUERY.user)
        SEARCH.user = QUERY.user
    if (QUERY.grade)
        SEARCH.grade = QUERY.grade
    if (QUERY.designation)
        SEARCH.designation = QUERY.designation
    if (QUERY.department)
        SEARCH.department = QUERY.department
    if (QUERY.section)
        SEARCH.section = QUERY.section
    if (QUERY.employee_type)
        SEARCH.employee_type = QUERY.employee_type
    if (QUERY.date_of_birth)
        SEARCH.date_of_birth = QUERY.date_of_birth
    if (QUERY.date_of_join)
        SEARCH.date_of_join = QUERY.date_of_join
    if (QUERY.date_of_release)
        SEARCH.date_of_release = QUERY.date_of_release
    if (QUERY.referer)
        SEARCH.referer = QUERY.referer
    if (QUERY.national_id)
        SEARCH.national_id = QUERY.national_id
    if (QUERY.religion)
        SEARCH.religion = QUERY.religion
    if (QUERY.marital_status)
        SEARCH.marital_status = QUERY.marital_status
    if (QUERY.contact_no)
        SEARCH.contact_no = QUERY.contact_no
    if (QUERY.blood_group)
        SEARCH.blood_group = QUERY.blood_group
    if (QUERY.duty_shift)
        SEARCH.duty_shift = QUERY.duty_shift
    if (QUERY.work_time)
        SEARCH.work_time = QUERY.work_time
    if (QUERY.payment_method)
        SEARCH.payment_method = QUERY.payment_method
    if (QUERY.status)
        SEARCH.status = QUERY.status
        // SEARCH.status = (QUERY.status)?QUERY.status:[1, 2];
    findData.where = SEARCH;
    findData.attributes = [
        'id', 'user', 'photo', 'grade', 'designation',
        'department', 'section', 'employee_type', 'date_of_birth',
        'date_of_join', 'date_of_release', 'referer',
        'national_id', 'religion', 'marital_status', 'contact_no',
        'blood_group', 'remarks', 'duty_shift', 'work_time',
        'payment_method', 'status'
    ];
    findData.include = [{
        model: db.user,
        attributes: [
            'id', 'first_name', 'last_name', 'name_bangla', 'card_no'
        ]
    }, {
        model: db.department,
        attributes: [
            'id', 'name'
        ]
    }, {
        model: db.designation,
        attributes: [
            'id', 'name', 'attendance_bonus', 'name_bangla'
        ]
    }, {
        model: db.employee_type,
        attributes: [
            'id', 'name'
        ]
    }, {
        model: db.section,
        attributes: [
            'id', 'name'
        ]
    }, {
        model: db.work_time,
        attributes: [
            'id', 'name', 'in_time', 'out_time',
            'in_hour', 'in_minute', 'in_late_allowed_minute',
            'in_bonus_late_allowed_minute', 'out_hour',
            'out_minute', 'out_late_allowed_minute',
            'out_bonus_late_allowed_minute'
        ]
    }];
    var SORT = (QUERY.sort) ? QUERY.sort : 'id';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = 100 //QUERY.limit;
    db.employee.findAll(findData).complete(function(err, empData) {
        async.each(empData, function(emp, cb_emp) {
            var t1 = JSON.stringify(emp.userTable, null, 4);
            var t2 = t1.split("\n");
            var t3 = (t2[4]) ? t2[4].split(":") : '';
            var t4 = (t3[2]) ? t3[1] + t3[2] : t3[1];
            var t5 = (t4) ? t4.split('"') : '';
            var t6 = (t5[1]) ? t5[1] : '';
            var e = {};
            e.id = emp.id;
            e.card_no = (emp.userTable) ?
                (emp.userTable.card_no ?
                    emp.userTable.card_no :
                    ' ') :
                ' ';
            e.name = (emp.userTable) ?
                ((emp.userTable.first_name) ?
                    ((emp.userTable.last_name) ?
                        emp.userTable.first_name.toUpperCase() + ' ' + emp.userTable.last_name.toUpperCase() :
                        emp.userTable.first_name.toUpperCase()) :
                    'NOT GIVEN') :
                'NOT GIVEN';
            e.name_bangla = t6;
            e.grade = emp.grade;
            e.designation = emp.designation;
            e.designationTable = JSON.parse(JSON.stringify(emp.designationTable));
            e.designationName = (e.designationTable) ?
                (e.designationTable.name.toUpperCase() ?
                    e.designationTable.name.toUpperCase() :
                    'NOT GIVEN') :
                'NOT GIVEN';
            e.designationBanglaName = (e.designationTable) ?
                (e.designationTable.name_bangla ?
                    e.designationTable.name_bangla :
                    '') :
                '';
            e.attendanceBonus = (emp.designationTable) ?
                (
                    emp.designationTable.attendance_bonus ?
                    emp.designationTable.attendance_bonus :
                    0
                ) :
                0;
            e.department = emp.department;
            e.departmentName = (emp.departmentTable) ?
                (emp.departmentTable.name.toUpperCase() ?
                    emp.departmentTable.name.toUpperCase() :
                    'NOT GIVEN') :
                'NOT GIVEN';
            e.section = emp.section;
            e.sectionName = (emp.sectionTable) ?
                (emp.sectionTable.name.toUpperCase() ?
                    emp.sectionTable.name.toUpperCase() :
                    'NOT GIVEN') :
                'NOT GIVEN';
            e.employee_type = emp.employee_type;
            e.employeeTypeName = (emp.employeeTypeTable) ?
                (emp.employeeTypeTable.name.toUpperCase() ?
                    emp.employeeTypeTable.name.toUpperCase() :
                    'NOT GIVEN') :
                'NOT GIVEN';
            e.workInTime = (emp.workTimeTable) ?
                (emp.workTimeTable.in_time ?
                    emp.workTimeTable.in_time :
                    '00:00:00') :
                '00:00:00';
            e.workOutTime = (emp.workTimeTable) ?
                (emp.workTimeTable.out_time ?
                    emp.workTimeTable.out_time :
                    '00:00:00') :
                '00:00:00';
            e.workTimeTable = JSON.parse(JSON.stringify(emp.workTimeTable));
            e.date_of_birth = (emp.date_of_birth) ? new Date(emp.date_of_birth) : new Date();
            e.date_of_join = (emp.date_of_join) ? new Date(emp.date_of_join) : new Date(emp.date_of_join);
            e.date_of_release = new Date(emp.date_of_release);
            e.payment_method = emp.payment_method;
            e.status = emp.status;
            e.statusName = '';
            e.last_punch = 'NOT FOUND';
            var statusSearch = {};
            statusSearch.id = emp.status;
            getStatus(db, statusSearch, function(statusData) {
                async.each(statusData, function(stat, cb_stat) {
                    e.statusName = stat.name.toUpperCase();
                    cb_stat();
                }, function(err) {
                    var attData = {
                        where: {
                            employee: e.id
                        },
                        order: [
                            ['punch_time', 'DESC']
                        ],
                        limit: 1
                    };
                    db.attendance.findAll(attData).complete(function(err, att) {
                        e.last_punch = (att[0]) ? ((att[0].punch_time) ? new Date(att[0].punch_time).formatedDate() : e.last_punch) : e.last_punch;
                        returnData.push(e);
                        cb_emp();
                    });
                });
            });
        }, function(err) {
            if (err) {
                throw err;
            }
            callback(returnData);
        });
    })
}

function getEmpPrintList(db, STACK, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    findData.where = {
        id: STACK
    };
    findData.attributes = [
        'id', 'user', 'photo', 'grade', 'designation',
        'department', 'section', 'employee_type', 'date_of_birth',
        'date_of_join', 'date_of_release', 'card_issue', 'card_expire',
        'address', 'address_bangla', 'referer', 'gender',
        'national_id', 'religion', 'marital_status', 'contact_no',
        'blood_group', 'remarks', 'duty_shift', 'work_time',
        'payment_method', 'status', 'created_at', 'updated_at'
    ];
    findData.include = [{
        model: db.user,
        attributes: [
            'id', 'card_no', 'finger_print_id', 'first_name', 'last_name',
            'name_bangla', 'email', 'access_level', 'created_at', 'updated_at'
        ]
    }, {
        model: db.department,
        attributes: [
            'id', 'name', 'created_at', 'updated_at'
        ]
    }, {
        model: db.religion,
        attributes: [
            'id', 'name', 'created_at', 'updated_at'
        ]
    }, {
        model: db.designation,
        attributes: [
            'id', 'section', 'name', 'attendance_bonus', 'name_bangla',
            'created_at', 'updated_at'
        ]
    }, {
        model: db.employee_type,
        attributes: [
            'id', 'name', 'created_at', 'updated_at'
        ]
    }, {
        model: db.blood_group,
        attributes: [
            'id', 'name', 'name_bangla', 'created_at', 'updated_at'
        ]
    }, {
        model: db.section,
        attributes: [
            'id', 'department', 'name', 'name_bangla', 'employee_type',
            'created_at', 'updated_at'
        ]
    }, {
        model: db.work_time,
        attributes: [
            'id', 'name', 'in_time', 'out_time', 'in_late_allowed_minute',
            'in_bonus_late_allowed_minute', 'out_hour', 'out_minute',
            'out_late_allowed_minute', 'out_bonus_late_allowed_minute',
            'created_at', 'updated_at'
        ]
    }];
    db.employee.findAll(findData).complete(function(err, empData) {
        callback(empData);
    })
}

function getComplianceEmployeeList(db, QUERY, callback) {
    var returnData = [],
        search_emp = {};
    if (!QUERY.id) {
        search_emp.status = [1, 2];
    } else {
        search_emp = ["(employee.id LIKE ? OR User_Table.first_name LIKE ? OR User_Table.name_bangla LIKE ? OR User_Table.card_no LIKE ? OR Designation_Table.name LIKE ? OR Section_Table.name LIKE ? OR Department_Table.name LIKE ? OR Employee_Type_Table.name LIKE ?) AND employee.status IN (1,2) AND Section_Table.name NOT LIKE '%Security%' AND Section_Table.name NOT LIKE '%Store%'", "%" + QUERY.id + "%", "%" + QUERY.id + "%", "%" + QUERY.id + "%", "%" + QUERY.id + "%", "%" + QUERY.id + "%", "%" + QUERY.id + "%", "%" + QUERY.id + "%", "%" + QUERY.id + "%"];
    }
    var START = (QUERY.start) ? parseInt(QUERY.start) : 0;
    var LIMIT = (QUERY.limit) ? parseInt(QUERY.limit) : 30;
    var SORT = (QUERY.sort) ? QUERY.sort : 'id';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';

    db.employee.findAndCountAll({
        where: search_emp,
        attributes: ['id', 'grade', 'status', 'date_of_birth', 'date_of_join'],
        include: [{
            model: db.user,
            attributes: [
                'id', 'card_no', 'finger_print_id',
                'first_name', 'last_name', 'name_bangla', 'email', 'access_level'
            ]
        }, {
            model: db.designation,
            attributes: ['name']
        }, {
            model: db.department,
            attributes: ['name']
        }, {
            model: db.section,
            attributes: ['name']
        }, {
            model: db.working_place,
            attributes: ['name']
        }, {
            model: db.employee_type,
            attributes: ['name']
        }, {
            model: db.status,
            attributes: ['name']
        }, {
            model: db.work_time,
            attributes: ['in_time', 'out_time']
        }, ],
        order: [
            [SORT, DIR]
        ],
        offset: START,
        limit: LIMIT,
    }).complete(function(err, empData) {
        callback(empData);
    })
}


function getEmployeeFullDetails(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    var SDate = new Date();
    if (QUERY.date)
        SDate = new Date(QUERY.date);
    if (QUERY.month)
        SDate = new Date(QUERY.month);
    if (QUERY.id)
        SEARCH.id = QUERY.id
    if (QUERY.user)
        SEARCH.user = QUERY.user
    if (QUERY.grade)
        SEARCH.grade = QUERY.grade
    if (QUERY.designation)
        SEARCH.designation = QUERY.designation
    if (QUERY.department)
        SEARCH.department = QUERY.department
    if (QUERY.section)
        SEARCH.section = QUERY.section
    if (QUERY.employee_type)
        SEARCH.employee_type = QUERY.employee_type
    if (QUERY.date_of_birth)
        SEARCH.date_of_birth = QUERY.date_of_birth
    if (QUERY.date_of_join)
        SEARCH.date_of_join = QUERY.date_of_join
    if (QUERY.date_of_release)
        SEARCH.date_of_release = QUERY.date_of_release
    if (QUERY.referer)
        SEARCH.referer = QUERY.referer
    if (QUERY.national_id)
        SEARCH.national_id = QUERY.national_id
    if (QUERY.religion)
        SEARCH.religion = QUERY.religion
    if (QUERY.marital_status)
        SEARCH.marital_status = QUERY.marital_status
    if (QUERY.contact_no)
        SEARCH.contact_no = QUERY.contact_no
    if (QUERY.blood_group)
        SEARCH.blood_group = QUERY.blood_group
    if (QUERY.duty_shift)
        SEARCH.duty_shift = QUERY.duty_shift
    if (QUERY.work_time)
        SEARCH.work_time = QUERY.work_time
    if (QUERY.payment_method)
        SEARCH.payment_method = QUERY.payment_method
    if (QUERY.status)
        SEARCH.status = QUERY.status
    findData.where = SEARCH;
    findData.attributes = [
        'id', 'user', 'photo', 'grade', 'designation',
        'department', 'section', 'employee_type', 'date_of_birth',
        'date_of_join', 'date_of_release', 'card_issue',
        'card_expire', 'address', 'address_bangla', 'referer',
        'national_id', 'religion', 'marital_status', 'contact_no',
        'blood_group', 'remarks', 'duty_shift', 'work_time',
        'payment_method', 'status', 'created_at', 'updated_at'
    ];
    findData.include = [{
        model: db.user,
        attributes: [
            'id', 'first_name', 'last_name', 'name_bangla',
            'card_no', 'finger_print_id', 'email',
            'access_level', 'created_at', 'updated_at'
        ]
    }, {
        model: db.department,
        attributes: [
            'id', 'name', 'created_at', 'updated_at'
        ]
    }, {
        model: db.designation,
        attributes: [
            'id', 'name', 'section', 'name_bangla',
            'attendance_bonus', 'created_at', 'updated_at'
        ]
    }, {
        model: db.employee_type,
        attributes: [
            'id', 'name', 'created_at', 'updated_at'
        ]
    }, {
        model: db.religion,
        attributes: [
            'id', 'name', 'created_at', 'updated_at'
        ]
    }, {
        model: db.status,
        attributes: [
            'id', 'name', 'created_at', 'updated_at'
        ]
    }, {
        model: db.section,
        attributes: [
            'id', 'name', 'department', 'name_bangla',
            'created_at', 'updated_at'
        ]
    }, {
        model: db.blood_group,
        attributes: [
            'id', 'name', 'name_bangla',
            'created_at', 'updated_at'
        ]
    }, {
        model: db.work_time,
        attributes: [
            'id', 'name', 'in_time', 'out_time', 'in_hour',
            'in_minute', 'in_late_allowed_minute',
            'in_bonus_late_allowed_minute', 'out_hour',
            'out_minute', 'out_late_allowed_minute',
            'out_bonus_late_allowed_minute', 'created_at', 'updated_at'
        ]
    }];
    var SORT = (QUERY.sort) ? QUERY.sort : 'id';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.order = [
        [SORT, DIR]
    ];
    db.employee.findAll(findData).complete(function(err, empData) {
        callback(empData);
        // async.each(empData, function (emp, cb_emp) {
        //   var o = {};
        //   o = emp;
        //   o.statusTable = emp.statu;
        //   // emp.statusTable = emp.statu;
        //   // JSON.parse(JSON.stringify(emp, null, 4));
        // }, function (err) {
        //   callback(returnData);
        // });
    })
}

function search_employee_id_list(db, QUERY, callback) {
    var search_emp = {};
    if (QUERY.status)
        search_emp.status = (QUERY.status) ? QUERY.status : 1;
    else if (QUERY.id)
        search_emp.id = QUERY.id;
    else if (QUERY.department)
        search_emp.department = QUERY.department;
    else if (QUERY.designation)
        search_emp.designation = QUERY.designation;
    else if (QUERY.section)
        search_emp.section = QUERY.section;
    else if (QUERY.working_place)
        search_emp.working_place = QUERY.working_place;
    else if (QUERY.employee_type)
        search_emp.employee_type = QUERY.employee_type;
    else
        search_emp.status = 1;
    db.employee.findAll({
        where: search_emp,
        attributes: ['id', 'grade', 'payment_method'],
        order: [
            ['id', 'ASC']
        ],
    }).complete(function(err, employee_data) {
        callback(employee_data);
    })
}

function UpdateEmployeeNameBangla(db, DATA, database, callback) {
    database.sequelize.query('UPDATE `user` SET `name_bangla` = "' + DATA.name_bangla + '" WHERE `user`.`id` = "' + DATA.id + '"').complete(function(err, user) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    });
}

function UpdateEmployeeAddressBangla(db, DATA, database, callback) {
    database.sequelize.query('UPDATE `employee` SET `address_bangla` = "' + DATA.address_bangla + '" WHERE `employee`.`id` = "' + DATA.id + '"').complete(function(err, employee) {
        if (err) {
            callback("error");
            // if(err[0].code == "ER_ROW_IS_REFERENCED_" ){
            //     callback("referenced");
            // }else{
            //     callback("error");
            // }
        } else {
            callback("success");
        }
    });
}

function employee_overtime_satement(db, DATA, callback) {
    var d = (DATA) ? new Date(DATA.date) : new Date();
    d.setDate(1);
    var e = (DATA) ? DATA.id : 1;
    var f = new Date(d);
    d.setMonth(d.getMonth() + 1);
    var t = new Date(d);

    var returnData = [];
    var holiday = [];
    var adjustment = [];
    var dateList = dateListFromMonth(f);
    var empJson = {};
    empJson.name = 'NOT GIVEN';
    empJson.card_no = '';
    empJson.fp_id = '';
    empJson.date_of_join = '';
    empJson.department = '';
    empJson.designation = '';
    empJson.inLate = 0;
    empJson.outLate = 0;
    empJson.overTime = 0;
    empJson.excessOverTime = 0;
    attendance = [];
    var dateJson = {};

    ///////////////////////////// Holiday Start /////////////////////////////////
    db.holiday.findAll({
        attributes: ['id', 'date'],
        where: {
            date: {
                between: [f, t]
            }
        },
    }).complete(function(err, hData) {
        async.each(hData, function(holid, cb_holid) {
            if (holid.date) {
                holiday.push(holid.date.getDate());
            }
            cb_holid();
        }, function(err) {
            ///////////////////////////// Adjustment Start /////////////////////////////////
            db.adjustment.findAll({
                attributes: ['id', 'date'],
                where: {
                    date: {
                        between: [f, t]
                    }
                },
            }).complete(function(err, aData) {
                async.each(aData, function(adj, cb_adj) {
                    if (adj.date) {
                        adjustment.push(adj.date.getDate());
                    }
                    cb_adj();
                }, function(err) {
                    async.each(dateList, function(dLDT, cb_dLDT) {
                        var tmpdLDT1 = dLDT + '-' + mthNames[f.getMonth()] + '-' + f.getFullYear();
                        var tmpdLDT2 = new Date(tmpdLDT1);
                        dateJson[tmpdLDT1] = {};
                        dateJson[tmpdLDT1].punches = [];
                        dateJson[tmpdLDT1].attendance = (tmpdLDT2.getDay() == 5) ?
                            'W' :
                            ((holiday.indexOf(dLDT) != -1) ?
                                'H' :
                                'A'
                            );
                        if (adjustment.indexOf(dLDT) != -1) {
                            dateJson[tmpdLDT1].attendance = 'A';
                        }
                        dateJson[tmpdLDT1].in = {};
                        dateJson[tmpdLDT1].in.A = 'A';
                        dateJson[tmpdLDT1].in.T = [];
                        dateJson[tmpdLDT1].in.H = 24;
                        dateJson[tmpdLDT1].in.M = 59;
                        dateJson[tmpdLDT1].in.S = 59;
                        dateJson[tmpdLDT1].out = {};
                        dateJson[tmpdLDT1].out.A = 'A';
                        dateJson[tmpdLDT1].out.T = [];
                        dateJson[tmpdLDT1].out.H = 24;
                        dateJson[tmpdLDT1].out.M = 59;
                        dateJson[tmpdLDT1].out.S = 59;
                        cb_dLDT();
                    }, function(err) {
                        db.attendance.findAll({
                            where: {
                                punch_time: {
                                    between: [f, t]
                                },
                                employee: e
                            },
                            attributes: ['id', 'punch_time'],
                            include: [{
                                model: db.employee,
                                attributes: ['id', 'user', 'date_of_join', 'department', 'designation'],
                                include: [{
                                    model: db.user,
                                    attributes: [
                                        'id', 'first_name', 'last_name',
                                        'card_no', 'finger_print_id', 'email',
                                        'access_level', 'created_at'
                                    ]
                                }, {
                                    model: db.department,
                                    attributes: [
                                        'id', 'name'
                                    ]
                                }, {
                                    model: db.designation,
                                    attributes: [
                                        'id', 'name'
                                    ]
                                }],
                            }],
                            order: [
                                ['employee', 'ASC']
                            ],
                        }).complete(function(err, attData) {
                            async.each(attData, function(att, cb_att) {
                                empJson.name = (att.employeeTable) ?
                                    ((att.employeeTable.userTable) ?
                                        ((att.employeeTable.userTable.first_name) ?
                                            ((att.employeeTable.userTable.last_name) ?
                                                att.employeeTable.userTable.first_name.toUpperCase() + ' ' + att.employeeTable.userTable.last_name.toUpperCase() :
                                                att.employeeTable.userTable.first_name.toUpperCase()) :
                                            'NOT GIVEN') :
                                        'NOT GIVEN') :
                                    'NOT GIVEN';
                                empJson.card_no = (att.employeeTable) ?
                                    ((att.employeeTable.userTable) ?
                                        ((att.employeeTable.userTable.card_no) ?
                                            att.employeeTable.userTable.card_no :
                                            '') :
                                        '') :
                                    '';
                                empJson.fp_id = (att.employeeTable) ?
                                    ((att.employeeTable.userTable) ?
                                        ((att.employeeTable.userTable.finger_print_id) ?
                                            att.employeeTable.userTable.finger_print_id :
                                            '') :
                                        '') :
                                    '';
                                empJson.date_of_join = (att.employeeTable) ?
                                    ((att.employeeTable.date_of_join) ?
                                        att.employeeTable.date_of_join :
                                        '') :
                                    '';
                                empJson.department = (att.employeeTable) ?
                                    ((att.employeeTable.departmentTable) ?
                                        ((att.employeeTable.departmentTable.name) ?
                                            att.employeeTable.departmentTable.name :
                                            '') :
                                        '') :
                                    '';
                                empJson.designation = (att.employeeTable) ?
                                    ((att.employeeTable.designationTable) ?
                                        ((att.employeeTable.designationTable.name) ?
                                            att.employeeTable.designationTable.name :
                                            '') :
                                        '') :
                                    '';
                                var pUD = att.punch_time.getUTCDate();
                                var pUM = att.punch_time.getUTCMonth();
                                var pUY = att.punch_time.getUTCFullYear();
                                var pDT = pUD + '-' + mthNames[pUM] + '-' + pUY;

                                var pUTH = att.punch_time.getUTCHours();
                                var pUTM = att.punch_time.getUTCMinutes();
                                var pUTS = att.punch_time.getUTCSeconds();
                                var pUT = pUTH + ':' + pUTM + ':' + pUTS;
                                if (dateJson[pDT]) {
                                    var tmpD1 = new Date(pDT);
                                    if (dateJson[pDT].attendance == 'W' || dateJson[pDT].attendance == 'H') {} else {
                                        dateJson[pDT].punches.push(pUT);
                                        if (pUTH < 17) {
                                            dateJson[pDT].in.T.push(pUT);
                                            if (pUTH <= dateJson[pDT].in.H) {
                                                dateJson[pDT].in.A = 'L';
                                                if (pUTH == dateJson[pDT].in.H && pUTM < dateJson[pDT].in.M) {
                                                    dateJson[pDT].in.H = pUTH;
                                                    dateJson[pDT].in.M = pUTM;
                                                    dateJson[pDT].in.S = pUTS;
                                                } else {
                                                    dateJson[pDT].in.H = pUTH;
                                                    dateJson[pDT].in.M = pUTM;
                                                    dateJson[pDT].in.S = pUTS;
                                                }
                                            }
                                        } else {
                                            dateJson[pDT].out.T.push(pUT);
                                            if (pUTH <= dateJson[pDT].out.H) {
                                                dateJson[pDT].out.A = 'P';
                                                if (pUTH == dateJson[pDT].out.H && pUTM < dateJson[pDT].out.M) {
                                                    dateJson[pDT].out.H = pUTH;
                                                    dateJson[pDT].out.M = pUTM;
                                                    dateJson[pDT].out.S = pUTS;
                                                } else {
                                                    dateJson[pDT].out.H = pUTH;
                                                    dateJson[pDT].out.M = pUTM;
                                                    dateJson[pDT].out.S = pUTS;
                                                }
                                            }
                                        }
                                    }
                                }
                                cb_att();
                            }, function(err) {
                                for (key in dateJson) {
                                    var outH = (dateJson[key].out.H < 24) ? addLeadingZero(2, (dateJson[key].out.H - 12)) : '00';
                                    var outM = (dateJson[key].out.H < 24) ? addLeadingZero(2, dateJson[key].out.M) : '00';
                                    var outS = (dateJson[key].out.H < 24) ? addLeadingZero(2, dateJson[key].out.S) : '00';
                                    var t1 = {};
                                    t1.overTime = (parseInt(outH) > 5) ? parseInt(outH) - 5 : 0;
                                    if (t1.overTime > 2) {
                                        empJson.excessOverTime += t1.overTime - 2;
                                        empJson.overTime += 2;
                                    } else {
                                        empJson.overTime += t1.overTime;
                                    }
                                }
                                callback(empJson);
                            });
                        });
                    });
                });
            });
            //////////// Adjustment End /////////
        });
    });
    /////////// Holiday End //////////
}

function search_employee_salary(db, QUERY, callback) {
    var returnData = [],
        search = {};
    search.employee = QUERY.id;
    var emp = {};
    emp.id = QUERY.id;
    emp.salary = 0;
    //emp.salaryList = [];
    emp.approve_date = '00-00-0000';
    emp.account_no = '000-000-0000000';
    //emp.bank_account = false;
    db.salary.findAll({
        where: search,
        attributes: ['id', 'amount', 'approve_date'],
    }).complete(function(err, salary) {
        async.each(salary, function(sal, cb_sal) {
            emp.salary += sal.amount;
            emp.approve_date = sal.approve_date;
            //emp.salaryList.push(sal);
            cb_sal();
        }, function(err) {
            db.bank_account.findAll({
                where: search,
                attributes: [
                    'id', 'branch_code', 'account_type', 'account_no'
                ],
                limit: 1,
                order: [
                    ['created_at', 'DESC']
                ]
            }).complete(function(err, bank_account) {
                async.each(bank_account, function(ba, cb_ba) {
                    emp.account_no = addLeadingZero(3, ba.branch_code) +
                        '-' + addLeadingZero(3, ba.account_type) +
                        '-' + addLeadingZero(7, ba.account_no);
                    //emp.bank_account = ba;
                    cb_ba();
                }, function(err) {
                    callback(emp)
                })
            })
        });
    })
}


function employee_list(db, DATA, callback) {
    var d = new Date();
    var f = d.getFullYear() + '-' + 00 + '-' + 01;
    var t = (d.getFullYear() + 1) + '-' + 00 + '-' + 01;
    var returnData = [];
    if (DATA.employee) {
        db.employee.findAll({
            where: {
                status: 1,
                id: DATA.employee
            },
            include: [{
                model: db.user,
                attributes: [
                    'id', 'card_no', 'finger_print_id',
                    'first_name', 'last_name', 'email'
                ]
            }, {
                model: db.designation,
                attributes: ['name']
            }, {
                model: db.department,
                attributes: ['name']
            }, {
                model: db.section,
                attributes: ['name']
            }, {
                model: db.working_place,
                attributes: ['name']
            }, {
                model: db.employee_type,
                attributes: ['name']
            }, {
                model: db.referer,
                attributes: ['name', 'address', 'contact_no']
            }, {
                model: db.religion,
                attributes: ['name']
            }, {
                model: db.blood_group,
                attributes: ['name']
            }, {
                model: db.work_time,
                attributes: ['in_time']
            }, {
                model: db.duty_shift,
                attributes: ['name']
            }, {
                model: db.status,
                attributes: ['name']
            }],
            order: [
                ['id', 'ASC']
            ]
        }).complete(function(err, employee_data) {
            async.each(employee_data, function(employee, cb_employee_data) {
                var emp = {};
                emp.employee = employee;
                var cl = 0;
                var sl = 0;
                db.leave.findAll({
                    where: {
                        employee: employee.id,
                        date: {
                            between: [f, t]
                        },
                    },
                    include: [{
                        model: db.leave_type,
                        attributes: ['id', 'name']
                    }, ]
                }).complete(function(err, leaves) {
                    if (leaves.length > 0) {
                        for (var i = 0; i < leaves.length; i++) {
                            if (leaves[i].leave_type == 1) {
                                sl += 1;
                            } else if (leaves[i].leave_type == 2) {
                                cl += 1;
                            }
                        };
                    }
                    emp.sl = sl;
                    emp.cl = cl;
                    returnData.push(emp)
                    cb_employee_data();
                })
            }, function(err) {
                if (err) {
                    throw err;
                }
                callback(returnData);
            });
        })
    } else {
        db.employee.findAll({
            where: {
                status: 1
            },
            include: [{
                model: db.user,
                attributes: [
                    'id', 'card_no', 'finger_print_id',
                    'first_name', 'last_name', 'email'
                ]
            }, {
                model: db.designation,
                attributes: ['name']
            }, {
                model: db.department,
                attributes: ['name']
            }, {
                model: db.section,
                attributes: ['name']
            }, {
                model: db.working_place,
                attributes: ['name']
            }, {
                model: db.employee_type,
                attributes: ['name']
            }, {
                model: db.referer,
                attributes: ['name', 'address', 'contact_no']
            }, {
                model: db.religion,
                attributes: ['name']
            }, {
                model: db.blood_group,
                attributes: ['name']
            }, {
                model: db.work_time,
                attributes: ['in_time']
            }, {
                model: db.duty_shift,
                attributes: ['name']
            }, {
                model: db.status,
                attributes: ['name']
            }],
            order: [
                ['id', 'ASC']
            ]
        }).complete(function(err, employee_data) {
            async.each(employee_data, function(employee, cb_employee_data) {
                var emp = {};
                emp.employee = employee;
                var cl = 0;
                var sl = 0;
                db.leave.findAll({
                    where: {
                        employee: employee.id,
                        date: {
                            between: [f, t]
                        },
                    },
                    include: [{
                        model: db.leave_type,
                        attributes: ['id', 'name']
                    }, ]
                }).complete(function(err, leaves) {
                    if (leaves.length > 0) {
                        for (var i = 0; i < leaves.length; i++) {
                            if (leaves[i].leave_type == 1) {
                                sl += 1;
                            } else if (leaves[i].leave_type == 2) {
                                cl += 1;
                            }
                        };
                    }
                    emp.sl = sl;
                    emp.cl = cl;
                    returnData.push(emp)
                    cb_employee_data();
                })
            }, function(err) {
                if (err) {
                    throw err;
                }
                callback(returnData);
            });
        })
    }
}

function UpdateEmployeeDesignation(db, DATA, callback) {
    db.employee.update({
        designation: DATA.designation
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateEmployeeGrade(db, DATA, callback) {
    db.employee.update({
        grade: DATA.grade
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateEmployeeDepartment(db, DATA, callback) {
    db.employee.update({
        department: DATA.department
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateEmployeeDateOfBirth(db, DATA, callback) {
    db.employee.update({
        date_of_birth: DATA.date_of_birth
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateEmployeeDateOfJoin(db, DATA, callback) {
    db.employee.update({
        date_of_join: DATA.date_of_join
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateEmployeeDateOfRelease(db, DATA, callback) {
    db.employee.update({
        date_of_release: DATA.date_of_release
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateEmployeeCardIssue(db, DATA, callback) {
    db.employee.update({
        card_issue: DATA.card_issue,
        card_expire: DATA.card_expire
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateEmployeeAddress(db, DATA, callback) {
    db.employee.update({
        address: DATA.address
    }, {
        id: DATA.id
    }).complete(function(err, emp) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateEmployeeContactNo(db, DATA, callback) {
    db.employee.update({
        contact_no: DATA.contact_no
    }, {
        id: DATA.id
    }).complete(function(err, emp) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    });
}

function UpdateEmployeeRemarks(db, DATA, callback) {
    db.employee.update({
        remarks: DATA.remarks
    }, {
        id: DATA.id
    }).complete(function(err, emp) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateEmployeeSection(db, DATA, callback) {
    db.employee.update({
        section: DATA.section
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateEmployeeWorkingPlace(db, DATA, callback) {
    db.employee.update({
        working_place: DATA.working_place
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateEmployeeNationalID(db, DATA, callback) {
    db.employee.update({
        national_id: DATA.national_id
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateEmployeeWorkTime(db, DATA, callback) {
    db.employee.update({
        work_time: DATA.work_time
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateEmployeeBloodGroup(db, DATA, callback) {
    db.employee.update({
        blood_group: DATA.blood_group
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}


function ActivateEMPBankAccount(db, DATA, callback) {
    var returnData = [];
    var SEARCH = {};
    SEARCH.employee = DATA.employee;
    db.bank_account.findAll({
        where: SEARCH,
        attributes: [
            'id', 'bank', 'branch_code', 'account_type',
            'employee', 'account_no', 'is_active'
        ],
    }).complete(function(err, baData) {
        async.each(baData, function(ba, cb_ba) {
            var o = {};
            if (DATA.bank == ba.bank) {
                db.bank_account.update({
                    is_active: 1
                }, {
                    id: ba.id
                }).complete(function(err, employee) {
                    cb_ba();
                });
            } else {
                db.bank_account.update({
                    is_active: 0
                }, {
                    id: ba.id
                }).complete(function(err, employee) {
                    cb_ba();
                });
            }
        }, function(err) {
            if (err)
                callback("error");
            else
                callback("success");
        })
    });
}


function UpdateEmployeeStatus(db, DATA, callback) {
    db.employee.update({
        status: DATA.status
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateEmployeeReligion(db, DATA, callback) {
    db.employee.update({
        religion: DATA.religion
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateEmployeeMaritalStatus(db, DATA, callback) {
    db.employee.update({
        marital_status: DATA.marital_status
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function UpdateEmployeeGender(db, DATA, callback) {
    db.employee.update({
        gender: DATA.gender
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            callback("error");
        } else {
            callback("success")
        }
    });
}



function ChangeProfilePicture(db, DATA, callback) {
    db.employee.update({
        photo: DATA.photo
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function CreateEmployee(db, DATA, callback) {
    db.employee.create({
        name: DATA.name,
        designation: DATA.designation,
        department: DATA.department,
        photo: DATA.photo,
        section: DATA.section,
        working_place: DATA.working_place,
        employee_type: DATA.employee_type,
        date_of_birth: DATA.date_of_birth,
        date_of_join: DATA.date_of_join,
        date_of_release: DATA.date_of_release
    }).complete(function(err, employee) {
        if (err) {
            callback("error");
            //throw err;
        } else {
            callback("success")
        }
    })
}

function DestroyEmployee(db, DATA, callback) {
    db.employee.destroy({
        id: [DATA]
    }).complete(function(err, data) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function employee_salary(db, QUERY, callback) {
    var returnData = [],
        search_emp = {};
    if (QUERY.status)
        search_emp.status = (QUERY.status) ? QUERY.status : 1;
    if (QUERY.id)
        search_emp.id = QUERY.id;
    if (QUERY.department)
        search_emp.department = QUERY.department;
    if (QUERY.designation)
        search_emp.designation = QUERY.designation;
    if (QUERY.section)
        search_emp.section = QUERY.section;
    if (QUERY.employee_type)
        search_emp.employee_type = QUERY.employee_type;
    var START = (QUERY.start) ? parseInt(QUERY.start) : 0;
    var LIMIT = (QUERY.limit) ? parseInt(QUERY.limit) : 30;
    var SORT = (QUERY.sort) ? QUERY.sort : 'id';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';

    db.employee.findAll({
        where: search_emp,
        include: [{
            model: db.user,
            attributes: [
                'first_name', 'last_name', 'card_no', 'name_bangla'
            ]
        }, {
            model: db.department,
            attributes: [
                'id', 'name'
            ]
        }, {
            model: db.section,
            attributes: [
                'id', 'name'
            ]
        }, {
            model: db.designation,
            attributes: [
                'id', 'name'
            ]
        }, {
            model: db.status,
            attributes: [
                'id', 'name'
            ]
        }, {
            model: db.employee_type,
            attributes: [
                'id', 'name'
            ]
        }],
        order: [
            [SORT, DIR]
        ],
        offset: START,
        limit: LIMIT,
    }).complete(function(err, employee_data) {
        async.each(employee_data, function(employee, cb_employee_data) {
            var emp = {};
            emp.id = employee.id;
            emp.name = (employee.userTable.first_name) ? employee.userTable.first_name : '';
            emp.user = (employee.userTable) ? JSON.stringify(employee.userTable, null, 4) : '';
            var t1 = emp.user;
            var t2 = t1.split("\n");
            var t3 = (t2[4]) ? t2[4].split(":") : '';
            var t4 = (t3[1]) ? t3[1].split('"') : '';
            var t5 = (t4[1]) ? t4[1].split(' \\') : '';
            emp.name_bangla = (t5[0]) ? t5[0] : '';
            emp.card_no = (employee.userTable.card_no) ? employee.userTable.card_no : 0;
            emp.grade = (employee.grade) ? employee.grade : 0;
            emp.department = (employee.departmentTable) ? employee.departmentTable.name : '';
            emp.section = (employee.sectionTable) ? employee.sectionTable.name : '';
            emp.designation = (employee.designationTable) ? employee.designationTable.name : '';
            emp.employee_type = (employee.employeeTypeTable) ? employee.employeeTypeTable.name : '';
            emp.status = (employee.statu) ? employee.statu.name : '';
            emp.statusID = (employee.status) ? employee.status : null;
            emp.designationID = (employee.designation) ? employee.designation : null;
            emp.departmentID = (employee.department) ? employee.department : null;
            emp.payment_method = employee.payment_method;
            emp.date_of_birth = (employee.date_of_birth) ? employee.date_of_birth : null;
            emp.date_of_join = (employee.date_of_join) ? employee.date_of_join : null;
            emp.salary = 0;
            emp.salaryList = [];
            emp.approve_date = '00-00-0000';
            emp.account_no = '000-000-0000000';
            emp.bank_account = false;
            if (employee.userTable.last_name) {
                emp.name += ' ' + employee.userTable.last_name;
            }
            db.salary.findAll({
                where: {
                    employee: employee.id,
                },
                attributes: ['id', 'amount', 'approve_date'],
            }).complete(function(err, salary) {
                async.each(salary, function(sal, cb_sal) {
                    emp.salary += sal.amount;
                    emp.approve_date = sal.approve_date;
                    emp.salaryList.push(sal);
                    cb_sal();
                }, function(err) {
                    db.bank_account.findAll({
                        where: {
                            employee: employee.id,
                        },
                        attributes: [
                            'id', 'branch_code', 'account_type', 'account_no'
                        ],
                        limit: 1,
                        order: [
                            ['created_at', 'DESC']
                        ]
                    }).complete(function(err, bank_account) {
                        async.each(bank_account, function(ba, cb_ba) {
                            emp.account_no = addLeadingZero(3, ba.branch_code) +
                                '-' + addLeadingZero(3, ba.account_type) +
                                '-' + addLeadingZero(7, ba.account_no);
                            emp.bank_account = ba;
                            cb_ba();
                        }, function(err) {
                            returnData.push(emp)
                            cb_employee_data();
                        })
                    })
                });
            })
        }, function(err) {
            returnData.sort(function(a, b) {
                return parseFloat(a.id) - parseFloat(b.id);
            });
            db.employee.count({
                where: search_emp
            }).complete(function(err, data) {
                var pp = {
                    "count": data,
                    "data": returnData
                }
                callback(pp);
            })
        });
    })
}

function employee_salary_all(db, QUERY, callback) {
    var returnData = [],
        search_emp = {};
    if (QUERY.status)
        search_emp.status = (QUERY.status) ? QUERY.status : 1;
    else if (QUERY.id)
        search_emp.id = QUERY.id;
    else if (QUERY.department)
        search_emp.department = QUERY.department;
    else if (QUERY.designation)
        search_emp.designation = QUERY.designation;
    else if (QUERY.section)
        search_emp.section = QUERY.section;
    else if (QUERY.working_place)
        search_emp.working_place = QUERY.working_place;
    else if (QUERY.employee_type)
        search_emp.employee_type = QUERY.employee_type;
    else
        search_emp.status = 1;

    db.employee.findAll({
        where: search_emp,
        attributes: ['id', 'section', 'designation', 'payment_method'],
        include: [{
            model: db.user,
            attributes: [
                'first_name', 'last_name', 'card_no'
            ]
        }, {
            model: db.section,
            attributes: [
                'id', 'name'
            ]
        }, {
            model: db.designation,
            attributes: [
                'id', 'name'
            ]
        }],
        order: [
            ['section', 'ASC']
        ]
    }).complete(function(err, employee_data) {
        async.each(employee_data, function(employee, cb_employee_data) {
            var emp = {};
            emp.id = employee.id;
            emp.name = (employee.userTable.first_name) ? employee.userTable.first_name : '';
            emp.card_no = (employee.userTable.card_no) ? employee.userTable.card_no : 0;
            emp.section = (employee.sectionTable) ? employee.sectionTable.name : '';
            emp.designation = (employee.designationTable) ? employee.designationTable.name : '';
            emp.payment_method = employee.payment_method;
            emp.salary = 0;
            emp.salaryList = [];
            emp.approve_date = '00-00-0000';
            emp.account_no = '000-000-0000000';
            emp.bank_account = false;
            if (employee.userTable.last_name) {
                emp.name += ' ' + employee.userTable.last_name;
            }
            db.salary.findAll({
                where: {
                    employee: employee.id,
                },
                attributes: ['id', 'amount', 'approve_date'],
            }).complete(function(err, salary) {
                async.each(salary, function(sal, cb_sal) {
                    emp.salary += sal.amount;
                    emp.approve_date = sal.approve_date;
                    emp.salaryList.push(sal);
                    cb_sal();
                }, function(err) {
                    db.bank_account.findAll({
                        where: {
                            employee: employee.id,
                        },
                        attributes: [
                            'id', 'branch_code', 'account_type', 'account_no'
                        ],
                        limit: 1,
                        order: [
                            ['created_at', 'DESC']
                        ]
                    }).complete(function(err, bank_account) {
                        async.each(bank_account, function(ba, cb_ba) {
                            emp.account_no = addLeadingZero(3, ba.branch_code) +
                                '-' + addLeadingZero(3, ba.account_type) +
                                '-' + addLeadingZero(7, ba.account_no);
                            emp.bank_account = ba;
                            cb_ba();
                        }, function(err) {
                            returnData.push(emp)
                            cb_employee_data();
                        })
                    })
                });
            });
        }, function(err) {
            returnData.sort(function(a, b) {
                return parseFloat(a.id) - parseFloat(b.id);
            });
            callback(returnData);
        });
    })
}

function search_type_list(db, QUERY, callback) {
    var returnData = [],
        search_emp = {};
    if (QUERY.status)
        search_emp.status = (QUERY.status) ? QUERY.status : 1;
    else if (QUERY.id)
        search_emp.id = QUERY.id;
    else if (QUERY.department)
        search_emp.department = QUERY.department;
    else if (QUERY.designation)
        search_emp.designation = QUERY.designation;
    else if (QUERY.section)
        search_emp.section = QUERY.section;
    else if (QUERY.working_place)
        search_emp.working_place = QUERY.working_place;
    else if (QUERY.employee_type)
        search_emp.employee_type = QUERY.employee_type;
    else
        search_emp.status = 1;

    db.employee.findAll({
        where: search_emp,
        attributes: ['id', 'section', 'designation', 'payment_method'],
        include: [{
            model: db.user,
            attributes: [
                'first_name', 'last_name', 'card_no'
            ]
        }, {
            model: db.section,
            attributes: [
                'id', 'name'
            ]
        }, {
            model: db.designation,
            attributes: [
                'id', 'name'
            ]
        }],
        order: [
            ['section', 'ASC']
        ]
    }).complete(function(err, employee_data) {
        async.each(employee_data, function(employee, cb_employee_data) {
            var emp = {};
            emp.id = employee.id;
            emp.name = (employee.userTable.first_name) ? employee.userTable.first_name : '';
            emp.card_no = (employee.userTable.card_no) ? employee.userTable.card_no : 0;
            emp.section = (employee.sectionTable) ? employee.sectionTable.name : '';
            emp.designation = (employee.designationTable) ? employee.designationTable.name : '';
            emp.payment_method = employee.payment_method;
            emp.salary = 0;
            emp.salaryList = [];
            emp.approve_date = '00-00-0000';
            emp.account_no = '000-000-0000000';
            emp.bank_account = false;
            if (employee.userTable.last_name) {
                emp.name += ' ' + employee.userTable.last_name;
            }
            db.salary.findAll({
                where: {
                    employee: employee.id,
                },
                attributes: ['id', 'amount', 'approve_date'],
            }).complete(function(err, salary) {
                async.each(salary, function(sal, cb_sal) {
                    emp.salary += sal.amount;
                    emp.approve_date = sal.approve_date;
                    emp.salaryList.push(sal);
                    cb_sal();
                }, function(err) {
                    db.bank_account.findAll({
                        where: {
                            employee: employee.id,
                        },
                        attributes: [
                            'id', 'branch_code', 'account_type', 'account_no'
                        ],
                        limit: 1,
                        order: [
                            ['created_at', 'DESC']
                        ]
                    }).complete(function(err, bank_account) {
                        async.each(bank_account, function(ba, cb_ba) {
                            emp.account_no = addLeadingZero(3, ba.branch_code) +
                                '-' + addLeadingZero(3, ba.account_type) +
                                '-' + addLeadingZero(7, ba.account_no);
                            emp.bank_account = ba;
                            cb_ba();
                        }, function(err) {
                            returnData.push(emp)
                            cb_employee_data();
                        })
                    })
                });
            });
        }, function(err) {
            returnData.sort(function(a, b) {
                return parseFloat(a.id) - parseFloat(b.id);
            });
            callback(returnData);
        });
    })
}

function salary_bank_account(db, SEARCH_DATA, callback) {
    var returnData = [];
    var holiday = 0
    var holiday_array = [];
    var adjustment = [];
    var d = new Date();
    if (SEARCH_DATA.month) {
        d = new Date(SEARCH_DATA.month);
        holiday = SEARCH_DATA.holiday;
        for (var i = 0; i < SEARCH_DATA.holiday_array.length; i++) {
            if (parseInt(SEARCH_DATA.holiday_array[i]) == 0 || parseInt(SEARCH_DATA.holiday_array[i]) == 32) {} else {
                holiday_array.push(parseInt(SEARCH_DATA.holiday_array[i]))
            }
        };
        for (var i = 0; i < SEARCH_DATA.adjustment.length; i++) {
            if (parseInt(SEARCH_DATA.adjustment[i]) == 0 || parseInt(SEARCH_DATA.adjustment[i]) == 32) {} else {
                adjustment.push(parseInt(SEARCH_DATA.adjustment[i]))
            }
        };
    }
    var f = new Date(d.getFullYear(), d.getMonth(), 01, 6, 30);
    var t = new Date(d.getFullYear(), d.getMonth() + 1, 00, 28, 30);
    var weekend_array = weekendList(d);
    var dateList = dateListFromMonth(d);

    db.employee.findAll({
        where: {
            status: 1
        },
        include: [{
            model: db.user,
            attributes: [
                'first_name', 'last_name'
            ]
        }, {
            model: db.department,
            attributes: [
                'id', 'name'
            ]
        }],
        attributes: ['id'],
    }).complete(function(err, employee_data) {
        async.each(employee_data, function(employee, cb_employee_data) {
            var leave_arr = [];
            var emp = {};
            emp.id = employee.id;
            emp.name = employee.userTable.first_name;
            emp.department = (employee.departmentTable) ? employee.departmentTable.name : '';
            emp.salary = 0.00;
            emp.account_no = '000-000-0000000';
            if (employee.userTable.last_name) {
                emp.name += ' ' + employee.userTable.last_name;
            }
            db.bank_account.findAll({
                where: {
                    employee: employee.id,
                },
                attributes: [
                    'id', 'branch_code', 'account_type', 'account_no'
                ],
                limit: 1,
                order: [
                    ['created_at', 'DESC']
                ]
            }).complete(function(err, bank_account) {
                var bank_account_s = JSON.stringify(bank_account);
                var ba_data = JSON.parse(bank_account_s);
                if (bank_account[0]) {
                    emp.account_no = addLeadingZero(3, ba_data[0].branch_code) +
                        '-' + addLeadingZero(3, ba_data[0].account_type) +
                        '-' + addLeadingZero(7, ba_data[0].account_no);
                }
                db.leave.findAll({
                    where: {
                        employee: employee.id,
                        date: {
                            between: [f, t]
                        },
                    },
                    attributes: [
                        'id', 'leave_type', 'date'
                    ]
                }).complete(function(err, leaves) {
                    var leave_s = JSON.stringify(leaves);
                    var leave_data = JSON.parse(leave_s);
                    for (var i = leave_data.length - 1; i >= 0; i--) {
                        var ld_dt = leave_data[i].date.split("T");
                        var ld_d = ld_dt[0].split("-");
                        leave_arr.push(parseInt(ld_d[2]));
                    }
                    db.attendance.findAll({
                        where: {
                            punch_time: {
                                between: [f, t]
                            },
                            employee: employee.id
                        },
                        attributes: [
                            'id', 'punch_time'
                        ],
                        order: [
                            ['id', 'DESC']
                        ],
                    }).complete(function(err, attendances) {
                        var punch_present_arr = [];
                        var punch_late_arr = [];
                        var attendance_s = JSON.stringify(attendances);
                        var attendance_data = JSON.parse(attendance_s);
                        for (var i = 0; i < attendance_data.length; i++) {
                            var ad_dt = attendance_data[i].punch_time.split("T");
                            var ad_d = ad_dt[0].split("-");
                            var ad_t = ad_dt[1].split(":");
                            var ad_date = new Date(ad_dt[0]);
                            var p_h = parseInt(ad_t[0]);
                            var p_m = parseInt(ad_t[1]);
                            var p_dd = parseInt(ad_d[2]);
                            var p_dm = parseInt(ad_d[1]);
                            var p_dy = parseInt(ad_d[0]);
                            if (p_h < 9) {
                                if (p_h == 8) {
                                    if (p_m < 15) {
                                        if (punch_present_arr.indexOf(p_dd) == -1) {
                                            punch_present_arr.push(p_dd);
                                        }
                                    } else {
                                        if (punch_present_arr.indexOf(p_dd) == -1 && punch_late_arr.indexOf(p_dd) == -1) {
                                            punch_late_arr.push(p_dd);
                                        }
                                    }
                                } else {
                                    if (punch_present_arr.indexOf(p_dd) == -1) {
                                        punch_present_arr.push(p_dd);
                                    }
                                }
                            } else {
                                if (punch_present_arr.indexOf(p_dd) == -1 && punch_late_arr.indexOf(p_dd) == -1) {
                                    punch_late_arr.push(p_dd);
                                }
                            }
                        };
                        for (var i = weekend_array.length - 1; i >= 0; i--) {
                            if (adjustment.indexOf(weekend_array[i]) != -1) {
                                weekend_array.splice(i, 1);
                            }
                        }
                        for (var i = punch_late_arr.length - 1; i >= 0; i--) {
                            if (punch_present_arr.indexOf(punch_late_arr[i]) != -1) {
                                punch_late_arr.splice(i, 1);
                            }
                        }
                        for (var i = punch_late_arr.length - 1; i >= 0; i--) {
                            if (leave_arr.indexOf(punch_late_arr[i]) != -1) {
                                punch_late_arr.splice(i, 1);
                            }
                        }
                        returnData.push(emp)
                        cb_employee_data();
                    })
                })
            })
        }, function(err) {
            callback(returnData);
        });
    })
}

function UpdateSalaryPaymentMethod(db, DATA, callback) {
    db.employee.update({
        payment_method: DATA.payment_method
    }, {
        id: DATA.id
    }).complete(function(err, employee) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    })
}

function daily_report_list(db, DATA, callback) {
    var d = new Date();
    if (DATA.form_date) {
        d = new Date(DATA.form_date)
    }
    var f = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    var t = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() + 1);



    db.employee.findAll({
        where: {
            status: 1
        },
        include: [{
            model: db.user,
            attributes: [
                'id', 'first_name', 'last_name'
            ]
        }, {
            model: db.department,
            attributes: [
                'id', 'name'
            ]
        }, {
            model: db.designation,
            attributes: [
                'id', 'name'
            ]
        }],
        order: [
            ['department', 'ASC']
        ],
    }).complete(function(err, data) {
        callback(data);
    })
}

function employee_user_list(db, UID, callback) {
    db.employee.findAll({
        where: {
            user: UID
        },
        include: [{
            model: db.user,
            attributes: [
                'id', 'card_no', 'finger_print_id',
                'first_name', 'last_name', 'email'
            ]
        }, {
            model: db.designation,
            attributes: ['name']
        }, {
            model: db.department,
            attributes: ['name']
        }, {
            model: db.section,
            attributes: ['name']
        }, {
            model: db.working_place,
            attributes: ['name']
        }, {
            model: db.employee_type,
            attributes: ['name']
        }, {
            model: db.referer,
            attributes: ['name', 'address', 'contact_no']
        }, {
            model: db.religion,
            attributes: ['name']
        }, {
            model: db.blood_group,
            attributes: ['name']
        }, {
            model: db.duty_shift,
            attributes: ['name']
        }, {
            model: db.status,
            attributes: ['name']
        }],
    }).complete(function(err, data) {
        callback(data);
    })
}

function routerInit(app, dbFull) {
    var db = dbFull.DA_HR

    app.get('/getComplianceEmployeeList', /*isAuthenticated,*/ function(req, res) {
        getComplianceEmployeeList(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/daily_report', /*isAuthenticated,*/ function(req, res) {
        daily_report_list(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/employee', /*isAuthenticated,*/ function(req, res) {
        employee_list(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/search_employee_list', /*isAuthenticated,*/ function(req, res) {
        search_employee_list(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/employee/:UID', /*isAuthenticated,*/ function(req, res) {
        var UID = req.params.UID;
        employee_user_list(db, UID, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.post('/ChangeProfilePicture', function(req, res) {
        var data = {};
        data.id = req.body.id;
        data.photo = req.files.profile_picture.name;
        ChangeProfilePicture(db, data, function(d) {
            res.write(d);
            res.end();
        });
    });

    app.get('/getTimeRange', /*isAuthenticated,*/ function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(timeArray(17, 29, 10));
    });

    app.get('/getEmpPrintList/:STACK', /*isAuthenticated,*/ function(req, res) {
        var IDStack = (req.query.STACK) ? req.query.STACK : req.params.STACK.split(",");
        getEmpPrintList(db, IDStack, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getEmployee', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        // QUERY.id = 1078;
        getEmployee(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getEmployeeID', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        //QUERY.id = 4017;
        getEmployeeID(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getAllEmployeeID', /*isAuthenticated,*/ function(req, res) {
        getAllEmployeeID(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getEmployeeCombo', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        //QUERY.id = 4017;
        getEmployeeCombo(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getPermission', /*isAuthenticated,*/ function(req, res) {
        getPermission(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getMaritalStatus', /*isAuthenticated,*/ function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send([{
            "id": 1,
            "name": 'Single'
        }, {
            "id": 2,
            "name": 'Married'
        }]);
    });

    app.get('/getGender', /*isAuthenticated,*/ function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send([{
            "id": 1,
            "name": 'Male'
        }, {
            "id": 2,
            "name": 'Female'
        }]);
    });

    app.post('/CreateEmployee', function(req, res) {
        var data = {};
        data.name = req.body.name;
        data.department = req.body.department;
        data.designation = req.body.designation;
        if (parseInt(req.body.employee_type) > 0)
            data.employee_type = req.body.employee_type;
        else
            data.employee_type = null;
        if (parseInt(req.body.section) > 0)
            data.section = req.body.section;
        else
            data.section = null;
        data.date_of_birth = req.body.date_of_birth;
        data.date_of_join = req.body.date_of_join;
        data.date_of_release = req.body.date_of_release;
        data.photo = req.files.photo.name;
        CreateEmployee(db, data, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/employee_salary', /*isAuthenticated,*/ function(req, res) {
        employee_salary(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/employee_salary_all', /*isAuthenticated,*/ function(req, res) {
        employee_salary_all(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/employee_salary_list', /*isAuthenticated,*/ function(req, res) {
        //var QUERY = req.query;
        var QUERY = {};


        search_type_list(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/salary_bank_account', /*isAuthenticated,*/ function(req, res) {
        salary_bank_account(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.post('/employeeIDMaker', function(req, res) {
        var siteURL = 'http://' + req.headers.host + '/';
        var postData = req.body;
        var fileName = 'myTest.pdf';
        var cardBackGround = (postData.idStackType == 'Bangla') ? 'http://sparky.ff-ltd.com/id_maker/include/bg/dal_bangla_sbg.png' : 'http://sparky.ff-ltd.com/id_maker/include/bg/dal_english_sbg.png';
        var IDName = (postData.idStackType == 'Bangla') ? 'নাম ' : 'NAME ';
        var IDDesignation = (postData.idStackType == 'Bangla') ? 'পদবি ' : 'DESIGNATION ';
        var IDSection = (postData.idStackType == 'Bangla') ? 'সেকশন ' : 'SECTION';
        var IDBloodGroup = (postData.idStackType == 'Bangla') ? 'রক্তের গ্রুপ ' : 'BLOOD GROUP';
        var IDDOJ = (postData.idStackType == 'Bangla') ? 'যোগদানের তারিখ ' : 'DATE OF JOIN';
        var IDCardIssue = (postData.idStackType == 'Bangla') ? 'ইস্যু তারিখ ' : 'CARD ISSUE';
        var IDCardExpire = (postData.idStackType == 'Bangla') ? 'মেয়াদ ' : 'CARD EXPIRE';
        var IDContactNo = (postData.idStackType == 'Bangla') ? 'ফোন নং ' : 'CONTACT NO';
        var IDAddress = (postData.idStackType == 'Bangla') ? 'স্থায়ী ঠিকানা ' : 'ADDRESS';
        var default_photo = "http://sparky.ff-ltd.com/id_maker/photo/default_photo.png";
        var default_signature = "http://sparky.ff-ltd.com/id_maker/signature/signature.png";
        var employeeID = postData.idStack.split(',');
        for (a in employeeID) {
            var tmpEmp = parseInt(employeeID[a]);
            employeeID[a] = (tmpEmp) ? tmpEmp : '';
        }
        var QUERY = {};
        QUERY.id = employeeID;

        var cardWidth = 5.5;
        var cardHeight = 8.5;

        var html = '<!DOCTYPE html>' +
            '<html>' +
            '<head>' +
            '<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>' +
            '<style>' +
            // "@import url('http://localhost/id_maker/include/builder/font.css');".
            'body {' +
            // "font-family: 'Bensen', Arial, sans-serif !important;"+
            'font-size: 50%;' +
            '}' +
            '.tdZero {' +
            'padding-top:0px;' +
            'padding-bottom:0px;' +
            '}' +
            '.container {' +
            'width: 100%;' +
            'overflow: auto;' +
            'background: #eee;' +
            'margin: auto;' +
            '}' +
            '.cardTable {' +
            // 'background-color:rgba(214, 254, 214, 0.5);'+
            '}' +
            '.cardID {' +
            // 'background-color:rgba(254, 200, 200, 0.8);'+
            'padding-top:37px;' +
            'padding-left:85px;' +
            '}' +
            '.cube {' +
            'background: url("' + cardBackGround + '") no-repeat center center;' +
            'width: ' + (cardWidth * 35) + 'px; height: ' + (cardHeight * 35) + 'px;' +
            'margin-bottom: 20px;' +
            'margin-left: 20px;' +
            '}' +
            '.cubeWithPB {' +
            'page-break-before:always;' +
            'background: url("' + cardBackGround + '") no-repeat center center;' +
            'width: ' + (cardWidth * 35) + 'px; height: ' + (cardHeight * 35) + 'px;' +
            'margin-bottom: 20px;' +
            'margin-left: 20px;' +
            '}' +
            '</style>' +
            '</head>' +
            '<body>' +
            '<table class="container">';

        getEmployeeFullDetails(db, QUERY, function(returnEmpData) {
            var i = 0;
            async.each(returnEmpData, function(emp, cb_emp) {
                var fp_id = addLeadingZero(9, parseInt(emp.id));
                fp_id = (postData.idStackType == 'Bangla') ? numEngToBan(fp_id) : fp_id;
                var photo = default_photo;

                var userTable = JSON.parse(JSON.stringify(emp.userTable, null, 4));
                var name = (userTable) ? userTable.first_name.toUpperCase() : "N/A";
                name = (postData.idStackType == 'Bangla') ? ((userTable) ? userTable.name_bangla : name) : name;

                var designationTable = JSON.parse(JSON.stringify(emp.designationTable, null, 4));
                var designation = (designationTable) ? designationTable.name.toUpperCase() : "N/A";
                designation = (postData.idStackType == 'Bangla') ? ((designationTable) ? designationTable.name_bangla : designation) : designation;

                var sectionTable = JSON.parse(JSON.stringify(emp.sectionTable, null, 4));
                var section = (sectionTable) ? sectionTable.name.toUpperCase() : "";
                section = (postData.idStackType == 'Bangla') ? ((sectionTable) ? sectionTable.name_bangla : section) : section;

                var bloodGroupTable = JSON.parse(JSON.stringify(emp.bloodGroupTable, null, 4));
                var blood_group = (bloodGroupTable) ? bloodGroupTable.name.toUpperCase() : "N/A";
                blood_group = (postData.idStackType == 'Bangla') ? ((bloodGroupTable) ? bloodGroupTable.name_bangla : blood_group) : blood_group;

                var doj = (emp.date_of_join) ? new Date(emp.date_of_join).formatDate() : new Date().formatDate();
                doj = (postData.idStackType == 'Bangla') ? new Date(doj).dateToBangla() : doj;

                var card_issue = (emp.card_issue) ? new Date(emp.card_issue).formatDate() : new Date().formatDate();
                var CE = (emp.card_issue) ? new Date(emp.card_issue) : new Date();
                card_issue = (postData.idStackType == 'Bangla') ? new Date(card_issue).dateToBangla() : card_issue;

                CE.setFullYear(CE.getFullYear() + 2);
                var card_expire = (emp.card_expire) ? new Date(emp.card_expire).formatDate() : CE.formatDate();
                card_expire = (postData.idStackType == 'Bangla') ? new Date(card_expire).dateToBangla() : card_expire;

                var contact_no = (emp.contact_no) ? emp.contact_no : 'N/A';
                contact_no = (postData.idStackType == 'Bangla') ? numEngToBan(contact_no) : contact_no;

                var address = (emp.address) ? emp.address : 'N/A';
                address = (postData.idStackType == 'Bangla') ? ((emp.address_bangla) ? emp.address_bangla : address) : address;

                var signature = default_signature;

                if (i % 3 == 0) {
                    html += '<tr>';
                }
                html += '<td>';
                if (i % 9 == 0 && i > 0) {
                    html += '<div class="cubeWithPB">';
                } else {
                    html += '<div class="cube">';
                }

                html += '<table width="100%" class="cardTable">' +
                    '<tr>' +
                    '<td colspan="2" class="cardID"><big><b>' + fp_id + '</b></big></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td colspan="2" width="100%" align="center">' +
                    '<img class="photo" src="' + photo + '" width="29" height="45" border="1">' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td colspan="2" class="tdZero"> ' + IDName + ': <big><b>' + name + '</b></big></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td width="30%" class="tdZero"> ' + IDDesignation + ' </td>' +
                    '<td class="tdZero">: <small>' + designation + '</small></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td class="tdZero"> ' + IDSection + ' </td>' +
                    '<td class="tdZero">: <small>' + section + '</small></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td class="tdZero"> ' + IDBloodGroup + ' </td>' +
                    '<td class="tdZero">: ' + blood_group + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td class="tdZero"> ' + IDDOJ + ' </td>' +
                    '<td class="tdZero">: ' + doj + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td class="tdZero"> ' + IDCardIssue + ' </td>' +
                    '<td class="tdZero">: ' + card_issue + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td class="tdZero"> ' + IDCardExpire + ' </td>' +
                    '<td class="tdZero">: ' + card_expire + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td class="tdZero"> ' + IDContactNo + ' </td>' +
                    '<td class="tdZero">: ' + contact_no + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td class="tdZero"> ' + IDAddress + ' </td>' +
                    '<td class="tdZero">: <small>' + address + '</small></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td colspan="2" width="100%" align="right">' +
                    '<img class="photo" src="' + signature + '" width="45" height="29" border="0">' +
                    '</td>' +
                    '</tr>' +
                    '</table>' +
                    '</div>' +
                    '</td>';
                if ((i + 1) % 3 == 0 && i > 1) {
                    html += '</tr>';
                }
                i++;
                cb_emp();
            }, function(err) {
                html += '</table></body></html>';
                d = new Date();
                var options = {
                    format: 'A4',
                    header: {
                        height: "10mm",
                        contents: '<div style="color: #444;font-size: 9px;text-align: right; margin: 15px"><span><br />PRINT TIME: ' + d + '</span></div>'
                    },
                    footer: {
                        height: "5mm",
                        contents: '<div style="color: #444;font-size: 9px;text-align: right; margin: 10px"><span>PAGE {{page}}</span> OUT OF <span>{{pages}}</span></div>'
                    },
                };
                pdf.create(html, options).toFile('./uploads/pdf/' + fileName, function(err, r) {
                    // res.redirect('http://localhost:8000/uploads/pdf/myTest.pdf');

                    res.render('api.ejs', {
                        test: 'My Test Data',
                        fileURL: siteURL + 'uploads/pdf/' + fileName
                    });
                });
            });
        });
    });

    app.get('/employeeIDMaker', function(req, res) {
        // res.render('api.ejs', {
        //   test: 'My Test Data'
        // });
        res.send('Select At Least One Employee');
    });

    app.get('/employee_overtime_satement', /*isAuthenticated,*/ function(req, res) {
        var secQuery = {};
        secQuery.id = 1;
        var returnData = [];
        search_section_list(db, secQuery, function(secList) {
            async.each(secList, function(sec, cb_sec) {
                var secOBJ = {};
                secOBJ.id = sec.id;
                secOBJ.name = sec.name;
                secOBJ.emp = [];
                var empQuery = {};
                empQuery.section = sec.id;
                search_employee_id_list(db, empQuery, function(empIDList) {
                    async.each(empIDList, function(empID, cb_empID) {
                        var empOBJ = {};
                        empOBJ.id = empID.id;
                        empOBJ.date = new Date('10-1-2016');
                        empOBJ.card_no = '0000';
                        empOBJ.name = 'NOT FOUND';
                        empOBJ.date_of_join = '';
                        empOBJ.department = '';
                        empOBJ.designation = '';
                        empOBJ.overTime = 0;
                        empOBJ.excessOverTime = 0;
                        empOBJ.salary = 0;
                        empOBJ.basic = 0;
                        empOBJ.overtime_rate = 0;
                        empOBJ.account_no = "000-000-0000000";
                        empOBJ.grade = empID.grade;
                        empOBJ.payment_method = (empID.payment_method == 1) ? 'CASH' : 'BANK';;
                        search_employee_salary(db, empOBJ, function(empSal) {
                            empOBJ.salary = empSal.salary;
                            empOBJ.basic = empSal.salary / 100 * 60;
                            empOBJ.overtime_rate = empOBJ.basic / 208 * 2;
                            empOBJ.account_no = empSal.account_no;
                            employee_overtime_satement(db, empOBJ, function(empOverTime) {
                                empOBJ.name = empOverTime.name;
                                empOBJ.card_no = empOverTime.card_no;
                                empOBJ.date_of_join = empOverTime.date_of_join;
                                empOBJ.department = empOverTime.department;
                                empOBJ.designation = empOverTime.designation;
                                empOBJ.overTime = empOverTime.overTime;
                                empOBJ.excessOverTime = empOverTime.excessOverTime;
                                secOBJ.emp.push(empOBJ);
                                cb_empID();
                            })
                        });
                    }, function(err) {
                        secOBJ.emp.sort(function(a, b) {
                            return parseFloat(a.id) - parseFloat(b.id);
                        });
                        returnData.push(secOBJ);
                        cb_sec();
                    });
                });
            }, function(err) {
                res.setHeader('Content-Type', 'application/json');
                res.send(returnData);
            })
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DestroyEmployee', function(data) {
        DestroyEmployee(db, data, function(data) {
            socket.emit("DestroyEmployee", data)
        });
    });

    socket.on('UpdateSalaryPaymentMethod', function(data) {
        UpdateSalaryPaymentMethod(db, data, function(data) {
            socket.emit("UpdateSalaryPaymentMethod", data)
        });
    });

    socket.on('UpdateEmployeeDesignation', function(data) {
        UpdateEmployeeDesignation(db, data, function(data) {
            socket.emit("UpdateEmployeeDesignation", data)
        });
    });

    socket.on('UpdateEmployeeGrade', function(data) {
        UpdateEmployeeGrade(db, data, function(data) {
            socket.emit("UpdateEmployeeGrade", data)
        });
    });

    socket.on('ActivateEMPBankAccount', function(data) {
        ActivateEMPBankAccount(db, data, function(data) {
            socket.emit("ActivateEMPBankAccount", data)
        });
    });

    socket.on('UpdateEmployeeNameBangla', function(data) {
        UpdateEmployeeNameBangla(db, data, database, function(data) {
            socket.emit("UpdateEmployeeNameBangla", data)
        });
    });

    socket.on('UpdateEmployeeAddressBangla', function(data) {
        UpdateEmployeeAddressBangla(db, data, database, function(data) {
            socket.emit("UpdateEmployeeAddressBangla", data)
        });
    });

    socket.on('UpdateEmployeeRemarks', function(data) {
        UpdateEmployeeRemarks(db, data, function(data) {
            socket.emit("UpdateEmployeeRemarks", data)
        });
    });



    socket.on('UpdateEmployeeDepartment', function(data) {
        UpdateEmployeeDepartment(db, data, function(data) {
            socket.emit("UpdateEmployeeDepartment", data)
        });
    });

    socket.on('UpdateEmployeeSection', function(data) {
        UpdateEmployeeSection(db, data, function(data) {
            socket.emit("UpdateEmployeeSection", data)
        });
    });

    socket.on('UpdateEmployeeWorkingPlace', function(data) {
        UpdateEmployeeWorkingPlace(db, data, function(data) {
            socket.emit("UpdateEmployeeWorkingPlace", data)
        });
    });

    socket.on('UpdateEmployeeWorkTime', function(data) {
        UpdateEmployeeWorkTime(db, data, function(data) {
            socket.emit("UpdateEmployeeWorkTime", data)
        });
    });

    socket.on('UpdateEmployeeBloodGroup', function(data) {
        UpdateEmployeeBloodGroup(db, data, function(data) {
            socket.emit("UpdateEmployeeBloodGroup", data)
        });
    });

    socket.on('UpdateEmployeeNationalID', function(data) {
        UpdateEmployeeNationalID(db, data, function(data) {
            socket.emit("UpdateEmployeeNationalID", data)
        });
    });

    socket.on('UpdateEmployeeDateOfBirth', function(data) {
        UpdateEmployeeDateOfBirth(db, data, function(data) {
            socket.emit("UpdateEmployeeDateOfBirth", data)
        });
    });

    socket.on('UpdateEmployeeDateOfJoin', function(data) {
        UpdateEmployeeDateOfJoin(db, data, function(data) {
            socket.emit("UpdateEmployeeDateOfJoin", data)
        });
    });

    socket.on('UpdateEmployeeDateOfRelease', function(data) {
        UpdateEmployeeDateOfRelease(db, data, function(data) {
            socket.emit("UpdateEmployeeDateOfRelease", data)
        });
    });

    socket.on('UpdateEmployeeCardIssue', function(data) {
        UpdateEmployeeCardIssue(db, data, function(data) {
            socket.emit("UpdateEmployeeCardIssue", data)
        });
    });

    socket.on('UpdateEmployeeAddress', function(data) {
        UpdateEmployeeAddress(db, data, function(data) {
            socket.emit("UpdateEmployeeAddress", data)
        });
    });

    socket.on('UpdateEmployeeContactNo', function(data) {
        UpdateEmployeeContactNo(db, data, function(data) {
            socket.emit("UpdateEmployeeContactNo", data)
        });
    });

    socket.on('UpdateEmployeeStatus', function(data) {
        UpdateEmployeeStatus(db, data, function(data) {
            socket.emit("UpdateEmployeeStatus", data)
        });
    });

    socket.on('UpdateEmployeeReligion', function(data) {
        UpdateEmployeeReligion(db, data, function(data) {
            socket.emit("UpdateEmployeeReligion", data)
        });
    });

    socket.on('UpdateEmployeeMaritalStatus', function(data) {
        UpdateEmployeeMaritalStatus(db, data, function(data) {
            socket.emit("UpdateEmployeeMaritalStatus", data)
        });
    });

    socket.on('UpdateEmployeeGender', function(data) {
        UpdateEmployeeGender(db, data, function(data) {
            socket.emit("UpdateEmployeeGender", data)
        });
    });

    socket.on('DownloadBonusStatementReport', function(QUERY) {
        var d = new Date(QUERY.date);
        var r = 1;
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            bonusStatementReportHead() +
            '<div id="pageBody">' +
            '<b style="line-height:2"><big>SECTION: ' +
            QUERY.sectionName +
            '</big></b>' +
            '<table style="width:100%;">' +
            '<tr>' +
            '<th>#</th>' +
            '<th>FP ID</th>' +
            '<th>EMPLOYEE NAME</th>' +
            '<th>DESIGNATION</th>' +
            '<th style="white-space:nowrap;">.JOIN DATE.</th>' +
            '<th><small><small>CARD</small></small></th>' +
            '<th><small><small>GR.</small></small></th>' +
            '<th>GROSS<br />SALARY</th>' +
            '<th><small><small>STAMP</small></small></th>' +
            '<th>PAYABLE<br />AMOUNT</th>' +
            '<th>PAY.<br />MODE</th>' +
            '<th><big>..SIGNATURE..</big></th>' +
            '</tr>';
        var netPayment = 0,
            salary = 0,
            tStamp = 0;
        getEmployeeDetails(db, QUERY, function(empData) {
            async.each(empData, function(emp, cb_emp) {
                var empDOJ = new Date(emp.date_of_join);
                var tmpSD = new Date(QUERY.date);
                tmpSD.setDate(1);
                tmpSD.setMonth(tmpSD.getMonth() + 1);
                tmpSD.setFullYear(tmpSD.getFullYear() - 1);
                if (empDOJ <= tmpSD) {
                    var payment_method = (emp.payment_method == 1) ? 'CASH' : 'BANK';
                    var stamp = (emp.payment_method == 1 && parseInt(emp.salary) > 0) ? 10 : (emp.employeeTypeName != "STAFF" && parseInt(emp.salary) > 0) ? 10 : 0;
                    var payAmount = (QUERY.bonus_type == 'BASIC') ? Math.round(emp.basic) - stamp : Math.round(emp.salary / 2) - stamp;
                    netPayment += payAmount;
                    salary += emp.salary;
                    tStamp += stamp;
                    htmlData += '<tr>' +
                        '<td height="60" align="center">' + r + '</td>' +
                        '<td>' + emp.id + '</td>' +
                        '<td>' + emp.name + '<br /><br />' + emp.name_bangla + '</td>' +
                        '<td>' + emp.designationName + '</td>' +
                        '<td>' + emp.date_of_join.formatDate() + '</td>' +
                        '<td align="center">' + emp.card_no + '</td>' +
                        '<td align="center">' + emp.grade + '</td>' +
                        '<td align="right">' + emp.salary.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + stamp.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + payAmount.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="center">' + payment_method + '</td>' +
                        '<td></td>' +
                        '</tr>';
                    r++;
                }
                cb_emp();
            }, function(err) {
                htmlData += '<tr>' +
                    '<td colspan="7"><b>TOTAL</b></td>' +
                    '<td align="right"><b>' + salary.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"><b>' + tStamp.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"><b>' + netPayment.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td colspan="2"></td>' +
                    '</tr>' +
                    '</table></div>';
                htmlData += '</body></html>';
                var options = {
                    format: 'A4',
                    header: {
                        height: "20mm",
                        contents: bonusStatementHeader(d, QUERY.festive_type)
                    },
                    footer: {
                        height: "20mm",
                        contents: footerSContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadBonusStatementReport", 'success');
                });
            });
        });
    });

    socket.on('DownloadEmployeesGridList', function(QUERY) {
        getEmployee(db, QUERY, function(empData) {
            empData.sort(function(a, b) {
                var o1 = a.departmentName;
                var o2 = b.departmentName;

                var p1 = a.sectionName;
                var p2 = b.sectionName;

                var q1 = a.id;
                var q2 = b.id;

                if (o1 < o2) return -1;
                if (o1 > o2) return 1;
                if (p1 < p2) return -1;
                if (p1 > p2) return 1;
                if (q1 < q2) return -1;
                if (q1 > q2) return 1;
                return 0;
            });
            socket.emit("DownloadEmployeesGridList", empData);
        });
    });


}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;