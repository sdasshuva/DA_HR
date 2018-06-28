module.exports = function() {};

function timeValidBetween(fh, fm, th, tm, ch, cm) {
    var f = (parseInt(fh) * 3600) + (parseInt(fm) * 60);
    var t = (parseInt(th) * 3600) + (parseInt(tm) * 60);
    var c = (parseInt(ch) * 3600) + (parseInt(cm) * 60);
    return c >= f && c <= t;
}

function section_list(db, callback) {
    db.section.findAll({
        where: {},
        attributes: ['id', 'department', 'name', 'name_bangla', 'employee_type', 'created_at', 'updated_at'],
        include: [{
            model: db.department,
            attributes: ['id', 'name', 'created_at', 'updated_at'],
        }, {
            model: db.employee_type,
            attributes: ['id', 'name', 'created_at', 'updated_at'],
        }],
    }).complete(function(err, data) {
        data.sort(function(a, b) {
            a.name = a.name.toUpperCase();
            b.name = b.name.toUpperCase();
            if (a.name < b.name)
                return -1;
            if (a.name > b.name)
                return 1;
            return 0;
        });
        callback(data);
    })
}

function section_by_department_list(db, DID, callback) {
    db.section.findAll({
        where: {
            department: DID
        }
    }).complete(function(err, data) {
        data.sort(function(a, b) {
            if (a.name < b.name)
                return -1;
            if (a.name > b.name)
                return 1;
            return 0;
        });
        callback(data);
    })
}

function getSectionHourlyPunchDetailsGrid(db, QUERY, callback) {
    var returnData = [];
    getEmployeeDayAttendance(db, QUERY, function(attData) {
        async.each(attData, function(att, cb_att) {
            var o = att;
            o.present = 0;
            o.absent = 0;
            o.late = 0;
            o.in_late = 0;
            o.out_late = 0;
            o.ot1h = 0;
            o.ot2h = 0;
            o.ot3h = 0;
            o.ot4h = 0;
            o.ot5h = 0;
            o.ot6h = 0;
            o.ot7h = 0;
            o.ot8h = 0;
            o.ot9h = 0;
            o.ot10h = 0;
            o.ot11h = 0;
            o.ot12h = 0;
            o.ot13h = 0;
            var OT = att.overTime + att.excessOverTime;
            var workInTime = att.workInTime.split(":");
            var workOutTime = att.workOutTime.split(":");
            var InH = parseInt(workInTime[0]);
            var InM = parseInt(workInTime[1]);
            var OutH = parseInt(workOutTime[0]);
            var OutM = parseInt(workOutTime[1]);
            switch (att.attendanceStatus) {
                case 'P':
                    o.present = 1;
                    if (att.officeIn.h > InH || (att.officeIn.h == InH && att.officeIn.m > InM)) {
                        o.in_late = 1;
                        o.late = 1;
                    }
                    if (!(att.officeOut.h >= 17)) {
                        o.out_late = 1;
                        o.late = 1;
                    }
                    break;
                case 'A':
                    o.absent = 1;
                    break;
            }
            switch (OT) {
                case 1:
                    o.ot1h = 1;
                    break;
                case 2:
                    o.ot2h = 1;
                    break;
                case 3:
                    o.ot3h = 1;
                    break;
                case 4:
                    o.ot4h = 1;
                    break;
                case 5:
                    o.ot5h = 1;
                    break;
                case 6:
                    o.ot6h = 1;
                    break;
                case 7:
                    o.ot7h = 1;
                    break;
                case 8:
                    o.ot7h = 1;
                    break;
                case 9:
                    o.ot7h = 1;
                    break;
                case 10:
                    o.ot7h = 1;
                    break;
                case 11:
                    o.ot7h = 1;
                    break;
                case 12:
                    o.ot7h = 1;
                    break;
                case 13:
                    o.ot7h = 1;
                    break;
            }
            if (QUERY.hour == 0)
                returnData.push(o);
            else if (QUERY.hour == 1 && o.ot1h)
                returnData.push(o);
            else if (QUERY.hour == 2 && o.ot2h)
                returnData.push(o);
            else if (QUERY.hour == 3 && o.ot3h)
                returnData.push(o);
            else if (QUERY.hour == 4 && o.ot4h)
                returnData.push(o);
            else if (QUERY.hour == 5 && o.ot5h)
                returnData.push(o);
            else if (QUERY.hour == 6 && o.ot6h)
                returnData.push(o);
            else if (QUERY.hour == 7 && o.ot7h)
                returnData.push(o);
            else if (QUERY.hour == 8 && o.ot8h)
                returnData.push(o);
            else if (QUERY.hour == 9 && o.ot9h)
                returnData.push(o);
            else if (QUERY.hour == 10 && o.ot10h)
                returnData.push(o);
            else if (QUERY.hour == 11 && o.ot11h)
                returnData.push(o);
            else if (QUERY.hour == 12 && o.ot12h)
                returnData.push(o);
            else if (QUERY.hour == 13 && o.ot13h)
                returnData.push(o);
            cb_att();
        }, function(err) {
            callback(returnData);
        });
    });
}

function getSectionSummary(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findSection = {};
    findSection.attributes = [
        'id', 'name', 'department', 'employee_type'
    ];
    findSection.include = [{
        model: db.department,
        attributes: [
            'id', 'name'
        ]
    }, {
        model: db.employee_type,
        attributes: [
            'id', 'name'
        ]
    }, ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'employee_type';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findSection.order = [
        [SORT, DIR]
    ];
    db.section.findAll(findSection).complete(function(err, secData) {
        async.each(secData, function(sec, cb_sec) {
            var s = {};
            s.id = sec.id;
            s.name = sec.name.toUpperCase();
            s.department = sec.department;
            s.employee_type = sec.employee_type;
            s.departmentTable = sec.departmentTable;
            s.departmentTable.name = sec.departmentTable.name.toUpperCase();
            s.employeeTypeTable = sec.employeeTypeTable;
            s.employeeTypeTable.name = sec.employeeTypeTable.name.toUpperCase();
            s.regular_bank_emp = 0;
            s.regular_bank_salary = 0;
            s.regular_bank_ex_ot = 0;
            s.regular_bank_total = 0;
            s.regular_cash_emp = 0;
            s.regular_cash_salary = 0;
            s.regular_cash_ex_ot = 0;
            s.regular_cash_total = 0;
            s.regular_total = 0;
            s.hold_bank_emp = 0;
            s.hold_bank_salary = 0;
            s.hold_bank_ex_ot = 0;
            s.hold_bank_total = 0;
            s.hold_cash_emp = 0;
            s.hold_cash_salary = 0;
            s.hold_cash_ex_ot = 0;
            s.hold_cash_total = 0;
            s.hold_total = 0;
            s.total_salary = 0;
            var SEARCH = {};
            var findMonthlyAttendance = {};
            findMonthlyAttendance.where = {
                year: QUERY.year,
                month: QUERY.month
            };
            findMonthlyAttendance.attributes = [
                    'id', 'employee', 'year', 'month', 'present_days',
                    'absent_days', 'overtime', 'excess_overtime', 'in_late',
                    'out_late', 'bonus', 'created_at', 'updated_at'
                ],
                findMonthlyAttendance.include = [{
                    model: db.employee,
                    where: {
                        section: sec.id,
                        status: QUERY.status
                    },
                    attributes: [
                        'id', 'user', 'grade', 'designation', 'department', 'section',
                        'employee_type', 'date_of_join', 'work_time', 'status'
                    ],
                    include: [{
                        model: db.user,
                        attributes: [
                            'id', 'first_name', 'name_bangla'
                        ]
                    }, {
                        model: db.designation,
                        attributes: [
                            'id', 'name', 'attendance_bonus'
                        ]
                    }, {
                        model: db.section,
                        attributes: [
                            'id', 'name', 'employee_type'
                        ]
                    }, {
                        model: db.status,
                        attributes: [
                            'id', 'name'
                        ]
                    }, ]
                }];
            var SORT = (QUERY.sort) ? QUERY.sort : 'employee';
            var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
            findMonthlyAttendance.order = [
                [SORT, DIR]
            ];
            db.monthly_attendance.findAll(findMonthlyAttendance).complete(function(err, mtData) {
                async.each(mtData, function(mtD, cb_mtD) {
                    cb_mtD()
                }, function(err) {
                    returnData.push(s);
                    cb_sec();
                })
            })
        }, function(err) {
            returnData.sort(function(a, b) {
                var o1 = a.name;
                var o2 = b.name;

                var p1 = a.employee_type;
                var p2 = b.employee_type;

                if (p1 < p2) return -1;
                if (p1 > p2) return 1;
                if (o1 < o2) return -1;
                if (o1 > o2) return 1;
                return 0;
            });
            callback(returnData);
        });
    });
}

function getSection(db, QUERY, callback) {
    var SEARCH = {};
    var findData = {};
    var returnData = [];
    if (QUERY.id)
        SEARCH.id = QUERY.id
    if (QUERY.name)
        SEARCH.name = QUERY.name
    if (QUERY.department)
        SEARCH.department = QUERY.department
    var SORT = (QUERY.sort) ? QUERY.sort : 'name';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.where = SEARCH;
    findData.attributes = [
        'id', 'name', 'name_bangla', 'department', 'employee_type'
    ];
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.section.findAll(findData).complete(function(err, secData) {
        async.each(secData, function(sec, cb_sec) {
            var s = {};
            s.id = sec.id;
            s.name = sec.name.toUpperCase();
            var TMPsec = JSON.parse(JSON.stringify(sec));
            s.nameBangla = TMPsec.name_bangla;
            s.departmentID = sec.department;
            s.employee_type = sec.employee_type;
            var depSearch = {};
            depSearch.id = sec.department;
            getDepartment(db, depSearch, function(depData) {
                async.each(depData, function(dep, cb_dep) {
                    s.department = dep.name.toUpperCase();
                    cb_dep();
                }, function(err) {
                    returnData.push(s);
                    cb_sec();
                });
            });
        }, function(err) {
            returnData.sort(function(a, b) {
                var o1 = a.departmentID;
                var o2 = b.departmentID;

                var p1 = a.id;
                var p2 = b.id;

                if (o1 < o2) return -1;
                if (o1 > o2) return 1;
                if (p1 < p2) return -1;
                if (p1 > p2) return 1;
                return 0;
                // if (a.departmentID < b.departmentID)
                //   return -1;
                // if (a.departmentID > b.departmentID)
                //   return 1;
                // return 0;
            });
            callback(returnData);
        });
    })
}

function getSectionDetails(db, QUERY, callback) {
    var SEARCH = {};
    var findData = {};
    var returnData = [];
    if (QUERY.id)
        SEARCH.id = QUERY.id
    if (QUERY.name)
        SEARCH.name = QUERY.name
    if (QUERY.department)
        SEARCH.department = QUERY.department
    if (QUERY.employee_type)
        SEARCH.employee_type = QUERY.employee_type
    var SORT = (QUERY.sort) ? QUERY.sort : 'name';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.where = SEARCH;
    findData.attributes = [
        'id', 'name', 'name_bangla', 'department', 'employee_type'
    ];
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.section.findAll(findData).complete(function(err, secData) {
        async.each(secData, function(sec, cb_sec) {
            var s = {};
            s.id = sec.id;
            s.name = sec.name.toUpperCase();
            var TMPsec = JSON.parse(JSON.stringify(sec));
            s.nameBangla = TMPsec.name_bangla;
            s.departmentID = sec.department;
            s.employee_type = sec.employee_type;
            var depSearch = {};
            depSearch.id = sec.department;
            getDepartment(db, depSearch, function(depData) {
                async.each(depData, function(dep, cb_dep) {
                    s.department = dep.name.toUpperCase();
                    cb_dep();
                }, function(err) {
                    returnData.push(s);
                    cb_sec();
                });
            });
        }, function(err) {
            returnData.sort(function(a, b) {
                var o1 = a.departmentID;
                var o2 = b.departmentID;

                var p1 = a.name;
                var p2 = b.name;

                if (o1 < o2) return -1;
                if (o1 > o2) return 1;
                if (p1 < p2) return -1;
                if (p1 > p2) return 1;
                return 0;
            });
            callback(returnData);
        });
    })
}

function getSectionNightTiffinDetails(db, QUERY, callback) {
    var returnData = [];
    getEmployee(db, QUERY, function(empData) {
        async.each(empData, function(emp, cb_emp) {
            var o = {};
            // o.emp = emp;
            o.id = emp.id;
            o.card_no = emp.card_no;
            o.name = emp.name;
            o.name_bangla = emp.name_bangla;
            o.section = emp.sectionName;
            o.department = emp.departmentName;
            o.designation = emp.designationTable.name.toUpperCase();
            o.designationBangla = emp.designationTable.name_bangla;
            var dayArray = [];
            async.each(QUERY.dateArray, function(da, cb_da) {
                o[da] = {};
                o[da].status = 0;
                o[da].time = '00:00 NN';
                dayArray.push(da);
                cb_da();
            }, function(err) {
                async.each(dayArray, function(day, cb_day) {
                    var AttQuery = {};
                    AttQuery.id = emp.id;
                    AttQuery.employee = emp.id;
                    AttQuery.date = new Date(day);
                    getEmployeeDayAttendance(db, AttQuery, function(attData) {
                        async.each(attData, function(att, cb_att) {
                            var fh = parseInt(QUERY.from_time_h);
                            var fm = parseInt(QUERY.from_time_m);
                            var th = parseInt(QUERY.to_time_h);
                            var tm = parseInt(QUERY.to_time_m);
                            var ch = parseInt(att.officeOut.h);
                            var cm = parseInt(att.officeOut.m);
                            if (timeValidBetween(fh, fm, th, tm, ch, cm))
                                o[day].status = 1;
                            o[day].time = att.officeOut.time;
                            cb_att();
                        }, function(err) {
                            cb_day();
                        });
                    })
                }, function(err) {
                    returnData.push(o);
                    cb_emp();
                });
            });
        }, function(err) {
            returnData.sort(function(a, b) {
                var o1 = a.id;
                var o2 = b.id;
                if (o1 < o2) return -1;
                if (o1 > o2) return 1;
                return 0;
            });
            callback(returnData);
        });
    });
}

function getSectionID(db, QUERY, callback) {
    var SEARCH = {};
    var findData = {};
    var returnData = [];
    if (QUERY.id)
        SEARCH.id = QUERY.id
    if (QUERY.name)
        SEARCH.name = QUERY.name
    if (QUERY.department)
        SEARCH.department = QUERY.department
    var SORT = (QUERY.sort) ? QUERY.sort : 'name';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.where = SEARCH;
    findData.attributes = [
        'id', 'name', 'department', 'employee_type'
    ];
    findData.include = [{
        model: db.department,
        attributes: [
            'id', 'name'
        ]
    }, {
        model: db.employee_type,
        attributes: [
            'id', 'name'
        ]
    }, ];
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.section.findAll(findData).complete(function(err, secData) {
        async.each(secData, function(sec, cb_sec) {
            var s = {};
            s.id = sec.id;
            s.name = sec.name.toUpperCase();
            s.employee_type = sec.employee_type;
            s.departmentID = sec.department;
            s.department = (sec.departmentTable) ? sec.departmentTable.name.toUpperCase() : 'DEPARTMENT NOT FOUND';
            returnData.push(s);
            cb_sec();
        }, function(err) {
            returnData.sort(function(a, b) {
                var o1 = a.departmentID;
                var o2 = b.departmentID;

                var p1 = a.id;
                var p2 = b.id;

                if (o1 < o2) return -1;
                if (o1 > o2) return 1;
                if (p1 < p2) return -1;
                if (p1 > p2) return 1;
                return 0;
            });
            callback(returnData);
        });
    })
}

function getComparativeSalarySearch(db, QUERY, callback) {
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    var returnData = [];
    var SEARCH = {};
    var secSearch = {};
    if (QUERY.section) {
        SEARCH.section = QUERY.section;
    }
    if (QUERY.section) {
        secSearch.id = QUERY.section;
    }
    SEARCH.date = d;
    SEARCH.status = [1, 2];
    var o = {};
    getSection(db, secSearch, function(secData) {
        async.each(secData, function(sec, cb_sec) {
            o[sec.name] = {};
            o[sec.name].staff = false;
            o[sec.name].name = sec.name.toUpperCase();
            o[sec.name].empCount = 0;
            o[sec.name].salary = 0;
            o[sec.name].ot = 0;
            o[sec.name].regular = {};
            o[sec.name].regular.empCount = 0;
            o[sec.name].regular.salary = 0;
            o[sec.name].regular.ot = 0;
            o[sec.name].regular.bank = {};
            o[sec.name].regular.bank.empCount = 0;
            o[sec.name].regular.bank.salary = 0;
            o[sec.name].regular.bank.ot = 0;
            o[sec.name].regular.cash = {};
            o[sec.name].regular.cash.empCount = 0;
            o[sec.name].regular.cash.salary = 0;
            o[sec.name].regular.cash.ot = 0;
            o[sec.name].hold = {};
            o[sec.name].hold.empCount = 0;
            o[sec.name].hold.salary = 0;
            o[sec.name].hold.ot = 0;
            o[sec.name].hold.bank = {};
            o[sec.name].hold.bank.empCount = 0;
            o[sec.name].hold.bank.salary = 0;
            o[sec.name].hold.bank.ot = 0;
            o[sec.name].hold.cash = {};
            o[sec.name].hold.cash.empCount = 0;
            o[sec.name].hold.cash.salary = 0;
            o[sec.name].hold.cash.ot = 0;
            cb_sec();
        }, function(err) {
            getEmployeeMonthSummaryV2(db, SEARCH, function(empData) {
                async.each(empData, function(emp, cb_emp) {
                    o[emp.section].staff = (emp.employee_type == "STAFF") ? true : false;
                    if (emp.status == "REGULAR" && emp.salary > 0) {
                        o[emp.section].empCount++;
                        o[emp.section].salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                        o[emp.section].ot += (emp.excessOverTimeAmount <= 0 || o[emp.section].staff) ? 0 : emp.excessOverTimeAmount;
                        o[emp.section].regular.empCount++;
                        o[emp.section].regular.salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                        o[emp.section].regular.ot += (emp.excessOverTimeAmount <= 0 || o[emp.section].staff) ? 0 : emp.excessOverTimeAmount;
                        if (emp.payment_method == 2) {
                            o[emp.section].regular.bank.empCount++;
                            o[emp.section].regular.bank.salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                            o[emp.section].regular.bank.ot += (emp.excessOverTimeAmount <= 0 || o[emp.section].staff) ? 0 : emp.excessOverTimeAmount;
                        } else {
                            o[emp.section].regular.cash.empCount++;
                            o[emp.section].regular.cash.salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                            o[emp.section].regular.cash.ot += (emp.excessOverTimeAmount <= 0 || o[emp.section].staff) ? 0 : emp.excessOverTimeAmount;
                        }
                    } else if (emp.status == "HOLD" && emp.salary > 0) {
                        o[emp.section].empCount++;
                        o[emp.section].salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                        o[emp.section].ot += (emp.excessOverTimeAmount <= 0 || o[emp.section].staff) ? 0 : emp.excessOverTimeAmount;
                        o[emp.section].hold.empCount++;
                        o[emp.section].hold.salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                        o[emp.section].hold.ot += (emp.excessOverTimeAmount <= 0 || o[emp.section].staff) ? 0 : emp.excessOverTimeAmount;
                        if (emp.payment_method == 2) {
                            o[emp.section].hold.bank.empCount++;
                            o[emp.section].hold.bank.salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                            o[emp.section].hold.bank.ot += (emp.excessOverTimeAmount <= 0 || o[emp.section].staff) ? 0 : emp.excessOverTimeAmount;
                        } else {
                            o[emp.section].hold.cash.empCount++;
                            o[emp.section].hold.cash.salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                            o[emp.section].hold.cash.ot += (emp.excessOverTimeAmount <= 0 || o[emp.section].staff) ? 0 : emp.excessOverTimeAmount;
                        }
                    }
                    cb_emp();
                }, function(err) {
                    callback(o);
                })
            });
        });
    });
}

function getComparativeSalarySearchB(db, QUERY, callback) {
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    var returnData = [];
    var SEARCH = {};
    var secSearch = {};
    if (QUERY.section) {
        SEARCH.section = QUERY.section;
    }
    if (QUERY.section) {
        secSearch.id = QUERY.section;
    }
    SEARCH.date = d;
    SEARCH.status = [1, 2];
    var o = {};
    getSection(db, secSearch, function(secData) {
        async.each(secData, function(sec, cb_sec) {
            o[sec.name] = {};
            o[sec.name].staff = false;
            o[sec.name].name = sec.name.toUpperCase();
            o[sec.name].empCount = 0;
            o[sec.name].salary = 0;
            o[sec.name].ot = 0;
            o[sec.name].regular = {};
            o[sec.name].regular.empCount = 0;
            o[sec.name].regular.salary = 0;
            o[sec.name].regular.ot = 0;
            o[sec.name].regular.bank = {};
            o[sec.name].regular.bank.empCount = 0;
            o[sec.name].regular.bank.salary = 0;
            o[sec.name].regular.bank.ot = 0;
            o[sec.name].regular.cash = {};
            o[sec.name].regular.cash.empCount = 0;
            o[sec.name].regular.cash.salary = 0;
            o[sec.name].regular.cash.ot = 0;
            o[sec.name].hold = {};
            o[sec.name].hold.empCount = 0;
            o[sec.name].hold.salary = 0;
            o[sec.name].hold.ot = 0;
            o[sec.name].hold.bank = {};
            o[sec.name].hold.bank.empCount = 0;
            o[sec.name].hold.bank.salary = 0;
            o[sec.name].hold.bank.ot = 0;
            o[sec.name].hold.cash = {};
            o[sec.name].hold.cash.empCount = 0;
            o[sec.name].hold.cash.salary = 0;
            o[sec.name].hold.cash.ot = 0;
            cb_sec();
        }, function(err) {
            getEmployeeMonthSummaryB(db, SEARCH, function(empData) {
                async.each(empData, function(emp, cb_emp) {
                    o[emp.section].staff = (emp.employee_type == "STAFF") ? true : false;
                    if (emp.status == "REGULAR" && emp.salary > 0) {
                        o[emp.section].empCount++;
                        o[emp.section].salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                        o[emp.section].ot += (emp.excessOverTimeAmount <= 0 || o[emp.section].staff) ? 0 : emp.excessOverTimeAmount;
                        o[emp.section].regular.empCount++;
                        o[emp.section].regular.salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                        o[emp.section].regular.ot += (emp.excessOverTimeAmount <= 0 || o[emp.section].staff) ? 0 : emp.excessOverTimeAmount;
                        if (emp.payment_method == 2) {
                            o[emp.section].regular.bank.empCount++;
                            o[emp.section].regular.bank.salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                            o[emp.section].regular.bank.ot += (emp.excessOverTimeAmount <= 0 || o[emp.section].staff) ? 0 : emp.excessOverTimeAmount;
                        } else {
                            o[emp.section].regular.cash.empCount++;
                            o[emp.section].regular.cash.salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                            o[emp.section].regular.cash.ot += (emp.excessOverTimeAmount <= 0 || o[emp.section].staff) ? 0 : emp.excessOverTimeAmount;
                        }
                    } else if (emp.status == "HOLD" && emp.salary > 0) {
                        o[emp.section].empCount++;
                        o[emp.section].salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                        o[emp.section].ot += (emp.excessOverTimeAmount <= 0 || o[emp.section].staff) ? 0 : emp.excessOverTimeAmount;
                        o[emp.section].hold.empCount++;
                        o[emp.section].hold.salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                        o[emp.section].hold.ot += (emp.excessOverTimeAmount <= 0 || o[emp.section].staff) ? 0 : emp.excessOverTimeAmount;
                        if (emp.payment_method == 2) {
                            o[emp.section].hold.bank.empCount++;
                            o[emp.section].hold.bank.salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                            o[emp.section].hold.bank.ot += (emp.excessOverTimeAmount <= 0 || o[emp.section].staff) ? 0 : emp.excessOverTimeAmount;
                        } else {
                            o[emp.section].hold.cash.empCount++;
                            o[emp.section].hold.cash.salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                            o[emp.section].hold.cash.ot += (emp.excessOverTimeAmount <= 0 || o[emp.section].staff) ? 0 : emp.excessOverTimeAmount;
                        }
                    }
                    cb_emp();
                }, function(err) {
                    callback(o);
                })
            });
        });
    });
}

function CreateSection(db, DATA, callback) {
    db.section.create({
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

function DestroySection(db, DATA, callback) {
    db.section.destroy({
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


function routerInit(app, dbFull) {
    var db = dbFull.DA_HR

    app.get('/section', /*isAuthenticated,*/ function(req, res) {
        section_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/section/:DID', /*isAuthenticated,*/ function(req, res) {
        var DID = req.params.DID;
        section_by_department_list(db, DID, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/sectionHourlyPunchDetailsGrid/:SECID/:DATE', /*isAuthenticated,*/ function(req, res) {
        var SEARCH = {};
        SEARCH.section = req.params.SECID;
        SEARCH.date = req.params.DATE;
        SEARCH.hour = (req.query.hour) ? parseInt(req.query.hour) : 0;
        SEARCH.status = [1, 2];
        getSectionHourlyPunchDetailsGrid(db, SEARCH, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getSectionSummary', /*isAuthenticated,*/ function(req, res) {
        getSectionSummary(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getSection', /*isAuthenticated,*/ function(req, res) {
        getSection(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getSection/:TYPE', /*isAuthenticated,*/ function(req, res) {
        req.query.employee_type = req.params.TYPE;
        getSectionDetails(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getSectionNightTiffinDetails', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.employee_type = 2;
        QUERY.status = 2;
        var htmlData =
            '<!DOCTYPE html>' +
            '<head>' +
            '<style>' +
            'table, th, td {' +
            'border: 1px solid black;' +
            'border-collapse: collapse;' +
            '}' +
            'th, td {' +
            'padding: 5px;' +
            'line-height: 1;' +
            'align: center;' +
            '}' +
            'h1, h2, h3, h4, h5, h6 {' +
            'line-height: 0;' +
            'text-align: center;' +
            '}' +
            '#pageBody {' +
            'font-size: 9px;' +
            'padding: 0px 0px;' +
            'page-break-after: always;' +
            '}' +
            '#pageBody:last-child {' +
            'page-break-after: avoid;' +
            '}' +
            '</style>' +
            '</head>' +
            '<body>' +
            headerContents();
        getSectionDetails(db, QUERY, function(secData) {
            async.each(secData, function(sec, cb_sec) {
                QUERY.section = sec.id;
                var secHTML = '';
                getSectionNightTiffinDetails(db, QUERY, function(rData) {
                    secHTML += '<div id="pageBody">' +
                        '<b style="line-height:2"><big>SECTION: ' +
                        sec.name +
                        '</big></b>' +
                        '<table style="width:100%;">' +
                        '<tr>' +
                        '<th>#</th>' +
                        // '<th>SECTION</th>'+
                        '<th><small>EMPLOYEE ID</small></th>' +
                        '<th>EMPLOYEE NAME</th>' +
                        '<th>DESIGNATION</th>' +
                        '<th><small>2017-12-30</small></th>' +
                        '<th><small>2017-12-31</small></th>' +
                        '<th><small>2018-01-01</small></th>' +
                        '<th><small>2018-01-02</small></th>' +
                        '<th><small>2018-01-03</small></th>' +
                        '<th><small>2018-01-04</small></th>' +
                        '<th><small>TOTAL</small></th>' +
                        '<th><small>..SIGNATURE..</small></th>' +
                        '</tr>';
                    rData.sort(function(a, b) {
                        var o1 = a.section;
                        var o2 = b.section;
                        if (o1 < o2) return -1;
                        if (o1 > o2) return 1;
                        return 0;
                    });
                    var dt1 = 0;
                    var dt2 = 0;
                    var dt3 = 0;
                    var dt4 = 0;
                    var dt5 = 0;
                    var dt6 = 0;
                    var Gtotal = 0;
                    var r = 1;
                    async.each(rData, function(emp, cb_emp) {
                        var d1 = emp["2017-12-30"].status;
                        var d2 = emp["2017-12-31"].status;
                        var d3 = emp["2018-01-01"].status;
                        var d4 = emp["2018-01-02"].status;
                        var d5 = emp["2018-01-03"].status;
                        var d6 = emp["2018-01-04"].status;
                        var tBill = (emp.designation == 'PACKINGMAN') ? 18 : ((emp.designation == 'IRONMAN') ? 24 : 12);
                        dt1 += (d1 * tBill);
                        dt2 += (d2 * tBill);
                        dt3 += (d3 * tBill);
                        dt4 += (d4 * tBill);
                        dt5 += (d5 * tBill);
                        dt6 += (d6 * tBill);
                        var total = (d1 + d2 + d3 + d4 + d5 + d6) * tBill;
                        Gtotal += total;
                        var rowData = '<tr>' +
                            '<td height="45" align="center">' + r + '</td>' +
                            // '<td style="white-space:nowrap;"><small><small><b>'+emp.section+'</b></small></small></td>'+
                            '<td align="center">' + addLeadingZero(9, emp.id) + '</td>' +
                            '<td style="white-space:nowrap;"><small><b>' + emp.name + '</b></small></td>' +
                            '<td style="white-space:nowrap;"><small><small><b>' + emp.designation + '</b></small></small></td>' +
                            '<td align="center" ' + (d1 ? 'bgcolor="#F4FEF4"' : '') + '>' + emp["2017-12-30"].time + '</td>' +
                            '<td align="center" ' + (d2 ? 'bgcolor="#F4FEF4"' : '') + '>' + emp["2017-12-31"].time + '</td>' +
                            '<td align="center" ' + (d3 ? 'bgcolor="#F4FEF4"' : '') + '>' + emp["2018-01-01"].time + '</td>' +
                            '<td align="center" ' + (d4 ? 'bgcolor="#F4FEF4"' : '') + '>' + emp["2018-01-02"].time + '</td>' +
                            '<td align="center" ' + (d5 ? 'bgcolor="#F4FEF4"' : '') + '>' + emp["2018-01-03"].time + '</td>' +
                            '<td align="center" ' + (d6 ? 'bgcolor="#F4FEF4"' : '') + '>' + emp["2018-01-04"].time + '</td>' +

                            // '<td align="center" >'+emp["2017-12-30"].time+'</td>'+
                            // '<td align="center" >'+emp["2017-12-31"].time+'</td>'+
                            // '<td align="center" >'+emp["2018-01-01"].time+'</td>'+
                            // '<td align="center" >'+emp["2018-01-02"].time+'</td>'+
                            // '<td align="center" >'+emp["2018-01-03"].time+'</td>'+
                            // '<td align="center" >'+emp["2018-01-04"].time+'</td>'+
                            '<td align="right" >' + total.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right" ></td>' +
                            '</tr>';
                        if (total > 0) {
                            secHTML += rowData;
                            r++;
                        }
                        cb_emp();
                    }, function(err) {
                        secHTML += '<tr>' +
                            '<td colspan="4" align="left"><b>TOTAL</b></td>' +
                            '<td align="right" >' + dt1.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right" >' + dt2.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right" >' + dt3.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right" >' + dt4.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right" >' + dt5.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right" >' + dt6.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right" >' + Gtotal.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right" ></td>' +
                            '</tr>' +
                            '</table></div>';
                        if (Gtotal > 0) {
                            htmlData += secHTML;
                        }
                        cb_sec();
                    });
                });
            }, function(err) {
                htmlData += '</body></html>';
                var options = {
                    format: 'A4',
                    header: {
                        height: "5mm",
                        // contents: headerContents()
                    },
                    footer: {
                        height: "12mm",
                        contents: footerTContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/NightTiffin.pdf', function(err, r) {
                    res.redirect('/uploads/pdf/NightTiffin.pdf');
                    // res.setHeader('Content-Type', 'application/json');
                    // res.send(htmlData);
                });
            });
        });
    });

    app.get('/getSectionID', /*isAuthenticated,*/ function(req, res) {
        getSectionID(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getSectionID/:NAME', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.name = req.params.NAME;
        getSectionID(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DownloadNightTiffinDetailsReport', function(QUERY) {
        var htmlData =
            '<!DOCTYPE html>' +
            '<head>' +
            '<style>' +
            'table, th, td {' +
            'border: 1px solid black;' +
            'border-collapse: collapse;' +
            '}' +
            'th, td {' +
            'padding: 5px;' +
            'line-height: 1;' +
            'align: center;' +
            '}' +
            'h1, h2, h3, h4, h5, h6 {' +
            'line-height: 0;' +
            'text-align: center;' +
            '}' +
            '#pageBody {' +
            'font-size: 9px;' +
            'padding: 0px 0px;' +
            'page-break-after: always;' +
            '}' +
            '#tiffinBody {' +
            'font-size: 11px;' +
            'padding: 20px 20px;' +
            '}' +
            '#pageBody:last-child {' +
            'page-break-after: avoid;' +
            '}' +
            '</style>' +
            '</head>' +
            '<body>' +
            headerContents();
        var tiffinSummary = '<div id="tiffinBody" align="center">' +
            '<h3 style="line-height: 0;">' + factoryName + '</h3>' +
            '<h4 style="line-height: 0;">FROM ' + new Date(QUERY.form_date).formatDate() + ' TO ' + new Date(QUERY.to_date).formatDate() + '</h4>' +
            '<b style="line-height:2"><big><u>TIFFIN BILL SUMMARY</u></big></b>' +
            '<table style="width:50%;">' +
            '<tr>' +
            '<th>#</th>' +
            '<th>SECTION</th>' +
            '<th>TOTAL</th>' +
            '</tr>';
        var tr = 1;
        var tiffinGross = 0;
        getSectionDetails(db, QUERY, function(secData) {
            secData.sort(function(a, b) {
                var o1 = a.name;
                var o2 = b.name;
                if (o1 < o2) return -1;
                if (o1 > o2) return 1;
                return 0;
            });
            async.each(secData, function(sec, cb_sec) {
                QUERY.section = sec.id;
                var secHTML = '';
                getSectionNightTiffinDetails(db, QUERY, function(rData) {
                    secHTML += '<div id="pageBody">' +
                        '<b style="line-height:2"><big>SECTION: ' +
                        sec.name +
                        '</big></b>' +
                        '<table style="width:100%;">' +
                        '<tr>' +
                        '<th>#</th>' +
                        '<th><small>EMP ID /<br />কার্ড</small></th>' +
                        '<th>EMPLOYEE NAME</th>' +
                        '<th>DESIGNATION</th>';
                    for (var i = 0; i < QUERY.dateArray.length; i++) {
                        secHTML += '<th><small>';
                        secHTML += QUERY.dateArray[i];
                        secHTML += '</small></th>';
                    }
                    secHTML += '<th><small>TOTAL</small></th>' +
                        '<th><small>..SIGNATURE..</small></th>' +
                        '</tr>';
                    var dtotalA = {};
                    for (var i = 0; i < QUERY.dateArray.length; i++) {
                        dtotalA[QUERY.dateArray[i]] = 0;
                    }
                    var Gtotal = 0;
                    var r = 1;
                    async.each(rData, function(emp, cb_emp) {
                        var tBill = 12;
                        if (emp.designation == 'PACKINGMAN' || emp.designation == 'POLYMAN' || emp.designation == 'SPOTMAN')
                            tBill = 18
                        if (emp.designation == 'IRONMAN' && emp.department == 'FINISHING')
                            tBill = 24
                        if (emp.designation == 'CUTTERMAN')
                            tBill = 24
                        if (QUERY.employee_type == 1)
                            tBill = 15
                        if (emp.id == 1001)
                            tBill = 20
                        var total = 0;
                        var rowData = '<tr>' +
                            '<td height="45" align="center">' + r + '</td>' +
                            '<td align="center">' + addLeadingZero(9, emp.id) + '<br /><small><b>' + numEngToBan(emp.card_no) + '</b></small></td>' +
                            '<td style="white-space:nowrap;"><small><b>' + emp.name + '<br />' + emp.name_bangla + '</b></small></td>' +
                            '<td style="white-space:nowrap;"><small><small><b>' + emp.designation + '<br />' + emp.designationBangla + '</b></small></small></td>';
                        for (var i = 0; i < QUERY.dateArray.length; i++) {
                            var dtmp = emp[QUERY.dateArray[i]].status;
                            // rowData+='<td align="center" '+(dtmp?'bgcolor="#F4FEF4"':'')+'>'+emp[QUERY.dateArray[i]].time+'</td>';
                            rowData += '<td align="right" ' + (dtmp ? 'bgcolor="#F4FEF4"' : '') + '><big>' + (dtmp * tBill).formatMoney(2, '.', ',') + '</big></td>';
                            dtotalA[QUERY.dateArray[i]] += (dtmp * tBill);
                            total += dtmp;
                        }
                        total *= tBill;
                        Gtotal += total;
                        rowData += '<td align="right" ><big>' + total.formatMoney(2, '.', ',') + '</big></td>' +
                            '<td align="right" ></td>' +
                            '</tr>';
                        if (total > 0) {
                            secHTML += rowData;
                            r++;
                        }
                        cb_emp();
                    }, function(err) {
                        secHTML += '<tr>' +
                            '<td colspan="4" align="left"><b>TOTAL</b></td>';
                        for (var i = 0; i < QUERY.dateArray.length; i++) {
                            secHTML += '<td align="right" >' + dtotalA[QUERY.dateArray[i]].formatMoney(2, '.', ',') + '</td>';
                        }
                        secHTML += '<td align="right" >' + Gtotal.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="right" ></td>' +
                            '</tr>' +
                            '</table></div>';
                        if (Gtotal > 0) {
                            htmlData += secHTML;
                            tiffinSummary += '<tr>' +
                                '<td align="center">' + tr + '</td>' +
                                '<td align="left" >' + sec.name + '</td>' +
                                '<td align="right" >' + Gtotal.formatMoney(2, '.', ',') + '</td>' +
                                '</tr>';
                            tiffinGross += Gtotal;
                            tr++;
                        }
                        cb_sec();
                    });
                });
            }, function(err) {
                tiffinSummary += '<tr>' +
                    '<td align="left"  colspan="2">GROSS TOTAL</td>' +
                    '<td align="right" >' + tiffinGross.formatMoney(2, '.', ',') + '</td>' +
                    '</tr>' +
                    '</table></div>';
                htmlData += tiffinSummary + '</body></html>';
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header: {
                        height: "5mm",
                    },
                    footer: {
                        height: "12mm",
                        contents: footerTContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, r) {
                    socket.emit("DownloadNightTiffinDetailsReport", 'success');
                });
            });
        });
    });

    socket.on('DownloadSectionHourlyPunchReport', function(eData, fileName) {
        var r = 1;
        var ot1h = 0;
        var ot2h = 0;
        var ot3h = 0;
        var ot4h = 0;
        var ot5h = 0;
        var ot6h = 0;
        var ot7h = 0;
        var ot8h = 0;
        var ot9h = 0;
        var ot10h = 0;
        var ot11h = 0;
        var ot12h = 0;
        var ot13h = 0;
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            bonusStatementReportHead() +
            '<div id="pageBody">' +
            '<b style="line-height:2"><big>SECTION: ' +
            eData.sectionName.toUpperCase() +
            '</big></b>' +
            '<table style="width:100%;">' +
            '<tr>' +
            '<th rowspan=2>#</th>' +
            '<th rowspan=2><small>EMPLOYEE ID</small></th>' +
            '<th rowspan=2>EMPLOYEE NAME</th>' +
            // '<th rowspan=2><small>LAST PUNCH</small></th>'+
            '<th rowspan=2><small><small>IN TIME</small></small></th>' +
            '<th rowspan=2><small><small>OUT TIME</small></small></th>' +
            '<th colspan=13>OVERTIME EMPLOYEE COUNT</th>' +
            '</tr>' +
            '<tr>' +
            '<th><small><small>1 H</small></small></th>' +
            '<th><small><small>2 H</small></small></th>' +
            '<th><small><small>3 H</small></small></th>' +
            '<th><small><small>4 H</small></small></th>' +
            '<th><small><small>5 H</small></small></th>' +
            '<th><small><small>6 H</small></small></th>' +
            '<th><small><small>7 H</small></small></th>' +
            '<th><small><small>8 H</small></small></th>' +
            '<th><small><small>9 H</small></small></th>' +
            '<th><small><small>10 H</small></small></th>' +
            '<th><small><small>11 H</small></small></th>' +
            '<th><small><small>12 H</small></small></th>' +
            '<th><small><small>13 H</small></small></th>' +
            '</tr>';
        getSectionHourlyPunchDetailsGrid(db, eData, function(rData) {
            rData.sort(function(a, b) {
                var o1 = a.id;
                var o2 = b.id;
                if (o1 < o2) return -1;
                if (o1 > o2) return 1;
                return 0;
            });
            async.each(rData, function(emp, cb_emp) {
                ot1h += emp.ot1h;
                ot2h += emp.ot2h;
                ot3h += emp.ot3h;
                ot4h += emp.ot4h;
                ot5h += emp.ot5h;
                ot6h += emp.ot6h;
                ot7h += emp.ot7h;
                ot8h += emp.ot8h;
                ot9h += emp.ot9h;
                ot10h += emp.ot10h;
                ot11h += emp.ot11h;
                ot12h += emp.ot12h;
                ot13h += emp.ot13h;
                htmlData += '<tr>' +
                    '<td align="center">' + r + '</td>' +
                    '<td align="center">' + addLeadingZero(9, emp.id) + '</td>' +
                    '<td style="white-space:nowrap;">' + emp.name + '</td>' +
                    // '<td align="center">'+emp.last_punch+'</td>'+
                    '<td align="center">' + emp.officeIn.time + '</td>' +
                    '<td align="center">' + emp.officeOut.time + '</td>' +
                    '<td align="center">' + emp.ot1h + '</td>' +
                    '<td align="center">' + emp.ot2h + '</td>' +
                    '<td align="center">' + emp.ot3h + '</td>' +
                    '<td align="center">' + emp.ot4h + '</td>' +
                    '<td align="center">' + emp.ot5h + '</td>' +
                    '<td align="center">' + emp.ot6h + '</td>' +
                    '<td align="center">' + emp.ot7h + '</td>' +
                    '<td align="center">' + emp.ot8h + '</td>' +
                    '<td align="center">' + emp.ot9h + '</td>' +
                    '<td align="center">' + emp.ot10h + '</td>' +
                    '<td align="center">' + emp.ot11h + '</td>' +
                    '<td align="center">' + emp.ot12h + '</td>' +
                    '<td align="center">' + emp.ot13h + '</td>' +
                    '</tr>';
                r++;
                cb_emp();
            }, function(err) {
                htmlData += '<tr>' +
                    '<td colspan="5"><b>TOTAL</b></td>' +
                    '<td align="center" ><b>' + ot1h + '</b></td>' +
                    '<td align="center" ><b>' + ot2h + '</b></td>' +
                    '<td align="center" ><b>' + ot3h + '</b></td>' +
                    '<td align="center" ><b>' + ot4h + '</b></td>' +
                    '<td align="center" ><b>' + ot5h + '</b></td>' +
                    '<td align="center" ><b>' + ot6h + '</b></td>' +
                    '<td align="center" ><b>' + ot7h + '</b></td>' +
                    '<td align="center" ><b>' + ot8h + '</b></td>' +
                    '<td align="center" ><b>' + ot9h + '</b></td>' +
                    '<td align="center" ><b>' + ot10h + '</b></td>' +
                    '<td align="center" ><b>' + ot11h + '</b></td>' +
                    '<td align="center" ><b>' + ot12h + '</b></td>' +
                    '<td align="center" ><b>' + ot13h + '</b></td>' +
                    '</tr>' +
                    '</table></div>' +
                    '</body></html>';
                var options = {
                    format: 'A4',
                    header: {
                        height: "5mm",
                        // contents: bonusStatementHeader(eData.date, 'QUERY.festive_type')
                    },
                    footer: {
                        height: "5mm",
                        // contents: footerSContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + fileName + '.pdf', function(err, res) {
                    socket.emit("DownloadSectionHourlyPunchReport", 'success');
                });
            });
        });
    });

    socket.on('UpdateComparativeSalarySection', function(QUERY) {
        var returnData = [];
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var SEARCH = {};
        SEARCH.section = QUERY.section;
        SEARCH.date = (QUERY.date) ? new Date(QUERY.date) : new Date();
        SEARCH.date.setDate(10);
        getComparativeSalarySearch(db, SEARCH, function(compSal) {
            var bulkValues = [];
            var rc = {};
            rc.date = SEARCH.date;
            rc.section = QUERY.section;
            rc.status = 1;
            rc.payment_method = 1;
            rc.employee_type = QUERY.employee_type;
            rc.employee_count = compSal[QUERY.secName].regular.cash.empCount;
            rc.salary_amount = compSal[QUERY.secName].regular.cash.salary;
            rc.ot_amount = compSal[QUERY.secName].regular.cash.ot;
            bulkValues.push(rc);
            var rb = {};
            rb.date = SEARCH.date;
            rb.section = QUERY.section;
            rb.status = 1;
            rb.payment_method = 2;
            rb.employee_type = QUERY.employee_type;
            rb.employee_count = compSal[QUERY.secName].regular.bank.empCount;
            rb.salary_amount = compSal[QUERY.secName].regular.bank.salary;
            rb.ot_amount = compSal[QUERY.secName].regular.bank.ot;
            bulkValues.push(rb);
            var hb = {};
            hb.date = SEARCH.date;
            hb.section = QUERY.section;
            hb.status = 2;
            hb.payment_method = 2;
            hb.employee_type = QUERY.employee_type;
            hb.employee_count = compSal[QUERY.secName].hold.bank.empCount;
            hb.salary_amount = compSal[QUERY.secName].hold.bank.salary;
            hb.ot_amount = compSal[QUERY.secName].hold.bank.ot;
            bulkValues.push(hb);
            var hc = {};
            hc.date = SEARCH.date;
            hc.section = QUERY.section;
            hc.status = 2;
            hc.payment_method = 1;
            hc.employee_type = QUERY.employee_type;
            hc.employee_count = compSal[QUERY.secName].hold.cash.empCount;
            hc.salary_amount = compSal[QUERY.secName].hold.cash.salary;
            hc.ot_amount = compSal[QUERY.secName].hold.cash.ot;
            bulkValues.push(hc);
            async.each(bulkValues, function(bV, cb_bV) {
                db.comparative_salary.create(bV).complete(function(err, cS) {
                    if (err) {
                        var tmpD1 = new Date(QUERY.date);
                        database.sequelize.query(
                            'UPDATE `comparative_salary` ' +
                            'SET `employee_count` = ' + bV.employee_count + ', ' +
                            '`salary_amount` = ' + bV.salary_amount + ', ' +
                            '`ot_amount` = ' + bV.ot_amount + ' ' +
                            'WHERE MONTH(`date`) = "' + (tmpD1.getMonth() + 1) + '" ' +
                            'AND YEAR(`date`) = "' + tmpD1.getFullYear() + '" ' +
                            'AND `section` = ' + bV.section + ' ' +
                            'AND `status` = ' + bV.status + ' ' +
                            'AND `payment_method` = ' + bV.payment_method + ';'
                        ).complete(function(err, qD31) {
                            cb_bV();
                        });
                    } else {
                        cb_bV();
                    }
                });
            }, function(err) {
                socket.emit("UpdateComparativeSalarySection" + QUERY.section, 'success');
            });
        });
    });

    socket.on('UpdateComparativeSalarySectionB', function(QUERY) {
        var returnData = [];
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var SEARCH = {};
        SEARCH.section = QUERY.section;
        SEARCH.date = (QUERY.date) ? new Date(QUERY.date) : new Date();
        SEARCH.date.setDate(10);
        getComparativeSalarySearchB(db, SEARCH, function(compSal) {
            var bulkValues = [];
            var rc = {};
            rc.date = SEARCH.date;
            rc.section = QUERY.section;
            rc.status = 1;
            rc.payment_method = 1;
            rc.employee_type = QUERY.employee_type;
            rc.employee_count = compSal[QUERY.secName].regular.cash.empCount;
            rc.salary_amount = compSal[QUERY.secName].regular.cash.salary;
            rc.ot_amount = compSal[QUERY.secName].regular.cash.ot;
            bulkValues.push(rc);
            var rb = {};
            rb.date = SEARCH.date;
            rb.section = QUERY.section;
            rb.status = 1;
            rb.payment_method = 2;
            rb.employee_type = QUERY.employee_type;
            rb.employee_count = compSal[QUERY.secName].regular.bank.empCount;
            rb.salary_amount = compSal[QUERY.secName].regular.bank.salary;
            rb.ot_amount = compSal[QUERY.secName].regular.bank.ot;
            bulkValues.push(rb);
            var hb = {};
            hb.date = SEARCH.date;
            hb.section = QUERY.section;
            hb.status = 2;
            hb.payment_method = 2;
            hb.employee_type = QUERY.employee_type;
            hb.employee_count = compSal[QUERY.secName].hold.bank.empCount;
            hb.salary_amount = compSal[QUERY.secName].hold.bank.salary;
            hb.ot_amount = compSal[QUERY.secName].hold.bank.ot;
            bulkValues.push(hb);
            var hc = {};
            hc.date = SEARCH.date;
            hc.section = QUERY.section;
            hc.status = 2;
            hc.payment_method = 1;
            hc.employee_type = QUERY.employee_type;
            hc.employee_count = compSal[QUERY.secName].hold.cash.empCount;
            hc.salary_amount = compSal[QUERY.secName].hold.cash.salary;
            hc.ot_amount = compSal[QUERY.secName].hold.cash.ot;
            bulkValues.push(hc);
            async.each(bulkValues, function(bV, cb_bV) {

                db.comparative_salary_b.create(bV).complete(function(err, cS) {
                    if (err) {
                        var tmpD1 = new Date(QUERY.date);
                        database.sequelize.query(
                            'UPDATE `comparative_salary_b` ' +
                            'SET `employee_count` = ' + bV.employee_count + ', ' +
                            '`salary_amount` = ' + bV.salary_amount + ', ' +
                            '`ot_amount` = ' + bV.ot_amount + ' ' +
                            'WHERE MONTH(`date`) = ' + (tmpD1.getMonth() + 1) + ' ' +
                            'AND YEAR(`date`) = ' + tmpD1.getFullYear() + ' ' +
                            'AND `section` = ' + bV.section + ' ' +
                            'AND `employee_type` = ' + bV.employee_type + ' ' +
                            'AND `status` = ' + bV.status + ' ' +
                            'AND `payment_method` = ' + bV.payment_method + ';'
                        ).complete(function(err, qD31) {
                            cb_bV();
                        });
                    } else {
                        cb_bV();
                    }
                });
            }, function(err) {
                socket.emit("UpdateComparativeSalarySectionB" + QUERY.section, 'success');
            });
        });
    });

    socket.on('UpdateOverTimeSummarySection', function(QUERY) {
        var returnData = [];
        var returnDataQ = [];
        async.each(QUERY.overtimeArray, function(ot, cb_ot) {
            async.each(QUERY.statusArray, function(st, cb_st) {
                var SEARCH = {};
                SEARCH.date = new Date(QUERY.date);
                SEARCH.section = QUERY.section;
                SEARCH.overtime = parseInt(ot);
                SEARCH.status = parseInt(st);
                var o = {};
                o.month = SEARCH.date.getMonth() + 1;
                o.year = SEARCH.date.getFullYear();
                o.section = SEARCH.section;
                o.overtime = SEARCH.overtime;
                o.status = SEARCH.status;
                o.amount = 0;
                getEmployeeMonthOvertimeSummary(db, SEARCH, function(empData) {
                    async.each(empData, function(emp, cb_emp) {
                        o.amount += emp.excessOverTimeAmount;
                        cb_emp();
                    }, function(err) {
                        db.overtime_summary.create(o).complete(function(err, cS) {
                            if (err) {
                                db.overtime_summary.update({
                                    amount: o.amount
                                }, {
                                    month: o.month,
                                    year: o.year,
                                    section: o.section,
                                    overtime: o.overtime,
                                    status: o.status,
                                }).complete(function(err, oCB) {
                                    cb_st();
                                });
                            } else {
                                cb_st();
                            }
                        });
                    });
                });
            }, function(err) {
                cb_ot();
            });
        }, function(err) {
            socket.emit("UpdateOverTimeSummarySection" + QUERY.section, 'success');
        });
    });

    socket.on('CreateSection', function(data) {
        CreateSection(db, data, function(data) {
            socket.emit("CreateSection", data)
        });
    });

    socket.on('DestroySection', function(data) {
        DestroySection(db, data, function(data) {
            socket.emit("DestroySection", data)
        });
    });



}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;