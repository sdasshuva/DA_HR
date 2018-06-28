module.exports = function() {};

Date.prototype.formatFullDate = function() {
    var d = new Date(this)
    return d.getDate() + '<sup>' + dayPower[d.getDate()] + '</sup> ' + monthNames[d.getMonth()] + ', ' + d.getFullYear();
};

function getEmployeeDetails(db, QUERY, callback) {
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
            'id', 'name', 'attendance_bonus'
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
            'id', 'in_time', 'out_time'
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
            e.id = addLeadingZero(9, emp.id);
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
            e.designationName = (emp.designationTable) ?
                (emp.designationTable.name.toUpperCase() ?
                    emp.designationTable.name.toUpperCase() :
                    'NOT GIVEN') :
                'NOT GIVEN';
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
            e.date_of_birth = (emp.date_of_birth) ? new Date(emp.date_of_birth) : new Date();
            e.date_of_join = (emp.date_of_join) ? new Date(emp.date_of_join) : new Date(emp.date_of_join);
            e.date_of_release = new Date(emp.date_of_release);
            e.payment_method = emp.payment_method;
            e.salary = 0;
            e.basic = 0;
            e.house_rent = 0;
            e.medical = 0;
            e.conveyance = 0;
            e.food = 0;
            e.advanceDeduct = 0;
            e.medicalDeduct = 0;
            e.stampDeduct = 0;
            e.aitDeduct = 0;
            e.lunchOutDeduct = 0;
            e.othersDeduct = 0;
            e.overtimeDeduct = 0;
            e.excessOvertimeDeduct = 0;
            e.branch_code = '000';
            e.account_type = '000';
            e.account_no = '0000000';
            e.account = '000-000-0000000';
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
                        var salSearch = {};
                        salSearch.employee = emp.id;
                        salSearch.date = SDate;
                        getSalaryJson(db, salSearch, function(salData) {
                            e.salary = (salData.amount > 0) ? salData.amount : e.salary;
                            e.basic = (e.employeeTypeName == 'STAFF') ? e.salary / 100 * 60 : ((e.salary > 0) ? (e.salary - 1100) / 1.4 : 0);
                            e.house_rent = (e.employeeTypeName == 'STAFF') ? e.salary / 100 * 30 : ((e.salary > 0) ? e.basic * 0.4 : 0);
                            e.medical = (e.employeeTypeName == 'STAFF') ? e.salary / 100 * 5 : ((e.salary > 0) ? 250 : 0);
                            e.conveyance = (e.employeeTypeName == 'STAFF') ? e.salary / 100 * 5 : ((e.salary > 0) ? 200 : 0);
                            e.food = (e.employeeTypeName == 'STAFF') ? 0 : ((e.salary > 0) ? 650 : 0);
                            e.advanceDeduct = (salData.advanceDeduct > 0) ? salData.advanceDeduct : e.advanceDeduct;
                            e.medicalDeduct = (salData.medicalDeduct > 0) ? salData.medicalDeduct : e.medicalDeduct;
                            e.stampDeduct = (salData.stampDeduct > 0) ? salData.stampDeduct : e.stampDeduct;
                            e.aitDeduct = (salData.aitDeduct > 0) ? salData.aitDeduct : e.aitDeduct;
                            e.lunchOutDeduct = (salData.lunchOutDeduct > 0) ? salData.lunchOutDeduct : e.lunchOutDeduct;
                            e.othersDeduct = (salData.othersDeduct > 0) ? salData.othersDeduct : e.othersDeduct;
                            e.overtimeDeduct = (salData.overtimeDeduct > 0) ? salData.overtimeDeduct : e.overtimeDeduct;
                            e.excessOvertimeDeduct = (salData.excessOvertimeDeduct > 0) ? salData.excessOvertimeDeduct : e.excessOvertimeDeduct;
                            e.branch_code = (salData.branch_code) ? salData.branch_code : e.branch_code;
                            e.account_type = (salData.account_type) ? salData.account_type : e.account_type;
                            e.account_no = (salData.account_no) ? salData.account_no : e.account_no;
                            e.account = (salData.account) ? salData.account : e.account;
                            returnData.push(e);
                            cb_emp();
                        });
                    });
                });
            });
        }, function(err) {
            returnData.sort(function(a, b) {
                var o1 = a.departmentName;
                var o2 = b.departmentName;

                var m1 = a.sectionName;
                var m2 = b.sectionName;

                var p1 = a.id;
                var p2 = b.id;

                if (o1 < o2) return -1;
                if (o1 > o2) return 1;
                if (m1 < m2) return -1;
                if (m1 > m2) return 1;
                if (p1 < p2) return -1;
                if (p1 > p2) return 1;
                return 0;
            });
            callback(returnData);
        });
    })
}

function addLeadingZero(length, str) {
    var returnString = str.toString();
    var l = length - returnString.length;
    var zero = '';
    while (l > 0) {
        zero += '0';
        l--
    }
    return zero + returnString;
}

function dayArrayFunc(a) {
    switch (a) {
        case 28:
            return [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28
            ];
            break;
        case 29:
            return [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28, 29
            ];
            break;
        case 30:
            return [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28, 29, 30
            ];
            break;
        case 31:
            return [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
            ];
            break;
        default:
            return [];
    }
}

function attendance_report3(db, QUERY, DATA, WP, SEC, callback) {
    var d = new Date();
    var search_month = new Date(d.getFullYear(), d.getMonth(), 01);
    var search_year = new Date(d.getFullYear(), 00, 01);
    var next_year = new Date(d.getFullYear() + 1, 00, 01);
    var holiday = 0
    var holiday_array = [];
    var adjustment = [];
    if (DATA.month) {
        d = new Date(DATA.month);
        holiday = DATA.holiday;
        search_month = new Date(d.getFullYear(), d.getMonth(), 01);
        search_year = new Date(d.getFullYear(), 00, 01);
        next_year = new Date(d.getFullYear() + 1, 00, 01);
        holiday_array = DATA.holiday_array
        for (var i = 0; i < DATA.adjustment.length; i++) {
            if (parseInt(DATA.adjustment[i]) == 0 || parseInt(DATA.adjustment[i]) == 32) {} else {
                adjustment.push(DATA.adjustment[i])
            }
        };
    }
    var dateList = dateListFromMonth(d);
    //var weekend = weekendCount(d);
    var total_days = dateList.length;
    var f = new Date(d);
    d.setMonth(d.getMonth() + 1);
    var t = new Date(d);
    var returnData = [];
    var empS = {};
    if (QUERY.section)
        empS.section = QUERY.section;
    if (QUERY.department)
        empS.department = QUERY.department;
    if (QUERY.designation)
        empS.designation = QUERY.designation;
    if (SEC) {
        empS.section = SEC;
    }
    if (WP) {
        empS.working_place = WP;
    }
    empS.status = 1;


    db.employee.findAll({
        where: empS,
        include: [{
            model: db.user,
            attributes: [
                'id', 'first_name', 'last_name', 'card_no'
            ],
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
            model: db.working_place,
            attributes: [
                'id', 'name'
            ]
        }],
        order: [
            ['id', 'ASC']
        ],
    }).complete(function(err, employee_data) {
        async.each(employee_data, function(employee, cb_employee_data) {
            var emp = {};
            emp.employee = employee;
            emp.attendance = {};
            emp.days = {};
            emp.punch_hour = {};
            emp.punch_min = {};
            emp.punch_sec = {};
            emp.id = employee.id;
            emp.card_no = employee.userTable.card_no;
            emp.first_name = employee.userTable.first_name;
            emp.last_name = employee.userTable.last_name;
            emp.department = employee.departmentTable.name;
            emp.section = (employee.sectionTable) ? employee.sectionTable.name : '';;
            emp.working_place = (employee.workingPlaceTable) ? employee.workingPlaceTable.name : '';;
            emp.leave_details = '';
            emp.leave = 0;
            emp.late_leave = 0;
            emp.absent_late_leave = 0;
            var cl = 0;
            var sl = 0;
            var nextdays = 0;
            var absent = 0;
            var present = 0;
            var weekend = 0;
            var late = 0;
            var holidays = 0;
            for (var i = 0; i < dateList.length; i++) {
                emp.attendance[dateList[i]] = 'A';
                emp.punch_hour[dateList[i]] = 24;
                emp.punch_min[dateList[i]] = 60;
                emp.punch_sec[dateList[i]] = 60;
            };
            db.leave.findAll({
                where: {
                    employee: employee.id,
                    date: {
                        gte: search_year,
                        lt: next_year,
                    }
                },
                include: [{
                    model: db.leave_type,
                    attributes: ['id', 'name']
                }, ]
            }).complete(function(err, leaves) {
                if (leaves.length) {
                    for (var i = 0; i < leaves.length; i++) {
                        var leave_date = new Date(leaves[i].date);
                        var ldgy = leave_date.getFullYear();
                        var ldgm = leave_date.getMonth();
                        var smgy = search_month.getFullYear();
                        var smgm = search_month.getMonth();
                        if (ldgy == smgy && ldgm == smgm) {
                            if (leaves[i].leave_type == 4) {
                                emp.late_leave++;
                            } else {
                                emp.leave++;
                            }
                        }
                        if (leaves[i].leave_type == 1) {
                            sl++;
                        } else if (leaves[i].leave_type == 2) {
                            cl++;
                        }
                    };
                }
                emp.leave_details = leaves;
                emp.sick_leave = sl;
                emp.casual_leave = cl;
                db.attendance.findAll({
                    where: {
                        punch_time: {
                            between: [f, t]
                        },
                        employee: employee.id
                    },
                    order: [
                        ['id', 'ASC']
                    ],
                }).complete(function(err, attendance_data) {
                    for (var i = 0; i < attendance_data.length; i++) {
                        emp.attendance[attendance_data[i].punch_time.getUTCDate()] = 'P'
                        if (attendance_data[i].punch_time.getUTCHours() < emp.punch_hour[attendance_data[i].punch_time.getUTCDate()]) {
                            emp.punch_hour[attendance_data[i].punch_time.getUTCDate()] = attendance_data[i].punch_time.getUTCHours();
                            if (attendance_data[i].punch_time.getUTCMinutes() < emp.punch_min[attendance_data[i].punch_time.getUTCDate()]) {
                                emp.punch_min[attendance_data[i].punch_time.getUTCDate()] = attendance_data[i].punch_time.getUTCMinutes();
                                emp.punch_sec[attendance_data[i].punch_time.getUTCDate()] = attendance_data[i].punch_time.getUTCSeconds();
                            }
                        }
                    };
                    for (var i = 0; i < dateList.length; i++) {
                        var tmp_day = new Date(search_month.getFullYear(), search_month.getMonth(), dateList[i]);
                        for (var j = 0; j < holiday_array.length; j++) {
                            if (dateList[i] == holiday_array[j]) {
                                emp.attendance[dateList[i]] = 'H'
                            }
                        };
                        if (tmp_day.getDay() == 5) {
                            if (adjustment.indexOf(dateList[i].toString()) == -1) {
                                emp.attendance[dateList[i]] = 'W'
                            }
                        }
                        /*if(adjustment.length>0){
                            for (var j = 0; j < adjustment.length; j++) {
                                if(dateList[i]!=adjustment[j]&&tmp_day.getDay()==5){
                                    emp.attendance[dateList[i]] = 'W'
                                }
                            };
                        }*/
                        if (emp.attendance[dateList[i]] == 'W' || emp.attendance[dateList[i]] == 'H') {
                            if (emp.attendance[dateList[i - 1]] == 'A' && emp.attendance[dateList[i + 1]] == 'A') {
                                emp.attendance[dateList[i]] = 'A';
                            }
                        }
                        if (emp.attendance[dateList[i]] == 'P') {
                            if (emp.punch_hour[dateList[i]] <= 8) {
                                if (emp.punch_hour[dateList[i]] == 8) {
                                    if (emp.punch_min[dateList[i]] >= 15) {
                                        emp.attendance[dateList[i]] = 'L'
                                    }
                                }
                            } else {
                                emp.attendance[dateList[i]] = 'L'
                            }
                        }
                        if (emp.attendance[dateList[i]] == 'L') {
                            emp.days['day_' + dateList[i]] = addLeadingZero(2, emp.punch_hour[dateList[i]].toString()) + ':' +
                                addLeadingZero(2, emp.punch_min[dateList[i]].toString()) + ':' +
                                addLeadingZero(2, emp.punch_sec[dateList[i]].toString());
                        } else {
                            emp.days['day_' + dateList[i]] = emp.attendance[dateList[i]];
                        }
                        if (emp.attendance[dateList[i]] == 'P')
                            present++;
                        if (emp.attendance[dateList[i]] == 'L')
                            late++;
                        if (emp.attendance[dateList[i]] == 'A')
                            absent++;
                        if (emp.attendance[dateList[i]] == 'W')
                            weekend++;
                        if (emp.attendance[dateList[i]] == 'H')
                            holidays++;
                    };
                    for (var i = 0; i < dateList.length; i++) {
                        if (leaves.length) {
                            for (var j = 0; j < leaves.length; j++) {
                                var leave_date = new Date(leaves[j].date);
                                var ldgy = leave_date.getFullYear();
                                var ldgm = leave_date.getMonth();
                                var ldgd = leave_date.getDate();
                                var smgy = search_month.getFullYear();
                                var smgm = search_month.getMonth();
                                if (ldgy == smgy && ldgm == smgm) {
                                    if (parseInt(dateList[i]) == ldgd) {
                                        var ldtn = shortNames(leaves[j].leaveTypeTable.name);
                                        if (emp.attendance[dateList[i]] == 'A' && ldtn == 'LL') {
                                            emp.absent_late_leave++;
                                        }
                                        emp.attendance[dateList[i]] = ldtn;
                                        emp.days['day_' + dateList[i]] = emp.attendance[dateList[i]];
                                    }
                                }
                            };
                        }
                    };
                    emp.weekend = weekend;
                    //emp.weekends = weekends;
                    emp.absent = absent;
                    emp.present = present;
                    emp.late = late;
                    emp.holidays = holidays;
                    emp.day_length = dateList.length;
                    //var ex_la = parseInt(late/3);
                    //emp.absent+=ex_la;
                    emp.total = emp.present + emp.late + emp.absent;
                    returnData.push(emp);
                    cb_employee_data();
                })
            })
        }, function(err) {
            if (err) {
                throw err;
            }
            callback(returnData);
        });
    })
}

Date.prototype.addHours = function(h) {
    this.setHours(this.getHours() + h);
    return this;
}

function CreateWorkTime(db, DATA, callback) {
    db.sequelize.query(
        "INSERT INTO work_time (in_time, out_time) " +
        "VALUES ('" + DATA.in_time + "', '" + DATA.out_time + "')"
    ).complete(function(err, data) {
        callback("success")
    });
}

function DestroyDailyAttendance(db, DATA, callback) {
    db.daily_attendance.destroy({
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

function rangeMArrayFunc(d) {
    var f = new Date(d);
    f.setUTCMonth(f.getUTCMonth() - 1);
    f.setUTCDate(26);
    var t = new Date(d);
    t.setUTCDate(25);
    var r = [];
    while (f <= t) {
        var Y = f.getUTCFullYear();
        var M = f.getUTCMonth() + 1;
        var D = f.getUTCDate();
        var YMD = Y + '-' + M + '-' + D;
        r.push(YMD);
        f.setUTCDate(f.getUTCDate() + 1);
    }
    return r;
}


function getDateArray(a, b, c) {
    var r = [];
    var f = new Date(a);
    var t = new Date(b);
    while (f <= t) {
        var Y = f.getFullYear();
        var M = f.getMonth() + 1;
        var D = f.getDate();
        var YMD = Y + '-' + M + '-' + D;
        r.push(YMD);
        f.setDate(f.getDate() + 1);
    }
    c(r);
}

function CreateEmployeeManualPunch(db, DATA, callback) {
    db.attendance.create({
        employee: DATA.employee,
        punch_time: DATA.punch_time,
        type: DATA.type
    }).complete(function(err, employee) {
        if (err) {
            callback("error");
            //throw err;
        } else {
            callback("success")
        }
    })
}


function attendance_list(db, DATA, callback) {
    var d = new Date();
    if (DATA.form_date) {
        d = new Date(DATA.form_date)
    }
    var f = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    d.setDate(d.getDate() + 1);
    var t = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate());
    db.attendance.findAll({
        where: {
            punch_time: {
                between: [f, t]
            },
        },
        group: [
            'employee'
        ],
        include: [{
            model: db.employee,
            attributes: ['id', 'user', 'department'],
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
            }],
            /*where: {
                department: 1
            },*/

        }],
        order: [
            ['employee', 'ASC']
        ],
    }).complete(function(err, data) {
        callback(data);
    })
}

function user_attendance_list(db, DATA, callback) {
    if (!DATA.month) {
        callback([]);
    } else {
        var sm = (DATA.month) ? new Date(DATA.month) : new Date();
        sm.setDate(1);
        var holiday = [];
        var adjustment = [];
        if (DATA.holiday) {
            for (var i = 0; i < DATA.holiday.length; i++) {
                if (parseInt(DATA.holiday[i]) > 0) {
                    holiday.push(DATA.holiday[i]);
                }
            };
        }
        if (DATA.adjustment) {
            for (var i = 0; i < DATA.adjustment.length; i++) {
                if (parseInt(DATA.adjustment[i]) > 0) {
                    adjustment.push(DATA.adjustment[i]);
                }
            };
        }
        var e = 1;
        var d = new Date();
        if (DATA.employee) {
            e = parseInt(DATA.employee);
        }
        if (DATA.month) {
            d = new Date(DATA.month);
            sm.setMonth(d.getMonth());
        }
        var f = new Date(d);
        d.setMonth(d.getMonth() + 1);
        var t = new Date(d);
        db.attendance.findAll({
            where: {
                punch_time: {
                    between: [f, t]
                },
                employee: e
            },
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
        }).complete(function(err, data) {
            var r_data = [];
            var dateList = dateListFromMonth(sm);
            var sDate = new Date(sm);
            var dateJson = {};
            var first_name = '';
            var last_name = '';
            var card_no = '';
            var finger_print_id = '';
            var email = '';
            var access_level = '';
            var date_of_join = '';
            var department = '';
            var designation = '';
            if (data[0]) {
                first_name = data[0].employeeTable.userTable.first_name;
                last_name = data[0].employeeTable.userTable.last_name;
                card_no = data[0].employeeTable.userTable.card_no;
                finger_print_id = data[0].employeeTable.userTable.finger_print_id;
                email = data[0].employeeTable.userTable.email;
                access_level = data[0].employeeTable.userTable.access_level;
                if (data[0].employeeTable.departmentTable)
                    department = data[0].employeeTable.departmentTable.name;
                if (data[0].employeeTable.designationTable)
                    designation = data[0].employeeTable.designationTable.name;
                date_of_join = data[0].employeeTable.date_of_join;
            }
            var weekend = 0;
            var nextdays = 0;
            var absent = 0;
            var present = 0;
            var late = 0;
            var holidays = 0;
            for (var i = 0; i < dateList.length; i++) {
                dateJson[dateList[i]] = {};
                var td1 = dateList[i] + '-' + mthNames[sDate.getMonth()] + '-' + sDate.getFullYear();
                var td2 = new Date(td1);
                var td3 = new Date();
                dateJson[dateList[i]].date = td1;
                if (td2.getDay() == 5 && adjustment.indexOf(dateList[i].toString()) == -1) {
                    dateJson[dateList[i]].attendance = 'W';
                } else if (td2.getDate() > td3.getDate() && td2.getMonth() == td3.getMonth()) {
                    dateJson[dateList[i]].attendance = 'N';
                } else {
                    dateJson[dateList[i]].attendance = 'A';
                    for (var z = 0; z < holiday.length; z++) {
                        if (parseInt(dateList[i]) == parseInt(holiday[z])) {
                            dateJson[dateList[i]].attendance = 'H';
                        }
                    };
                }
                dateJson[dateList[i]].punch_time = [];
                dateJson[dateList[i]].punch_dates = [];
                dateJson[dateList[i]].in_time = null;
                dateJson[dateList[i]].in_time_h = 24;
                dateJson[dateList[i]].in_time_m = 59;
                dateJson[dateList[i]].in_time_s = 59;
            };
            for (var i = 0; i <= data.length - 1; i++) {
                var exact_datetime = data[i].punch_time.toISOString();
                var exact_datetime_array = exact_datetime.split('T');
                var exact_date_array = exact_datetime_array[0].split('-');
                var exact_time_array = exact_datetime_array[1].split('.');
                var exact_time_array = exact_time_array[0].split(':');
                var e_date = parseInt(exact_date_array[2]);
                var e_month = parseInt(exact_date_array[1]);
                var e_year = parseInt(exact_date_array[0]);
                var e_hour = exact_time_array[0];
                var e_min = exact_time_array[1];
                var e_sec = exact_time_array[2];
                var e_period = 'AM';
                if (e_hour > 12)
                    e_period = 'PM';
                if (dateJson[e_date].in_time_h > parseInt(e_hour)) {
                    dateJson[e_date].in_time = exact_datetime;
                    dateJson[e_date].in_time_h = e_hour;
                    if (dateJson[e_date].in_time_m > parseInt(e_min)) {
                        dateJson[e_date].in_time = exact_datetime;
                        dateJson[e_date].in_time_m = e_min;
                        if (dateJson[e_date].in_time_s > parseInt(e_sec)) {
                            dateJson[e_date].in_time = exact_datetime;
                            dateJson[e_date].in_time_s = e_sec;
                        }
                    }
                }
                if (dateJson[e_date].in_time_h < 8) {
                    dateJson[e_date].attendance = 'P';
                    if (dateJson[e_date].in_time_h <= 8) {
                        if (dateJson[e_date].in_time_h == 8) {
                            if (dateJson[e_date].in_time_m >= 15) {
                                dateJson[e_date].attendance = 'L';
                            }
                        }
                    } else {
                        dateJson[e_date].attendance = 'L';
                    }
                } else {
                    dateJson[e_date].attendance = 'L';
                }
                var tmp_time = '[ ' + e_hour + ':' + e_min + ':' + e_sec + ' ' + e_period + ' ] ';
                dateJson[e_date].punch_time.push(tmp_time);
                dateJson[e_date].punch_dates.push(exact_datetime_array[0]);
            };
            for (var i = 0; i < dateList.length; i++) {
                if (dateJson[dateList[i]].attendance == 'W')
                    weekend++;
                else if (dateJson[dateList[i]].attendance == 'N')
                    nextdays++;
                else if (dateJson[dateList[i]].attendance == 'A')
                    absent++;
                else if (dateJson[dateList[i]].attendance == 'P')
                    present++;
                else if (dateJson[dateList[i]].attendance == 'L')
                    late++;
                else if (dateJson[dateList[i]].attendance == 'H')
                    holidays++;
                if (i == dateList.length - 1) {
                    dateJson[dateList[i]].weekend = weekend;
                    dateJson[dateList[i]].nextdays = nextdays;
                    dateJson[dateList[i]].absent = absent;
                    dateJson[dateList[i]].present = present;
                    dateJson[dateList[i]].late = late;
                    dateJson[dateList[i]].holiday = holidays;
                    dateJson[dateList[i]].finger_print_id = finger_print_id;
                    dateJson[dateList[i]].card_no = card_no;
                    dateJson[dateList[i]].email = email;
                    dateJson[dateList[i]].access_level = access_level;
                    dateJson[dateList[i]].date_of_join = date_of_join;
                    dateJson[dateList[i]].department = department;
                    dateJson[dateList[i]].designation = designation;
                    if (first_name) {
                        if (last_name) {
                            dateJson[dateList[i]].name = first_name + ' ' + last_name;
                        } else {
                            dateJson[dateList[i]].name = first_name;
                        }
                    }
                }
            };
            for (key in dateJson) {
                r_data.push(dateJson[key]);
            }
            if (r_data[0].date == 'NaN-undefined-NaN')
                r_data = [];
            callback(r_data);
        })
    }
}

function getAttendance(db, QUERY, callback) {
    var SEARCH = {};
    var findData = {};
    if (QUERY.employee)
        SEARCH.employee = QUERY.employee
    if (QUERY.type)
        SEARCH.type = QUERY.type
    if (QUERY.date) {
        var f = new Date(QUERY.date);
        f.setDate(f.getDate() - 1);
        f.setHours(0);
        f.setMinutes(0);
        var t = new Date(QUERY.date);
        t.setDate(t.getDate() + 1);
        t.setHours(18);
        t.setMinutes(18);
        SEARCH.punch_time = {};
        SEARCH.punch_time.between = [f, t];
    }
    findData.where = SEARCH;
    findData.attributes = [
        'id', 'employee', 'punch_time', 'type'
    ];
    findData.include = [{
        model: db.employee,
        attributes: [
            'id', 'work_time', 'employee_type', 'department', 'section'
        ],
        include: [{
            model: db.work_time,
            attributes: [
                'id', 'name', 'in_time', 'out_time',
                'in_hour', 'in_minute', 'in_late_allowed_minute',
                'in_bonus_late_allowed_minute', 'out_hour',
                'out_minute', 'out_late_allowed_minute',
                'out_bonus_late_allowed_minute'
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
        }, ]
    }, ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'punch_time';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.attendance.findAll(findData).complete(function(err, d) {
        callback(d);
    })
}

function getEmployeeDayAttendance(db, QUERY, callback) {
    var returnData = [];
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    var Y = d.getFullYear();
    var M = d.getMonth() + 1;
    var D = d.getDate();
    var YMD = Y + '-' + M + '-' + D;
    QUERY.date = YMD;
    getEmployee(db, QUERY, function(empData) {
        async.each(empData, function(emp, cb_emp) {
            var o = {};
            QUERY.employee = emp.id;
            o = emp;
            getEmployeeDayPunch(db, QUERY, function(attData) {
                o.overTime = attData[YMD].overTime;
                o.excessOverTime = attData[YMD].excessOverTime;
                o.workingHour = attData[YMD].workingHour;
                o.attendanceStatus = attData[YMD].status;
                o.lastDayOut = attData[YMD].lastDayOut;
                o.officeIn = attData[YMD].officeIn;
                o.lunchOut = attData[YMD].lunchOut;
                o.lunchIn = attData[YMD].lunchIn;
                o.officeOut = attData[YMD].officeOut;
                // if(QUERY.attendance_type){
                //   if(QUERY.attendance_type=='PRESENT'){
                //     if(o.attendanceStatus!='A'){
                //       returnData.push(o)
                //     }
                //   }
                //   if(QUERY.attendance_type=='ABSENT'){
                //     if(o.attendanceStatus=='A'){
                //       returnData.push(o)
                //     }
                //   }
                // }else{
                //   returnData.push(o)
                // }
                returnData.push(o)
                cb_emp();
            });
        }, function(err) {
            callback(returnData);
        });
    })
}

function getEmployeeMonthAttendance(db, QUERY, callback) {
    var returnData = [];
    var c = (QUERY.date) ? new Date(QUERY.date) : new Date();
    c.setDate(1);
    var f = (QUERY.date) ? new Date(QUERY.date) : new Date();
    f.setMonth(f.getMonth() - 1);
    f.setDate(20);
    var t = (QUERY.date) ? new Date(QUERY.date) : new Date();
    t.setMonth(t.getMonth() + 1);
    t.setDate(10);
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    d.setDate(20);
    getEmployee(db, QUERY, function(empData) {
        async.each(empData, function(emp, cb_emp) {
            var o = {};
            o = emp;
            o.salary = 0;
            o.advanceDeduct = 0;
            o.medicalDeduct = 0;
            o.stampDeduct = 0;
            o.aitDeduct = 0;
            o.lunchOutDeduct = 0;
            o.othersDeduct = 0;
            o.overtimeDeduct = 0;
            o.excessOvertimeDeduct = 0;
            o.branch_code = '000';
            o.account_type = '000';
            o.account_no = '0000000';
            o.account = '000-000-0000000';
            o.attendance = {};
            var Y = d.getFullYear();
            var M = d.getMonth();
            var D = d.getDate();
            var YMD = Y + '-' + M + '-' + D;
            var SEARCH = {};
            SEARCH.employee = emp.id;
            SEARCH.id = emp.id;
            SEARCH.date = YMD;
            var d1 = new Date(d);
            d1.setMonth(d.getMonth() - 1);
            var Y1 = d1.getFullYear();
            var M1 = d1.getMonth() + 1;
            var D1 = d1.getDate();
            var Y1M1D1 = Y1 + '-' + M1 + '-' + D1;
            SEARCH.date = Y1M1D1;
            getEmployeeMonthPunch(db, SEARCH, function(monthData) {
                Object.keys(monthData).forEach((key) => (monthData[key].day >= 20) ? o.attendance[key] = monthData[key] : null);
                M = d.getMonth() + 1;
                YMD = Y + '-' + M + '-' + D;
                SEARCH.date = YMD;
                getEmployeeMonthPunch(db, SEARCH, function(month2Data) {
                    Object.keys(month2Data).forEach((key) => o.attendance[key] = month2Data[key]);
                    var d2 = new Date(d);
                    d2.setMonth(d.getMonth() + 1);
                    var Y2 = d2.getFullYear();
                    var M2 = d2.getMonth() + 1;
                    var D2 = d2.getDate();
                    var Y2M2D2 = Y2 + '-' + M2 + '-' + D2;
                    SEARCH.date = Y2M2D2;
                    getEmployeeMonthPunch(db, SEARCH, function(month3Data) {
                        Object.keys(month3Data).forEach((key) => (month3Data[key].day <= 10) ? o.attendance[key] = month3Data[key] : null);
                        M = d.getMonth() + 1;
                        YMD = Y + '-' + M + '-' + D;
                        SEARCH.date = YMD;
                        getAdjustment(db, SEARCH, function(adjData) {
                            async.each(adjData, function(adj, cb_adj) {
                                if (o.attendance[adj.d]) {
                                    o.attendance[adj.d].adjust = true;
                                    o.attendance[adj.d].weekend = false;
                                }
                                cb_adj();
                            }, function(err) {
                                getHoliday(db, SEARCH, function(holiData) {
                                    async.each(holiData, function(holi, cb_holi) {
                                        if (o.attendance[holi.d]) {
                                            o.attendance[holi.d].holiday = true;
                                            o.attendance[holi.d].weekend = false;
                                        }
                                        cb_holi();
                                    }, function(err) {
                                        getLeave(db, SEARCH, function(lvData) {
                                            async.each(lvData, function(lv, cb_lv) {
                                                if (o.attendance[lv.d]) {
                                                    o.attendance[lv.d].leave = true;
                                                    o.attendance[lv.d].leaveName = lv.leave;
                                                    o.attendance[lv.d].leaveType = lv.leave_type;
                                                }
                                                cb_lv();
                                            }, function(err) {
                                                getDateArray(f, t, function(dtArr) {
                                                    var tmpO = {};
                                                    tmpO.flag = false;
                                                    tmpO.tmpFlag = false;
                                                    tmpO.date = [];
                                                    tmpO.tmpDate = [];
                                                    async.each(dtArr, function(dt, cb_dt) {
                                                        tmpO.flag = (
                                                            (o.attendance[dt].weekend && !o.attendance[dt].adjust) ||
                                                            (o.attendance[dt].attend && o.attendance[dt].adjust && o.attendance[dt].weekend) ||
                                                            (o.attendance[dt].attend && !o.attendance[dt].adjust && !o.attendance[dt].weekend) ||
                                                            o.attendance[dt].holiday
                                                        );
                                                        o.attendance[dt].payable = tmpO.flag;
                                                        if (
                                                            (!tmpO.tmpFlag || (tmpO.tmpDate.length > 0)) &&
                                                            (o.attendance[dt].weekend || o.attendance[dt].holiday)
                                                        ) {
                                                            tmpO.tmpDate.push(dt);
                                                        }
                                                        if (!tmpO.flag) {
                                                            if (tmpO.tmpFlag) {
                                                                if (
                                                                    (!o.attendance[dt].weekend || !o.attendance[dt].holiday) &&
                                                                    (tmpO.tmpDate.length > 0)
                                                                ) {
                                                                    tmpO.date = tmpO.date.concat(tmpO.tmpDate);
                                                                    tmpO.tmpDate = [];
                                                                }
                                                            }
                                                        }
                                                        if (o.attendance[dt].attend && !o.attendance[dt].weekend && !o.attendance[dt].holiday) {
                                                            tmpO.tmpDate = [];
                                                        }
                                                        tmpO.tmpFlag = tmpO.flag;
                                                        if (o.attendance[dt].attend && (o.attendance[dt].weekend || o.attendance[dt].holiday)) {
                                                            o.attendance[dt].excessOverTime = o.attendance[dt].workingHour;
                                                        }
                                                        cb_dt()
                                                    }, function(err) {
                                                        async.each(tmpO.date, function(tdt, cb_tdt) {
                                                            o.attendance[tdt].payable = false;
                                                            cb_tdt();
                                                        }, function(err) {
                                                            var salSearch = {};
                                                            salSearch.employee = emp.id;
                                                            salSearch.date = new Date(c);
                                                            getSalaryJson(db, salSearch, function(salData) {
                                                                o.salary = (salData.amount > 0) ? salData.amount : o.salary;
                                                                o.advanceDeduct = (salData.advanceDeduct > 0) ? salData.advanceDeduct : o.advanceDeduct;
                                                                o.medicalDeduct = (salData.medicalDeduct > 0) ? salData.medicalDeduct : o.medicalDeduct;
                                                                o.stampDeduct = (salData.stampDeduct > 0) ? salData.stampDeduct : o.stampDeduct;
                                                                o.aitDeduct = (salData.aitDeduct > 0) ? salData.aitDeduct : o.aitDeduct;
                                                                o.lunchOutDeduct = (salData.lunchOutDeduct > 0) ? salData.lunchOutDeduct : o.lunchOutDeduct;
                                                                o.othersDeduct = (salData.othersDeduct > 0) ? salData.othersDeduct : o.othersDeduct;
                                                                o.overtimeDeduct = (salData.overtimeDeduct > 0) ? salData.overtimeDeduct : o.overtimeDeduct;
                                                                o.excessOvertimeDeduct = (salData.excessOvertimeDeduct > 0) ? salData.excessOvertimeDeduct : o.excessOvertimeDeduct;
                                                                o.branch_code = (salData.branch_code) ? salData.branch_code : o.branch_code;
                                                                o.account_type = (salData.account_type) ? salData.account_type : o.account_type;
                                                                o.account_no = (salData.account_no) ? salData.account_no : o.account_no;
                                                                o.account = (salData.account) ? salData.account : o.account;
                                                                returnData.push(o);
                                                                cb_emp();
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }, function(err) {
            callback(returnData);
        });
    })
}

function CreateArchiveAttendance(db, DATA, callback) {
    for (var i = 0; i < DATA.length; i++) {
        fs.readFile(DATA[i], 'utf8', function(err, data) {
            if (err) throw err;
            var file_array = data.split("\r\n");
            var bulkArray = [];
            for (var j = 0; j < file_array.length; j++) {
                var inputs = {};
                if (file_array[j] != '') {
                    var filedatetime_array = file_array[j].split(" ");
                    if (filedatetime_array[1] == 'AM' || filedatetime_array[1] == 'PM') {
                        var datetime_array = filedatetime_array[0].split(":");
                        inputs.employee = parseInt(datetime_array[1]);
                        var date = new Date(datetime_array[2]);
                        var year = date.getFullYear();
                        var month = date.getMonth();
                        var day = date.getDate();
                        var hours = parseInt(datetime_array[3]);
                        var minutes = parseInt(datetime_array[4]);
                        var seconds = parseInt(datetime_array[5]);
                        if (filedatetime_array[1] == 'PM') {
                            hours += 12;
                        }
                        inputs.punch_time = Date.UTC(year, month, day, hours, minutes, seconds, 00);
                        bulkArray.push(inputs)
                    }
                }
            };
            db.attendance.bulkCreate(bulkArray).complete(function(err, wash) {
                if (err) {
                    callback("error");
                    //throw err;
                }
            });
        });
        if (i == DATA.length - 1) {
            callback("success")
        }
    };
}

function getEmployeeMonthAttendanceV2(db, QUERY, callback) {
    var returnData = [];
    var c = (QUERY.date) ? new Date(QUERY.date) : new Date();
    c.setDate(1);
    var f = (QUERY.date) ? new Date(QUERY.date) : new Date();
    f.setMonth(f.getMonth() - 1);
    f.setDate(20);
    var t = (QUERY.date) ? new Date(QUERY.date) : new Date();
    t.setMonth(t.getMonth() + 1);
    t.setDate(10);
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    d.setDate(20);
    getEmployee(db, QUERY, function(empData) {
        async.each(empData, function(emp, cb_emp) {
            var o = {};
            o = emp;
            o.salary = 0;
            o.advanceDeduct = 0;
            o.medicalDeduct = 0;
            o.stampDeduct = 0;
            o.aitDeduct = 0;
            o.lunchOutDeduct = 0;
            o.othersDeduct = 0;
            o.overtimeDeduct = 0;
            o.excessOvertimeDeduct = 0;
            o.branch_code = '000';
            o.account_type = '000';
            o.account_no = '0000000';
            o.account = '000-000-0000000';
            o.attendance = {};
            var Y = d.getFullYear();
            var M = d.getMonth();
            var D = d.getDate();
            var YMD = Y + '-' + M + '-' + D;
            var SEARCH = {};
            SEARCH.employee = emp.id;
            SEARCH.id = emp.id;
            SEARCH.date = YMD;
            var d1 = new Date(d);
            d1.setMonth(d.getMonth() - 1);
            var Y1 = d1.getFullYear();
            var M1 = d1.getMonth() + 1;
            var D1 = d1.getDate();
            var Y1M1D1 = Y1 + '-' + M1 + '-' + D1;
            SEARCH.date = Y1M1D1;
            getEmployeeMonthPunch(db, SEARCH, function(monthData) {
                Object.keys(monthData).forEach((key) => (monthData[key].day >= 20) ? o.attendance[key] = monthData[key] : null);
                M = d.getMonth() + 1;
                YMD = Y + '-' + M + '-' + D;
                SEARCH.date = YMD;
                getEmployeeMonthPunch(db, SEARCH, function(month2Data) {
                    Object.keys(month2Data).forEach((key) => o.attendance[key] = month2Data[key]);
                    var d2 = new Date(d);
                    d2.setMonth(d.getMonth() + 1);
                    var Y2 = d2.getFullYear();
                    var M2 = d2.getMonth() + 1;
                    var D2 = d2.getDate();
                    var Y2M2D2 = Y2 + '-' + M2 + '-' + D2;
                    SEARCH.date = Y2M2D2;
                    getEmployeeMonthPunch(db, SEARCH, function(month3Data) {
                        Object.keys(month3Data).forEach((key) => (month3Data[key].day <= 10) ? o.attendance[key] = month3Data[key] : null);
                        M = d.getMonth() + 1;
                        YMD = Y + '-' + M + '-' + D;
                        SEARCH.date = YMD;
                        getAdjustment(db, SEARCH, function(adjData) {
                            async.each(adjData, function(adj, cb_adj) {
                                if (o.attendance[adj.d]) {
                                    o.attendance[adj.d].adjust = true;
                                    o.attendance[adj.d].weekend = false;
                                }
                                cb_adj();
                            }, function(err) {
                                getHoliday(db, SEARCH, function(holiData) {
                                    async.each(holiData, function(holi, cb_holi) {
                                        if (o.attendance[holi.d]) {
                                            o.attendance[holi.d].holiday = true;
                                            o.attendance[holi.d].weekend = false;
                                        }
                                        cb_holi();
                                    }, function(err) {
                                        getLeave(db, SEARCH, function(lvData) {
                                            async.each(lvData, function(lv, cb_lv) {
                                                if (o.attendance[lv.d]) {
                                                    o.attendance[lv.d].leave = true;
                                                    o.attendance[lv.d].leaveName = lv.leave;
                                                    o.attendance[lv.d].leaveType = lv.leave_type;
                                                }
                                                cb_lv();
                                            }, function(err) {
                                                getDateArray(f, t, function(dtArr) {
                                                    var tmpO = {};
                                                    tmpO.flag = false;
                                                    tmpO.tmpFlag = false;
                                                    tmpO.date = [];
                                                    tmpO.tmpDate = [];
                                                    async.each(dtArr, function(dt, cb_dt) {
                                                        tmpO.flag = (
                                                            (o.attendance[dt].weekend && !o.attendance[dt].adjust) ||
                                                            (o.attendance[dt].attend && o.attendance[dt].adjust && o.attendance[dt].weekend) ||
                                                            (o.attendance[dt].attend && !o.attendance[dt].adjust && !o.attendance[dt].weekend) ||
                                                            o.attendance[dt].holiday
                                                        );
                                                        o.attendance[dt].payable = tmpO.flag;
                                                        if (
                                                            (!tmpO.tmpFlag || (tmpO.tmpDate.length > 0)) &&
                                                            (o.attendance[dt].weekend || o.attendance[dt].holiday)
                                                        ) {
                                                            tmpO.tmpDate.push(dt);
                                                        }
                                                        if (!tmpO.flag) {
                                                            if (tmpO.tmpFlag) {
                                                                if (
                                                                    (!o.attendance[dt].weekend || !o.attendance[dt].holiday) &&
                                                                    (tmpO.tmpDate.length > 0)
                                                                ) {
                                                                    tmpO.date = tmpO.date.concat(tmpO.tmpDate);
                                                                    tmpO.tmpDate = [];
                                                                }
                                                            }
                                                        }
                                                        if (o.attendance[dt].attend && !o.attendance[dt].weekend && !o.attendance[dt].holiday) {
                                                            tmpO.tmpDate = [];
                                                        }
                                                        tmpO.tmpFlag = tmpO.flag;
                                                        if (o.attendance[dt].attend && (o.attendance[dt].weekend || o.attendance[dt].holiday)) {
                                                            o.attendance[dt].excessOverTime = o.attendance[dt].workingHour;
                                                        }
                                                        cb_dt()
                                                    }, function(err) {
                                                        async.each(tmpO.date, function(tdt, cb_tdt) {
                                                            o.attendance[tdt].payable = false;
                                                            cb_tdt();
                                                        }, function(err) {
                                                            var salSearch = {};
                                                            salSearch.employee = emp.id;
                                                            salSearch.date = new Date(c);
                                                            getSalaryJson(db, salSearch, function(salData) {
                                                                o.salary = (salData.amount > 0) ? salData.amount : o.salary;
                                                                o.advanceDeduct = (salData.advanceDeduct > 0) ? salData.advanceDeduct : o.advanceDeduct;
                                                                o.medicalDeduct = (salData.medicalDeduct > 0) ? salData.medicalDeduct : o.medicalDeduct;
                                                                o.stampDeduct = (salData.stampDeduct > 0) ? salData.stampDeduct : o.stampDeduct;
                                                                o.aitDeduct = (salData.aitDeduct > 0) ? salData.aitDeduct : o.aitDeduct;
                                                                o.lunchOutDeduct = (salData.lunchOutDeduct > 0) ? salData.lunchOutDeduct : o.lunchOutDeduct;
                                                                o.othersDeduct = (salData.othersDeduct > 0) ? salData.othersDeduct : o.othersDeduct;
                                                                o.overtimeDeduct = (salData.overtimeDeduct > 0) ? salData.overtimeDeduct : o.overtimeDeduct;
                                                                o.excessOvertimeDeduct = (salData.excessOvertimeDeduct > 0) ? salData.excessOvertimeDeduct : o.excessOvertimeDeduct;
                                                                o.branch_code = (salData.branch_code) ? salData.branch_code : o.branch_code;
                                                                o.account_type = (salData.account_type) ? salData.account_type : o.account_type;
                                                                o.account_no = (salData.account_no) ? salData.account_no : o.account_no;
                                                                o.account = (salData.account) ? salData.account : o.account;
                                                                returnData.push(o);
                                                                cb_emp();
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }, function(err) {
            callback(returnData);
        });
    })
}


function getDailyAttendanceSummary(db, QUERY, secData, callback) {
    var returnData = [];
    secData.sort(function(a, b) {
        var o1 = a.name;
        var o2 = b.name;
        if (o1 < o2) return -1;
        if (o1 > o2) return 1;
        return 0;
    });
    async.each(secData, function(sec, cb_sec) {
        var o = {};
        o.id = sec.id;
        o.section = sec.name;
        QUERY.section = sec.id;
        o.emp_count = sec.emp_count;
        o.present = 0;
        o.absent = 0;
        o.late = 0;
        o.in_late = 0;
        o.out_late = 0;
        getEmployeeDailyAttendance(db, QUERY, function(attData) {
            async.each(attData, function(att, cb_att) {
                var WTTable = JSON.parse(JSON.stringify(att.workTimeTable));
                var inH = parseInt(WTTable.in_hour);
                var inM = parseInt(WTTable.in_minute);
                var inLM = parseInt(WTTable.in_late_allowed_minute);
                var inBM = parseInt(WTTable.in_bonus_late_allowed_minute);
                var outH = parseInt(WTTable.out_hour);
                var outM = parseInt(WTTable.out_minute);
                var outLM = parseInt(WTTable.out_late_allowed_minute);
                var outBM = parseInt(WTTable.out_bonus_late_allowed_minute);
                var OT = att.overTime + att.excessOverTime;
                switch (att.attendanceStatus) {
                    case 'P':
                        o.present += 1;
                        if (att.officeIn.h > inH || (att.officeIn.h == inH && att.officeIn.m > inM)) {
                            o.in_late += 1;
                            o.late += 1;
                        }
                        if (!(att.officeOut.h >= 17)) {
                            o.out_late += 1;
                            o.late += 1;
                        }
                        break;
                    case 'A':
                        o.absent += 1;
                        break;
                }
                cb_att();
            }, function(err) {
                returnData.push(o);
                cb_sec();
            });
        })
    }, function(err) {
        callback(returnData);
    });
}

function CreatePunchDatAttendance(db, DATA, callback) {
    async.each(DATA, function(dt, cb_dt) {
        var o = {};
        var flag = false;
        var tmpData = dt.split('\t');
        if (tmpData.length > 1) {
            flag = true;
            o.employee = parseInt(tmpData[0]);
            var timestamp = Date.parse(tmpData[1])
            o.punch_time = (isNaN(timestamp) == false) ? new Date(tmpData[1]) : new Date(tmpData[2]);
            o.punch_time.setHours(o.punch_time.getHours() + 6);
        }
        if (flag) {
            db.attendance.create(o).complete(function(err, attendance) {
                cb_dt();
            })
        } else {
            cb_dt();
        }
    }, function(err) {
        callback("success");
    });
}

function CreateCSVAttendance(db, DATA, callback) {
    var bulkArray = [];
    var tmpArray = [];
    var success = 0;
    var i = 0;
    async.each(DATA, function(dt, cb_dt) {
        var tmpData = dt.split(/[\n]+/);
        tmpArray.push(tmpData[0])
        cb_dt()
    }, function(err) {
        async.each(tmpArray, function(ba, cb_ba) {
            if (ba) {
                var o = {};
                var tmpData1 = ba.split(/[,;]+/);
                var tmpID = parseInt(tmpData1[0].match(/(\d+)/), 10);
                var tmpDate = new Date(tmpData1[1]);

                if (tmpID && tmpDate) {
                    success = 1;
                    o.employee = tmpID;
                    o.punch_time = tmpDate;
                    o.punch_time.addHours(6);
                    if (o.punch_time != 'Invalid Date') {
                        db.attendance.create(o).complete(function(err, attendance) {
                            i++;
                            cb_ba();
                        });
                    } else {
                        cb_ba();
                    }
                } else {
                    cb_ba();
                }
                //      if(tmpData1[0]&&tmpData1[1]){
                //       var tmpData2 = tmpData1[0].split('"');
                //       var tmpData3 = tmpData1[1].split('"');
                //       var tmpA = tmpData2[1];
                //       var tmpB = tmpData3[1];
                //       if(tmpA=='No.'&&tmpB=='Date/Time'){
                //     success = 1;
                //       }
                //    if(success){
                //        o.employee = tmpA;
                //        o.punch_time = new Date(tmpB);
                //        o.punch_time.addHours(6);
                //        if(o.punch_time!='Invalid Date'){
                //      db.attendance.create(o).complete(function (err, attendance) {
                //          i++;
                //          cb_ba();
                //      });
                //        }else{
                //      cb_ba();
                //     }
                //    }else{
                //  cb_ba();
                //    }
                //      }else{
                // cb_ba();
                //   }
            } else {
                cb_ba();
            }
        }, function(err) {
            if (success) {
                if (i > 0) {
                    callback("success");
                } else {
                    callback("error");
                }
            } else {
                callback("error");
            }
        });
    });
}

function getEmployeeDailyAttendance(db, QUERY, callback) {
    var returnData = [];
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    var Y = d.getUTCFullYear();
    var M = d.getUTCMonth() + 1;
    var D = d.getUTCDate();
    var YMD = Y + '-' + M + '-' + D;
    QUERY.date = YMD;
    getEmployee(db, QUERY, function(empData) {
        async.each(empData, function(emp, cb_emp) {
            var o = {};
            var EMPQUERY = {};
            EMPQUERY.date = YMD;
            EMPQUERY.employee = emp.id;
            o = emp;
            getEmployeeDailyPunchDetails(db, EMPQUERY, function(attData) {
                o.overTime = attData[YMD].overTime;
                o.excessOverTime = attData[YMD].excessOverTime;
                o.workingHour = attData[YMD].workingHour;
                o.attendanceStatus = attData[YMD].status;
                o.lastDayOut = attData[YMD].lastDayOut;
                o.officeIn = attData[YMD].officeIn;
                o.officeOut = attData[YMD].officeOut;
                returnData.push(o)
                cb_emp();
            });
        }, function(err) {
            callback(returnData);
        });
    })
}

function CreateAttendance(db, DATA, callback) {
    db.attendance.create({
        name: DATA.name,
    }).complete(function(err, employee) {
        if (err) {
            callback("error");
            //throw err;
        } else {
            callback("success")
        }
    })
}

function SendDailyAttendanceReport(db, values, v, callback) {
    var t_d = new Date(values.date);
    var sendData = {};
    sendData.from = 'no_reply@fashionflashltd.com';
    sendData.to = 'njrips@gmail.com';
    factoryName = 'Not Found ERROR';

    if (folderName == 'DA_HR') {
        sendData.to = 'helal@fashionflashltd.com,kmizan@fashionflashltd.com,hasan@fashionflashltd.com,zahir@fjeansltd.com,rashed@denimaltd.com';
        sendData.cc = 'it@denimaltd.com';
        sendData.bcc = 'ripon@fashionflashltd.com,sazzad@fashionflashltd.com';
        factoryName = 'Denim Attires LTD';
    }
    if (folderName == 'FFL_FACTORY_HR') {
        sendData.to = 'helal@fashionflashltd.com,kmizan@fashionflashltd.com,hasan@fashionflashltd.com,zahir@fjeansltd.com';
        sendData.cc = 'it@fjeansltd.com';
        sendData.bcc = 'ripon@fashionflashltd.com,sazzad@fashionflashltd.com';
        factoryName = 'Fashion Flash LTD Factory';
    }
    if (folderName == 'FJL_HR') {
        sendData.to = 'helal@fashionflashltd.com,kmizan@fashionflashltd.com,hasan@fashionflashltd.com,zahir@fjeansltd.com';
        sendData.cc = 'it@fjeansltd.com';
        sendData.bcc = 'ripon@fashionflashltd.com,sazzad@fashionflashltd.com';
        factoryName = 'Fashion Jeans LTD';
    }
    if (folderName == 'JCL_WASH_HR') {
        sendData.to = 'helal@fashionflashltd.com,kmizan@fashionflashltd.com,hasan@fashionflashltd.com';
        sendData.cc = 'jclwashing@gmail.com';
        sendData.bcc = 'ripon@fashionflashltd.com,sazzad@fashionflashltd.com';
        factoryName = 'Jeans Concept LTD';
    }
    if (folderName == 'Right_Link') {
        sendData.to = 'right.linkbd@gmail.com,helal@fashionflashltd.com';
        sendData.cc = 'rightlinkindustries@gmail.com';
        sendData.bcc = 'ripon@fashionflashltd.com';
        factoryName = 'Right Link';
    }

    sendData.subject = factoryName + ' Attendance Report For ' + t_d.getDate() + ' ' + mthCPNames[t_d.getMonth()] + ' ' + t_d.getFullYear();
    sendData.html = '<b>Dear All' +
        ',</b><br /><p>Please find full daily attendance report from attached file & attendance summary overview given below.</p>';

    sendData.html += v;
    sendData.html += '<p style="font-family: Helvetica, Arial, sans-serif; font-size: 10px; line-height: 12px; margin-bottom: 10px;"><a style="text-decoration: none;" href="http://ff-ltd.com/"> <img src="http://ff-ltd.com/images/jcl_logo.jpg" alt="JCL Group" width="111" height="80" border="0" /> </a></p>' +
        '<p style="font-family: Helvetica, Arial, sans-serif; font-size: 10px; line-height: 12px; margin-bottom: 10px;"><span style="font-weight: bold; color: #212121; display: inline;">JCL Group</span> <span style="display: inline;"><br /></span> <span style="color: #212121; display: inline;">88-02-58951541, 88-02-58957154, 88-02-58950256, 88-02-58951722</span> <span style="display: inline;"><br /></span> <span style="color: #212121; display: inline;">House #1, Road# 13/C, Sector #6, Uttara Dhaka-1230</span> <span style="display: inline;"><br /></span> <a style="color: #477ccc; text-decoration: none; display: inline;" href="http://ff-ltd.com">http://ff-ltd.com</a></p>';
    sendData.html += '<p><i style="color:gray"><small><b>N:B:</b> This is an automatically generated email, please do not reply. If you have any concerns regarding this mail,' +
        'report to IT Department.</i></small></p>';
    sendData.attachments = [{
        path: values.folderLocation + values.file_name + '.pdf'
    }, ];
    transporter.sendMail(sendData, function(error, info) {
        callback('success');
    });
}







function getComplianceEmployeeMonthAttendance(db, QUERY, callback) {
    var returnData = [];
    var c = (QUERY.date) ? new Date(QUERY.date) : new Date();
    c.setDate(1);
    var f = (QUERY.date) ? new Date(QUERY.date) : new Date();
    f.setMonth(f.getMonth() - 1);
    f.setDate(20);
    var t = (QUERY.date) ? new Date(QUERY.date) : new Date();
    t.setMonth(t.getMonth() + 1);
    t.setDate(10);
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    d.setDate(20);
    getEmployee(db, QUERY, function(empData) {
        async.each(empData, function(emp, cb_emp) {
            var o = {};
            o = emp;
            o.salary = 0;
            o.advanceDeduct = 0;
            o.medicalDeduct = 0;
            o.stampDeduct = 0;
            o.aitDeduct = 0;
            o.lunchOutDeduct = 0;
            o.othersDeduct = 0;
            o.overtimeDeduct = 0;
            o.excessOvertimeDeduct = 0;
            o.branch_code = '000';
            o.account_type = '000';
            o.account_no = '0000000';
            o.account = '000-000-0000000';
            o.attendance = {};
            var Y = d.getFullYear();
            var M = d.getMonth();
            var D = d.getDate();
            var YMD = Y + '-' + M + '-' + D;
            var SEARCH = {};
            SEARCH.employee = emp.id;
            SEARCH.id = emp.id;
            SEARCH.date = YMD;
            var d1 = new Date(d);
            d1.setMonth(d.getMonth() - 1);
            var Y1 = d1.getFullYear();
            var M1 = d1.getMonth() + 1;
            var D1 = d1.getDate();
            var Y1M1D1 = Y1 + '-' + M1 + '-' + D1;
            SEARCH.date = Y1M1D1;
            getEmployeeMonthPunch(db, SEARCH, function(monthData) {
                Object.keys(monthData).forEach((key) => (monthData[key].day >= 20) ? o.attendance[key] = monthData[key] : null);
                M = d.getMonth() + 1;
                YMD = Y + '-' + M + '-' + D;
                SEARCH.date = YMD;
                getEmployeeMonthPunch(db, SEARCH, function(month2Data) {
                    Object.keys(month2Data).forEach((key) => o.attendance[key] = month2Data[key]);
                    var d2 = new Date(d);
                    d2.setMonth(d.getMonth() + 1);
                    var Y2 = d2.getFullYear();
                    var M2 = d2.getMonth() + 1;
                    var D2 = d2.getDate();
                    var Y2M2D2 = Y2 + '-' + M2 + '-' + D2;
                    SEARCH.date = Y2M2D2;
                    getEmployeeMonthPunch(db, SEARCH, function(month3Data) {
                        Object.keys(month3Data).forEach((key) => (month3Data[key].day <= 10) ? o.attendance[key] = month3Data[key] : null);
                        M = d.getMonth() + 1;
                        YMD = Y + '-' + M + '-' + D;
                        SEARCH.date = YMD;
                        getHoliday(db, SEARCH, function(holiData) {
                            async.each(holiData, function(holi, cb_holi) {
                                if (o.attendance[holi.d]) {
                                    o.attendance[holi.d].holiday = true;
                                    o.attendance[holi.d].weekend = false;
                                }
                                cb_holi();
                            }, function(err) {
                                getLeave(db, SEARCH, function(lvData) {
                                    async.each(lvData, function(lv, cb_lv) {
                                        if (o.attendance[lv.d]) {
                                            o.attendance[lv.d].leave = true;
                                            o.attendance[lv.d].leaveName = lv.leave;
                                            o.attendance[lv.d].leaveType = lv.leave_type;
                                        }
                                        cb_lv();
                                    }, function(err) {
                                        getDateArray(f, t, function(dtArr) {
                                            var tmpO = {};
                                            tmpO.flag = false;
                                            tmpO.tmpFlag = false;
                                            tmpO.date = [];
                                            tmpO.tmpDate = [];
                                            async.each(dtArr, function(dt, cb_dt) {
                                                tmpO.flag = (
                                                    (o.attendance[dt].weekend) ||
                                                    (o.attendance[dt].attend && o.attendance[dt].weekend) ||
                                                    (o.attendance[dt].attend && !o.attendance[dt].weekend) ||
                                                    o.attendance[dt].holiday
                                                );
                                                o.attendance[dt].payable = tmpO.flag;
                                                if (
                                                    (!tmpO.tmpFlag || (tmpO.tmpDate.length > 0)) &&
                                                    (o.attendance[dt].weekend || o.attendance[dt].holiday)
                                                ) {
                                                    tmpO.tmpDate.push(dt);
                                                }
                                                if (!tmpO.flag) {
                                                    if (tmpO.tmpFlag) {
                                                        if (
                                                            (!o.attendance[dt].weekend || !o.attendance[dt].holiday) &&
                                                            (tmpO.tmpDate.length > 0)
                                                        ) {
                                                            tmpO.date = tmpO.date.concat(tmpO.tmpDate);
                                                            tmpO.tmpDate = [];
                                                        }
                                                    }
                                                }
                                                if (o.attendance[dt].attend && !o.attendance[dt].weekend && !o.attendance[dt].holiday) {
                                                    tmpO.tmpDate = [];
                                                }
                                                tmpO.tmpFlag = tmpO.flag;
                                                if (o.attendance[dt].attend && (o.attendance[dt].weekend || o.attendance[dt].holiday)) {
                                                    o.attendance[dt].excessOverTime = o.attendance[dt].workingHour;
                                                }
                                                cb_dt()
                                            }, function(err) {
                                                async.each(tmpO.date, function(tdt, cb_tdt) {
                                                    o.attendance[tdt].payable = false;
                                                    cb_tdt();
                                                }, function(err) {
                                                    var salSearch = {};
                                                    salSearch.employee = emp.id;
                                                    salSearch.date = new Date(c);
                                                    getSalaryJson(db, salSearch, function(salData) {
                                                        o.salary = (salData.amount > 0) ? salData.amount : o.salary;
                                                        o.advanceDeduct = (salData.advanceDeduct > 0) ? salData.advanceDeduct : o.advanceDeduct;
                                                        o.medicalDeduct = (salData.medicalDeduct > 0) ? salData.medicalDeduct : o.medicalDeduct;
                                                        o.stampDeduct = (salData.stampDeduct > 0) ? salData.stampDeduct : o.stampDeduct;
                                                        o.aitDeduct = (salData.aitDeduct > 0) ? salData.aitDeduct : o.aitDeduct;
                                                        o.lunchOutDeduct = (salData.lunchOutDeduct > 0) ? salData.lunchOutDeduct : o.lunchOutDeduct;
                                                        o.othersDeduct = (salData.othersDeduct > 0) ? salData.othersDeduct : o.othersDeduct;
                                                        o.overtimeDeduct = (salData.overtimeDeduct > 0) ? salData.overtimeDeduct : o.overtimeDeduct;
                                                        o.excessOvertimeDeduct = (salData.excessOvertimeDeduct > 0) ? salData.excessOvertimeDeduct : o.excessOvertimeDeduct;
                                                        o.branch_code = (salData.branch_code) ? salData.branch_code : o.branch_code;
                                                        o.account_type = (salData.account_type) ? salData.account_type : o.account_type;
                                                        o.account_no = (salData.account_no) ? salData.account_no : o.account_no;
                                                        o.account = (salData.account) ? salData.account : o.account;
                                                        returnData.push(o);
                                                        cb_emp();
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }, function(err) {
            callback(returnData);
        });
    })
}

function department_search_list(db, ID, callback) {
    var search = {};
    if (ID) {
        search.where = {};
        search.where.id = ID;
    }
    db.department.findAll(search).complete(function(err, data) {
        callback(data);
    })
}

function daily_report(db, DEPARTMENT_ID, DATA, callback) {
    var d = new Date();
    if (DATA.date) {
        d = new Date(DATA.date)
    }
    var f = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    d.setDate(d.getDate() + 1);
    var t = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate());
    var absent = 0;
    var present = 0;
    var late = 0;
    var total = 0;
    var returnData = [];
    var search_emp = {};
    search_emp.department = (DATA.department) ? DATA.department : DEPARTMENT_ID;
    search_emp.status = [1, 2];
    if (DATA.section)
        search_emp.section = DATA.section;
    if (DATA.working_place)
        search_emp.working_place = DATA.working_place;
    if (DATA.employee_type)
        search_emp.employee_type = DATA.employee_type;
    db.employee.findAll({
        where: search_emp,
        include: [{
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
                'id', 'name'
            ]
        }, {
            model: db.section,
            attributes: [
                'id', 'name'
            ]
        }, {
            model: db.working_place,
            attributes: [
                'id', 'name'
            ]
        }, {
            model: db.employee_type,
            attributes: [
                'id', 'name'
            ]
        }, {
            model: db.status,
            attributes: [
                'id', 'name'
            ]
        }],
        order: [
            ['id', 'ASC']
        ],
    }).complete(function(err, employee_data) {
        async.each(employee_data, function(employee, cb_employee_data) {
            var emp = {};
            emp.punches = [];
            emp.out_time = '00:00:00';
            emp.attendance = 'A';
            emp.punch_hour = 24;
            emp.punch_min = 60;
            emp.punch_sec = 60;
            emp.id = employee.id;
            emp.first_name = employee.userTable.first_name;
            emp.last_name = employee.userTable.last_name;
            emp.user = employee.userTable;
            emp.department = employee.departmentTable.name;
            emp.designation = (employee.designationTable) ? employee.designationTable.name : '';
            emp.card_no = employee.userTable.card_no;
            emp.card_no = 0;
            if (employee.userTable.card_no > 0)
                emp.card_no = employee.userTable.card_no;
            emp.section = '';
            if (employee.sectionTable)
                emp.section = employee.sectionTable.name;
            emp.working_place = '';
            if (employee.workingPlaceTable)
                emp.working_place = employee.workingPlaceTable.name;
            emp.employee_type = '';
            if (employee.employeeTypeTable)
                emp.employee_type = employee.employeeTypeTable.name;
            db.attendance.findAll({
                where: {
                    punch_time: {
                        between: [f, t]
                    },
                    employee: employee.id
                },
                order: [
                    ['id', 'ASC']
                ],
            }).complete(function(err, attendance_data) {
                if (attendance_data.length > 0) {
                    for (var i = 0; i < attendance_data.length; i++) {
                        emp.attendance = 'P'
                        emp.punches.push(attendance_data[i].punch_time);
                        if (attendance_data[i].punch_time.getUTCHours() < emp.punch_hour) {
                            emp.punch_hour = attendance_data[i].punch_time.getUTCHours();
                            if (attendance_data[i].punch_time.getUTCMinutes() < emp.punch_min) {
                                emp.punch_min = attendance_data[i].punch_time.getUTCMinutes();
                                emp.punch_sec = attendance_data[i].punch_time.getUTCSeconds();
                            }
                        }
                    };
                }
                if (emp.attendance == 'P') {
                    if (emp.punch_hour <= 8) {
                        if (emp.punch_hour == 8) {
                            if (emp.punch_min >= 15) {
                                emp.attendance = 'L';
                            }
                        }
                    } else {
                        emp.attendance = 'L';
                    }
                }
                if (emp.attendance == 'A') {
                    emp.in_time = '00:00:00';
                    absent++;
                    total++;
                } else {
                    if (emp.attendance == 'P') {
                        present++;
                        total++;
                    }
                    if (emp.attendance == 'L') {
                        late++;
                        total++;
                    }
                    emp.in_time = addLeadingZero(2, emp.punch_hour) + ':' +
                        addLeadingZero(2, emp.punch_min) + ':' +
                        addLeadingZero(2, emp.punch_sec);
                }
                if (emp.punches.length > 1) {
                    var sorted = emp.punches.sort(sortDates);
                    var minDate = sorted[0];
                    var maxDate = sorted[sorted.length - 1];
                    emp.out_time = addLeadingZero(2, maxDate.getUTCHours()) + ':' +
                        addLeadingZero(2, maxDate.getUTCMinutes()) + ':' +
                        addLeadingZero(2, maxDate.getUTCSeconds());
                }

                emp.present = present;
                emp.absent = absent;
                emp.late = late;
                emp.total = total;
                if (DATA.attendance_type) {
                    if (DATA.attendance_type == 'PRESENT') {
                        if (emp.attendance != 'A') {
                            returnData.push(emp)
                        }
                    }
                    if (DATA.attendance_type == 'ABSENT') {
                        if (emp.attendance == 'A') {
                            returnData.push(emp)
                        }
                    }
                } else {
                    returnData.push(emp)
                }
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






function DestroyAttendance(db, DATA, callback) {
    db.attendance.destroy({
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


function getDailyAttendanceCreateData(db, QUERY, callback) {
    var returnData = [];
    getAllEmployeeID(db, QUERY, function(eIdData) {
        async.each(eIdData, function(eId, cb_eId) {
            var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
            d.setDate(1);
            var dayArray = dayArrayFunc(d.monthDays());
            async.each(dayArray, function(day, cb_day) {
                d.setDate(day);
                var Y = d.getFullYear();
                var M = d.getMonth() + 1;
                var D = d.getDate();
                var YMD = Y + '-' + M + '-' + D;
                var AttSearch = {};
                AttSearch.date = YMD;
                AttSearch.employee = eId.id;
                getEmployeeDayPunchDetails(db, AttSearch, function(eDPD) {
                    var o = {};
                    o.employee = eDPD[YMD].employee;
                    o.day = eDPD[YMD].day;
                    o.month = eDPD[YMD].month;
                    o.year = eDPD[YMD].year;
                    o.work_time = eDPD[YMD].work_time;
                    o.in_hour = eDPD[YMD].in_hour;
                    o.in_minute = eDPD[YMD].in_minute;
                    o.in_late_minute = eDPD[YMD].in_late_minute;
                    o.out_hour = eDPD[YMD].out_hour;
                    o
                    o.out_minute = eDPD[YMD].out_minute;
                    o.out_late_minute = eDPD[YMD].out_late_minute;
                    o.attend_status = eDPD[YMD].attend_status;
                    o.working_minute = eDPD[YMD].working_minute;
                    o.overtime = eDPD[YMD].overtime;
                    o.break_minute = eDPD[YMD].break_minute;
                    var opt = {};
                    opt.employee = eDPD[YMD].employee;
                    opt.day = eDPD[YMD].day;
                    opt.month = eDPD[YMD].month;
                    opt.year = eDPD[YMD].year;
                    opt.work_time = eDPD[YMD].work_time;
                    db.daily_attendance.find({
                        where: opt
                    }).then(function(obj) {
                        if (obj) {
                            db.daily_attendance.update(o, opt).complete(function(e, r) {
                                cb_day();
                            })
                        } else {
                            db.daily_attendance.create(o).complete(function(e, r) {
                                cb_day();
                            })
                        }
                    });
                });
            }, function(err) {
                cb_eId();
            });
        }, function(err) {
            callback(returnData);
        });
    });
}

/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////Socket Init And route init //////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function routerInit(app, dbFull) {
    var db = dbFull.DA_HR

    app.get('/attendance', /*isAuthenticated,*/ function(req, res) {
        attendance_list(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getEmployeeDetails', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        // QUERY.id = 4017;
        QUERY.status = 4;
        // QUERY.date = new Date('2016-11-01');
        getEmployeeDetails(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/user_attendance', /*isAuthenticated,*/ function(req, res) {
        user_attendance_list(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getAttendance', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.employee = 96;
        // QUERY.date = new Date('2016-08-06');
        getAttendance(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getEmployeeDayAttendance', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.id = 3209;
        QUERY.employee = 3209;
        QUERY.date = new Date('2017-01-13');
        getEmployeeDayAttendance(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send([d]);
        })
    });

    app.get('/getEmployeeMonthAttendance/:EID', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.id = req.params.EID;
        QUERY.employee = req.params.EID;
        QUERY.date = new Date('2017-01-01');
        getEmployeeMonthAttendance(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getEmployeeMonthAttendance2', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        //QUERY.id = 4017;
        //QUERY.employee = 4017;
        QUERY.section = 1;
        QUERY.date = new Date('2016-11-01');
        getEmployeeMonthAttendance2(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getEmployeeMonthAttendance', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.id = 117;
        QUERY.employee = 117;
        QUERY.date = new Date('2017-06-05');
        getEmployeeMonthAttendance(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.post('/CreateArchiveAttendance', function(req, res) {
        var files = req.files.archive_file;
        var file_path = [];
        if (files.length) {
            for (var i = 0; i < files.length; i++) {
                file_path.push(files[i].path)
            };
        } else {
            file_path.push(files.path)
        }
        CreateArchiveAttendance(db, file_path, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getEmployeeMonthAttendanceV2', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.id = 3004;
        QUERY.employee = 3004;
        QUERY.date = new Date('2017-10-10');
        getEmployeeMonthAttendanceV2(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getDailyAttendanceSummary', /*isAuthenticated,*/ function(req, res) {
        var QUERY = req.query;
        QUERY.date = (req.query.date) ? new Date(req.query.date) : new Date('2017-10-22');
        QUERY.status = [1, 2];
        database.sequelize.query(
            "SELECT  `section`.`id`, `section`.`name`,  COUNT(`employee`.`id`) AS `emp_count` " +
            "FROM  `section` " +
            "LEFT JOIN  `employee`" +
            " ON  `employee`.`section` =  `section`.`id` " +
            "WHERE  `employee`.`status` IN (1, 2) " +
            "GROUP BY  `section`. `id`;"
        ).complete(function(err, secData) {
            getDailyAttendanceSummary(db, QUERY, secData, function(d) {
                res.setHeader('Content-Type', 'application/json');
                res.send(d);
            })
        });
    });

    app.post('/CreatePunchDatAttendance', function(req, res) {
        var rawFile = req.files.user_file.path;
        var password = createHash('ffljcl1234');
        fs.readFile(rawFile, 'utf8', function(err, data) {
            if (err) throw err;
            var d = data.split(/[\n]+/);
            CreatePunchDatAttendance(db, d, function(d) {
                res.setHeader('Content-Type', 'application/json');
                res.send(d);
            });
        });
    });

    app.post('/CreateCSVAttendance', function(req, res) {
        var rawFile = req.files.user_file.path;
        var password = createHash('ffljcl1234');
        fs.readFile(rawFile, 'utf8', function(err, data) {
            if (err) throw err;
            var d = data.split(/[\n\r]+/);
            //var d = data.split("\n");
            CreateCSVAttendance(db, d, function(d) {
                res.setHeader('Content-Type', 'application/json');
                res.send(d);
            });
        });
    });

    app.get('/getEmployeeDailyAttendance', /*isAuthenticated,*/ function(req, res) {
        var QUERY = req.query;
        QUERY.section = 1;
        QUERY.date = new Date(Date.UTC(2017, 9, 22));
        QUERY.status = [1, 2];
        getEmployeeDailyAttendance(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}


// =======================================================
// =================socketInit============================
// =======================================================
function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('CreateAttendance', function(data) {
        CreateAttendance(db, data, function(data) {
            socket.emit("CreateAttendance", data)
        });
    });

    socket.on('SendDailyAttendanceReport', function(values, v) {
        SendDailyAttendanceReport(db, values, v, function(m) {
            socket.emit("SendDailyAttendanceReportReturn", m);
        });
    });

    socket.on('CreateMonthlyAttendanceReportPDF', function(data, file_name) {
        var options = {
            width: '4500px',
            height: '3182px'
        };
        pdf.create(data, options).toFile('./uploads/pdf/' + file_name + '.pdf', function(err, res) {
            socket.emit("CreateMonthlyAttendanceReportPDF", 'success');
        });
    });

    socket.on('DownloadComplianceBonusStatementReport', function(QUERY) {
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
            '<th>' + ((QUERY.bonus_type == 'BASIC') ? 'BASIC' : 'HALF<br />GROSS') + '</th>' +
            '<th><small><small>STAMP</small></small></th>' +
            '<th>PAYABLE<br />AMOUNT</th>' +
            '<th><big>..SIGNATURE..</big></th>' +
            '</tr>';
        var netPayment = 0,
            salary = 0,
            tBonusAmount = 0,
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
                    var bonusAmount = (QUERY.bonus_type == 'BASIC') ? Math.round(emp.basic) : Math.round(emp.salary / 2);
                    var payAmount = bonusAmount - stamp;
                    tBonusAmount += bonusAmount;
                    netPayment += payAmount;
                    salary += emp.salary;
                    tStamp += stamp;
                    htmlData += '<tr>' +
                        '<td height="70" align="center">' + r + '</td>' +
                        '<td>' + emp.id + '</td>' +
                        '<td>' + emp.name + '<br /><br />' + emp.name_bangla + '</td>' +
                        '<td>' + emp.designationName + '</td>' +
                        '<td>' + emp.date_of_join.formatDate() + '</td>' +
                        '<td align="center">' + emp.card_no + '</td>' +
                        '<td align="center">' + emp.grade + '</td>' +
                        '<td align="right">' + emp.salary.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + bonusAmount.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + stamp.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + payAmount.formatMoney(2, '.', ',') + '</td>' +
                        '<td></td>' +
                        '</tr>';
                    r++;
                }
                cb_emp();
            }, function(err) {
                htmlData += '<tr>' +
                    '<td colspan="7"><b>TOTAL</b></td>' +
                    '<td align="right"><b>' + salary.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"><b>' + tBonusAmount.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"><b>' + tStamp.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"><b>' + netPayment.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td></td>' +
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
                    socket.emit("DownloadComplianceBonusStatementReport", 'success');
                });
            });
        });
    });

    socket.on('CreateMonthlyUserAttendanceReportPDF', function(file_name, site_url, sd, eid) {
        var ms = new Date(sd);
        var ns = new Date(sd);
        ns.setMonth(ns.getMonth() + 1);
        ns.setDate(0);
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            dailyReportHead();
        list.emp_month_attendance(db, sd, eid, function(empAttDL) {
            var eD = empAttDL[0]
            var eName = (eD.name == 'NOT GIVEN') ? eid.name : eD.name;
            var eFpID = (eD.fp_id == '') ? eid.id : eD.fp_id;
            var eDOJ = (eD.date_of_join == '') ? eid.date_of_join : eD.date_of_join;
            var eDep = (eD.department == '') ? eid.department.toUpperCase() : eD.department.toUpperCase();
            var eDes = (eD.designation == '') ? eid.designation.toUpperCase() : eD.designation.toUpperCase();
            var eEmail = (eD.email == '') ? eid.email : eD.email;
            htmlData += '<div id="pageBody">' +
                '<table style="width:100%">' +
                '<tr>' +
                '<td rowspan="2" align="center">' +
                '<b>' +
                'EMPLOYEE ATTENDANCE REPORT- 1' +
                '<sup>' +
                dayPower[1] +
                '</sup> ' +
                monthCapitalNames[ms.getMonth()] + ', ' +
                ms.getUTCFullYear() +
                ' TO ' +
                ns.getDate() +
                '<sup>' +
                dayPower[ns.getDate()] +
                '</sup> ' +
                monthCapitalNames[ns.getMonth()] + ', ' +
                ns.getUTCFullYear() +
                '</b>' +
                '</td>' +
                '</tr>' +
                '</table>' +
                '<table style="width:100%;">' +
                //////////////////////ROW////////////////////////
                '<tr>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'EMPLOYEE ID ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '<b>' +
                ': ' +
                addLeadingZero(9, eFpID) +
                '</b>' +
                '</td>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'PRESENT ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '<b>' +
                ': ' +
                addLeadingZero(2, eD.present) +
                '</b>' +
                '</td>' +
                '</tr>' +
                //////////////////////ROW////////////////////////
                '<tr>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'NAME ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '<b>' +
                ': ' +
                eName +
                '</b>' +
                '</td>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'ABSENT ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '<b>' +
                ': ' +
                addLeadingZero(2, eD.absent) +
                '</b>' +
                '</td>' +
                '</tr>' +
                //////////////////////ROW////////////////////////
                '<tr>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'JOINING DATE ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '<b>' +
                ': ' +
                eDOJ +
                '</b>' +
                '</td>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'LATE ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '<b>' +
                ': ' +
                addLeadingZero(2, eD.late) +
                '</b>' +
                '</td>' +
                '</tr>' +
                //////////////////////ROW////////////////////////
                '<tr>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'DEPARTMENT ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '<b>' +
                ': ' +
                eDep +
                '</b>' +
                '</td>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'HOLIDAY ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '<b>' +
                ': ' +
                addLeadingZero(2, eD.holiday) +
                '</b>' +
                '</td>' +
                '</tr>' +
                //////////////////////ROW////////////////////////
                '<tr>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'DESIGNATION ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '<b>' +
                ': ' +
                eDes +
                '</b>' +
                '</td>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'WEEKEND ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '<b>' +
                ': ' +
                addLeadingZero(2, eD.weekend) +
                '</b>' +
                '</td>' +
                '</tr>' +
                //////////////////////ROW////////////////////////
                '<tr>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                '<b>' +
                'IN LATE ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                '<b>' +
                ': ' +
                addLeadingZero(2, eD.inLate) +
                ' ( AL : ' +
                addLeadingZero(2, parseInt(eD.inLate / 3)) +
                ' )' +
                '</b>' +
                '</td>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<b>' +
                'TOTAL ' +
                '</b>' +
                '</td>' +
                '<td style="border-left: 0px solid white;border-right: 0px solid white;border-bottom: 0px solid white;">' +
                '<b>' +
                ': ' +
                addLeadingZero(2, eD.absent + eD.present + eD.late + eD.holiday + eD.weekend) +
                '</b>' +
                '</td>' +
                '</tr>' +
                //////////////////////ROW////////////////////////
                '<tr>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                '<b>' +
                'OUT LATE ' +
                '</b>' +
                '</td>' +
                '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                '<b>' +
                ': ' +
                addLeadingZero(2, eD.outLate) +
                ' ( AL : ' +
                addLeadingZero(2, parseInt(eD.outLate / 3)) +
                ' )' +
                '</b>' +
                '</td>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '<td style="border: 0px solid white;">' +
                '</td>' +
                '</tr>' +
                //////////////////////ROW////////////////////////
                '<tr>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                '<b>' +
                'TOTAL LATE ' +
                '</b>' +
                '</td>' +
                '<td style="background:Gainsboro;border-left: 0px solid Gainsboro;border-right: 0px solid Gainsboro;">' +
                '<b>' +
                ': ' +
                addLeadingZero(2, (parseInt(eD.inLate) + parseInt(eD.outLate))) +
                ' ( AL : ' +
                addLeadingZero(2, (parseInt(eD.inLate / 3) + parseInt(eD.outLate / 3))) +
                ' )' +
                '</b>' +
                '</td>' +
                /////////////////////COL/////////////////////////
                '<td style="border: 0px solid white;">' +
                '</td>' +
                '</td>' +
                '<td style="border: 0px solid white;">' +
                '</td>' +
                '</td>' +
                '</tr>' +
                '</table>' +
                '<table style="width:100%">' +
                '<tr>' +
                '<th>DATE</th>' +
                '<th>IN TIME</th>' +
                '<th>OUT TIME</th>' +
                '<th>OVER TIME (H)</th>' +
                '<th>STATUS</th>' +
                '</tr>';
            async.each(eD.attendance, function(att, cb_att) {
                htmlData += '<tr>' +
                    '<td align="center">' +
                    att.date +
                    '</td>' +
                    '<td align="center">' +
                    att.in_time +
                    '</td>' +
                    '<td align="center">' +
                    att.out_time +
                    '</td>' +
                    '<td align="center">' +
                    addLeadingZero(2, parseInt(att.overTime)) +
                    ' H</td>' +
                    '<td align="center">' +
                    att.status +
                    '</td>' +
                    '</tr>';
                cb_att();
            }, function(err) {
                htmlData += '<tr>' +
                    '<td align="right" colspan="3">' +
                    '<b>' +
                    'TOTAL = ' +
                    '</b>' +
                    '</td>' +
                    '<td align="center"><b>' +
                    addLeadingZero(2, parseInt(eD.overTime)) +
                    ' H</b></td>' +
                    '<td align="center">' +
                    '</td>' +
                    '</tr>' +
                    '</table><br />' +
                    '<b>N.B.: </b>ONLY FULL HOUR WILL COUNT AS OVER TIME' +
                    '</div></body></html>';
                var pt = new Date();
                var options = {
                    format: 'Letter',
                    header: {
                        height: "27mm",
                        contents: headerContents() +
                            '<h4 style="' +
                            'line-height: 0;' +
                            '">MONTHLY ATTENDANCE REPORT</h4>' +
                            '<h6 style="line-height: 0;">' +
                            eName + ' | ' +
                            monthCapitalNames[ms.getMonth()] + ', ' +
                            ms.getUTCFullYear() +
                            '</h6>'
                    },
                    footer: {
                        height: "15mm",
                        contents: footerContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + file_name + '.pdf', function(err, res) {
                    socket.emit("CreateMonthlyUserAttendanceReportPDF", 'success');
                });
            })
        })
    });

    socket.on('DownloadMonthAttendance', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var dateList = dateListFromMonth(d);
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>.' +
            monthlyReportHead();
        getSection(db, QUERY, function(secList) {
            async.each(secList, function(sec, cb_sec) {
                htmlData += '<div><table style="width:100%">' +
                    '<tr>' +
                    '<th align="left">' +
                    '<h3>' +
                    sec.name.toUpperCase() +
                    '</h3>' +
                    '</th>' +
                    '</tr>' +
                    '</table>' +
                    '<table style="width:100%">' +
                    '<tr>' +
                    '<th width="60px">EMP. ID</th>' +
                    '<th width="60px">CARD</th>' +
                    '<th width="260px">EMP. NAME</th>' +
                    '<th>P</th>' +
                    '<th>A</th>' +
                    '<th>L</th>' +
                    '<th>W</th>' +
                    '<th>H</th>' +
                    '<th>IL</th>' +
                    '<th>OL</th>' +
                    '<th>AL</th>' +
                    '<th>LA</th>' +
                    '<th>PD</th>' +
                    '<th>AD</th>' +
                    '<th>TD</th>';
                for (var j = 0; j < dateList.length; j++) {
                    htmlData += '<th width="65px"><small><small>' + mthCPNames[d.getMonth()] + ' <big><big>' + dateList[j] + '</big></big></small></small></th>';
                };
                htmlData += '<th><small>ROT</small></th>' +
                    '<th><small>EOT</small></th>' +
                    '<th><small>A.B.</small></th>' +
                    '</tr>';
                var empSearch = {};
                empSearch.section = sec.id;
                empSearch.status = QUERY.status;
                empSearch.date = d;
                getEmployeeMonthSummary(db, empSearch, function(empData) {
                    async.each(empData, function(emp, cb_emp) {
                        htmlData += '<tr>' +
                            '<td><b>' + emp.fp + '</b></td>' +
                            '<td><b>' + emp.card_no + '</b></td>' +
                            '<td><b>' + emp.name + '</b></td>' +
                            '<td align="center">' + emp.present + '</b></td>' +
                            '<td align="center">' + emp.absent + '</td>' +
                            '<td align="center">' + emp.late + '</td>' +
                            '<td align="center">' + emp.weekend + '</td>' +
                            '<td align="center">' + emp.holiday + '</td>' +
                            '<td align="center">' + emp.inLate + '</td>' +
                            '<td align="center">' + emp.outLate + '</td>' +
                            '<td align="center">' + emp.absentForLate + '</td>' +
                            '<td align="center">' + emp.leave + '</td>' +
                            '<td align="center"><b>' + emp.totalPayableDays + '</b></td>' +
                            '<td align="center">' + emp.totalDeductDays + '</td>' +
                            '<td align="center">' + emp.totalDays + '</td>';
                        for (var j = 0; j < dateList.length; j++) {
                            var Y = d.getFullYear();
                            var M = d.getMonth() + 1;
                            var D = dateList[j];
                            var YMD = Y + '-' + M + '-' + D;
                            htmlData += '<td align="center"><b>' + emp.attendance[YMD] + '</b></td>';
                        };
                        htmlData += '<td align="center"><b>' + emp.overTime + '</b></td>' +
                            '<td align="center"><b>' + emp.excessOverTime + '</b></td>' +
                            '<td align="center"><b>' + ((emp.attendanceBonus > 0) ? 'Y' : 'N') + '</b></td>' +
                            '</tr>';
                        cb_emp();
                    }, function(err) {
                        htmlData += '</table><br /></div><br />';
                        cb_sec();
                    })
                });
            }, function(err) {
                htmlData += '</body></html>';
                var options = {
                    format: 'Letter',
                    header: {
                        height: "45mm",
                        contents: '<div style="' +
                            'color: #444;' +
                            'font-size: 15px;' +
                            'position: fixed;' +
                            'top: 15;' +
                            'right: 15;' +
                            '">' +
                            '<span>PRINT TIME: ' +
                            new Date() +
                            '</span>' +
                            '</div>' +
                            '<br />' +
                            '<h1><b>' + factoryName + '</b></h1>' +
                            '<h2><b>Monthly Attendance Report</b></h2>' +
                            '<h4><b>' +
                            monthCapitalNames[d.getMonth()] + ', ' +
                            d.getFullYear() +
                            '</b></h4>'
                    },
                    footer: {
                        height: "25mm",
                        contents: '<div style="' +
                            'color: #444;' +
                            'font-size: 15px;' +
                            'position: fixed;' +
                            'bottom: 15;' +
                            'right: 15;' +
                            '">' +
                            '<span>PAGE {{page}}</span>' +
                            ' OUT OF ' +
                            '<span>{{pages}}</span>' +
                            '</div>' +
                            '<br /><br />' +
                            '<small>' +
                            'N.B.: <i>P = PRESENT, A = ABSENT, L = LATE, W = WEEKEND, ' +
                            'H = HOLIDAY, TD = TOTAL DAYS, AL = ABSENT DUE TO LATE, ALL = LATE LEAVE ON ABSENT DAY, ' +
                            'LL = LATE LEAVE/ SHORT LEAVE, CL = CASUAL LEAVE, SL = SICK LEAVE, EL = EARN LEAVE, ' +
                            'LA = LEAVE ACCEPTED, PD = PRESENT DAYS, AD = ABSENT DAYS</i>' +
                            '</small>'
                    },
                    width: '7120px',
                    height: '4320px'
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadMonthAttendance", 'success');
                });
            });
        });
    });

    socket.on('DownloadMonthAttendanceV2', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        d.setDate(10);
        var dateList = dateListFromMonth(d);
        var rangeMArray = rangeMArrayFunc(d);
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>.' +
            monthlyReportHead();
        getSection(db, QUERY, function(secList) {
            async.each(secList, function(sec, cb_sec) {
                htmlData += '<div><table style="width:100%">' +
                    '<tr>' +
                    '<th align="left">' +
                    '<h3>' +
                    sec.name.toUpperCase() +
                    '</h3>' +
                    '</th>' +
                    '</tr>' +
                    '</table>' +
                    '<table style="width:100%">' +
                    '<tr>' +
                    '<th width="60px">EMP. ID</th>' +
                    '<th width="60px">CARD</th>' +
                    '<th width="260px">EMP. NAME</th>' +
                    '<th>P</th>' +
                    '<th>A</th>' +
                    '<th>L</th>' +
                    '<th>W</th>' +
                    '<th>H</th>' +
                    '<th>IL</th>' +
                    '<th>OL</th>' +
                    '<th>AL</th>' +
                    '<th>LA</th>' +
                    '<th>PD</th>' +
                    '<th>AD</th>' +
                    '<th>TD</th>';
                for (var j = 0; j < rangeMArray.length; j++) {
                    var raD = new Date(rangeMArray[j])
                    htmlData += '<th width="65px"><small><small>' + mthCPNames[raD.getMonth()] + ' <big><big>' + raD.getDate() + '</big></big></small></small></th>';
                };
                htmlData += '<th><small>ROT</small></th>' +
                    '<th><small>EOT</small></th>' +
                    '<th><small>A.B.</small></th>' +
                    '</tr>';
                var empSearch = {};
                empSearch.section = sec.id;
                empSearch.status = QUERY.status;
                empSearch.date = d;
                getEmployeeMonthSummaryV2(db, empSearch, function(empData) {
                    async.each(empData, function(emp, cb_emp) {
                        htmlData += '<tr>' +
                            '<td><b>' + emp.fp + '</b></td>' +
                            '<td><b>' + emp.card_no + '</b></td>' +
                            '<td><b>' + emp.name + '</b></td>' +
                            '<td align="center">' + emp.present + '</b></td>' +
                            '<td align="center">' + emp.absent + '</td>' +
                            '<td align="center">' + emp.late + '</td>' +
                            '<td align="center">' + emp.weekend + '</td>' +
                            '<td align="center">' + emp.holiday + '</td>' +
                            '<td align="center">' + emp.inLate + '</td>' +
                            '<td align="center">' + emp.outLate + '</td>' +
                            '<td align="center">' + emp.absentForLate + '</td>' +
                            '<td align="center">' + emp.leave + '</td>' +
                            '<td align="center"><b>' + emp.totalPayableDays + '</b></td>' +
                            '<td align="center">' + emp.totalDeductDays + '</td>' +
                            '<td align="center">' + emp.totalDays + '</td>';
                        for (var j = 0; j < rangeMArray.length; j++) {
                            var YMD = rangeMArray[j];
                            var dr = new Date(YMD);
                            var Y = dr.getFullYear();
                            var M = dr.getMonth() + 1;
                            var D = dr.getDate();
                            htmlData += '<td align="center"><b>' + emp.attendance[YMD] + '</b></td>';
                        };
                        htmlData += '<td align="center"><b>' + emp.overTime + '</b></td>' +
                            '<td align="center"><b>' + emp.excessOverTime + '</b></td>' +
                            '<td align="center"><b>' + ((emp.attendanceBonus > 0) ? 'Y' : 'N') + '</b></td>' +
                            '</tr>';
                        cb_emp();
                    }, function(err) {
                        htmlData += '</table><br /></div><br />';
                        cb_sec();
                    })
                });
            }, function(err) {
                htmlData += '</body></html>';
                var options = {
                    format: 'Letter',
                    header: {
                        height: "45mm",
                        contents: '<div style="' +
                            'color: #444;' +
                            'font-size: 15px;' +
                            'position: fixed;' +
                            'top: 15;' +
                            'right: 15;' +
                            '">' +
                            '<span>PRINT TIME: ' +
                            new Date() +
                            '</span>' +
                            '</div>' +
                            '<br />' +
                            '<h1><b>' + factoryName + '</b></h1>' +
                            '<h2><b>Monthly Attendance Report</b></h2>' +
                            '<h4><b>' +
                            monthCapitalNames[d.getMonth()] + ', ' +
                            d.getFullYear() +
                            '</b></h4>'
                    },
                    footer: {
                        height: "25mm",
                        contents: '<div style="' +
                            'color: #444;' +
                            'font-size: 15px;' +
                            'position: fixed;' +
                            'bottom: 15;' +
                            'right: 15;' +
                            '">' +
                            '<span>PAGE {{page}}</span>' +
                            ' OUT OF ' +
                            '<span>{{pages}}</span>' +
                            '</div>' +
                            '<br /><br />' +
                            '<small>' +
                            'N.B.: <i>P = PRESENT, A = ABSENT, L = LATE, W = WEEKEND, ' +
                            'H = HOLIDAY, TD = TOTAL DAYS, AL = ABSENT DUE TO LATE, ALL = LATE LEAVE ON ABSENT DAY, ' +
                            'LL = LATE LEAVE/ SHORT LEAVE, CL = CASUAL LEAVE, SL = SICK LEAVE, EL = EARN LEAVE, ' +
                            'LA = LEAVE ACCEPTED, PD = PRESENT DAYS, AD = ABSENT DAYS</i>' +
                            '</small>'
                    },
                    width: '7120px',
                    height: '4320px'
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadMonthAttendanceV2", 'success');
                });
            });
        });
    });

    socket.on('DownloadEmployeeMonthlyAttendance', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var dayArray = dayArrayFunc(d.monthDays());
        var options = {};
        getEmployeeMonthAttendance(db, QUERY, function(empData) {
            var htmlData =
                '<!DOCTYPE html><body>' +
                dailyReportHead() +
                '<div id="pageBody">' +
                '<table style="width:100%">' +
                '<tr>' +
                '<td rowspan="2" align="center">' +
                '<b>' +
                'EMPLOYEE ATTENDANCE REPORT ' +
                monthCapitalNames[d.getMonth()] + ', ' +
                d.getUTCFullYear() +
                '</b>' +
                '</td>' +
                '</tr>' +
                '</table>';
            var gridData = '';
            var present = 0;
            var absent = 0;
            var late = 0;
            var holiday = 0;
            var weekend = 0;
            var leave = 0;
            var inLate = 0;
            var outLate = 0;
            var fp = addLeadingZero(9, QUERY.id);
            var name = '';
            var joinDate = '';
            var department = '';
            var section = '';
            var designation = '';
            async.each(empData, function(emp, cb_emp) {
                name = emp.name;
                joinDate = emp.date_of_join.formatFullDate();
                department = emp.departmentName;
                section = emp.sectionName;
                designation = emp.designationName;
                options = {
                    format: 'Letter',
                    header: {
                        height: "27mm",
                        contents: headerContents() +
                            '<h4 style="' +
                            'line-height: 0;' +
                            '">MONTHLY ATTENDANCE REPORT</h4>' +
                            '<h6 style="line-height: 0;">' +
                            emp.name + ' | ' +
                            monthCapitalNames[d.getMonth()] + ', ' +
                            d.getUTCFullYear() +
                            '</h6>'
                    },
                    footer: {
                        height: "15mm",
                        contents: footerContents()
                    },
                };
                var overTime = 0;
                var excessOverTime = 0;
                var workInTime = emp.workInTime.split(":");
                var workOutTime = emp.workOutTime.split(":");
                var inH = parseInt(workInTime[0]);
                var inM = parseInt(workInTime[1]);
                var outH = parseInt(workOutTime[0]);
                var outM = parseInt(workOutTime[1]);
                gridData += '<table style="width:100%">' +
                    '<tr>' +
                    '<th>DATE</th>' +
                    '<th>OFFICE IN</th>' +
                    '<th>LUNCH OUT</th>' +
                    '<th>LUNCH IN</th>' +
                    '<th>OFFICE OUT</th>' +
                    '<th>OT (H)</th>' +
                    '<th>EOT (H)</th>' +
                    '<th>STATUS</th>' +
                    '</tr>';
                async.each(dayArray, function(day, cb_day) {
                    d.setDate(day);
                    var Y = d.getFullYear();
                    var M = d.getMonth() + 1;
                    var D = d.getDate();
                    var YMD = Y + '-' + M + '-' + D;
                    inH = (ramadan2017.indexOf(YMD) != -1) ? parseInt(workInTime[0]) - 1 : parseInt(workInTime[0]);
                    outH = (ramadan1p2017.indexOf(YMD) != -1) ? parseInt(workOutTime[0]) - 1 : (ramadan2p2017.indexOf(YMD) != -1) ? parseInt(workOutTime[0]) - 2 : parseInt(workOutTime[0]);
                    outM = (ramadan2p2017.indexOf(YMD) != -1) ? ((parseInt(workOutTime[1]) == 30) ? 00 : 30) : parseInt(workOutTime[1]);

                    if (folderName == 'DA_HR') {
                        if (Y == 2017 && M == 6) {
                            inH = 7;
                            inM = 0;
                            outH = (D == 9 || D == 16 || D == 23) ? 16 : 15;
                            outM = (D == 9 || D == 16 || D == 23) ? 0 : 30;
                        }
                    } else if (folderName == 'FFL_FACTORY_HR') {
                        if (Y == 2017 && M == 6) {
                            inH = (emp.department == 22) ? 8 : ((emp.id == 1184) ? 9 : 7);
                            inM = 0;
                            outH = (emp.department == 22) ? 16 : ((emp.id == 1184) ? 17 : 15);
                            outM = 30;
                        }
                    } else if (folderName == 'FJL_HR') {
                        if (Y == 2017 && M == 6) {
                            inH = (emp.department == 11) ? 8 : ((emp.id == 1184) ? 9 : 7);
                            inM = 0;
                            outH = (emp.department == 11) ? 16 : ((emp.id == 1184) ? 17 : 15);
                            outM = 30;
                        }
                    }

                    var tD = (emp.date_of_join) ? new Date(emp.date_of_join) : new Date();
                    var tDY = tD.getFullYear();
                    var tDM = tD.getMonth() + 1;
                    var tDD = tD.getDate();
                    var tDYMD = tDY + '-' + tDM + '-' + tDD;
                    var InStatus = (emp.attendance[YMD].officeIn.flag) ?
                        (
                            (emp.attendance[YMD].officeIn.h <= inH) ?
                            (
                                (emp.attendance[YMD].officeIn.h == inH && emp.attendance[YMD].officeIn.m > inM) ?
                                'L' :
                                'P'
                            ) :
                            'L'
                        ) :
                        'A';
                    var OutStatus = (emp.attendance[YMD].officeOut.flag) ?
                        (
                            (emp.attendance[YMD].officeOut.h >= outH) ?
                            (
                                (emp.attendance[YMD].officeOut.h == outH && emp.attendance[YMD].officeOut.m < outM) ?
                                'L' :
                                'P'
                            ) :
                            'L'
                        ) :
                        'A';
                    var empStatus = (InStatus == 'P' && OutStatus == 'P') ?
                        'P' :
                        (
                            (
                                (InStatus == 'P' && (OutStatus == 'L' || OutStatus == 'A')) ||
                                ((InStatus == 'L' || InStatus == 'A') && OutStatus == 'P') ||
                                (InStatus == 'L' && OutStatus == 'A') ||
                                (InStatus == 'A' && OutStatus == 'L') ||
                                (InStatus == 'L' && OutStatus == 'L')
                            ) ?
                            'L' :
                            'A'
                        );
                    var cDate = addLeadingZero(2, parseInt(D)) + '-' + mthCPNames[M - 1] + '-' + Y;
                    var officeIn = emp.attendance[YMD].officeIn.time + ' (' + InStatus + ')';
                    var lunchOut = emp.attendance[YMD].lunchOut.time;
                    var lunchIn = emp.attendance[YMD].lunchIn.time;
                    var officeOut = emp.attendance[YMD].officeOut.time + ' (' + OutStatus + ')';
                    if (emp.attendance[YMD].leave) {
                        officeIn = emp.attendance[YMD].leaveType;
                        lunchOut = emp.attendance[YMD].leaveType;
                        lunchIn = emp.attendance[YMD].leaveType;
                        officeOut = emp.attendance[YMD].leaveType;
                        empStatus = emp.attendance[YMD].leaveName;
                        //OT=emp.attendance[YMD].leaveName;
                        leave++;
                    } else if (!emp.attendance[YMD].adjust) {
                        if (emp.attendance[YMD].holiday) {
                            if (emp.attendance[YMD].payable) {
                                if (Y == tDY && M == tDM && D < tDD) {
                                    officeIn = 'ABSENT';
                                    lunchOut = 'ABSENT';
                                    lunchIn = 'ABSENT';
                                    officeOut = 'ABSENT';
                                    empStatus = 'A';
                                    //OT='A';
                                    absent++;
                                } else {
                                    officeIn += ' (HOLIDAY)';
                                    lunchOut += ' (HOLIDAY)';
                                    lunchIn += ' (HOLIDAY)';
                                    officeOut += ' (HOLIDAY)';
                                    empStatus = 'H';
                                    //OT='H';
                                    holiday++;
                                }
                            } else {
                                officeIn = 'ABSENT';
                                lunchOut = 'ABSENT';
                                lunchIn = 'ABSENT';
                                officeOut = 'ABSENT';
                                empStatus = 'A';
                                //OT='A';
                                absent++;
                            }
                        } else {
                            if (emp.attendance[YMD].weekend) {
                                if (emp.attendance[YMD].payable) {
                                    if (Y == tDY && M == tDM && D < tDD) {
                                        officeIn = 'ABSENT';
                                        lunchOut = 'ABSENT';
                                        lunchIn = 'ABSENT';
                                        officeOut = 'ABSENT';
                                        empStatus = 'A';
                                        //OT='A';
                                        absent++;
                                    } else {
                                        officeIn += ' (WEEKEND)';
                                        lunchOut += ' (WEEKEND)';
                                        lunchIn += ' (WEEKEND)';
                                        officeOut += ' (WEEKEND)';
                                        empStatus = 'W';
                                        //OT='W';
                                        weekend++;
                                    }
                                } else {
                                    officeIn = 'ABSENT';
                                    lunchOut = 'ABSENT';
                                    lunchIn = 'ABSENT';
                                    officeOut = 'ABSENT';
                                    empStatus = 'A';
                                    //OT='A';
                                    absent++;
                                }
                            } else {
                                if (empStatus == 'A') {
                                    officeIn = 'ABSENT';
                                    lunchOut = 'ABSENT';
                                    lunchIn = 'ABSENT';
                                    officeOut = 'ABSENT';
                                    empStatus = 'A';
                                    //OT='A';
                                    absent++;
                                }
                            }
                        }
                    } else {
                        if (empStatus == 'A') {
                            officeIn = 'ABSENT';
                            lunchOut = 'ABSENT';
                            lunchIn = 'ABSENT';
                            officeOut = 'ABSENT';
                            empStatus = 'A';
                            //OT='A';
                            absent++;
                        }
                    }
                    if (empStatus == 'P') {
                        present++;
                    } else if (empStatus == 'L') {
                        if (InStatus == 'L' || InStatus == 'A') {
                            inLate++;
                        }
                        if (OutStatus == 'L' || OutStatus == 'A') {
                            outLate++;
                        }
                        late++;
                    }
                    var OT = (empStatus == 'H' || empStatus == 'W') ? '00 H' : addLeadingZero(2, parseInt(emp.attendance[YMD].overTime)) + ' H';
                    var EOT = (empStatus == 'H' || empStatus == 'W') ? emp.attendance[YMD].workingHour : emp.attendance[YMD].excessOverTime;
                    EOT = addLeadingZero(2, parseInt(EOT)) + ' H';

                    gridData += '<tr>' +
                        '<td align="center">' +
                        cDate +
                        '</td>' +
                        '<td align="center">' +
                        officeIn +
                        '</td>' +
                        '<td align="center">' +
                        lunchOut +
                        '</td>' +
                        '<td align="center">' +
                        lunchIn +
                        '</td>' +
                        '<td align="center">' +
                        officeOut +
                        '</td>' +
                        '<td align="center">' +
                        OT +
                        '</td>' +
                        '<td align="center">' +
                        EOT +
                        '</td>' +
                        '<td align="center">' +
                        empStatus +
                        '</td>' +
                        '</tr>';
                    overTime += (empStatus == 'P' || empStatus == 'L') ? emp.attendance[YMD].overTime : 0;
                    excessOverTime += (empStatus == 'H' || empStatus == 'W') ? emp.attendance[YMD].workingHour : emp.attendance[YMD].excessOverTime;
                    cb_day()
                }, function(err) {
                    gridData += '<tr>' +
                        '<td align="right" colspan="5">' +
                        '<b>' +
                        'TOTAL = ' +
                        '</b>' +
                        '</td>' +
                        '<td align="center"><b>' +
                        addLeadingZero(2, parseInt(overTime)) +
                        ' H</b></td>' +
                        '<td align="center"><b>' +
                        addLeadingZero(2, parseInt(excessOverTime)) +
                        ' H</b></td>' +
                        '<td align="center">' +
                        '</td>' +
                        '</tr>' +
                        '</table><br />' +
                        '</div></body></html>';
                    cb_emp();
                });
            }, function(err) {
                htmlData += '<table style="width:100%;">' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>NAME </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + name + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>EMPLOYEE ID </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + fp + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>PRESENT </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, present) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>DEPARTMENT </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + department + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>SECTION </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + section + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>ABSENT </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, absent) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>DESIGNATION </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + designation + '</b>' +
                    '</td>' +
                    ///////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>JOINING DATE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + joinDate + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>LATE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, late) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                    '<b>IN LATE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                    '<b>: ' + addLeadingZero(2, inLate) + ' ( Absent For Late : ' +
                    addLeadingZero(2, parseInt(inLate / 3)) + ' )</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>HOLIDAY </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, holiday) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                    '<b>OUT LATE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                    '<b>: ' + addLeadingZero(2, outLate) + ' ( Absent For Late : ' +
                    addLeadingZero(2, parseInt(outLate / 3)) + ' )</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>WEEKEND </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, weekend) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                    '<b>TOTAL LATE </b>' +
                    '</td>' +
                    '<td style="background:Gainsboro;border-left: 0px solid Gainsboro;border-right: 0px solid Gainsboro;">' +
                    '<b>: ' + addLeadingZero(2, (inLate + outLate)) + ' ( Absent For Late : ' +
                    addLeadingZero(2, (parseInt(inLate / 3) + parseInt(outLate / 3))) + ' )</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>LEAVE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, leave) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>TOTAL </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border-left: 0px solid white;border-right: 0px solid white;border-bottom: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, absent + present + late + holiday + weekend + leave) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    '</table>';
                htmlData += gridData;
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadEmployeeMonthlyAttendance", 'success');
                });
            });
        });
    });

    socket.on('DownloadComplianceEmployeeMonthlyAttendanceV2', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        d.setDate(10);
        var dayArray = dayArrayFunc(d.monthDays());
        var rangeMArray = rangeMArrayFunc(d);
        var options = {};
        getComplianceEmployeeMonthAttendance(db, QUERY, function(empData) {
            var htmlData =
                '<!DOCTYPE html><body>' +
                dailyReportHead() +
                '<div id="pageBody">' +
                '<table style="width:100%">' +
                '<tr>' +
                '<td rowspan="2" align="center">' +
                '<b>' +
                'EMPLOYEE ATTENDANCE REPORT ' +
                monthCapitalNames[d.getMonth()] + ', ' +
                d.getUTCFullYear() +
                '</b>' +
                '</td>' +
                '</tr>' +
                '</table>';
            var gridData = '';
            var present = 0;
            var absent = 0;
            var late = 0;
            var holiday = 0;
            var weekend = 0;
            var leave = 0;
            var inLate = 0;
            var outLate = 0;
            var fp = addLeadingZero(9, QUERY.id);
            var name = '';
            var joinDate = '';
            var department = '';
            var section = '';
            var designation = '';
            async.each(empData, function(emp, cb_emp) {
                name = emp.name;
                joinDate = emp.date_of_join.formatFullDate();
                department = emp.departmentName;
                section = emp.sectionName;
                designation = emp.designationName;
                options = {
                    format: 'Letter',
                    header: {
                        height: "27mm",
                        contents: headerContents() +
                            '<h4 style="' +
                            'line-height: 0;' +
                            '">MONTHLY ATTENDANCE REPORT</h4>' +
                            '<h6 style="line-height: 0;">' +
                            emp.name + ' | ' +
                            monthCapitalNames[d.getMonth()] + ', ' +
                            d.getUTCFullYear() +
                            '</h6>'
                    },
                    footer: {
                        height: "15mm",
                        contents: footerContents()
                    },
                };
                var overTime = 0;
                var excessOverTime = 0;
                var workInTime = emp.workInTime.split(":");
                var workOutTime = emp.workOutTime.split(":");
                var inH = parseInt(workInTime[0]);
                var inM = parseInt(workInTime[1]);
                var outH = parseInt(workOutTime[0]);
                var outM = parseInt(workOutTime[1]);
                gridData += '<table style="width:100%">' +
                    '<tr>' +
                    '<th>DATE</th>' +
                    '<th>OFFICE IN</th>' +
                    '<th>LUNCH OUT</th>' +
                    '<th>LUNCH IN</th>' +
                    '<th>OFFICE OUT</th>' +
                    '<th>OT (H)</th>' +
                    '<th>STATUS</th>' +
                    '</tr>';
                async.each(rangeMArray, function(YMD, cb_day) {
                    var dr = new Date(YMD);
                    var Y = dr.getFullYear();
                    var M = dr.getMonth() + 1;
                    var D = dr.getDate();
                    inH = parseInt(workInTime[0]);
                    outH = parseInt(workOutTime[0]);
                    outM = parseInt(workOutTime[1]);

                    var tD = (emp.date_of_join) ? new Date(emp.date_of_join) : new Date();
                    var tDY = tD.getFullYear();
                    var tDM = tD.getMonth() + 1;
                    var tDD = tD.getDate();
                    var tDYMD = tDY + '-' + tDM + '-' + tDD;
                    var ComOutTime = (emp.sectionName == 'LOAD-UNLOAD' || emp.sectionName == 'SECURITY') ? '05:0' + (Math.floor(Math.random() * 9) + 0) + ' PM' : '07:0' + (Math.floor(Math.random() * 9) + 0) + ' PM';
                    var OffOutTime = (emp.attendance[YMD].officeOut.h > 18) ? ComOutTime : (emp.attendance[YMD].officeOut.h == 18) ? ComOutTime : emp.attendance[YMD].officeOut.time;
                    var InStatus = (emp.attendance[YMD].officeIn.flag) ? 'P' : 'A';
                    var OutStatus = (emp.attendance[YMD].officeOut.flag) ? 'P' : 'A';
                    var empStatus = (InStatus == 'P' && OutStatus == 'P') ?
                        'P' :
                        (
                            (
                                (InStatus == 'P' && (OutStatus == 'L' || OutStatus == 'A')) ||
                                ((InStatus == 'L' || InStatus == 'A') && OutStatus == 'P') ||
                                (InStatus == 'L' && OutStatus == 'A') ||
                                (InStatus == 'A' && OutStatus == 'L') ||
                                (InStatus == 'L' && OutStatus == 'L')
                            ) ?
                            'L' :
                            'A'
                        );
                    // var cDate = YMD;
                    var cDate = addLeadingZero(2, parseInt(D)) + '-' + mthCPNames[M - 1] + '-' + Y;
                    var officeIn = emp.attendance[YMD].officeIn.time + ' (' + InStatus + ')';
                    var lunchOut = emp.attendance[YMD].lunchOut.time;
                    var lunchIn = emp.attendance[YMD].lunchIn.time;
                    var officeOut = OffOutTime + ' (' + OutStatus + ')';
                    if (emp.attendance[YMD].leave) {
                        officeIn = emp.attendance[YMD].leaveType;
                        lunchOut = emp.attendance[YMD].leaveType;
                        lunchIn = emp.attendance[YMD].leaveType;
                        officeOut = emp.attendance[YMD].leaveType;
                        empStatus = emp.attendance[YMD].leaveName;
                        //OT=emp.attendance[YMD].leaveName;
                        leave++;
                    } else if (!emp.attendance[YMD].adjust) {
                        if (emp.attendance[YMD].holiday) {
                            if (emp.attendance[YMD].payable) {
                                if (Y == tDY && M == tDM && D < tDD) {
                                    officeIn = 'ABSENT';
                                    lunchOut = 'ABSENT';
                                    lunchIn = 'ABSENT';
                                    officeOut = 'ABSENT';
                                    empStatus = 'A';
                                    //OT='A';
                                    absent++;
                                } else {
                                    officeIn += ' (HOLIDAY)';
                                    lunchOut += ' (HOLIDAY)';
                                    lunchIn += ' (HOLIDAY)';
                                    officeOut += ' (HOLIDAY)';
                                    empStatus = 'H';
                                    //OT='H';
                                    holiday++;
                                }
                            } else {
                                officeIn = 'ABSENT';
                                lunchOut = 'ABSENT';
                                lunchIn = 'ABSENT';
                                officeOut = 'ABSENT';
                                empStatus = 'A';
                                //OT='A';
                                absent++;
                            }
                        } else {
                            if (emp.attendance[YMD].weekend) {
                                if (emp.attendance[YMD].payable) {
                                    if (Y == tDY && M == tDM && D < tDD) {
                                        officeIn = 'ABSENT';
                                        lunchOut = 'ABSENT';
                                        lunchIn = 'ABSENT';
                                        officeOut = 'ABSENT';
                                        empStatus = 'A';
                                        //OT='A';
                                        absent++;
                                    } else {
                                        officeIn += ' (WEEKEND)';
                                        lunchOut += ' (WEEKEND)';
                                        lunchIn += ' (WEEKEND)';
                                        officeOut += ' (WEEKEND)';
                                        empStatus = 'W';
                                        //OT='W';
                                        weekend++;
                                    }
                                } else {
                                    officeIn = 'ABSENT';
                                    lunchOut = 'ABSENT';
                                    lunchIn = 'ABSENT';
                                    officeOut = 'ABSENT';
                                    empStatus = 'A';
                                    //OT='A';
                                    absent++;
                                }
                            } else {
                                if (empStatus == 'A') {
                                    officeIn = 'ABSENT';
                                    lunchOut = 'ABSENT';
                                    lunchIn = 'ABSENT';
                                    officeOut = 'ABSENT';
                                    empStatus = 'A';
                                    //OT='A';
                                    absent++;
                                }
                            }
                        }
                    } else {
                        if (empStatus == 'A') {
                            officeIn = 'ABSENT';
                            lunchOut = 'ABSENT';
                            lunchIn = 'ABSENT';
                            officeOut = 'ABSENT';
                            empStatus = 'A';
                            //OT='A';
                            absent++;
                        }
                    }
                    if (empStatus == 'P') {
                        present++;
                    } else if (empStatus == 'L') {
                        if (InStatus == 'L' || InStatus == 'A') {
                            inLate++;
                        }
                        if (OutStatus == 'L' || OutStatus == 'A') {
                            outLate++;
                        }
                        late++;
                    }
                    var OT = (empStatus == 'H' || empStatus == 'W') ? '00 H' : addLeadingZero(2, parseInt(emp.attendance[YMD].overTime)) + ' H';
                    var EOT = (empStatus == 'H' || empStatus == 'W') ? emp.attendance[YMD].workingHour : emp.attendance[YMD].excessOverTime;
                    EOT = addLeadingZero(2, parseInt(EOT)) + ' H';

                    gridData += '<tr>' +
                        '<td align="center">' +
                        cDate +
                        '</td>' +
                        '<td align="center">' +
                        officeIn +
                        '</td>' +
                        '<td align="center">' +
                        lunchOut +
                        '</td>' +
                        '<td align="center">' +
                        lunchIn +
                        '</td>' +
                        '<td align="center">' +
                        officeOut +
                        '</td>' +
                        '<td align="center">' +
                        OT +
                        '</td>' +
                        '<td align="center">' +
                        empStatus +
                        '</td>' +
                        '</tr>';
                    overTime += (empStatus == 'P' || empStatus == 'L') ? emp.attendance[YMD].overTime : 0;
                    cb_day()
                }, function(err) {
                    gridData += '<tr>' +
                        '<td align="right" colspan="5">' +
                        '<b>' +
                        'TOTAL = ' +
                        '</b>' +
                        '</td>' +
                        '<td align="center"><b>' +
                        addLeadingZero(2, parseInt(overTime)) +
                        ' H</b></td>' +
                        '<td align="center">' +
                        '</td>' +
                        '</tr>' +
                        '</table><br />' +
                        '</div></body></html>';
                    cb_emp();
                });
            }, function(err) {
                htmlData += '<table style="width:100%;">' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>NAME </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + name + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>EMPLOYEE ID </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + fp + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>PRESENT </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, present) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>DEPARTMENT </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + department + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>SECTION </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + section + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>ABSENT </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, absent) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>DESIGNATION </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + designation + '</b>' +
                    '</td>' +
                    ///////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>JOINING DATE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + joinDate + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>LATE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, late) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>HOLIDAY </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, holiday) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>WEEKEND </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, weekend) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>LEAVE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, leave) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>TOTAL </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border-left: 0px solid white;border-right: 0px solid white;border-bottom: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, absent + present + late + holiday + weekend + leave) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    '</table>';
                htmlData += gridData;
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadComplianceEmployeeMonthlyAttendanceV2", 'success');
                });
            });
        });
    });

    socket.on('ComplianceEmployeeMonthlyAttendance', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var dayArray = dayArrayFunc(d.monthDays());
        var rangeMArray = rangeMArrayFunc(d);
        var options = {};
        getComplianceEmployeeMonthAttendance(db, QUERY, function(empData) {
            var htmlData =
                '<!DOCTYPE html><body>' +
                dailyReportHead() +
                '<div id="pageBody">' +
                '<table style="width:100%">' +
                '<tr>' +
                '<td rowspan="2" align="center">' +
                '<b>' +
                'EMPLOYEE ATTENDANCE REPORT ' +
                monthCapitalNames[d.getMonth()] + ', ' +
                d.getUTCFullYear() +
                '</b>' +
                '</td>' +
                '</tr>' +
                '</table>';
            var gridData = '';
            var present = 0;
            var absent = 0;
            var late = 0;
            var holiday = 0;
            var weekend = 0;
            var leave = 0;
            var inLate = 0;
            var outLate = 0;
            var fp = addLeadingZero(9, QUERY.id);
            var name = '';
            var joinDate = '';
            var department = '';
            var section = '';
            var designation = '';
            async.each(empData, function(emp, cb_emp) {
                name = emp.name;
                joinDate = emp.date_of_join.formatFullDate();
                department = emp.departmentName;
                section = emp.sectionName;
                designation = emp.designationName;
                options = {
                    format: 'Letter',
                    header: {
                        height: "27mm",
                        contents: headerContents() +
                            '<h4 style="' +
                            'line-height: 0;' +
                            '">MONTHLY ATTENDANCE REPORT</h4>' +
                            '<h6 style="line-height: 0;">' +
                            emp.name + ' | ' +
                            monthCapitalNames[d.getMonth()] + ', ' +
                            d.getUTCFullYear() +
                            '</h6>'
                    },
                    footer: {
                        height: "15mm",
                        contents: footerContents()
                    },
                };
                var overTime = 0;
                var excessOverTime = 0;
                var workInTime = emp.workInTime.split(":");
                var workOutTime = emp.workOutTime.split(":");
                var inH = parseInt(workInTime[0]);
                var outH = parseInt(workOutTime[0]);
                gridData += '<table style="width:100%">' +
                    '<tr>' +
                    '<th>DATE</th>' +
                    '<th>OFFICE IN</th>' +
                    '<th>LUNCH OUT</th>' +
                    '<th>LUNCH IN</th>' +
                    '<th>OFFICE OUT</th>' +
                    '<th>OT (H)</th>' +
                    '<th>STATUS</th>' +
                    '</tr>';
                async.each(dayArray, function(day, cb_day) {
                    d.setDate(day);
                    var Y = d.getFullYear();
                    var M = d.getMonth() + 1;
                    var D = d.getDate();
                    var YMD = Y + '-' + M + '-' + D;

                    var ComOutTime = (emp.sectionName == 'LOAD-UNLOAD' || emp.sectionName == 'SECURITY') ? '05:0' + (Math.floor(Math.random() * 9) + 0) + ' PM' : '07:0' + (Math.floor(Math.random() * 9) + 0) + ' PM';
                    var OffOutTime = (emp.attendance[YMD].officeOut.h > 18) ? ComOutTime : (emp.attendance[YMD].officeOut.h == 18) ? ComOutTime : emp.attendance[YMD].officeOut.time;
                    var InStatus = (emp.attendance[YMD].officeIn.flag) ? 'P' : 'A';
                    var OutStatus = (emp.attendance[YMD].officeOut.flag) ? 'P' : 'A';
                    var empStatus = (InStatus == 'P' && OutStatus == 'P') ?
                        'P' :
                        (
                            (
                                (InStatus == 'P' && (OutStatus == 'L' || OutStatus == 'A')) ||
                                ((InStatus == 'L' || InStatus == 'A') && OutStatus == 'P') ||
                                (InStatus == 'L' && OutStatus == 'A') ||
                                (InStatus == 'A' && OutStatus == 'L') ||
                                (InStatus == 'L' && OutStatus == 'L')
                            ) ?
                            'L' :
                            'A'
                        );
                    var cDate = addLeadingZero(2, parseInt(D)) + '-' + mthCPNames[M - 1] + '-' + Y;
                    var officeIn = emp.attendance[YMD].officeIn.time + ' (' + InStatus + ')';
                    var lunchOut = emp.attendance[YMD].lunchOut.time;
                    var lunchIn = emp.attendance[YMD].lunchIn.time;
                    var officeOut = OffOutTime + ' (' + OutStatus + ')';
                    if (emp.attendance[YMD].leave) {
                        officeIn = emp.attendance[YMD].leaveType;
                        lunchOut = emp.attendance[YMD].leaveType;
                        lunchIn = emp.attendance[YMD].leaveType;
                        officeOut = emp.attendance[YMD].leaveType;
                        empStatus = emp.attendance[YMD].leaveName;
                        //OT=emp.attendance[YMD].leaveName;
                        leave++;
                    } else if (!emp.attendance[YMD].adjust) {
                        if (emp.attendance[YMD].holiday) {
                            if (emp.attendance[YMD].payable) {
                                officeIn = 'HOLIDAY';
                                lunchOut = 'HOLIDAY';
                                lunchIn = 'HOLIDAY';
                                officeOut = 'HOLIDAY';
                                empStatus = 'H';
                                //OT='H';
                                holiday++;
                            } else {
                                officeIn = 'ABSENT';
                                lunchOut = 'ABSENT';
                                lunchIn = 'ABSENT';
                                officeOut = 'ABSENT';
                                empStatus = 'A';
                                //OT='A';
                                absent++;
                            }
                        } else {
                            if (emp.attendance[YMD].weekend) {
                                if (emp.attendance[YMD].payable) {
                                    officeIn = 'WEEKEND';
                                    lunchOut = 'WEEKEND';
                                    lunchIn = 'WEEKEND';
                                    officeOut = 'WEEKEND';
                                    empStatus = 'W';
                                    //OT='W';
                                    weekend++;
                                } else {
                                    officeIn = 'ABSENT';
                                    lunchOut = 'ABSENT';
                                    lunchIn = 'ABSENT';
                                    officeOut = 'ABSENT';
                                    empStatus = 'A';
                                    //OT='A';
                                    absent++;
                                }
                            } else {
                                if (empStatus == 'A') {
                                    officeIn = 'ABSENT';
                                    lunchOut = 'ABSENT';
                                    lunchIn = 'ABSENT';
                                    officeOut = 'ABSENT';
                                    empStatus = 'A';
                                    //OT='A';
                                    absent++;
                                }
                            }
                        }
                    } else {
                        if (empStatus == 'A') {
                            officeIn = 'ABSENT';
                            lunchOut = 'ABSENT';
                            lunchIn = 'ABSENT';
                            officeOut = 'ABSENT';
                            empStatus = 'A';
                            //OT='A';
                            absent++;
                        }
                    }
                    if (empStatus == 'P') {
                        present++;
                    } else if (empStatus == 'L') {
                        if (InStatus == 'L' || InStatus == 'A') {
                            inLate++;
                        }
                        if (OutStatus == 'L' || OutStatus == 'A') {
                            outLate++;
                        }
                        late++;
                    }
                    var OT = (empStatus == 'W' || empStatus == 'H') ? empStatus : addLeadingZero(2, parseInt(emp.attendance[YMD].overTime)) + ' H';

                    gridData += '<tr>' +
                        '<td align="center">' +
                        cDate +
                        '</td>' +
                        '<td align="center">' +
                        officeIn +
                        '</td>' +
                        '<td align="center">' +
                        lunchOut +
                        '</td>' +
                        '<td align="center">' +
                        lunchIn +
                        '</td>' +
                        '<td align="center">' +
                        officeOut +
                        '</td>' +
                        '<td align="center">' +
                        OT +
                        '</td>' +
                        '<td align="center">' +
                        empStatus +
                        '</td>' +
                        '</tr>';
                    overTime += ((empStatus == 'P' || empStatus == 'L') && (empStatus != 'W' || empStatus != 'H')) ? emp.attendance[YMD].overTime : 0;
                    cb_day()
                }, function(err) {
                    gridData += '<tr>' +
                        '<td align="right" colspan="5">' +
                        '<b>' +
                        'TOTAL = ' +
                        '</b>' +
                        '</td>' +
                        '<td align="center"><b>' +
                        addLeadingZero(2, parseInt(overTime)) +
                        ' H</b></td>' +
                        '<td align="center">' +
                        '</td>' +
                        '</tr>' +
                        '</table><br />' +
                        '</div></body></html>';
                    cb_emp();
                });
            }, function(err) {
                htmlData += '<table style="width:100%;">' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>NAME </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + name + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>EMPLOYEE ID </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + fp + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>PRESENT </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, present) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>DEPARTMENT </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + department + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>SECTION </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + section + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>ABSENT </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, absent) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>DESIGNATION </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + designation + '</b>' +
                    '</td>' +
                    ///////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>JOINING DATE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + joinDate + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>LATE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, late) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>HOLIDAY </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, holiday) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>WEEKEND </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, weekend) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;></td>' +
                    '<td style="border: 0px solid white;></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>LEAVE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, leave) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>TOTAL </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border-left: 0px solid white;border-right: 0px solid white;border-bottom: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, absent + present + late + holiday + weekend + leave) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    '</table>';
                htmlData += gridData;
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("ComplianceEmployeeMonthlyAttendance", 'success');
                });
            });
        });
    });

    socket.on('DownloadDailyAttendanceReportPDF', function(values) {
        var ms = (values.date != '') ? new Date(values.date) : new Date();
        var htmlData = '<!DOCTYPE html><head><meta lang="bn" http-equiv="Content-Type" content="application/xhtml+xml; charset=UTF-8" /><?xml version="1.0" encoding="UTF-8"?></head><body>' + dailyReportHead();
        var totalOverView = '<table style="width:100%;font-size: 11px;padding:5px;margin:5px;" border=2>' +
            '<tr>' +
            '<th>DEPARTMENT</th>' +
            '<th>SECTION</th>' +
            '<th style="padding:0px;">P<small><small><small>RESENT</small></small></small></th>' +
            '<th style="padding:0px;">I<small><small><small>N</small></small></small> L<small><small><small>ATE</small></small></small></th>' +
            '<th style="padding:0px;">O<small><small><small>UT</small></small></small> L<small><small><small>ATE</small></small></small></th>' +
            '<th>L<small><small><small>ATE</small></small></small></th>' +
            '<th style="padding:0px;">ATT<small><small><small>END</small></small></small></th>' +
            '<th style="padding:0px;">A<small><small><small>BSENT</small></small></small></th>' +
            '<th>T<small><small><small>OTAL</small></small></small></th>' +
            '</tr>';
        var totalPresent = 0;
        var totalAbsent = 0;
        var totalInLate = 0;
        var totalOutLate = 0;
        var totalLate = 0;
        var grandTotal = 0;
        var secSearch = {};
        if (values.department != '')
            secSearch.department = values.department;
        else if (values.section != '')
            secSearch.id = values.section;
        getSection(db, secSearch, function(secList) {
            secList.sort(function(a, b) {
                var o1 = a.department;
                var o2 = b.department;

                // var p1 = a.id;
                // var p2 = b.id;

                if (o1 < o2) return -1;
                if (o1 > o2) return 1;
                // if (p1 < p2) return -1;
                // if (p1 > p2) return 1;
                return 0;
            });
            async.each(secList, function(sec, cb_sec) {
                values.section = sec.id;
                var tmpHtmlData = '';
                var present = 0;
                var absent = 0;
                var inLate = 0;
                var outLate = 0;
                var late = 0;
                var total = 0;
                var eFSearch = {};
                eFSearch.section = sec.id;
                eFSearch.status = [1, 2];
                eFSearch.date = new Date(ms);
                if (values.employee_type != '')
                    eFSearch.employee_type = values.employee_type;
                if (values.attendance_type != '')
                    eFSearch.attendance_type = values.attendance_type;
                var flag = 0;
                tmpHtmlData += '<table style="width:100%">' +
                    '<tr>' +
                    '<th>FP ID</th>' +
                    '<th><small>CARD</small></th>' +
                    '<th>EMPLOYEE NAME</th>' +
                    '<th>DESIGNATION</th>' +
                    '<th><small><small>LAST DAY OUT</small></small></th>' +
                    '<th><small>OFFICE IN</small></th>' +
                    '<th><small>LUNCH OUT</small></th>' +
                    '<th><small>LUNCH IN</small></th>' +
                    '<th><small>OFFICE OUT</small></th>' +
                    '<th><small><small>STATUS</small></small></th>' +
                    '</tr>';
                getEmployeeDayAttendance(db, eFSearch, function(empList) {
                    empList.sort(function(a, b) {
                        if (a.id < b.id)
                            return -1;
                        if (a.id > b.id)
                            return 1;
                        return 0;
                    });
                    async.each(empList, function(emp, cb_emp) {
                        var workInTime = emp.workInTime.split(":");;
                        var workOutTime = emp.workOutTime.split(":");;
                        var inH = parseInt(workInTime[0]);
                        var inM = parseInt(workInTime[1]);
                        var outH = parseInt(workOutTime[0]);

                        var InStatus = (emp.officeIn.flag) ?
                            (
                                (emp.officeIn.h <= inH) ?
                                (
                                    (emp.officeIn.h == inH && emp.officeIn.m > 0) ?
                                    'L' :
                                    'P'
                                ) :
                                'L'
                            ) :
                            'A';
                        var OutStatus = (emp.officeOut.flag) ? ((emp.officeOut.h >= outH) ? 'P' : 'L') : 'A';
                        var empStatus = (InStatus == 'P' && OutStatus == 'P') ?
                            'P' :
                            ((
                                    (InStatus == 'P' && (OutStatus == 'L' || OutStatus == 'A')) ||
                                    ((InStatus == 'L' || InStatus == 'A') && OutStatus == 'P') ||
                                    (InStatus == 'L' && OutStatus == 'A') ||
                                    (InStatus == 'A' && OutStatus == 'L') ||
                                    (InStatus == 'L' && OutStatus == 'L')
                                ) ?
                                'L' :
                                'A');
                        if (empStatus == 'A')
                            absent++;
                        if (empStatus == 'P')
                            present++;
                        if (empStatus == 'L')
                            late++;
                        if ((InStatus == 'L' || InStatus == 'A') && empStatus == 'L')
                            inLate++;
                        if ((OutStatus == 'L' || OutStatus == 'A') && empStatus == 'L')
                            outLate++;
                        if (emp.id)
                            flag = 1;
                        var empHTMLData = '<tr' +
                            ((emp.attendanceStatus == 'A') ? ' style="background-color:#DDD;"' : '') + '>' +
                            '<td align="center">' +
                            addLeadingZero(9, parseInt(emp.id)) +
                            '</td>' +
                            '<td align="left">' +
                            emp.card_no +
                            '</td>' +
                            '<td align="left">' +
                            emp.name +
                            '</td>' +
                            '<td align="left">' +
                            emp.designationName +
                            '</td>' +
                            '<td align="center">' +
                            emp.lastDayOut.time +
                            ((emp.lastDayOut.flag) ? ((emp.lastDayOut.h >= outH) ? ' (P)' : ' (L)') : ' (A)') +
                            '</td>' +
                            '<td align="center">' +
                            emp.officeIn.time +
                            ((emp.officeIn.flag) ? (
                                    (emp.officeIn.h < inH) ?
                                    ' (P)' :
                                    (
                                        (emp.officeIn.h == inH && emp.officeIn.m == inM) ?
                                        ' (P)' :
                                        ' (L)'
                                    )
                                ) :
                                ' (A)') +
                            '</td>' +
                            '<td align="center">' +
                            emp.lunchOut.time +
                            ((emp.lunchOut.flag) ? ' (P)' : ' (A)') +
                            '</td>' +
                            '<td align="center">' +
                            emp.lunchIn.time +
                            ((emp.lunchIn.flag) ? ' (P)' : ' (A)') +
                            '</td>' +
                            '<td align="center">' +
                            emp.officeOut.time +
                            ((emp.officeOut.flag) ? ((emp.officeOut.h >= outH) ? ' (P)' : ' (L)') : ' (A)') +
                            '</td>' +
                            '<td align="center">' +
                            empStatus +
                            '</td>' +
                            '</tr>';

                        if (values.attendance_type) {
                            if (values.attendance_type == 'PRESENT') {
                                if (empStatus != 'A') {
                                    if (values.attendance_period == 'BOTH') {
                                        tmpHtmlData += empHTMLData;
                                    }
                                    if (values.attendance_period == 'IN TIME') {
                                        if (InStatus != 'A') {
                                            tmpHtmlData += empHTMLData;
                                        }
                                    }
                                    if (values.attendance_period == 'OUT TIME') {
                                        if (OutStatus != 'A') {
                                            tmpHtmlData += empHTMLData;
                                        }
                                    }
                                }
                            } else if (values.attendance_type == 'ABSENT') {
                                if (empStatus == 'A' && values.attendance_period == 'BOTH') {
                                    tmpHtmlData += empHTMLData;
                                }
                                if (InStatus == 'A' && values.attendance_period == 'IN TIME') {
                                    tmpHtmlData += empHTMLData;
                                }
                                if (OutStatus == 'A' && values.attendance_period == 'OUT TIME') {
                                    tmpHtmlData += empHTMLData;
                                }
                            } else if (values.attendance_type == 'LATE') {
                                if (empStatus == 'L' && values.attendance_period == 'BOTH') {
                                    tmpHtmlData += empHTMLData;
                                }
                                if (InStatus == 'L' && values.attendance_period == 'IN TIME') {
                                    tmpHtmlData += empHTMLData;
                                }
                                if (OutStatus == 'L' && values.attendance_period == 'OUT TIME') {
                                    tmpHtmlData += empHTMLData;
                                }
                            } else {
                                tmpHtmlData += empHTMLData;
                            }
                        } else {
                            tmpHtmlData += empHTMLData;
                        }
                        cb_emp();
                    }, function(err) {
                        total = present + absent + late;
                        totalPresent += present;
                        totalAbsent += absent;
                        totalInLate += inLate;
                        totalOutLate += outLate;
                        totalLate += late;
                        grandTotal += total;
                        tmpHtmlData += '</table></div>';
                        var tmpHtmlHead = '<div id="pageBody">' +
                            '<table style="width:100%">' +
                            '<tr>' +
                            '<td style="border: 0px solid white;width:100px"><b>SECTION </b></td>' +
                            '<td style="border: 0px solid white;"> : ' +
                            sec.name +
                            '</td>' +
                            '<td style="border: 0px solid white;width:60px"><small>PRESENT:</small></td>' +
                            '<td style="border: 0px solid white;width:60px">' +
                            addLeadingZero(2, present) +
                            '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td style="border: 0px solid white;"><b>DEPARTMENT </b></td>' +
                            '<td style="border: 0px solid white;"> : ' +
                            sec.department +
                            '</td>' +
                            '<td style="border: 0px solid white;"><small>ABSENT:</small></td>' +
                            '<td style="border: 0px solid white;">' +
                            addLeadingZero(2, absent) +
                            '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td style="border: 0px solid white;"></td>' +
                            '<td style="border: 0px solid white;"></td>' +
                            '<td style="border: 0px solid white;"><small>LATE:</small></td>' +
                            '<td style="border: 0px solid white;">' +
                            addLeadingZero(2, inLate) +
                            '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td style="border: 0px solid white;"></td>' +
                            '<td style="border: 0px solid white;"></td>' +
                            '<td style="border: 0px solid white;"><small>LATE:</small></td>' +
                            '<td style="border: 0px solid white;">' +
                            addLeadingZero(2, outLate) +
                            '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td style="border: 0px solid white;"></td>' +
                            '<td style="border: 0px solid white;"></td>' +
                            '<td style="border: 0px solid white;"><small>LATE:</small></td>' +
                            '<td style="border: 0px solid white;">' +
                            addLeadingZero(2, late) +
                            '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td style="border: 0px solid white;"></td>' +
                            '<td style="border: 0px solid white;"></td>' +
                            '<td style="border-left: 0px solid white;border-right: 0px solid white;">' +
                            '<small>TOTAL:</small>' +
                            '</td>' +
                            '<td style="border-left: 0px solid white;border-right: 0px solid white;">' +
                            addLeadingZero(2, total) +
                            '</td>' +
                            '</tr>' +
                            '</table>';
                        totalOverView += '<tr>' +
                            '<td>' +
                            sec.department +
                            '</td>' +
                            '<td>' +
                            sec.name +
                            '</td>' +
                            '<td>' +
                            addLeadingZero(2, present) +
                            '</td>' +
                            '<td>' +
                            addLeadingZero(2, inLate) +
                            '</td>' +
                            '<td>' +
                            addLeadingZero(2, outLate) +
                            '</td>' +
                            '<td>' +
                            addLeadingZero(2, late) +
                            '</td>' +
                            '<td>' +
                            addLeadingZero(2, (present + late)) +
                            '</td>' +
                            '<td>' +
                            addLeadingZero(2, absent) +
                            '</td>' +
                            '<td>' +
                            addLeadingZero(2, total) +
                            '</td>' +
                            '</tr>';
                        if (flag) {
                            htmlData += tmpHtmlHead;
                            htmlData += tmpHtmlData;
                            flag = 0;
                        }
                        cb_sec();
                    });
                });
            }, function(err) {
                totalOverView += '<tr>' +
                    '<td colspan=2><b>TOTAL</b></td>' +
                    '<td><b>' +
                    addLeadingZero(2, totalPresent) +
                    '</td></b>' +
                    '<td><b>' +
                    addLeadingZero(2, totalInLate) +
                    '</td></b>' +
                    '<td><b>' +
                    addLeadingZero(2, totalOutLate) +
                    '</td></b>' +
                    '<td><b>' +
                    addLeadingZero(2, totalLate) +
                    '</td></b>' +
                    '<td><b>' +
                    addLeadingZero(2, (totalPresent + totalLate)) +
                    '</td></b>' +
                    '<td><b>' +
                    addLeadingZero(2, totalAbsent) +
                    '</td></b>' +
                    '<td><b>' +
                    addLeadingZero(2, grandTotal) +
                    '</td></b>' +
                    '</tr>' +
                    '</table>';
                var tFC = '<br />';
                tFC += '<table style="bottom:0;width:100%;border: 0px solid white;font-size: 12px;">';
                tFC += '<td style="border: 0px solid white;" align="center"><u>Executive (IT)</u></td>';
                tFC += '<td style="border: 0px solid white;" align="center"><u>HR Admin / Compliance</u></td>';
                tFC += '<td style="border: 0px solid white;" align="center"><u>DGM / GM</u></td>';
                tFC += '<td style="border: 0px solid white;" align="center"><u>Managing Director / Director</u></td>';
                tFC += '</tr>';
                tFC += '</table>';
                htmlData += totalOverView + tFC;
                htmlData += '</body></html>';
                var options = {
                    format: 'Letter',
                    header: {
                        height: "27mm",
                        contents: headerContents() +
                            '<h4 style="' +
                            'line-height: 0;' +
                            '">DAILY ATTENDANCE REPORT</h4>' +
                            '<h6 style="line-height: 0;">' +
                            ms.getDate() +
                            '<sup>' +
                            dayPower[ms.getDate()] +
                            '</sup> ' +
                            monthCapitalNames[ms.getMonth()] + ', ' +
                            ms.getUTCFullYear() +
                            '</h6>'
                    },
                    footer: {
                        height: "15mm",
                        contents: footerContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + values.file_name + '.pdf', function(err, res) {
                    // tmpStoreData.htmlData = htmlData;
                    // tmpStoreData.createDate = new Date();
                    socket.emit("DownloadDailyAttendanceReportPDF", 'success', totalOverView);
                });
            });
        });
    });

    socket.on('CreateDailyAttendancePDF', function(site_url, values) {
        var ms = (values.date != '') ? new Date(values.date) : new Date();
        var file_name = ms.getDate() + '_' + monthNames[ms.getMonth()] + '_' + ms.getUTCFullYear() + '_Daily_Report';
        var htmlData = '<!DOCTYPE html><head><meta lang="bn" http-equiv="Content-Type" content="application/xhtml+xml; charset=UTF-8" /><?xml version="1.0" encoding="UTF-8"?></head><body>' + dailyReportHead();
        if (values.department) {
            list.department_search_list(db, values.department, function(depList) {
                async.each(depList, function(dep, cb_dep) {
                    list.daily_report(db, dep.id, values, function(dailyReport) {
                        if (dailyReport.length > 0) {
                            var storeData = dailyReport;
                            var l = storeData.length;
                            htmlData += '<div id="pageBody">' +
                                '<table style="width:100%">' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"><b>DEPARTMENT NAME:</b> ' +
                                dep.name.toUpperCase() +
                                '</td>' +
                                '<td style="border: 0px solid white;"><small>PRESENT:</small></td>' +
                                '<td style="border: 0px solid white;">' +
                                addLeadingZero(2, storeData[storeData.length - 1].present) +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"></td>' +
                                '<td style="border: 0px solid white;"><small>ABSENT:</small></td>' +
                                '<td style="border: 0px solid white;">' +
                                addLeadingZero(2, storeData[storeData.length - 1].absent) +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"></td>' +
                                '<td style="border: 0px solid white;"><small>LATE:</small></td>' +
                                '<td style="border: 0px solid white;">' +
                                addLeadingZero(2, storeData[storeData.length - 1].late) +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"></td>' +
                                '<td style="border-left: 0px solid white;border-right: 0px solid white;">' +
                                '<small>TOTAL:</small>' +
                                '</td>' +
                                '<td style="border-left: 0px solid white;border-right: 0px solid white;">' +
                                addLeadingZero(2, storeData[storeData.length - 1].total) +
                                '</td>' +
                                '</tr>' +
                                '</table>' +
                                '<table style="width:100%">' +
                                '<tr>' +
                                '<th>FP ID</th>' +
                                '<th>CARD NO</th>' +
                                '<th>EMPLOYEE NAME</th>' +
                                '<th>DESIGNATION</th>' +
                                '<th>SECTION</th>' +
                                '<th>IN TIME</th>' +
                                '<th>OUT TIME</th>' +
                                '<th>STATUS</th>' +
                                '</tr>';
                            for (var j = 0; j < storeData.length; j++) {
                                htmlData += '<tr>';
                                htmlData += '<td align="center">';
                                htmlData += addLeadingZero(9, parseInt(storeData[j].id));
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                htmlData += (storeData[j].card_no != '') ? storeData[j].card_no : '';
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                htmlData += (storeData[j].first_name) ? ((storeData[j].first_name != '') ? storeData[j].first_name.toUpperCase() : '') : '';
                                htmlData += (storeData[j].last_name) ? ((storeData[j].last_name != '') ? ' ' + storeData[j].last_name.toUpperCase() : '') : '';
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                htmlData += (storeData[j].designation != '') ? storeData[j].designation.toUpperCase() : '';
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                htmlData += (storeData[j].section != '') ? storeData[j].section.toUpperCase() : '';
                                htmlData += '</td>';
                                htmlData += '<td align="center">';
                                htmlData += storeData[j].in_time;
                                htmlData += '</td>';
                                htmlData += '<td align="center">';
                                htmlData += storeData[j].out_time;
                                htmlData += '</td>';
                                htmlData += '<td align="center">';
                                htmlData += storeData[j].attendance;
                                htmlData += '</td>';
                                htmlData += '</tr>';
                            };
                            htmlData += '</table></div>';
                        }
                        cb_dep();
                    });
                }, function(err) {
                    htmlData += '</body></html>';
                    var pt = new Date();
                    var options = {
                        format: 'Letter',
                        header: {
                            height: "27mm",
                            contents: headerContents() +
                                '<h4 style="' +
                                'line-height: 0;' +
                                '">DAILY ATTENDANCE REPORT</h4>' +
                                '<h6 style="line-height: 0;">' +
                                ms.getDate() +
                                '<sup>' +
                                dayPower[ms.getDate()] +
                                '</sup> ' +
                                monthCapitalNames[ms.getMonth()] + ', ' +
                                ms.getUTCFullYear() +
                                '</h6>'
                        },
                        footer: {
                            height: "15mm",
                            contents: footerContents()
                        },
                    };
                    pdf.create(htmlData, options).toFile('./uploads/pdf/' + file_name + '.pdf', function(err, res) {
                        socket.emit("CreateDailyAttendancePDF", 'success');
                    });
                });
            })
        } else {
            list.department_list(db, function(depList) {
                async.each(depList, function(dep, cb_dep) {
                    list.daily_report(db, dep.id, values, function(dailyReport) {
                        if (dailyReport.length > 0) {
                            var storeData = dailyReport;
                            var l = storeData.length;
                            htmlData += '<div id="pageBody">' +
                                '<table style="width:100%">' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"><b>DEPARTMENT NAME:</b> ' +
                                dep.name.toUpperCase() +
                                '</td>' +
                                '<td style="border: 0px solid white;"><small>PRESENT:</small></td>' +
                                '<td style="border: 0px solid white;">' +
                                addLeadingZero(2, storeData[storeData.length - 1].present) +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"></td>' +
                                '<td style="border: 0px solid white;"><small>ABSENT:</small></td>' +
                                '<td style="border: 0px solid white;">' +
                                addLeadingZero(2, storeData[storeData.length - 1].absent) +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"></td>' +
                                '<td style="border: 0px solid white;"><small>LATE:</small></td>' +
                                '<td style="border: 0px solid white;">' +
                                addLeadingZero(2, storeData[storeData.length - 1].late) +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"></td>' +
                                '<td style="border-left: 0px solid white;border-right: 0px solid white;">' +
                                '<small>TOTAL:</small>' +
                                '</td>' +
                                '<td style="border-left: 0px solid white;border-right: 0px solid white;">' +
                                addLeadingZero(2, storeData[storeData.length - 1].total) +
                                '</td>' +
                                '</tr>' +
                                '</table>' +
                                '<table style="width:100%">' +
                                '<tr>' +
                                '<th>FP ID</th>' +
                                '<th>CARD NO</th>' +
                                '<th>EMPLOYEE NAME</th>' +
                                '<th>বাংলা নাম</th>' +
                                '<th>DESIGNATION</th>' +
                                '<th>SECTION</th>' +
                                '<th>IN TIME</th>' +
                                '<th>OUT TIME</th>' +
                                '<th>STATUS</th>' +
                                '</tr>';
                            for (var j = 0; j < storeData.length; j++) {
                                htmlData += '<tr>';
                                htmlData += '<td align="center">';
                                htmlData += addLeadingZero(9, parseInt(storeData[j].id));
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                htmlData += (storeData[j].card_no != '') ? storeData[j].card_no : '';
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                htmlData += (storeData[j].first_name) ? ((storeData[j].first_name != '') ? storeData[j].first_name.toUpperCase() : '') : '';
                                htmlData += (storeData[j].last_name) ? ((storeData[j].last_name != '') ? ' ' + storeData[j].last_name.toUpperCase() : '') : '';
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                var t1 = JSON.stringify(storeData[j].user, null, 4);
                                var t2 = t1.split("\n");
                                var t3 = (t2[4]) ? t2[4].split(":") : '';
                                var t4 = (t3[1]) ? t3[1].split('"') : '';
                                var t5 = (t4[1]) ? t4[1].split(' \\') : '';
                                var t6 = (t5[0]) ? t5[0] : '';
                                htmlData += t6;
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                htmlData += (storeData[j].designation != '') ? storeData[j].designation.toUpperCase() : '';
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                htmlData += (storeData[j].section != '') ? storeData[j].section.toUpperCase() : '';
                                htmlData += '</td>';
                                htmlData += '<td align="center">';
                                htmlData += storeData[j].in_time;
                                htmlData += '</td>';
                                htmlData += '<td align="center">';
                                htmlData += storeData[j].out_time;
                                htmlData += '</td>';
                                htmlData += '<td align="center">';
                                htmlData += storeData[j].attendance;
                                htmlData += '</td>';
                                htmlData += '</tr>';
                            };
                            htmlData += '</table></div>';
                        }
                        cb_dep();
                    });
                }, function(err) {
                    htmlData += '</body></html>';
                    var pt = new Date();
                    var options = {
                        format: 'Letter',
                        header: {
                            height: "27mm",
                            contents: headerContents() +
                                '<h4 style="' +
                                'line-height: 0;' +
                                '">DAILY ATTENDANCE REPORT</h4>' +
                                '<h6 style="line-height: 0;">' +
                                ms.getDate() +
                                '<sup>' +
                                dayPower[ms.getDate()] +
                                '</sup> ' +
                                monthCapitalNames[ms.getMonth()] + ', ' +
                                ms.getUTCFullYear() +
                                '</h6>'
                        },
                        footer: {
                            height: "15mm",
                            contents: footerContents()
                        },
                    };
                    pdf.create(htmlData, options).toFile('./uploads/pdf/' + file_name + '.pdf', function(err, res) {
                        socket.emit("CreateDailyAttendancePDF", 'success');
                    });
                });
            })
        }
    });

    socket.on('SendMailCreateDailyAttendancePDF', function(site_url, values) {
        var ms = (values.date) ? new Date(values.date) : new Date(values);
        var file_name = ms.getDate() + '_' + monthNames[ms.getMonth()] + '_' + ms.getUTCFullYear() + '_Daily_Report';
        var htmlData = '<!DOCTYPE html><body>' + dailyReportHead();
        if (values.department) {
            list.department_search_list(db, values.department, function(depList) {
                async.each(depList, function(dep, cb_dep) {
                    list.daily_report(db, dep.id, values, function(dailyReport) {
                        if (dailyReport.length > 0) {
                            var storeData = dailyReport;
                            var l = storeData.length;
                            htmlData += '<div id="pageBody">' +
                                '<table style="width:100%">' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"><b>DEPARTMENT NAME:</b> ' +
                                dep.name.toUpperCase() +
                                '</td>' +
                                '<td style="border: 0px solid white;"><small>PRESENT:</small></td>' +
                                '<td style="border: 0px solid white;">' +
                                addLeadingZero(2, storeData[storeData.length - 1].present) +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"></td>' +
                                '<td style="border: 0px solid white;"><small>ABSENT:</small></td>' +
                                '<td style="border: 0px solid white;">' +
                                addLeadingZero(2, storeData[storeData.length - 1].absent) +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"></td>' +
                                '<td style="border: 0px solid white;"><small>LATE:</small></td>' +
                                '<td style="border: 0px solid white;">' +
                                addLeadingZero(2, storeData[storeData.length - 1].late) +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"></td>' +
                                '<td style="border-left: 0px solid white;border-right: 0px solid white;">' +
                                '<small>TOTAL:</small>' +
                                '</td>' +
                                '<td style="border-left: 0px solid white;border-right: 0px solid white;">' +
                                addLeadingZero(2, storeData[storeData.length - 1].total) +
                                '</td>' +
                                '</tr>' +
                                '</table>' +
                                '<table style="width:100%">' +
                                '<tr>' +
                                '<th>FP ID</th>' +
                                '<th>CARD NO</th>' +
                                '<th>EMPLOYEE NAME</th>' +
                                '<th>DESIGNATION</th>' +
                                '<th>SECTION</th>' +
                                '<th>IN TIME</th>' +
                                '<th>OUT TIME</th>' +
                                '<th>STATUS</th>' +
                                '</tr>';
                            for (var j = 0; j < storeData.length; j++) {
                                htmlData += '<tr>';
                                htmlData += '<td align="center">';
                                htmlData += addLeadingZero(9, parseInt(storeData[j].id));
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                htmlData += (storeData[j].card_no != '') ? storeData[j].card_no : '';
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                htmlData += (storeData[j].first_name) ? ((storeData[j].first_name != '') ? storeData[j].first_name.toUpperCase() : '') : '';
                                htmlData += (storeData[j].last_name) ? ((storeData[j].last_name != '') ? ' ' + storeData[j].last_name.toUpperCase() : '') : '';
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                htmlData += (storeData[j].designation != '') ? storeData[j].designation.toUpperCase() : '';
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                htmlData += (storeData[j].section != '') ? storeData[j].section.toUpperCase() : '';
                                htmlData += '</td>';
                                htmlData += '<td align="center">';
                                htmlData += storeData[j].in_time;
                                htmlData += '</td>';
                                htmlData += '<td align="center">';
                                htmlData += storeData[j].out_time;
                                htmlData += '</td>';
                                htmlData += '<td align="center">';
                                htmlData += storeData[j].attendance;
                                htmlData += '</td>';
                                htmlData += '</tr>';
                            };
                            htmlData += '</table></div>';
                        }
                        cb_dep();
                    });
                }, function(err) {
                    htmlData += '</body></html>';
                    var pt = new Date();
                    var options = {
                        format: 'Letter',
                        header: {
                            height: "27mm",
                            contents: headerContents() +
                                '<h4 style="' +
                                'line-height: 0;' +
                                '">DAILY ATTENDANCE REPORT</h4>' +
                                '<h6 style="line-height: 0;">' +
                                ms.getDate() +
                                '<sup>' +
                                dayPower[ms.getDate()] +
                                '</sup> ' +
                                monthCapitalNames[ms.getMonth()] + ', ' +
                                ms.getUTCFullYear() +
                                '</h6>'
                        },
                        footer: {
                            height: "15mm",
                            contents: footerContents()
                        },
                    };
                    pdf.create(htmlData, options).toFile('./uploads/pdf/' + file_name + '.pdf', function(err, res) {
                        socket.emit("SendMailCreateDailyAttendancePDFReturn", 'success');
                    });
                });
            })
        } else {
            list.department_list(db, function(depList) {
                async.each(depList, function(dep, cb_dep) {
                    list.daily_report(db, dep.id, values, function(dailyReport) {
                        if (dailyReport.length > 0) {
                            var storeData = dailyReport;
                            var l = storeData.length;
                            htmlData += '<div id="pageBody">' +
                                '<table style="width:100%">' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"><b>DEPARTMENT NAME:</b> ' +
                                dep.name.toUpperCase() +
                                '</td>' +
                                '<td style="border: 0px solid white;"><small>PRESENT:</small></td>' +
                                '<td style="border: 0px solid white;">' +
                                addLeadingZero(2, storeData[storeData.length - 1].present) +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"></td>' +
                                '<td style="border: 0px solid white;"><small>ABSENT:</small></td>' +
                                '<td style="border: 0px solid white;">' +
                                addLeadingZero(2, storeData[storeData.length - 1].absent) +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"></td>' +
                                '<td style="border: 0px solid white;"><small>LATE:</small></td>' +
                                '<td style="border: 0px solid white;">' +
                                addLeadingZero(2, storeData[storeData.length - 1].late) +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"></td>' +
                                '<td style="border-left: 0px solid white;border-right: 0px solid white;">' +
                                '<small>TOTAL:</small>' +
                                '</td>' +
                                '<td style="border-left: 0px solid white;border-right: 0px solid white;">' +
                                addLeadingZero(2, storeData[storeData.length - 1].total) +
                                '</td>' +
                                '</tr>' +
                                '</table>' +
                                '<table style="width:100%">' +
                                '<tr>' +
                                '<th>FP ID</th>' +
                                '<th>CARD NO</th>' +
                                '<th>EMPLOYEE NAME</th>' +
                                '<th>DESIGNATION</th>' +
                                '<th>SECTION</th>' +
                                '<th>IN TIME</th>' +
                                '<th>OUT TIME</th>' +
                                '<th>STATUS</th>' +
                                '</tr>';
                            for (var j = 0; j < storeData.length; j++) {
                                htmlData += '<tr>';
                                htmlData += '<td align="center">';
                                htmlData += addLeadingZero(9, parseInt(storeData[j].id));
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                htmlData += (storeData[j].card_no != '') ? storeData[j].card_no : '';
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                htmlData += (storeData[j].first_name) ? ((storeData[j].first_name != '') ? storeData[j].first_name.toUpperCase() : '') : '';
                                htmlData += (storeData[j].last_name) ? ((storeData[j].last_name != '') ? ' ' + storeData[j].last_name.toUpperCase() : '') : '';
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                htmlData += (storeData[j].designation != '') ? storeData[j].designation.toUpperCase() : '';
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                htmlData += (storeData[j].section != '') ? storeData[j].section.toUpperCase() : '';
                                htmlData += '</td>';
                                htmlData += '<td align="center">';
                                htmlData += storeData[j].in_time;
                                htmlData += '</td>';
                                htmlData += '<td align="center">';
                                htmlData += storeData[j].out_time;
                                htmlData += '</td>';
                                htmlData += '<td align="center">';
                                htmlData += storeData[j].attendance;
                                htmlData += '</td>';
                                htmlData += '</tr>';
                            };
                            htmlData += '</table></div>';
                        }
                        cb_dep();
                    });
                }, function(err) {
                    htmlData += '</body></html>';
                    var pt = new Date();
                    var options = {
                        format: 'Letter',
                        header: {
                            height: "27mm",
                            contents: headerContents() +
                                '<h4 style="' +
                                'line-height: 0;' +
                                '">DAILY ATTENDANCE REPORT</h4>' +
                                '<h6 style="line-height: 0;">' +
                                ms.getDate() +
                                '<sup>' +
                                dayPower[ms.getDate()] +
                                '</sup> ' +
                                monthCapitalNames[ms.getMonth()] + ', ' +
                                ms.getUTCFullYear() +
                                '</h6>'
                        },
                        footer: {
                            height: "15mm",
                            contents: footerContents()
                        },
                    };
                    pdf.create(htmlData, options).toFile('./uploads/pdf/' + file_name + '.pdf', function(err, res) {
                        socket.emit("SendMailCreateDailyAttendancePDFReturn", 'success');
                    });
                });
            })
        }
    });

    socket.on('CreateCustomMonthlyAttendanceReportPDF', function(site_url, vr) {
        var sd = vr.ms
        var sec = vr.sec
        var wp = vr.wp
        var dp = vr.dp
        var ms = new Date(sd);
        var QUERY = {};
        var dataValues = {};
        dataValues.month = ms;
        var holiday = 0;
        var holiday_array = [];
        var adjustment = [];
        var file_name = monthNames[ms.getMonth()] + '_' + ms.getUTCFullYear() + '_' + factoryShort + '_Monthly_Report';
        var htmlData =
            '<!DOCTYPE html><body>' +
            monthlyReportHead();
        list.holiday_list(db, function(holidayList) {
            holiday_array[0] = 0;
            holiday_array[32] = 32;
            adjustment[0] = 0;
            adjustment[32] = 32;
            holiday = holidayList.length;
            async.each(holidayList, function(holiD, cb_holiD) {
                if (holidayList.length > 0) {
                    if (holiD.date.getFullYear() == ms.getFullYear()) {
                        if (holiD.date.getMonth() == ms.getMonth()) {
                            holiday_array.push(holiD.date.getDate());
                        }
                    }
                }
                cb_holiD();
            }, function(err) {
                list.adjustment_list(db, function(adjustList) {
                    async.each(adjustList, function(adjD, cb_adjD) {
                        if (adjustList.length > 0) {
                            if (adjD.date.getFullYear() == ms.getFullYear()) {
                                if (adjD.date.getMonth() == ms.getMonth()) {
                                    adjustment.push(adjD.date.getDate());
                                }
                            }
                        }
                        cb_adjD();
                    }, function(err) {
                        list.section_list(db, function(depList) {
                            dataValues.holiday = holiday;
                            dataValues.holiday_array = holiday_array;
                            dataValues.adjustment = adjustment;
                            async.each(depList, function(dep, cb_dep) {
                                QUERY.section = dep.id
                                list.attendance_report3(db, QUERY, dataValues, wp, sec, function(monthlyReport) {
                                    var storeData = monthlyReport;
                                    var l = storeData.length;
                                    if (l > 0) {
                                        htmlData += '<div>' +
                                            '<table style="width:100%">' +
                                            '<tr>' +
                                            '<th align="left">' +
                                            '<h3>' +
                                            dep.name.toUpperCase() +
                                            '</h3>' +
                                            '</th>' +
                                            '</tr>' +
                                            '</table>' +
                                            '<table style="width:100%">' +
                                            '<tr>' +
                                            '<th>EMP. ID</th>' +
                                            '<th>CARD</th>';
                                        htmlData += '<th width="260px">EMP. NAME</th>';
                                        htmlData += '<th>P</th>' +
                                            '<th>A</th>' +
                                            '<th>L</th>' +
                                            '<th>W</th>' +
                                            '<th>H</th>' +
                                            '<th>AL</th>' +
                                            '<th>ALL</th>' +
                                            '<th>LL</th>' +
                                            '<th>LA</th>' +
                                            '<th>PD</th>' +
                                            '<th>AD</th>' +
                                            '<th>TD</th>';
                                        for (var j = 1; j < storeData[0].day_length + 1; j++) {
                                            htmlData += '<th width="65px"><small><small>' + mthCPNames[ms.getMonth()] + ' ' + j + '</small></small></th>';
                                        };
                                        htmlData += '</tr>';
                                        for (var j = 0; j < storeData.length; j++) {
                                            htmlData += '<tr>';
                                            htmlData += '<td align="left" style="width:100px"><b>';
                                            htmlData += addLeadingZero(9, parseInt(storeData[j].id));
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="left" style="width:100px"><b>';
                                            htmlData += (storeData[j].card_no) ? storeData[j].card_no : 0;
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="left"><b>';
                                            htmlData += (storeData[j].first_name) ? ((storeData[j].first_name != '') ? storeData[j].first_name.toUpperCase() : '') : '';
                                            htmlData += (storeData[j].last_name) ? ((storeData[j].last_name != '') ? ' ' + storeData[j].last_name.toUpperCase() : '') : '';
                                            htmlData += '</b></td>';
                                            var tmp_TD = parseInt(storeData[j].day_length);
                                            var tmp_P = parseInt(storeData[j].present);
                                            var tmp_A = parseInt(storeData[j].absent);
                                            var tmp_L = parseInt(storeData[j].late);
                                            var tmp_W = parseInt(storeData[j].weekend);
                                            var tmp_H = parseInt(storeData[j].holidays);
                                            var tmp_LA = parseInt(storeData[j].leave);
                                            var tmp_LL = parseInt(storeData[j].late_leave);
                                            var tmp_ALL = parseInt(storeData[j].absent_late_leave);
                                            htmlData += '<td align="center"><b>';
                                            htmlData += addLeadingZero(2, tmp_P.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            htmlData += addLeadingZero(2, tmp_A.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            htmlData += addLeadingZero(2, tmp_L.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            htmlData += addLeadingZero(2, tmp_W.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            htmlData += addLeadingZero(2, tmp_H.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            var tmp_AL = parseInt(tmp_L / 3);
                                            htmlData += addLeadingZero(2, tmp_AL.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            htmlData += addLeadingZero(2, tmp_ALL.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            htmlData += addLeadingZero(2, tmp_LL.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            htmlData += addLeadingZero(2, tmp_LA.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            var tmp_LLP = parseInt(tmp_L - tmp_LL);
                                            var tmp_NAL = parseInt(tmp_LLP / 3);
                                            var tmp_PD = parseInt(tmp_P + (tmp_LLP - tmp_NAL) + tmp_LL + tmp_LA + tmp_W + tmp_H + tmp_ALL);
                                            htmlData += addLeadingZero(2, tmp_PD.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            var tmp_AD = parseInt(tmp_TD - tmp_PD);
                                            htmlData += addLeadingZero(2, tmp_AD.toString());
                                            htmlData += '</b></td>';
                                            htmlData += '<td align="center"><b>';
                                            htmlData += addLeadingZero(2, tmp_TD.toString());
                                            htmlData += '</b></td>';
                                            for (var k = 1; k < storeData[0].day_length + 1; k++) {
                                                var obj_res = Object.keys(storeData[j])[18 + k];
                                                htmlData += '<td align="center"><small>' + storeData[j].days['day_' + k] + '</small></td>';
                                            };
                                            htmlData += '</tr>';
                                        };
                                        htmlData += '</table></div><br /><br />';
                                    }
                                    cb_dep();
                                });
                            }, function(err) {
                                htmlData += '</body></html>';
                                var pt = new Date();
                                var options = {
                                    format: 'Letter',
                                    header: {
                                        height: "45mm",
                                        contents: '<div style="' +
                                            'color: #444;' +
                                            'font-size: 15px;' +
                                            'position: fixed;' +
                                            'top: 15;' +
                                            'right: 15;' +
                                            '">' +
                                            '<span>PRINT TIME: ' +
                                            new Date() +
                                            '</span>' +
                                            '</div>' +
                                            '<br />' +
                                            '<h1><b>' + factoryName + '</b></h1>' +
                                            '<h2><b>Monthly Attendance Report</b></h2>' +
                                            '<h4><b>' +
                                            monthCapitalNames[ms.getMonth()] + ', ' +
                                            ms.getFullYear() +
                                            '</b></h4>'
                                    },
                                    footer: {
                                        height: "25mm",
                                        contents: '<div style="' +
                                            'color: #444;' +
                                            'font-size: 15px;' +
                                            'position: fixed;' +
                                            'bottom: 15;' +
                                            'right: 15;' +
                                            '">' +
                                            '<span>PAGE {{page}}</span>' +
                                            ' OUT OF ' +
                                            '<span>{{pages}}</span>' +
                                            '</div>' +
                                            '<br /><br />' +
                                            '<small>' +
                                            'N.B.: <i>P = PRESENT, A = ABSENT, L = LATE, W = WEEKEND, ' +
                                            'H = HOLIDAY, TD = TOTAL DAYS, AL = ABSENT DUE TO LATE, ALL = LATE LEAVE ON ABSENT DAY, ' +
                                            'LL = LATE LEAVE/ SHORT LEAVE, CL = CASUAL LEAVE, SL = SICK LEAVE, EL = EARN LEAVE, ' +
                                            'LA = LEAVE ACCEPTED, PD = PRESENT DAYS, AD = ABSENT DAYS</i>' +
                                            '</small>'
                                    },
                                    width: '7120px',
                                    height: '4320px'
                                };
                                pdf.create(htmlData, options).toFile('./uploads/pdf/' + file_name + '.pdf', function(err, res) {
                                    socket.emit("CreateCustomMonthlyAttendanceReportPDF", 'success');
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    socket.on('DestroyAttendance', function(data) {
        DestroyAttendance(db, data, function(data) {
            socket.emit("DestroyAttendance", data)
        });
    });

    socket.on('CreateDailyAttendance', function(QUERY) {
        getC.getDailyAttendanceCreateData(db, QUERY, function(mData) {
            socket.emit("CreateDailyAttendance", mData);
        });
        // var InputData = [];
        // getC.getEmployeeID(db, QUERY, function(empData){
        //   async.each(empData, function (emp, cb_md) {
        //     var o = {};
        //     o.employee = md.id;
        //     o.year = QUERY.year;
        //     o.month = QUERY.month;
        //     o.present_days = md.totalPayableDays;
        //     o.absent_days = md.totalDeductDays;
        //     o.overtime = (md.employee_type=='STAFF')?0:md.overTime;
        //     o.excess_overtime = (md.employee_type=='STAFF')?0:md.excessOverTime;
        //     o.in_late = md.inLate;
        //     o.out_late = md.outLate;
        //     o.bonus = (md.in_late>0||md.out_late>0||md.inBonusLateCount>0||md.totalDeductDays>0||md.leave>0)?false:true;
        //     InputData.push(o);
        //     cb_md();
        //   }, function (err) {
        //     input.CreateDailyAttendance(db,InputData,function(data){
        //         socket.emit("CreateDailyAttendance",data)
        //     });
        //   });
        // });
    });

    socket.on('CreateMonthlyAttendance', function(QUERY) {
        var InputData = [];
        getEmployeeMonthSummaryV2(db, QUERY, function(monthData) {
            async.each(monthData, function(md, cb_md) {
                var o = {};
                o.employee = md.id;
                o.year = QUERY.year;
                o.month = QUERY.month;
                o.present_days = md.totalPayableDays;
                o.absent_days = md.totalDeductDays;
                o.overtime = (md.employee_type == 'STAFF') ? 0 : md.overTime;
                o.excess_overtime = (md.employee_type == 'STAFF') ? 0 : md.excessOverTime;
                o.in_late = md.inLate;
                o.out_late = md.outLate;
                o.bonus = (md.in_late > 0 || md.out_late > 0 || md.inBonusLateCount > 0 || md.totalDeductDays > 0 || md.leave > 0) ? false : true;
                InputData.push(o);
                cb_md();
            }, function(err) {
                CreateMonthlyAttendance(db, InputData, function(data) {
                    socket.emit("CreateMonthlyAttendance" + QUERY.section, data);
                });
            });
        });
    });


    socket.on('DownloadEmployeeMonthlyAttendanceV2', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        d.setDate(10);
        var dayArray = dayArrayFunc(d.monthDays());
        var rangeMArray = rangeMArrayFunc(d);
        var options = {};
        getEmployeeMonthAttendanceV2(db, QUERY, function(empData) {
            var htmlData =
                '<!DOCTYPE html><body>' +
                dailyReportHead() +
                '<div id="pageBody">' +
                '<table style="width:100%">' +
                '<tr>' +
                '<td rowspan="2" align="center">' +
                '<b>' +
                'EMPLOYEE ATTENDANCE REPORT ' +
                monthCapitalNames[d.getMonth()] + ', ' +
                d.getUTCFullYear() +
                '</b>' +
                '</td>' +
                '</tr>' +
                '</table>';
            var gridData = '';
            var present = 0;
            var absent = 0;
            var late = 0;
            var holiday = 0;
            var weekend = 0;
            var leave = 0;
            var inLate = 0;
            var outLate = 0;
            var fp = addLeadingZero(9, QUERY.id);
            var name = '';
            var joinDate = '';
            var department = '';
            var section = '';
            var designation = '';
            async.each(empData, function(emp, cb_emp) {
                name = emp.name;
                joinDate = emp.date_of_join.formatFullDate();
                department = emp.departmentName;
                section = emp.sectionName;
                designation = emp.designationName;
                options = {
                    format: 'Letter',
                    header: {
                        height: "27mm",
                        contents: headerContents() +
                            '<h4 style="' +
                            'line-height: 0;' +
                            '">MONTHLY ATTENDANCE REPORT</h4>' +
                            '<h6 style="line-height: 0;">' +
                            emp.name + ' | ' +
                            monthCapitalNames[d.getMonth()] + ', ' +
                            d.getUTCFullYear() +
                            '</h6>'
                    },
                    footer: {
                        height: "15mm",
                        contents: footerContents()
                    },
                };
                var overTime = 0;
                var excessOverTime = 0;
                var workInTime = emp.workInTime.split(":");
                var workOutTime = emp.workOutTime.split(":");
                var inH = parseInt(workInTime[0]);
                var inM = parseInt(workInTime[1]);
                var outH = parseInt(workOutTime[0]);
                var outM = parseInt(workOutTime[1]);
                gridData += '<table style="width:100%">' +
                    '<tr>' +
                    '<th>DATE</th>' +
                    '<th>OFFICE IN</th>' +
                    '<th>LUNCH OUT</th>' +
                    '<th>LUNCH IN</th>' +
                    '<th>OFFICE OUT</th>' +
                    '<th>OT (H)</th>' +
                    '<th>EOT (H)</th>' +
                    '<th>STATUS</th>' +
                    '</tr>';
                async.each(rangeMArray, function(YMD, cb_day) {
                    var dr = new Date(YMD);
                    var Y = dr.getFullYear();
                    var M = dr.getMonth() + 1;
                    var D = dr.getDate();
                    inH = (ramadan2017.indexOf(YMD) != -1) ? parseInt(workInTime[0]) - 1 : parseInt(workInTime[0]);
                    outH = (ramadan1p2017.indexOf(YMD) != -1) ? parseInt(workOutTime[0]) - 1 : (ramadan2p2017.indexOf(YMD) != -1) ? parseInt(workOutTime[0]) - 2 : parseInt(workOutTime[0]);
                    outM = (ramadan2p2017.indexOf(YMD) != -1) ? ((parseInt(workOutTime[1]) == 30) ? 00 : 30) : parseInt(workOutTime[1]);

                    var tD = (emp.date_of_join) ? new Date(emp.date_of_join) : new Date();
                    var tDY = tD.getFullYear();
                    var tDM = tD.getMonth() + 1;
                    var tDD = tD.getDate();
                    var tDYMD = tDY + '-' + tDM + '-' + tDD;
                    // var InStatus = (emp.attendance[YMD].officeIn.flag)?((emp.attendance[YMD].officeIn.h<inH)?'P':'L'):'A';
                    // var OutStatus = (emp.attendance[YMD].officeOut.flag)?((emp.attendance[YMD].officeOut.h>=outH)?'P':'L'):'A';

                    var InStatus = (emp.attendance[YMD].officeIn.flag) ?
                        (
                            (emp.attendance[YMD].officeIn.h <= inH) ?
                            (
                                (emp.attendance[YMD].officeIn.h == inH && emp.attendance[YMD].officeIn.m > inM) ?
                                'L' :
                                'P'
                            ) :
                            'L'
                        ) :
                        'A';
                    var OutStatus = (emp.attendance[YMD].officeOut.flag) ?
                        (
                            (emp.attendance[YMD].officeOut.h >= outH) ?
                            (
                                (emp.attendance[YMD].officeOut.h == outH && emp.attendance[YMD].officeOut.m < outM) ?
                                'L' :
                                'P'
                            ) :
                            'L'
                        ) :
                        'A';
                    var empStatus = (InStatus == 'P' && OutStatus == 'P') ?
                        'P' :
                        (
                            (
                                (InStatus == 'P' && (OutStatus == 'L' || OutStatus == 'A')) ||
                                ((InStatus == 'L' || InStatus == 'A') && OutStatus == 'P') ||
                                (InStatus == 'L' && OutStatus == 'A') ||
                                (InStatus == 'A' && OutStatus == 'L') ||
                                (InStatus == 'L' && OutStatus == 'L')
                            ) ?
                            'L' :
                            'A'
                        );
                    // var cDate = YMD;
                    var cDate = addLeadingZero(2, parseInt(D)) + '-' + mthCPNames[M - 1] + '-' + Y;
                    var officeIn = emp.attendance[YMD].officeIn.time + ' (' + InStatus + ')';
                    var lunchOut = emp.attendance[YMD].lunchOut.time;
                    var lunchIn = emp.attendance[YMD].lunchIn.time;
                    var officeOut = emp.attendance[YMD].officeOut.time + ' (' + OutStatus + ')';
                    if (emp.attendance[YMD].leave) {
                        officeIn = emp.attendance[YMD].leaveType;
                        lunchOut = emp.attendance[YMD].leaveType;
                        lunchIn = emp.attendance[YMD].leaveType;
                        officeOut = emp.attendance[YMD].leaveType;
                        empStatus = emp.attendance[YMD].leaveName;
                        //OT=emp.attendance[YMD].leaveName;
                        leave++;
                    } else if (!emp.attendance[YMD].adjust) {
                        if (emp.attendance[YMD].holiday) {
                            if (emp.attendance[YMD].payable) {
                                if (Y == tDY && M == tDM && D < tDD) {
                                    officeIn = 'ABSENT';
                                    lunchOut = 'ABSENT';
                                    lunchIn = 'ABSENT';
                                    officeOut = 'ABSENT';
                                    empStatus = 'A';
                                    //OT='A';
                                    absent++;
                                } else {
                                    officeIn += ' (HOLIDAY)';
                                    lunchOut += ' (HOLIDAY)';
                                    lunchIn += ' (HOLIDAY)';
                                    officeOut += ' (HOLIDAY)';
                                    empStatus = 'H';
                                    //OT='H';
                                    holiday++;
                                }
                            } else {
                                officeIn = 'ABSENT';
                                lunchOut = 'ABSENT';
                                lunchIn = 'ABSENT';
                                officeOut = 'ABSENT';
                                empStatus = 'A';
                                //OT='A';
                                absent++;
                            }
                        } else {
                            if (emp.attendance[YMD].weekend) {
                                if (emp.attendance[YMD].payable) {
                                    if (Y == tDY && M == tDM && D < tDD) {
                                        officeIn = 'ABSENT';
                                        lunchOut = 'ABSENT';
                                        lunchIn = 'ABSENT';
                                        officeOut = 'ABSENT';
                                        empStatus = 'A';
                                        //OT='A';
                                        absent++;
                                    } else {
                                        officeIn += ' (WEEKEND)';
                                        lunchOut += ' (WEEKEND)';
                                        lunchIn += ' (WEEKEND)';
                                        officeOut += ' (WEEKEND)';
                                        empStatus = 'W';
                                        //OT='W';
                                        weekend++;
                                    }
                                } else {
                                    officeIn = 'ABSENT';
                                    lunchOut = 'ABSENT';
                                    lunchIn = 'ABSENT';
                                    officeOut = 'ABSENT';
                                    empStatus = 'A';
                                    //OT='A';
                                    absent++;
                                }
                            } else {
                                if (empStatus == 'A') {
                                    officeIn = 'ABSENT';
                                    lunchOut = 'ABSENT';
                                    lunchIn = 'ABSENT';
                                    officeOut = 'ABSENT';
                                    empStatus = 'A';
                                    //OT='A';
                                    absent++;
                                }
                            }
                        }
                    } else {
                        if (empStatus == 'A') {
                            officeIn = 'ABSENT';
                            lunchOut = 'ABSENT';
                            lunchIn = 'ABSENT';
                            officeOut = 'ABSENT';
                            empStatus = 'A';
                            //OT='A';
                            absent++;
                        }
                    }
                    if (empStatus == 'P') {
                        present++;
                    } else if (empStatus == 'L') {
                        if (InStatus == 'L' || InStatus == 'A') {
                            inLate++;
                        }
                        if (OutStatus == 'L' || OutStatus == 'A') {
                            outLate++;
                        }
                        late++;
                    }
                    var OT = (empStatus == 'H' || empStatus == 'W') ? '00 H' : addLeadingZero(2, parseInt(emp.attendance[YMD].overTime)) + ' H';
                    var EOT = (empStatus == 'H' || empStatus == 'W') ? emp.attendance[YMD].workingHour : emp.attendance[YMD].excessOverTime;
                    EOT = addLeadingZero(2, parseInt(EOT)) + ' H';

                    gridData += '<tr>' +
                        '<td align="center">' +
                        cDate +
                        '</td>' +
                        '<td align="center">' +
                        officeIn +
                        '</td>' +
                        '<td align="center">' +
                        lunchOut +
                        '</td>' +
                        '<td align="center">' +
                        lunchIn +
                        '</td>' +
                        '<td align="center">' +
                        officeOut +
                        '</td>' +
                        '<td align="center">' +
                        OT +
                        '</td>' +
                        '<td align="center">' +
                        EOT +
                        '</td>' +
                        '<td align="center">' +
                        empStatus +
                        '</td>' +
                        '</tr>';
                    overTime += (empStatus == 'P' || empStatus == 'L') ? emp.attendance[YMD].overTime : 0;
                    excessOverTime += (empStatus == 'H' || empStatus == 'W') ? emp.attendance[YMD].workingHour : emp.attendance[YMD].excessOverTime;
                    cb_day()
                }, function(err) {
                    gridData += '<tr>' +
                        '<td align="right" colspan="5">' +
                        '<b>' +
                        'TOTAL = ' +
                        '</b>' +
                        '</td>' +
                        '<td align="center"><b>' +
                        addLeadingZero(2, parseInt(overTime)) +
                        ' H</b></td>' +
                        '<td align="center"><b>' +
                        addLeadingZero(2, parseInt(excessOverTime)) +
                        ' H</b></td>' +
                        '<td align="center">' +
                        '</td>' +
                        '</tr>' +
                        '</table><br />' +
                        '</div></body></html>';
                    cb_emp();
                });
            }, function(err) {
                htmlData += '<table style="width:100%;">' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>NAME </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + name + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>EMPLOYEE ID </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + fp + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>PRESENT </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, present) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>DEPARTMENT </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + department + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>SECTION </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + section + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>ABSENT </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, absent) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>DESIGNATION </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + designation + '</b>' +
                    '</td>' +
                    ///////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>JOINING DATE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + joinDate + '</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>LATE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, late) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                    '<b>IN LATE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                    '<b>: ' + addLeadingZero(2, inLate) + ' ( Absent For Late : ' +
                    addLeadingZero(2, parseInt(inLate / 3)) + ' )</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>HOLIDAY </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, holiday) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                    '<b>OUT LATE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                    '<b>: ' + addLeadingZero(2, outLate) + ' ( Absent For Late : ' +
                    addLeadingZero(2, parseInt(outLate / 3)) + ' )</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>WEEKEND </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, weekend) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid Gainsboro;background:Gainsboro;">' +
                    '<b>TOTAL LATE </b>' +
                    '</td>' +
                    '<td style="background:Gainsboro;border-left: 0px solid Gainsboro;border-right: 0px solid Gainsboro;">' +
                    '<b>: ' + addLeadingZero(2, (inLate + outLate)) + ' ( Absent For Late : ' +
                    addLeadingZero(2, (parseInt(inLate / 3) + parseInt(outLate / 3))) + ' )</b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>LEAVE </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, leave) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    //////////////////////ROW////////////////////////
                    '<tr>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;"></td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border: 0px solid white;">' +
                    '<b>TOTAL </b>' +
                    '</td>' +
                    /////////////////////COL/////////////////////////
                    '<td style="border-left: 0px solid white;border-right: 0px solid white;border-bottom: 0px solid white;">' +
                    '<b>: ' + addLeadingZero(2, absent + present + late + holiday + weekend + leave) + '</b>' +
                    '</td>' +
                    '</tr>' +
                    '</table>';
                htmlData += gridData;
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadEmployeeMonthlyAttendanceV2", 'success');
                });
            });
        });
    });

    socket.on('DownloadDailyAttendanceComplianceReportPDF', function(values) {
        var ms = (values.date != '') ? new Date(values.date) : new Date();
        var htmlData = '<!DOCTYPE html><head><meta lang="bn" http-equiv="Content-Type" content="application/xhtml+xml; charset=UTF-8" /><?xml version="1.0" encoding="UTF-8"?></head><body>' + dailyReportHead();
        var totalOverView = '<table style="width:100%;font-size: 11px;padding:5px;margin:5px;" border=2>' +
            '<tr>' +
            '<th>DEPARTMENT</th>' +
            '<th>SECTION</th>' +
            '<th>PRESENT</th>' +
            '<th>LATE</th>' +
            '<th>ATTEND</th>' +
            '<th>ABSENT</th>' +
            '<th>TOTAL</th>' +
            '</tr>';
        var totalPresent = 0;
        var totalAbsent = 0;
        var totalLate = 0;
        var grandTotal = 0;
        var secSearch = {};
        if (values.department != '')
            secSearch.department = values.department;
        else if (values.section != '')
            secSearch.id = values.section;
        getSection(db, secSearch, function(secList) {
            secList.sort(function(a, b) {
                if (a.department < b.department)
                    return -1;
                if (a.department > b.department)
                    return 1;
                return 0;
            });
            async.each(secList, function(sec, cb_sec) {
                if (sec.name != 'SECURITY' && sec.name != 'LOAD-UNLOAD') {
                    values.section = sec.id;
                    var tmpHtmlData = '';
                    var present = 0;
                    var absent = 0;
                    var late = 0;
                    var total = 0;
                    var eFSearch = {};
                    eFSearch.section = sec.id;
                    eFSearch.status = [1, 2];
                    eFSearch.date = new Date(ms);
                    if (values.employee_type != '')
                        eFSearch.employee_type = values.employee_type;
                    if (values.attendance_type != '')
                        eFSearch.attendance_type = values.attendance_type;
                    var flag = 0;
                    tmpHtmlData += '<table style="width:100%">' +
                        '<tr>' +
                        '<th>FP ID</th>' +
                        '<th><small>CARD</small></th>' +
                        '<th>EMPLOYEE NAME</th>' +
                        '<th>DESIGNATION</th>' +
                        '<th><small><small>LAST DAY OUT</small></small></th>' +
                        '<th><small>OFFICE IN</small></th>' +
                        '<th><small>LUNCH OUT</small></th>' +
                        '<th><small>LUNCH IN</small></th>' +
                        '<th><small>OFFICE OUT</small></th>' +
                        '<th><small><small>STATUS</small></small></th>' +
                        '</tr>';
                    getEmployeeDayAttendance(db, eFSearch, function(empList) {
                        empList.sort(function(a, b) {
                            if (a.id < b.id)
                                return -1;
                            if (a.id > b.id)
                                return 1;
                            return 0;
                        });
                        async.each(empList, function(emp, cb_emp) {
                            var workInTime = emp.workInTime.split(":");;
                            var workOutTime = emp.workOutTime.split(":");;
                            var inH = parseInt(workInTime[0]);
                            var inM = parseInt(workInTime[1]);
                            var outH = parseInt(workOutTime[0]);

                            ///////////    COMPLIANCE TIME CREATE     ///////////
                            var officeOutC = emp.officeOut.time;
                            var lastDayOutC = emp.lastDayOut.time;
                            var ComOutTime = (emp.sectionName == 'LOAD-UNLOAD' || emp.sectionName == 'SECURITY') ? '05:0' : '07:0';
                            if (parseInt(emp.officeOut.h) > 18) {
                                officeOutC = ComOutTime + (Math.floor(Math.random() * 9) + 0) + ' PM';
                            }
                            if (parseInt(emp.officeOut.h) == 18 && (emp.sectionName == 'LOAD-UNLOAD' || emp.sectionName == 'SECURITY')) {
                                officeOutC = ComOutTime + (Math.floor(Math.random() * 9) + 0) + ' PM';
                            }
                            if (parseInt(emp.lastDayOut.h) > 18) {
                                lastDayOutC = ComOutTime + (Math.floor(Math.random() * 9) + 0) + ' PM';
                            }
                            if (parseInt(emp.lastDayOut.h) == 18 && (emp.sectionName == 'LOAD-UNLOAD' || emp.sectionName == 'SECURITY')) {
                                lastDayOutC = ComOutTime + (Math.floor(Math.random() * 9) + 0) + ' PM';
                            }
                            ///////////    COMPLIANCE TIME CREATE     ///////////

                            var empStatus = (emp.attendanceStatus == 'P') ?
                                (
                                    (emp.officeIn.h < inH) ?
                                    'P' :
                                    (
                                        (emp.officeIn.h == inH && emp.officeIn.m == inM) ?
                                        'P' :
                                        'L'
                                    )
                                ) :
                                'A';
                            if (empStatus == 'A')
                                absent++;
                            if (empStatus == 'P')
                                present++;
                            if (empStatus == 'L')
                                late++;
                            if (emp.id)
                                flag = 1;
                            tmpHtmlData += '<tr';
                            tmpHtmlData += (emp.attendanceStatus == 'A') ? ' style="background-color:#DDD;"' : '';
                            tmpHtmlData += '>';
                            tmpHtmlData += '<td align="center">';
                            tmpHtmlData += addLeadingZero(9, parseInt(emp.id));
                            tmpHtmlData += '</td>';
                            tmpHtmlData += '<td align="left">';
                            tmpHtmlData += emp.card_no;
                            tmpHtmlData += '</td>';
                            tmpHtmlData += '<td align="left">';
                            tmpHtmlData += emp.name;
                            tmpHtmlData += '</td>';
                            tmpHtmlData += '<td align="left">';
                            tmpHtmlData += emp.designationName;
                            tmpHtmlData += '</td>';
                            tmpHtmlData += '<td align="center">';
                            // tmpHtmlData+=emp.lastDayOut.time;
                            tmpHtmlData += lastDayOutC;
                            tmpHtmlData += (emp.lastDayOut.flag) ? ((emp.lastDayOut.h >= outH) ? ' (P)' : ' (L)') : ' (A)';
                            tmpHtmlData += '</td>';
                            tmpHtmlData += '<td align="center">';
                            tmpHtmlData += emp.officeIn.time;
                            tmpHtmlData += (emp.officeIn.flag) ? (
                                    (emp.officeIn.h < inH) ?
                                    ' (P)' :
                                    (
                                        (emp.officeIn.h == inH && emp.officeIn.m == inM) ?
                                        ' (P)' :
                                        ' (L)'
                                    )
                                ) :
                                ' (A)';
                            tmpHtmlData += '</td>';
                            tmpHtmlData += '<td align="center">';
                            tmpHtmlData += emp.lunchOut.time;
                            tmpHtmlData += (emp.lunchOut.flag) ? ' (P)' : ' (A)';
                            tmpHtmlData += '</td>';
                            tmpHtmlData += '<td align="center">';
                            tmpHtmlData += emp.lunchIn.time;
                            tmpHtmlData += (emp.lunchIn.flag) ? ' (P)' : ' (A)';
                            tmpHtmlData += '</td>';
                            tmpHtmlData += '<td align="center">';
                            // tmpHtmlData+=emp.officeOut.time;
                            tmpHtmlData += officeOutC;
                            tmpHtmlData += (emp.officeOut.flag) ? ((emp.officeOut.h >= outH) ? ' (P)' : ' (L)') : ' (A)';
                            tmpHtmlData += '</td>';
                            tmpHtmlData += '<td align="center">';
                            tmpHtmlData += empStatus;
                            tmpHtmlData += '</td>';
                            tmpHtmlData += '</tr>';
                            cb_emp();
                        }, function(err) {
                            total = present + absent + late;
                            totalPresent += present;
                            totalAbsent += absent;
                            totalLate += late;
                            grandTotal += total;
                            tmpHtmlData += '</table></div>';
                            var tmpHtmlHead = '<div id="pageBody">' +
                                '<table style="width:100%">' +
                                '<tr>' +
                                '<td style="border: 0px solid white;width:100px"><b>SECTION </b></td>' +
                                '<td style="border: 0px solid white;"> : ' +
                                sec.name +
                                '</td>' +
                                '<td style="border: 0px solid white;width:60px"><small>PRESENT:</small></td>' +
                                '<td style="border: 0px solid white;width:60px">' +
                                addLeadingZero(2, present) +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"><b>DEPARTMENT </b></td>' +
                                '<td style="border: 0px solid white;"> : ' +
                                sec.department +
                                '</td>' +
                                '<td style="border: 0px solid white;"><small>ABSENT:</small></td>' +
                                '<td style="border: 0px solid white;">' +
                                addLeadingZero(2, absent) +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"></td>' +
                                '<td style="border: 0px solid white;"></td>' +
                                '<td style="border: 0px solid white;"><small>LATE:</small></td>' +
                                '<td style="border: 0px solid white;">' +
                                addLeadingZero(2, late) +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"></td>' +
                                '<td style="border: 0px solid white;"></td>' +
                                '<td style="border-left: 0px solid white;border-right: 0px solid white;">' +
                                '<small>TOTAL:</small>' +
                                '</td>' +
                                '<td style="border-left: 0px solid white;border-right: 0px solid white;">' +
                                addLeadingZero(2, total) +
                                '</td>' +
                                '</tr>' +
                                '</table>';
                            totalOverView += '<tr>' +
                                '<td>' +
                                sec.department +
                                '</td>' +
                                '<td>' +
                                sec.name +
                                '</td>' +
                                '<td>' +
                                addLeadingZero(2, present) +
                                '</td>' +
                                '<td>' +
                                addLeadingZero(2, late) +
                                '</td>' +
                                '<td>' +
                                addLeadingZero(2, (present + late)) +
                                '</td>' +
                                '<td>' +
                                addLeadingZero(2, absent) +
                                '</td>' +
                                '<td>' +
                                addLeadingZero(2, total) +
                                '</td>' +
                                '</tr>';
                            if (flag) {
                                htmlData += tmpHtmlHead;
                                htmlData += tmpHtmlData;
                                flag = 0;
                            }
                            cb_sec();
                        });
                    });
                } else {
                    cb_sec();
                }

            }, function(err) {
                totalOverView += '<tr>' +
                    '<td colspan=2><b>TOTAL</b></td>' +
                    '<td><b>' +
                    addLeadingZero(2, totalPresent) +
                    '</td></b>' +
                    '<td><b>' +
                    addLeadingZero(2, totalLate) +
                    '</td></b>' +
                    '<td><b>' +
                    addLeadingZero(2, (totalPresent + totalLate)) +
                    '</td></b>' +
                    '<td><b>' +
                    addLeadingZero(2, totalAbsent) +
                    '</td></b>' +
                    '<td><b>' +
                    addLeadingZero(2, grandTotal) +
                    '</td></b>' +
                    '</tr>' +
                    '</table>';

                var tFC = '<br />';
                tFC += '<table style="bottom:0;width:100%;border: 0px solid white;font-size: 12px;">';
                tFC += '<td style="border: 0px solid white;" align="center"><u>Executive (IT)</u></td>';
                tFC += '<td style="border: 0px solid white;" align="center"><u>HR Admin / Compliance</u></td>';
                tFC += '<td style="border: 0px solid white;" align="center"><u>DGM / GM</u></td>';
                tFC += '<td style="border: 0px solid white;" align="center"><u>Managing Director / Director</u></td>';
                tFC += '</tr>';
                tFC += '</table>';

                htmlData += totalOverView + tFC;
                htmlData += '</body></html>';
                var options = {
                    format: 'Letter',
                    header: {
                        height: "27mm",
                        contents: headerContents() +
                            '<h4 style="' +
                            'line-height: 0;' +
                            '">DAILY ATTENDANCE REPORT</h4>' +
                            '<h6 style="line-height: 0;">' +
                            ms.getDate() +
                            '<sup>' +
                            dayPower[ms.getDate()] +
                            '</sup> ' +
                            monthCapitalNames[ms.getMonth()] + ', ' +
                            ms.getUTCFullYear() +
                            '</h6>'
                    },
                    footer: {
                        height: "15mm",
                        contents: footerContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + values.file_name + '.pdf', function(err, res) {
                    // tmpStoreData.htmlData = htmlData;
                    // tmpStoreData.createDate = new Date();
                    socket.emit("DownloadDailyAttendanceComplianceReportPDF", 'success', totalOverView);
                });
            });
        });
    });

    socket.on('CreateEmployeeManualPunch', function(data) {
        CreateEmployeeManualPunch(db, data, function(data) {
            socket.emit("CreateEmployeeManualPunch", data)
        });
    });

}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;