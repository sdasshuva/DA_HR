module.exports = function() {};

function dateFormatDMY(a) {
    var d = new Date(a)
    return d.getDate() + '-' + mthCPNames[d.getMonth()] + '-' + d.getFullYear();
}

Date.prototype.formatDate = function(){
  var d = new Date(this)
  return addLeadingZero(2, d.getDate())+'-'+mthCPNames[d.getMonth()]+'-'+d.getFullYear();
};

Date.prototype.formatBanglaDate = function(){
  var d = new Date(this)
  return numEngToBan(addLeadingZero(2, d.getDate()))+'-'+mthBngNames[d.getMonth()]+'-'+numEngToBan(d.getFullYear());
};

function dArray3Month(a) {
    var cM = new Date(a); ///// Current Month
    var pM = new Date(cM); ///// Previous Month
    pM.setMonth(pM.getMonth() - 1);
    var cMC = cM.monthDays(); ///// Current Month Count
    var pMC = pM.monthDays(); ///// Previous Month Count

    var TpMC = 20;
    var TnMC = 1;
    var TcMC = 1;

    var r_array = [];
    while (TpMC <= pMC) {
        r_array.push('P' + TpMC);
        TpMC++;
    }
    while (TcMC <= cMC) {
        r_array.push('C' + TcMC);
        TcMC++;
    }
    while (TnMC < 10) {
        r_array.push('N' + TnMC);
        TnMC++;
    }
    return r_array;
}

function getEmployeeMonthAttendanceB(db, QUERY, callback) {
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

function salary_statement_report_old(db, DATA, callback) {
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
    var total_days = dateList.length;
    var f = new Date(d);
    d.setMonth(d.getMonth() + 1);
    var t = new Date(d);
    var returnData = [];
    db.employee.findAll({
        where: {
            status: 1
        },
        include: [{
            model: db.user,
            attributes: [
                'id', 'first_name', 'last_name', 'name_bangla'
            ]
        }, {
            model: db.department,
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
            emp.first_name = employee.userTable.first_name;
            emp.last_name = employee.userTable.last_name;
            emp.name_bangla = employee.userTable.name_bangla;
            emp.department = employee.departmentTable.name;
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
                    emp.absent = absent;
                    emp.present = present;
                    emp.late = late;
                    emp.holidays = holidays;
                    emp.day_length = dateList.length;
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

function salaryStatementHeader(ms) {
    var t = new Date(ms);
    t.setDate(25);
    var f = new Date(ms);
    f.setDate(26);
    f.setMonth(t.getMonth() - 1);
    var sSH = '<br />' +
        '<h1 style="line-height: 0.5;font-size: 80%;">' +
        factoryName +
        '</h1>' +
        '<h2 style="line-height: 0.5;font-size: 65%;">' +
        'SALARY & ALLOWANCE STATEMENT' +
        '</h2>' +
        '<h3 style="line-height: 0.5;font-size: 55%;">' +
        'FOR THE PERIOD OF ' +
        f.formatDate2() + ' TO ' +
        t.formatDate2() +
        '</h3>';
    return sSH;
}

function salaryStatementBanglaHeader(ms) {
    var d = new Date(ms)
    var sSH = '<br />' +
        '<h1 style="line-height: 0.5;font-size: 80%;">' +
        factoryBanglaName +
        '</h1>' +
        '<h2 style="line-height: 0.5;font-size: 65%;">' +
        'বেতন বিবরণী' +
        '</h2>' +
        '<h3 style="line-height: 0.5;font-size: 55%;">' +
        numEngToBan(d.getUTCFullYear()) + ' ইং সনের ' + monthCapitalBanglaNames[d.getMonth() - 1] + '-' + monthCapitalBanglaNames[d.getMonth()] + ' মাসের জন্য' +
        '</h3>';
    return sSH;
}

function salaryStatementReportHead() {
    var sSRH = '<head>' +
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
        'font-size: 7px;' +
        'padding: 0px 0px;' +
        'page-break-after: always;' +
        '}' +
        '#pageBody:last-child {' +
        'page-break-after: avoid;' +
        '}' +
        '</style>' +
        '</head>';
    return sSRH;
}

function salary_statement_report(db, searchM, callback) {
    var SD = (searchM) ? new Date(searchM) : new Date();
    //var SD = new Date('9/9/2016');
    var ef = new Date(SD);
    var et = new Date(SD);
    ef.setDate(1);
    et.setMonth(et.getMonth() + 1);
    et.setDate(0);

    var f = new Date(SD);
    var t = new Date(SD);
    f.setMonth(f.getMonth() - 1);
    f.setDate(20);
    t.setMonth(t.getMonth() + 1);
    t.setDate(10);

    var prM = f.getMonth();
    var nxM = t.getMonth();

    var returnData = [];
    var holiday = [];
    var adjustment = [];
    var dateList = dArray3Month(SD);
    var tDays = SD.monthDays(); // Month Days Count
    ////// Holiday Start ///////
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
                    if (holid.date.getMonth() == prM)
                        holiday.push('P' + holid.date.getDate());
                    else if (holid.date.getMonth() == nxM)
                        holiday.push('N' + holid.date.getDate());
                    else
                        holiday.push('C' + holid.date.getDate());
                }
                cb_holid();
            }, function(err) {
                ////// Adjustment Start ///////
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
                                if (adj.date.getMonth() == prM)
                                    adjustment.push('P' + adj.date.getDate());
                                else if (adj.date.getMonth() == nxM)
                                    adjustment.push('N' + adj.date.getDate());
                                else
                                    adjustment.push('C' + adj.date.getDate());
                            }
                            cb_adj();
                        }, function(err) {
                            /////// Dep Start ///////////
                            db.section.findAll({
                                attributes: ['id', 'name']
                            }).complete(function(err, secData) {
                                async.each(secData, function(dep, cb_dep) {
                                    var dD = {};
                                    dD.id = dep.id;
                                    dD.name = dep.name.toUpperCase();
                                    dD.employee = [];
                                    /////// Emp Start ////////
                                    db.employee.findAll({
                                        where: {
                                            section: dep.id,
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
                                        }],
                                        order: [
                                            ['designation', 'ASC']
                                        ],
                                    }).complete(function(err, empData) {
                                        async.each(empData, function(emp, cb_emp) {
                                            var att = {};
                                            var pH = {};
                                            var pM = {};
                                            var pS = {};
                                            var lvj = {};
                                            var lva = [];
                                            var eD = {};
                                            eD.fp = emp.id;
                                            eD.id = (emp.designationTable) ?
                                                (emp.designationTable.id ?
                                                    emp.designationTable.id :
                                                    9999) :
                                                9999;
                                            eD.name = (emp.userTable) ?
                                                ((emp.userTable.first_name) ?
                                                    ((emp.userTable.last_name) ?
                                                        emp.userTable.first_name.toUpperCase() + ' ' + emp.userTable.last_name.toUpperCase() :
                                                        emp.userTable.first_name.toUpperCase()) :
                                                    'NOT GIVEN') :
                                                'NOT GIVEN';
                                            eD.designation = (emp.designationTable) ?
                                                (emp.designationTable.name.toUpperCase() ?
                                                    emp.designationTable.name.toUpperCase() :
                                                    'NOT GIVEN') :
                                                'NOT GIVEN';
                                            eD.department = (emp.departmentTable) ?
                                                (emp.departmentTable.name.toUpperCase() ?
                                                    emp.departmentTable.name.toUpperCase() :
                                                    'NOT GIVEN') :
                                                'NOT GIVEN';
                                            eD.employeeType = (emp.employeeTypeTable) ?
                                                (emp.employeeTypeTable.name.toUpperCase() ?
                                                    emp.employeeTypeTable.name.toUpperCase() :
                                                    'NOT GIVEN') :
                                                'NOT GIVEN';
                                            eD.section = (emp.sectionTable) ?
                                                (emp.sectionTable.name.toUpperCase() ?
                                                    emp.sectionTable.name.toUpperCase() :
                                                    'NOT GIVEN') :
                                                'NOT GIVEN';
                                            eD.sectionID = (emp.sectionTable) ?
                                                (emp.sectionTable.id ?
                                                    emp.sectionTable.id :
                                                    0) :
                                                0;
                                            eD.date_of_join = (emp.date_of_join) ? emp.date_of_join : new Date();
                                            eD.payment_method = emp.payment_method;
                                            eD.gSalary = 0;
                                            eD.tDays = tDays;
                                            eD.pDays = 0;
                                            eD.aDays = 0;
                                            eD.lDays = 0;
                                            eD.wDays = 0;
                                            eD.hDays = 0;
                                            eD.oDays = 0;
                                            eD.aOnly = 0;
                                            //eD.inLate = 0;
                                            //eD.outLate = 0;
                                            eD.Leave = 0;
                                            //eD.lLeave = 0;
                                            //eD.sLeave = 0;
                                            //eD.cLeave = 0;
                                            //eD.alLeave = 0;
                                            eD.basic = 0;
                                            eD.house_rent = 0;
                                            eD.medical = 0;
                                            eD.conveyance = 0;
                                            eD.abcDeduct = 0;
                                            eD.advDeduct = 0;
                                            eD.mediDeduct = 0;
                                            eD.stmpDeduct = 0;
                                            eD.othDeduct = 0;
                                            eD.aitDeduct = 0;
                                            eD.ttlDeduct = 0;
                                            eD.attBonus = (eD.employeeType == 'STAFF') ?
                                                (
                                                    (eD.designation == 'HELPER' || eD.designation == 'TRAINEE HELPER' || eD.designation == 'AYA' || eD.designation == 'CLEANER') ?
                                                    250 :
                                                    (
                                                        (folderName == 'DA_HR') ?
                                                        500 :
                                                        600
                                                    )
                                                ) :
                                                (
                                                    (eD.employeeType == 'WORKER') ?
                                                    (
                                                        (eD.designation == 'HELPER' || eD.designation == 'TRAINEE HELPER' || eD.designation == 'AYA' || eD.designation == 'CLEANER') ?
                                                        250 :
                                                        (eD.designation == 'LOADER') ? 0 : 450
                                                    ) :
                                                    0
                                                );
                                            if (eD.section == 'SECURITY' || eD.section == 'DEEN & CO' || eD.designation == 'LOADER') {
                                                eD.attBonus = 0;
                                            }
                                            if (eD.section == 'DEEN & CO. (LOADER & CLEANER)') {
                                                if (eD.designation == 'CLEANER') {
                                                    eD.attBonus = 250;
                                                }
                                            }
                                            eD.netPayable = 0;

                                            eD.attData = {};
                                            var atdData = {};
                                            eD.atTime = {};
                                            var atTime = {};
                                            //eD.leave = {};

                                            //////// HOLIDAY OR WEEKEND BETWEEN ABSENT INITIALIZING START ////////
                                            var abFlag = 0;
                                            //eD.abFlag = 0;
                                            var abDtArr = [];
                                            /////// HOLIDAY OR WEEKEND BETWEEN ABSENT INITIALIZING START ////////

                                            ///////// Salary Start ///////////
                                            db.salary.findAll({
                                                where: {
                                                    employee: emp.id,
                                                },
                                                order: [
                                                    ['approve_date', 'ASC']
                                                ]
                                            }).complete(function(err, salData) {
                                                async.each(salData, function(sal, cb_sal) {
                                                    eD.gSalary += sal.amount;
                                                    cb_sal();
                                                }, function(err) {
                                                    eD.basic = eD.gSalary / 100 * 60;
                                                    eD.house_rent = eD.gSalary / 100 * 30;
                                                    eD.medical = eD.gSalary / 100 * 5;
                                                    eD.conveyance = eD.gSalary / 100 * 5;
                                                    eD.branch_code = '000';
                                                    eD.account_type = '000';
                                                    eD.account_no = '0000000';
                                                    eD.account = '' + eD.branch_code + eD.account_type + eD.account_no;

                                                    db.bank_account.findAll({
                                                        where: {
                                                            employee: emp.id,
                                                        }
                                                    }).complete(function(err, bankAData) {
                                                        async.each(bankAData, function(bankA, cb_bankA) {
                                                            eD.branch_code = (bankA.branch_code) ? addLeadingZero(3, bankA.branch_code) : '000';
                                                            eD.account_type = (bankA.account_type) ? addLeadingZero(3, bankA.account_type) : '000';
                                                            eD.account_no = (bankA.account_no) ? addLeadingZero(7, bankA.account_no) : '000000';
                                                            eD.account = '' + eD.branch_code + eD.account_type + eD.account_no;
                                                            cb_bankA();
                                                        }, function(err) {
                                                            ////////// Deduction Start /////////
                                                            db.deduction.findAll({
                                                                where: {
                                                                    employee: emp.id,
                                                                    month: {
                                                                        between: [ef, et]
                                                                    }
                                                                },
                                                                attributes: ['id', 'month', 'advance', 'medical', 'stamp', 'ait', 'lunch_out', 'others'],
                                                            }).complete(function(err, deductData) {
                                                                async.each(deductData, function(deduct, cb_deduct) {
                                                                    eD.advDeduct += (deduct.advance) ? parseFloat(deduct.advance) : 0;
                                                                    eD.mediDeduct += (deduct.medical) ? parseFloat(deduct.medical) : 0;
                                                                    eD.stmpDeduct += (deduct.stamp) ? parseFloat(deduct.stamp) : 0;
                                                                    eD.loDeduct += (deduct.lunch_out) ? parseFloat(deduct.lunch_out) : 0;
                                                                    eD.othDeduct += (deduct.others) ? parseFloat(deduct.others) : 0;
                                                                    eD.aitDeduct += (deduct.ait) ? parseFloat(deduct.ait) : 0;
                                                                    eD.overtimeDeduct += (deduct.overtime) ? parseInt(deduct.overtime) : 0;
                                                                    eD.excessOvertimeDeduct += (deduct.excess_overtime) ? parseInt(deduct.excess_overtime) : 0;
                                                                    cb_deduct();
                                                                }, function(err) {
                                                                    eD.mediDeduct = (folderName == 'DA_HR') ? 0 : ((eD.employeeType == 'STAFF') ? 20 : 0);
                                                                    eD.stmpDeduct = (eD.employeeType == 'WORKER') ? 10 : eD.stmpDeduct;
                                                                    ///////// Leave Start ////////
                                                                    db.leave.findAll({
                                                                        where: {
                                                                            employee: emp.id,
                                                                            date: {
                                                                                between: [f, t]
                                                                            }
                                                                        },
                                                                        attributes: ['id', 'date'],
                                                                        include: [{
                                                                            model: db.leave_type,
                                                                            attributes: ['id', 'name']
                                                                        }, ]
                                                                    }).complete(function(err, lvData) {
                                                                        async.each(lvData, function(lv, cb_lv) {
                                                                            if (lv.date.getMonth() == prM) {
                                                                                lva.push('P' + lv.date.getDate());
                                                                                lvj['P' + lv.date.getDate()] = (lv.leaveTypeTable.name) ? shortNames(lv.leaveTypeTable.name) : 'A';
                                                                            } else if (lv.date.getMonth() == nxM) {
                                                                                lva.push('N' + lv.date.getDate());
                                                                                lvj['N' + lv.date.getDate()] = (lv.leaveTypeTable.name) ? shortNames(lv.leaveTypeTable.name) : 'A';
                                                                            } else {
                                                                                lva.push('C' + lv.date.getDate());
                                                                                lvj['C' + lv.date.getDate()] = (lv.leaveTypeTable.name) ? shortNames(lv.leaveTypeTable.name) : 'A';
                                                                            }
                                                                            //eD.leave[shortNames(lv.leaveTypeTable.name)] = 0;
                                                                            cb_lv();
                                                                        }, function(err) {
                                                                            //////// DateList Start /////////
                                                                            async.each(dateList, function(dL, cb_dL) {
                                                                                var tmpDate1 = new Date(SD);
                                                                                var tdL = (dL[2]) ? dL[1] + dL[2] : dL[1];

                                                                                tmpDate1.setDate(parseInt(tdL));
                                                                                if (dL[0] == 'C') {
                                                                                    tmpDate1.setMonth(SD.getMonth());
                                                                                } else if (dL[0] == 'P') {
                                                                                    tmpDate1.setMonth(SD.getMonth() - 1);
                                                                                    if (SD.getMonth() == 0) {
                                                                                        tmpDate1.setFullYear(SD.getFullYear() - 1);
                                                                                    }
                                                                                } else {
                                                                                    tmpDate1.setMonth(SD.getMonth() + 1);
                                                                                    if (SD.getMonth() == 11) {
                                                                                        tmpDate1.setFullYear(SD.getFullYear() + 1);
                                                                                    }
                                                                                }

                                                                                pH[dL] = 24;
                                                                                pM[dL] = 60;
                                                                                pS[dL] = 60;
                                                                                eD.atTime[dL] = pH[dL] + ':' + pM[dL] + ':' + pS[dL];
                                                                                atTime[dL] = pH[dL] + ':' + pM[dL] + ':' + pS[dL];

                                                                                ////// INITIALIZING DAYS ///////////
                                                                                eD.attData[dL] = 'A';
                                                                                atdData[dL] = 'A';

                                                                                /////// CHECKING WEEKENDS //////////
                                                                                if (tmpDate1.getDay() == 5) {
                                                                                    eD.attData[dL] = 'W';
                                                                                    atdData[dL] = 'W';
                                                                                }

                                                                                //////// CHECKING HOLIDAYS ///////
                                                                                if (holiday.indexOf(dL) != -1) {
                                                                                    eD.attData[dL] = 'H';
                                                                                    atdData[dL] = 'H';
                                                                                }

                                                                                ///////// INITIALIZING ADJUSTMENT DAYS //////////
                                                                                if (adjustment.indexOf(dL) != -1) {
                                                                                    eD.attData[dL] = 'A';
                                                                                    atdData[dL] = 'A';
                                                                                }

                                                                                cb_dL();
                                                                            }, function(err) {
                                                                                ///////// Attendance Start /////////
                                                                                db.attendance.findAll({
                                                                                    where: {
                                                                                        punch_time: {
                                                                                            between: [f, t]
                                                                                        },
                                                                                        employee: emp.id
                                                                                    },
                                                                                    attributes: ['id', 'punch_time'],
                                                                                    order: [
                                                                                        ['id', 'ASC']
                                                                                    ],
                                                                                }).complete(function(err, attData) {
                                                                                    async.each(attData, function(atd, cb_atd) {
                                                                                        var pT = atd.punch_time;
                                                                                        var pD = 'C' + pT.getUTCDate();
                                                                                        if (pT.getUTCMonth() == prM) {
                                                                                            pD = 'P' + pT.getUTCDate();
                                                                                        } else if (pT.getUTCMonth() == nxM) {
                                                                                            pD = 'N' + pT.getUTCDate();
                                                                                        } else {
                                                                                            pD = 'C' + pT.getUTCDate();
                                                                                        }
                                                                                        //var pD = pT.getUTCDate();

                                                                                        ////// INTIME INITIALIZE START ////////
                                                                                        var InTimeH = pT.getUTCHours();
                                                                                        var InTimeM = pT.getUTCMinutes();
                                                                                        var InTimeS = pT.getUTCSeconds();

                                                                                        if (InTimeH < pH[pD]) {
                                                                                            pH[pD] = InTimeH;
                                                                                            pM[pD] = InTimeM;
                                                                                            pS[pD] = InTimeS;
                                                                                        }
                                                                                        if (InTimeH == pH[pD]) {
                                                                                            if (InTimeM < pM[pD]) {
                                                                                                pM[pD] = InTimeM;
                                                                                                pS[pD] = InTimeS;
                                                                                            }
                                                                                        }
                                                                                        /////////// INTIME INITIALIZE END //////////

                                                                                        eD.atTime[pD] = pH[pD] + ':' + pM[pD] + ':' + pS[pD];
                                                                                        atTime[pD] = pH[pD] + ':' + pM[pD] + ':' + pS[pD];

                                                                                        cb_atd();
                                                                                    }, function(err) {
                                                                                        var tmpAbDtArr = [];

                                                                                        async.each(dateList, function(dL2, cb_dL2) {
                                                                                            if (folderName == 'FFL_FACTORY_HR') {
                                                                                                if (eD.section == 'SAMPLE & DESIGN' || eD.section == 'LOAD-UNLOAD') {
                                                                                                    /////////// TIME ZONE 9:5 START ////////////
                                                                                                    if (atdData[dL2] == 'A') {
                                                                                                        if (pH[dL2] < 24) {
                                                                                                            if (pH[dL2] <= 9) {
                                                                                                                if (pH[dL2] == 9 && pM[dL2] >= 5) {
                                                                                                                    atdData[dL2] = 'L';
                                                                                                                    eD.attData[dL2] = 'L';
                                                                                                                } else {
                                                                                                                    eD.attData[dL2] = 'P';
                                                                                                                    atdData[dL2] = 'P';
                                                                                                                }
                                                                                                            } else {
                                                                                                                atdData[dL2] = 'L';
                                                                                                                eD.attData[dL2] = 'L';
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                    ////////// TIME ZONE 9:5 END ///////////
                                                                                                } else {
                                                                                                    /////////// TIME ZONE 8:15 START ////////////
                                                                                                    if (atdData[dL2] == 'A') {
                                                                                                        if (pH[dL2] < 24) {
                                                                                                            if (pH[dL2] <= 8) {
                                                                                                                if (pH[dL2] == 8 && pM[dL2] >= 15) {
                                                                                                                    atdData[dL2] = 'L';
                                                                                                                    eD.attData[dL2] = 'L';
                                                                                                                } else {
                                                                                                                    eD.attData[dL2] = 'P';
                                                                                                                    atdData[dL2] = 'P';
                                                                                                                }
                                                                                                            } else {
                                                                                                                atdData[dL2] = 'L';
                                                                                                                eD.attData[dL2] = 'L';
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                    ////////// TIME ZONE 8:15 END ///////////
                                                                                                }
                                                                                            } else {
                                                                                                /////////// TIME ZONE 8:15 START ////////////
                                                                                                if (atdData[dL2] == 'A') {
                                                                                                    if (pH[dL2] < 24) {
                                                                                                        if (pH[dL2] <= 8) {
                                                                                                            if (pH[dL2] == 8 && pM[dL2] >= 15) {
                                                                                                                atdData[dL2] = 'L';
                                                                                                                eD.attData[dL2] = 'L';
                                                                                                            } else {
                                                                                                                eD.attData[dL2] = 'P';
                                                                                                                atdData[dL2] = 'P';
                                                                                                            }
                                                                                                        } else {
                                                                                                            atdData[dL2] = 'L';
                                                                                                            eD.attData[dL2] = 'L';
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                                ////////// TIME ZONE 8:15 END ///////////
                                                                                            }


                                                                                            if (atdData[dL2] == 'A' || atdData[dL2] == 'H' || atdData[dL2] == 'W') {
                                                                                                if (atdData[dL2] == 'A') {
                                                                                                    if (abFlag == 1) {
                                                                                                        abDtArr = abDtArr.concat(tmpAbDtArr);
                                                                                                        tmpAbDtArr = [];
                                                                                                    }
                                                                                                    abFlag = 1;
                                                                                                } else {
                                                                                                    if (abFlag == 1) {
                                                                                                        tmpAbDtArr.push(dL2);
                                                                                                    }
                                                                                                }
                                                                                            } else {
                                                                                                if (abFlag == 1) {
                                                                                                    abFlag = 0;
                                                                                                    tmpAbDtArr = [];
                                                                                                }
                                                                                            }
                                                                                            cb_dL2();
                                                                                        }, function(err) {
                                                                                            async.each(dateList, function(dL3, cb_dL3) {

                                                                                                ///////// APPLYING ABSENT BETWEEN ABSENT START /////////
                                                                                                if (abDtArr.indexOf(dL3) != -1) {
                                                                                                    atdData[dL3] = 'A';
                                                                                                    eD.attData[dL3] = 'A';
                                                                                                }
                                                                                                ////////// APPLYING ABSENT BETWEEN ABSENT END ////////

                                                                                                //////// APPLYING LEAVE START ////////////
                                                                                                if (lva.indexOf(dL3) != -1) {
                                                                                                    atdData[dL3] = lvj[dL3];
                                                                                                    eD.attData[dL3] = lvj[dL3];
                                                                                                }
                                                                                                ////////// APPLYING LEAVE END /////////

                                                                                                if (dL3[0] == 'C') {
                                                                                                    if (atdData[dL3] == 'A') {
                                                                                                        eD.aOnly++;
                                                                                                        eD.aDays++;
                                                                                                    } else if (atdData[dL3] == 'H') {
                                                                                                        eD.hDays++;
                                                                                                    } else if (atdData[dL3] == 'W') {
                                                                                                        eD.wDays++;
                                                                                                    } else if (atdData[dL3] == 'L') {
                                                                                                        eD.lDays++;
                                                                                                    } else {
                                                                                                        eD.oDays++;
                                                                                                    }
                                                                                                    if (lva.indexOf(dL3) != -1) {
                                                                                                        eD.Leave++;
                                                                                                    }
                                                                                                    //atTime[dL3] = atdData[dL3]
                                                                                                    //eD.atTime[dL3] = eD.attData[dL3]+'-'+atTime[dL3]
                                                                                                }
                                                                                                cb_dL3();
                                                                                            }, function(err) {
                                                                                                if (eD.lDays > 0 || eD.aDays > 0 || eD.Leave > 0) {
                                                                                                    eD.attBonus = 0;
                                                                                                }
                                                                                                var tLDays = eD.lDays - parseInt(eD.lDays / 3)
                                                                                                eD.pDays = eD.oDays + eD.wDays + eD.hDays + tLDays;
                                                                                                eD.aDays += parseInt(eD.lDays / 3);
                                                                                                eD.abcDeduct = Math.round((eD.gSalary / eD.tDays) * eD.aDays);
                                                                                                eD.ttlDeduct = eD.abcDeduct + eD.advDeduct + eD.mediDeduct + eD.stmpDeduct + eD.othDeduct + eD.aitDeduct;
                                                                                                eD.netPayable = eD.gSalary - eD.ttlDeduct + eD.attBonus;
                                                                                                dD.employee.push(eD);
                                                                                                cb_emp()
                                                                                            });
                                                                                        });
                                                                                    });
                                                                                });
                                                                                /////// Attendance End ////////
                                                                            });
                                                                            /////////// DateList End //////////
                                                                        });
                                                                    });
                                                                    ///////// Leave End /////////
                                                                });
                                                            });
                                                        })
                                                    })
                                                });
                                            });
                                            /////// Salary End ////////
                                        }, function(err) {
                                            dD.employee.sort(function(a, b) {
                                                return parseFloat(a.id) - parseFloat(b.id);
                                            });
                                            returnData.push(dD);
                                            cb_dep();
                                        });

                                    });
                                    ///////// Emp End /////////
                                }, function(err) {
                                    callback(returnData);
                                });
                            });
                            ///////// Dep End /////////
                        });
                    })
                    /////// Adjustment End ////////
            });
        })
        ///////// Holiday End ////////
}

function salary_list(db, callback) {
    db.salary.findAll({
        include: [{
            model: db.employee,
            attributes: ['id'],
            include: [{
                model: db.user,
                attributes: ['id', 'first_name']
            }],
        }],
        order: [
            ['id', 'DESC']
        ]
    }).complete(function(err, data) {
        callback(data);
    })
}

function salary_details_list(db, ID, callback) {
    db.salary.findAll({
        where: {
            employee: ID
        }
    }).complete(function(err, data) {
        callback(data);
    })
}

function getSalaryPayment(db, QUERY, callback) {
    QUERY.date = (QUERY.date) ? new Date(QUERY.date) : new Date();
    QUERY.year = (QUERY.year) ? QUERY.year : QUERY.date.getFullYear();
    QUERY.month = (QUERY.month) ? QUERY.month : QUERY.date.getMonth() + 1;
    QUERY.date.setDate(10);
    var returnData = [];
    var SearchEMP = {};
    SearchEMP.status = (QUERY.status) ? QUERY.status : 1;
    if (!QUERY.download)
        SearchEMP.section = 1;
    if (QUERY.section)
        SearchEMP.section = QUERY.section;
    if (QUERY.payment_method)
        SearchEMP.payment_method = QUERY.payment_method;
    if (QUERY.employee_type)
        SearchEMP.employee_type = QUERY.employee_type;
    getEmployee(db, SearchEMP, function(empData) {
        async.each(empData, function(emp, cb_emp) {
            var o = {};
            o.year = QUERY.year;
            o.month = QUERY.month;
            o.payment_type = 1;
            o.salary_amount = 0;
            o.deduct_amount = 0;
            o.paid_amount = 0;
            o.payment_status = 1;
            o.user = null;
            o.id = emp.id;
            o.card_no = emp.card_no;
            o.name = emp.name;
            o.name_bangla = emp.name_bangla;
            o.grade = emp.grade;
            o.designation = emp.designation;
            o.designationName = emp.designationName;
            o.attendanceBonus = emp.attendanceBonus;
            o.department = emp.department;
            o.departmentName = emp.departmentName;
            o.section = emp.section;
            o.sectionName = emp.sectionName;
            o.employee_type = emp.employee_type;
            o.employeeTypeName = emp.employeeTypeName;
            o.workInTime = emp.workInTime;
            o.workOutTime = emp.workOutTime;
            o.date_of_birth = emp.date_of_birth;
            o.date_of_join = emp.date_of_join;
            o.date_of_release = emp.date_of_release;
            o.payment_method = emp.payment_method;
            o.pay_mode = (o.payment_method == 1) ? 'CASH' : 'BANK';
            o.status = emp.status;
            o.statusName = emp.statusName;
            o.last_punch = emp.last_punch;
            o.branch_code = '000';
            o.account_type = '000';
            o.account_no = '0000000';
            o.account = '000-000-0000000';
            o.bank = 'NO BANK ACCOUNT';
            var findData = {};
            findData.where = {
                employee: emp.id,
                year: QUERY.year,
                month: QUERY.month,
            };
            findData.attributes = [
                    'id', 'employee', 'year', 'month', 'payment_type',
                    'salary_amount', 'deduct_amount', 'paid_amount',
                    'payment_status', 'user', 'created_at', 'updated_at'
                ],
                db.salary_payment.findAll(findData).complete(function(err, mtData) {
                    async.each(mtData, function(mtp, cb_mtp) {
                        o.year = QUERY.year;
                        o.month = QUERY.month;
                        o.payment_type = mtp.payment_type;
                        o.salary_amount = mtp.salary_amount;
                        o.deduct_amount = mtp.deduct_amount;
                        o.paid_amount = mtp.paid_amount;
                        o.payment_status = mtp.payment_status;
                        o.user = mtp.user;
                        cb_mtp();
                    }, function(err) {
                        var SearchAcc = {};
                        SearchAcc.employee = emp.id;
                        getBankAccountDetails(db, SearchAcc, function(baData) {
                            async.each(baData, function(ba, cb_ba) {
                                if (ba.is_active == 1) {
                                    o.branch_code = ba.branch_code;
                                    o.account_type = ba.account_type;
                                    o.account_no = ba.account_no;
                                    o.account = ba.account;
                                    o.bank = ba.bankName;
                                    o.bankID = ba.bank;
                                }
                                cb_ba();
                            }, function(err) {
                                if ((folderName == 'FFL_FACTORY_HR' || folderName == 'FJL_HR') && QUERY.download) {
                                    if (o.sectionName == 'SECURITY') {

                                    } else {
                                        returnData.push(o);
                                    }
                                } else {
                                    returnData.push(o);
                                }
                                cb_emp();
                            });
                        });
                    });
                });
        }, function(err) {
            returnData.sort(function(a, b) {
                if (a.id < b.id)
                    return -1;
                if (a.id > b.id)
                    return 1;
                return 0;
            });
            callback(returnData);
        });
    });
}

function getSalary(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    findData.attributes = [
        'id', 'employee', 'amount', 'approve_date'
    ];
    if (QUERY.date) {
        var date = new Date(QUERY.date);
        date.setDate(1);
        var Y = date.getFullYear();
        var M = date.getMonth() + 2;
        var D = date.getDate();
        var YMD = Y + '-' + M + '-' + D;
        var d = new Date(YMD);
        SEARCH.approve_date = {};
        SEARCH.approve_date.lt = d;
    }
    if (QUERY.employee) {
        SEARCH.employee = QUERY.employee;
    }
    findData.where = SEARCH;
    var SORT = (QUERY.sort) ? QUERY.sort : 'approve_date';
    var DIR = (QUERY.dir) ? QUERY.dir : 'DESC';
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.salary.findAll(findData).complete(function(err, salData) {
        callback(d);
    })
}

function getSalaryJson(db, QUERY, callback) {
    var SEARCH = {};
    var findData = {};
    findData.attributes = [
        'id', 'employee', 'amount', 'approve_date'
    ];
    if (QUERY.date) {
        var date = new Date(QUERY.date);
        date.setDate(1);
        var Y = date.getFullYear();
        var M = date.getMonth() + 2;
        var D = date.getDate();
        var YMD = Y + '-' + M + '-' + D;
        var d = new Date(YMD);
        SEARCH.approve_date = {};
        SEARCH.approve_date.lt = d;
    }
    if (QUERY.employee) {
        SEARCH.employee = QUERY.employee;
    }
    findData.where = SEARCH;
    var o = {};
    o.amount = 0;
    o.branch_code = '000';
    o.account_type = '000';
    o.account_no = '0000000';
    o.account = '000-000-0000000';
    o.advanceDeduct = 0;
    o.medicalDeduct = 0;
    o.stampDeduct = 0;
    o.aitDeduct = 0;
    o.lunchOutDeduct = 0;
    o.othersDeduct = 0;
    o.overtimeDeduct = 0;
    o.excessOvertimeDeduct = 0;
    db.salary.findAll(findData).complete(function(err, salData) {
        async.each(salData, function(sal, cb_sal) {
            o.employee = sal.employee;
            o.amount += sal.amount;
            cb_sal();
        }, function(err) {
            getBankAccountNo(db, QUERY, function(baData) {
                o.branch_code = (baData.branch_code) ? baData.branch_code : o.branch_code;
                o.account_type = (baData.account_type) ? baData.account_type : o.account_type;
                o.account_no = (baData.account_no) ? baData.account_no : o.account_no;
                o.account = (baData.account) ? baData.account : o.account;
                var deductSearch = {};
                deductSearch.employee = QUERY.employee;
                deductSearch.date = date;
                getDeductionJson(db, deductSearch, function(deductData) {
                    o.advanceDeduct = (deductData.advanceDeduct > 0) ? deductData.advanceDeduct : o.advanceDeduct;
                    o.medicalDeduct = (deductData.medicalDeduct > 0) ? deductData.medicalDeduct : o.medicalDeduct;
                    o.stampDeduct = (deductData.stampDeduct > 0) ? deductData.stampDeduct : o.stampDeduct;
                    o.aitDeduct = (deductData.aitDeduct > 0) ? deductData.aitDeduct : o.aitDeduct;
                    o.lunchOutDeduct = (deductData.lunchOutDeduct > 0) ? deductData.lunchOutDeduct : o.lunchOutDeduct;
                    o.othersDeduct = (deductData.othersDeduct > 0) ? deductData.othersDeduct : o.othersDeduct;
                    o.overtimeDeduct = (deductData.overtimeDeduct > 0) ? deductData.overtimeDeduct : o.overtimeDeduct;
                    o.excessOvertimeDeduct = (deductData.excessOvertimeDeduct > 0) ? deductData.excessOvertimeDeduct : o.excessOvertimeDeduct;
                    callback(o);
                });
            });
        });
    })
}

function dailyReportHead() {
    var dRH = '<head>' +
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
        'font-size: 8px;' +
        'padding: 5px 20px 5px 20px;' +
        'page-break-after: always;' +
        '}' +
        '#pageBody:last-child {' +
        'page-break-after: avoid;' +
        '}' +
        '</style>' +
        '</head>';
    return dRH;
}


function getDisappointedEmployeeMonthSummaryB(db, QUERY, callback) {
    var returnData = [];
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    var dayArray = dayArrayFunc(d.monthDays());
    var rangeMArray = rangeMArrayFunc(d);
    getEmployeeMonthAttendanceB(db, QUERY, function(empData) {
        async.each(empData, function(emp, cb_emp) {
            var o = {};
            o.id = emp.id;
            o.fp = addLeadingZero(9, emp.id);
            o.card_no = emp.card_no;
            o.name = emp.name;
            o.name_bangla = emp.name_bangla;
            o.grade = emp.grade;
            o.department = emp.departmentName;
            o.section = emp.sectionName;
            o.designation = emp.designationName;
            o.designationBanglaName = emp.designationBanglaName;
            o.employee_type = emp.employeeTypeName;
            o.date_of_join = emp.date_of_join.formatDate();
            o.date_of_birth = emp.date_of_birth.formatDate();
            o.payment_method = emp.payment_method;
            o.status = emp.statusName;
            o.salary = emp.salary;
            o.basic = (emp.employeeTypeName == 'STAFF') ? emp.salary / 100 * 60 : ((emp.salary > 0) ? (emp.salary - 1100) / 1.4 : 0);
            o.house_rent = (emp.employeeTypeName == 'STAFF') ? emp.salary / 100 * 30 : ((emp.salary > 0) ? o.basic * 0.4 : 0);
            o.medical = (emp.employeeTypeName == 'STAFF') ? emp.salary / 100 * 5 : ((emp.salary > 0) ? 250 : 0);
            o.conveyance = (emp.employeeTypeName == 'STAFF') ? emp.salary / 100 * 5 : ((emp.salary > 0) ? 200 : 0);
            o.food = (emp.employeeTypeName == 'STAFF') ? 0 : ((emp.salary > 0) ? 650 : 0);
            o.advanceDeduct = (emp.salary > 0) ? emp.advanceDeduct : 0;
            o.medicalDeduct = (emp.salary > 0) ? ((emp.employeeTypeName == 'STAFF') ? 20 + emp.medicalDeduct : emp.medicalDeduct) : 0;
            o.stampDeduct = (emp.salary > 0) ? ((emp.payment_method == 1) ? 10 + emp.stampDeduct : ((emp.employeeTypeName == 'WORKER') ? 10 + emp.stampDeduct : emp.stampDeduct)) : 0;
            o.aitDeduct = (emp.salary > 0) ? emp.aitDeduct : 0;
            o.lunchOutDeduct = (emp.salary > 0) ? (o.basic / 208 * emp.lunchOutDeduct) : 0;
            o.othersDeduct = (emp.salary > 0) ? emp.othersDeduct : 0;
            o.overtimeDeduct = (emp.salary > 0) ? emp.overtimeDeduct : 0;
            o.excessOvertimeDeduct = (emp.salary > 0) ? emp.excessOvertimeDeduct : 0;
            o.absentDeduct = 0;
            o.totalDeduct = 0;
            o.netPayable = 0;
            o.attendanceBonus = emp.attendanceBonus;
            o.branch_code = emp.branch_code;
            o.account_type = emp.account_type;
            o.account_no = emp.account_no;
            o.account = emp.account;
            o.present = 0;
            o.absent = 0;
            o.late = 0;
            o.leave = 0;
            o.outLeave = 0;
            o.compensation = 0;
            o.directWorkPlace = 0;
            o.absentForLate = 0;
            o.holiday = 0;
            o.weekend = 0;
            o.inLate = 0;
            o.inBonusLateCount = 0;
            o.absentForInLate = 0;
            o.outLate = 0;
            o.absentForOutLate = 0;
            o.totalDays = 0;
            o.totalPayableDays = 0;
            o.totalDeductDays = 0;
            o.overTime = 0;
            o.overTimeRate = 0;
            o.overTimeAmount = 0;
            o.excessOverTime = 0;
            o.holidayOverTime = 0;
            o.excessOverTimeAmount = 0;
            o.attendance = {};
            var workInTime = emp.workInTime.split(":");
            var workOutTime = emp.workOutTime.split(":");
            var inH = parseInt(workInTime[0]);
            var inM = parseInt(workInTime[1]);
            var outH = parseInt(workOutTime[0]);
            var outM = parseInt(workOutTime[1]);
            async.each(rangeMArray, function(YMD, cb_day) {
                var dr = new Date(YMD);
                var Y = dr.getFullYear();
                var M = dr.getMonth() + 1;
                var D = dr.getDate();
                inH = (ramadan2017.indexOf(YMD) != -1) ? parseInt(workInTime[0]) - 1 : parseInt(workInTime[0]);
                outH = (ramadan1p2017.indexOf(YMD) != -1) ? parseInt(workOutTime[0]) - 1 : (ramadan2p2017.indexOf(YMD) != -1) ? parseInt(workOutTime[0]) - 2 : parseInt(workOutTime[0]);
                outM = (ramadan2p2017.indexOf(YMD) != -1) ? ((parseInt(workOutTime[1]) == 30) ? 0 : 30) : parseInt(workOutTime[1]);

                var tD = (emp.date_of_join) ? new Date(emp.date_of_join) : new Date();
                var tDY = tD.getFullYear();
                var tDM = tD.getMonth() + 1;
                var tDD = tD.getDate();
                var tDYMD = tDY + '-' + tDM + '-' + tDD;
                var InBonusLate = (emp.attendance[YMD].officeIn.flag) ?
                    (
                        (emp.attendance[YMD].officeIn.h <= inH) ?
                        (
                            (emp.attendance[YMD].officeIn.h == inH && emp.attendance[YMD].officeIn.m > inM + 5) ?
                            'L' :
                            'P'
                        ) :
                        'L'
                    ) :
                    'A';
                var InStatus = (emp.attendance[YMD].officeIn.flag) ?
                    (
                        (emp.attendance[YMD].officeIn.h <= inH) ?
                        (
                            (emp.attendance[YMD].officeIn.h == inH && emp.attendance[YMD].officeIn.m > inM + 10) ?
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
                // var OutStatus = (emp.attendance[YMD].officeOut.flag)?((emp.attendance[YMD].officeOut.h>=outH)?'P':'L'):'A';
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

                empStatus = (emp.attendance[YMD].leave) ? emp.attendance[YMD].leaveName : empStatus;
                if (emp.attendance[YMD].leave) {
                    empStatus = emp.attendance[YMD].leaveName;
                    if (emp.attendance[YMD].leaveName == 'OL')
                        o.outLeave++;
                    else if (emp.attendance[YMD].leaveName == 'C')
                        o.compensation++;
                    else if (emp.attendance[YMD].leaveName == 'DWP')
                        o.directWorkPlace++;
                    else
                        o.leave++;
                } else if (!emp.attendance[YMD].adjust) {
                    if (emp.attendance[YMD].holiday) {
                        if (emp.attendance[YMD].payable) {
                            if (Y == tDY && M == tDM && D < tDD) {
                                empStatus = 'A';
                                o.absent++;
                            } else {
                                empStatus = 'H';
                                o.holiday++;
                            }
                        } else {
                            empStatus = 'A';
                            o.absent++;
                        }
                    } else {
                        if (emp.attendance[YMD].weekend) {
                            if (emp.attendance[YMD].payable) {
                                if (Y == tDY && M == tDM && D < tDD) {
                                    empStatus = 'A';
                                    o.absent++;
                                } else {
                                    empStatus = 'W';
                                    o.weekend++;
                                }
                            } else {
                                empStatus = 'A';
                                o.absent++;
                            }
                        } else {
                            if (empStatus == 'A') {
                                empStatus = 'A';
                                o.absent++;
                            }
                        }
                    }
                } else {
                    if (empStatus == 'A') {
                        empStatus = 'A';
                        o.absent++;
                    }
                }
                if (empStatus == 'P') {
                    if (InBonusLate == 'L') {
                        o.inBonusLateCount++;
                    }
                    o.present++;
                } else if (empStatus == 'L') {
                    if (InStatus == 'L' || InStatus == 'A') {
                        o.inLate++;
                    }
                    if (OutStatus == 'L' || OutStatus == 'A') {
                        o.outLate++;
                    }
                    o.late++;
                }
                o.attendance[YMD] = empStatus;
                o.overTime += (empStatus == 'P' || empStatus == 'L') ? emp.attendance[YMD].overTime : 0;
                o.excessOverTime += (empStatus == 'H' || empStatus == 'W') ? emp.attendance[YMD].workingHour : emp.attendance[YMD].excessOverTime;
                cb_day();
            }, function(err) {
                var tmpSD = (QUERY.date) ? new Date(QUERY.date) : new Date();
                var tmpSD2 = (QUERY.date) ? new Date(QUERY.date) : new Date();
                var tmpSD2Y = tmpSD2.getFullYear();
                var tmpSD2M = tmpSD2.getMonth();
                tmpSD.setMonth(tmpSD.getMonth() + 1);
                tmpSD.setDate(1);
                var tmpDOJ = (emp.date_of_join) ? new Date(emp.date_of_join) : new Date();
                var tmpDOJY = tmpDOJ.getFullYear();
                var tmpDOJM = tmpDOJ.getMonth();
                var tmpDOJD = tmpDOJ.getDate();

                o.overTime = o.overTime - o.overtimeDeduct;
                o.excessOverTime = o.excessOverTime - o.excessOvertimeDeduct;
                o.overTimeRate = o.basic / 208 * 2;
                o.overTimeAmount = Math.round(o.overTime * o.overTimeRate);
                o.excessOverTimeAmount = Math.round(o.excessOverTime * o.overTimeRate);
                o.absentForInLate = parseInt(o.inLate / 3);
                o.absentForOutLate = parseInt(o.outLate / 3);
                o.absentForLate = parseInt(o.inLate / 3) + parseInt(o.outLate / 3);
                if (o.employee_type === 'WORKER') {
                    o.absentForLate = 0
                }
                o.totalDays = o.absent + o.present + o.late + o.leave + o.outLeave + o.compensation + o.directWorkPlace + o.holiday + o.weekend;
                o.totalDeductDays = o.absent + o.absentForLate + o.compensation;
                o.totalPayableDays = o.totalDays - o.totalDeductDays;
                if (o.inBonusLateCount > 0 || o.inLate > 0 || o.outLate > 0 || o.totalDeductDays > 0 || o.leave > 0) {
                    o.attendanceBonus = 0;
                }
                o.absentDeduct = Math.round(o.salary / o.totalDays * o.totalDeductDays);
                if (o.employee_type === 'WORKER') {
                    o.absentDeduct = Math.round(o.salary / 30 * o.totalDeductDays);
                }
                o.totalDeduct = o.absentDeduct + o.advanceDeduct + o.medicalDeduct + o.stampDeduct + o.lunchOutDeduct + o.othersDeduct + o.aitDeduct;
                o.netPayable = o.salary - o.totalDeduct + o.attendanceBonus;
                o.netPayable = (o.employee_type == 'WORKER') ?
                    Math.round(o.overTimeAmount + o.netPayable) :
                    Math.round(o.netPayable);
                if (tmpSD > tmpDOJ) {
                    returnData.push(o);
                }
                cb_emp();
            });
        }, function(err) {
            returnData.sort(function(a, b) {
                if (a.id < b.id)
                    return -1;
                if (a.id > b.id)
                    return 1;
                return 0;
            });
            callback(returnData);
        });
    });
}

function DestroySalary(db, DATA, callback) {
    db.salary.destroy({
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

function DestroySalaryDeduction(db, DATA, callback) {
    db.deduction.destroy({
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

function UpdateSalaryApproveDate(db, DATA, callback) {
    var app_date = new Date(DATA.approve_date);
    app_date.setDate(1);
    app_date.setHours(8);
    db.salary.update({
        approve_date: app_date
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

function UpdateSalaryAmount(db, DATA, callback) {
    db.salary.update({
        amount: DATA.amount
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

function CreateSalary(db, DATA, callback) {
    if (DATA.input_salary) {
        db.salary.create({
            employee: DATA.employee,
            amount: DATA.amount,
            approve_date: DATA.approve_date,
        }).complete(function(err, employee) {
            if (err) {
                callback("error");
            } else {
                db.employee.update({
                    payment_method: DATA.payment_method
                }, {
                    id: DATA.employee
                }).complete(function(err, employee) {
                    if (err) {
                        if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                            callback("referenced");
                        } else {
                            callback("error");
                        }
                    } else {
                        db.bank_account.findAll({
                            where: {
                                employee: DATA.employee,
                                bank: DATA.bank
                            },
                        }).complete(function(err, bank_account) {
                            if (bank_account.length > 0) {
                                db.bank_account.update({
                                    is_active: 0,
                                }, {
                                    employee: DATA.employee
                                }).complete(function(err, r) {
                                    db.bank_account.update({
                                        branch_code: DATA.branch_code,
                                        account_type: DATA.account_type,
                                        account_no: DATA.account_no,
                                        is_active: DATA.is_active,
                                    }, {
                                        employee: DATA.employee,
                                        bank: DATA.bank
                                    }).complete(function(err, bank_account) {
                                        if (err) {
                                            callback("error");
                                        } else {
                                            callback("success");
                                        }
                                    })
                                })
                            } else {
                                db.bank_account.update({
                                    is_active: 0,
                                }, {
                                    employee: DATA.employee
                                }).complete(function(err, r) {
                                    db.bank_account.create({
                                        employee: DATA.employee,
                                        bank: DATA.bank,
                                        branch_code: DATA.branch_code,
                                        account_type: DATA.account_type,
                                        account_no: DATA.account_no,
                                        is_active: DATA.is_active
                                    }).complete(function(err, bank_account) {
                                        if (err) {
                                            callback("error");
                                        } else {
                                            callback("success");
                                        }
                                    })
                                })
                            }
                        })
                    }
                })
            }
        })
    } else {
        db.employee.update({
            payment_method: DATA.payment_method
        }, {
            id: DATA.employee
        }).complete(function(err, employee) {
            if (err) {
                if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                    callback("referenced");
                } else {
                    callback("error");
                }
            } else {
                db.bank_account.findAll({
                    where: {
                        employee: DATA.employee,
                        bank: DATA.bank
                    },
                }).complete(function(err, bank_account) {
                    if (bank_account.length > 0) {
                        db.bank_account.update({
                            is_active: 0,
                        }, {
                            employee: DATA.employee
                        }).complete(function(err, r) {
                            db.bank_account.update({
                                branch_code: DATA.branch_code,
                                account_type: DATA.account_type,
                                account_no: DATA.account_no,
                                is_active: DATA.is_active,
                            }, {
                                employee: DATA.employee,
                                bank: DATA.bank
                            }).complete(function(err, bank_account) {
                                if (err) {
                                    callback("error");
                                } else {
                                    callback("success");
                                }
                            })
                        })
                    } else {
                        db.bank_account.update({
                            is_active: 0,
                        }, {
                            employee: DATA.employee
                        }).complete(function(err, r) {
                            db.bank_account.create({
                                employee: DATA.employee,
                                bank: DATA.bank,
                                branch_code: DATA.branch_code,
                                account_type: DATA.account_type,
                                account_no: DATA.account_no,
                                is_active: DATA.is_active
                            }).complete(function(err, bank_account) {
                                if (err) {
                                    callback("error");
                                } else {
                                    callback("success");
                                }
                            })
                        })
                    }
                })
            }
        })
    }
}

function CreateSalaryDeduction(db, DATA, callback) {
    db.deduction.create({
        employee: DATA.employee,
        month: DATA.month,
        advance: DATA.advance,
        medical: DATA.medical,
        stamp: DATA.stamp,
        ait: DATA.ait,
        lunch_out: DATA.lunch_out,
        others: DATA.others,
        overtime: DATA.overtime,
        excess_overtime: DATA.excess_overtime,
    }).complete(function(err, employee) {
        if (err) {
            callback("error");
            //throw err;
        } else {
            callback("success")
        }
    })
}

function CreateUpdateSalaryPayment(db, DATA, callback) {
    var success = true;
    async.each(DATA, function(dt, cb_dt) {
        db.salary_payment.create(dt).complete(function(err, mt1) {
            if (err) {
                if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
                    db.salary_payment.update({
                        salary_amount: dt.salary_amount,
                        deduct_amount: dt.deduct_amount,
                        paid_amount: dt.paid_amount,
                        payment_status: dt.payment_status,
                        user: dt.user
                    }, {
                        employee: dt.employee,
                        payment_type: dt.payment_type,
                        year: dt.year,
                        month: dt.month,
                    }).complete(function(err2, mt2) {
                        if (err2) {
                            success = false;
                        } else {
                            success = true;
                        }
                        cb_dt();
                    })
                } else {
                    success = false;
                    cb_dt();
                }
            } else {
                cb_dt();
            }
        })
    }, function(err) {
        if (err) {
            callback("error");
        } else {
            if (success)
                callback("success")
            else
                callback("error");
        }
    });
}

function search_salary_statement_report(db, values, callback) {
    var SD = (values.date) ? new Date(values.date) : new Date();
    var status = (values.status) ? values.status : 1;
    //var SD = new Date('9/9/2016');
    var ef = new Date(SD);
    var et = new Date(SD);
    ef.setDate(1);
    et.setMonth(et.getMonth() + 1);
    et.setDate(0);

    var f = new Date(SD);
    var t = new Date(SD);
    f.setMonth(f.getMonth() - 1);
    f.setDate(20);
    t.setMonth(t.getMonth() + 1);
    t.setDate(10);

    var prM = f.getMonth();
    var nxM = t.getMonth();

    var returnData = [];
    var holiday = [];
    var adjustment = [];
    var dateList = dArray3Month(SD);
    var tDays = SD.monthDays(); // Month Days Count
    ////// Holiday Start ///////
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
                    if (holid.date.getMonth() == prM)
                        holiday.push('P' + holid.date.getDate());
                    else if (holid.date.getMonth() == nxM)
                        holiday.push('N' + holid.date.getDate());
                    else
                        holiday.push('C' + holid.date.getDate());
                }
                cb_holid();
            }, function(err) {
                ////// Adjustment Start ///////
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
                                if (adj.date.getMonth() == prM)
                                    adjustment.push('P' + adj.date.getDate());
                                else if (adj.date.getMonth() == nxM)
                                    adjustment.push('N' + adj.date.getDate());
                                else
                                    adjustment.push('C' + adj.date.getDate());
                            }
                            cb_adj();
                        }, function(err) {
                            /////// Dep Start ///////////
                            db.section.findAll({
                                where: {
                                    id: values.section,
                                },
                                attributes: ['id', 'name']
                            }).complete(function(err, secData) {
                                async.each(secData, function(dep, cb_dep) {
                                    var dD = {};
                                    dD.id = dep.id;
                                    dD.name = dep.name.toUpperCase();
                                    dD.employee = [];
                                    /////// Emp Start ////////
                                    db.employee.findAll({
                                        where: {
                                            section: dep.id,
                                            status: status
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
                                        }],
                                        order: [
                                            ['designation', 'ASC']
                                        ],
                                    }).complete(function(err, empData) {
                                        async.each(empData, function(emp, cb_emp) {
                                            var att = {};
                                            var pH = {};
                                            var pM = {};
                                            var pS = {};
                                            var lvj = {};
                                            var lva = [];
                                            var eD = {};
                                            eD.fp = emp.id;
                                            eD.id = (emp.designationTable) ?
                                                (emp.designationTable.id ?
                                                    emp.designationTable.id :
                                                    9999) :
                                                9999;
                                            eD.name = (emp.userTable) ?
                                                ((emp.userTable.first_name) ?
                                                    ((emp.userTable.last_name) ?
                                                        emp.userTable.first_name.toUpperCase() + ' ' + emp.userTable.last_name.toUpperCase() :
                                                        emp.userTable.first_name.toUpperCase()) :
                                                    'NOT GIVEN') :
                                                'NOT GIVEN';
                                            eD.department = (emp.departmentTable) ?
                                                (emp.departmentTable.name.toUpperCase() ?
                                                    emp.departmentTable.name.toUpperCase() :
                                                    'NOT GIVEN') :
                                                'NOT GIVEN';
                                            eD.designation = (emp.designationTable) ?
                                                (emp.designationTable.name.toUpperCase() ?
                                                    emp.designationTable.name.toUpperCase() :
                                                    'NOT GIVEN') :
                                                'NOT GIVEN';
                                            eD.employeeType = (emp.employeeTypeTable) ?
                                                (emp.employeeTypeTable.name.toUpperCase() ?
                                                    emp.employeeTypeTable.name.toUpperCase() :
                                                    'NOT GIVEN') :
                                                'NOT GIVEN';
                                            eD.section = (emp.sectionTable) ?
                                                (emp.sectionTable.name.toUpperCase() ?
                                                    emp.sectionTable.name.toUpperCase() :
                                                    'NOT GIVEN') :
                                                'NOT GIVEN';
                                            eD.sectionID = (emp.sectionTable) ?
                                                (emp.sectionTable.id ?
                                                    emp.sectionTable.id :
                                                    0) :
                                                0;
                                            eD.date_of_join = (emp.date_of_join) ? emp.date_of_join : new Date();
                                            eD.payment_method = emp.payment_method;
                                            eD.gSalary = 0;
                                            eD.tDays = tDays;
                                            eD.pDays = 0;
                                            eD.aDays = 0;
                                            eD.lDays = 0;
                                            eD.wDays = 0;
                                            eD.hDays = 0;
                                            eD.oDays = 0;
                                            eD.aOnly = 0;
                                            //eD.inLate = 0;
                                            //eD.outLate = 0;
                                            eD.Leave = 0;
                                            //eD.lLeave = 0;
                                            //eD.sLeave = 0;
                                            //eD.cLeave = 0;
                                            //eD.alLeave = 0;
                                            eD.basic = 0;
                                            eD.house_rent = 0;
                                            eD.medical = 0;
                                            eD.conveyance = 0;
                                            eD.abcDeduct = 0;
                                            eD.advDeduct = 0;
                                            eD.mediDeduct = 0;
                                            eD.stmpDeduct = 0;
                                            eD.othDeduct = 0;
                                            eD.aitDeduct = 0;
                                            eD.ttlDeduct = 0;
                                            eD.attBonus = (eD.employeeType == 'STAFF') ?
                                                (
                                                    (eD.designation == 'HELPER' || eD.designation == 'TRAINEE HELPER' || eD.designation == 'AYA' || eD.designation == 'CLEANER') ?
                                                    250 :
                                                    (
                                                        (folderName == 'DA_HR') ?
                                                        500 :
                                                        600
                                                    )
                                                ) :
                                                (
                                                    (eD.employeeType == 'WORKER') ?
                                                    (
                                                        (eD.designation == 'HELPER' || eD.designation == 'TRAINEE HELPER' || eD.designation == 'AYA' || eD.designation == 'CLEANER') ?
                                                        250 :
                                                        (eD.designation == 'LOADER') ? 0 : 450
                                                    ) :
                                                    0
                                                );
                                            if (eD.section == 'SECURITY' || eD.section == 'DEEN & CO' || eD.designation == 'LOADER') {
                                                eD.attBonus = 0;
                                            }
                                            if (eD.section == 'DEEN & CO. (LOADER & CLEANER)') {
                                                if (eD.designation == 'CLEANER') {
                                                    eD.attBonus = 250;
                                                }
                                            }
                                            eD.netPayable = 0;

                                            eD.attData = {};
                                            var atdData = {};
                                            eD.atTime = {};
                                            var atTime = {};
                                            //eD.leave = {};

                                            //////// HOLIDAY OR WEEKEND BETWEEN ABSENT INITIALIZING START ////////
                                            var abFlag = 0;
                                            //eD.abFlag = 0;
                                            var abDtArr = [];
                                            /////// HOLIDAY OR WEEKEND BETWEEN ABSENT INITIALIZING START ////////

                                            ///////// Salary Start ///////////
                                            db.salary.findAll({
                                                where: {
                                                    employee: emp.id,
                                                },
                                                order: [
                                                    ['approve_date', 'ASC']
                                                ]
                                            }).complete(function(err, salData) {
                                                async.each(salData, function(sal, cb_sal) {
                                                    eD.gSalary += sal.amount;
                                                    cb_sal();
                                                }, function(err) {
                                                    eD.basic = eD.gSalary / 100 * 60;
                                                    eD.house_rent = eD.gSalary / 100 * 30;
                                                    eD.medical = eD.gSalary / 100 * 5;
                                                    eD.conveyance = eD.gSalary / 100 * 5;
                                                    eD.branch_code = '000';
                                                    eD.account_type = '000';
                                                    eD.account_no = '0000000';
                                                    eD.account = '' + eD.branch_code + eD.account_type + eD.account_no;

                                                    db.bank_account.findAll({
                                                        where: {
                                                            employee: emp.id,
                                                        }
                                                    }).complete(function(err, bankAData) {
                                                        async.each(bankAData, function(bankA, cb_bankA) {
                                                            eD.branch_code = (bankA.branch_code) ? addLeadingZero(3, bankA.branch_code) : '000';
                                                            eD.account_type = (bankA.account_type) ? addLeadingZero(3, bankA.account_type) : '000';
                                                            eD.account_no = (bankA.account_no) ? addLeadingZero(7, bankA.account_no) : '000000';
                                                            eD.account = '' + eD.branch_code + eD.account_type + eD.account_no;
                                                            cb_bankA();
                                                        }, function(err) {
                                                            ////////// Deduction Start /////////
                                                            db.deduction.findAll({
                                                                where: {
                                                                    employee: emp.id,
                                                                    month: {
                                                                        between: [ef, et]
                                                                    }
                                                                },
                                                                attributes: ['id', 'month', 'advance', 'medical', 'stamp', 'ait', 'lunch_out', 'others'],
                                                            }).complete(function(err, deductData) {
                                                                async.each(deductData, function(deduct, cb_deduct) {
                                                                    eD.advDeduct += (deduct.advance) ? parseFloat(deduct.advance) : 0;
                                                                    eD.mediDeduct += (deduct.medical) ? parseFloat(deduct.medical) : 0;
                                                                    eD.stmpDeduct += (deduct.stamp) ? parseFloat(deduct.stamp) : 0;
                                                                    eD.loDeduct += (deduct.lunch_out) ? parseFloat(deduct.lunch_out) : 0;
                                                                    eD.othDeduct += (deduct.others) ? parseFloat(deduct.others) : 0;
                                                                    eD.aitDeduct += (deduct.ait) ? parseFloat(deduct.ait) : 0;
                                                                    cb_deduct();
                                                                }, function(err) {

                                                                    eD.mediDeduct = (folderName == 'DA_HR') ? 0 : ((eD.employeeType == 'STAFF') ? 20 : 0);
                                                                    eD.stmpDeduct = (eD.employeeType == 'WORKER') ? 10 : eD.stmpDeduct;
                                                                    ///////// Leave Start ////////
                                                                    db.leave.findAll({
                                                                        where: {
                                                                            employee: emp.id,
                                                                            date: {
                                                                                between: [f, t]
                                                                            }
                                                                        },
                                                                        attributes: ['id', 'date'],
                                                                        include: [{
                                                                            model: db.leave_type,
                                                                            attributes: ['id', 'name']
                                                                        }, ]
                                                                    }).complete(function(err, lvData) {
                                                                        async.each(lvData, function(lv, cb_lv) {
                                                                            if (lv.date.getMonth() == prM) {
                                                                                lva.push('P' + lv.date.getDate());
                                                                                lvj['P' + lv.date.getDate()] = (lv.leaveTypeTable.name) ? shortNames(lv.leaveTypeTable.name) : 'A';
                                                                            } else if (lv.date.getMonth() == nxM) {
                                                                                lva.push('N' + lv.date.getDate());
                                                                                lvj['N' + lv.date.getDate()] = (lv.leaveTypeTable.name) ? shortNames(lv.leaveTypeTable.name) : 'A';
                                                                            } else {
                                                                                lva.push('C' + lv.date.getDate());
                                                                                lvj['C' + lv.date.getDate()] = (lv.leaveTypeTable.name) ? shortNames(lv.leaveTypeTable.name) : 'A';
                                                                            }
                                                                            //eD.leave[shortNames(lv.leaveTypeTable.name)] = 0;
                                                                            cb_lv();
                                                                        }, function(err) {
                                                                            //////// DateList Start /////////
                                                                            async.each(dateList, function(dL, cb_dL) {
                                                                                var tmpDate1 = new Date(SD);
                                                                                var tdL = (dL[2]) ? dL[1] + dL[2] : dL[1];

                                                                                tmpDate1.setDate(parseInt(tdL));
                                                                                if (dL[0] == 'C') {
                                                                                    tmpDate1.setMonth(SD.getMonth());
                                                                                } else if (dL[0] == 'P') {
                                                                                    tmpDate1.setMonth(SD.getMonth() - 1);
                                                                                    if (SD.getMonth() == 0) {
                                                                                        tmpDate1.setFullYear(SD.getFullYear() - 1);
                                                                                    }
                                                                                } else {
                                                                                    tmpDate1.setMonth(SD.getMonth() + 1);
                                                                                    if (SD.getMonth() == 11) {
                                                                                        tmpDate1.setFullYear(SD.getFullYear() + 1);
                                                                                    }
                                                                                }

                                                                                pH[dL] = 24;
                                                                                pM[dL] = 60;
                                                                                pS[dL] = 60;
                                                                                eD.atTime[dL] = pH[dL] + ':' + pM[dL] + ':' + pS[dL];
                                                                                atTime[dL] = pH[dL] + ':' + pM[dL] + ':' + pS[dL];

                                                                                ////// INITIALIZING DAYS ///////////
                                                                                eD.attData[dL] = 'A';
                                                                                atdData[dL] = 'A';

                                                                                /////// CHECKING WEEKENDS //////////
                                                                                if (tmpDate1.getDay() == 5) {
                                                                                    eD.attData[dL] = 'W';
                                                                                    atdData[dL] = 'W';
                                                                                }

                                                                                //////// CHECKING HOLIDAYS ///////
                                                                                if (holiday.indexOf(dL) != -1) {
                                                                                    eD.attData[dL] = 'H';
                                                                                    atdData[dL] = 'H';
                                                                                }

                                                                                ///////// INITIALIZING ADJUSTMENT DAYS //////////
                                                                                if (adjustment.indexOf(dL) != -1) {
                                                                                    eD.attData[dL] = 'A';
                                                                                    atdData[dL] = 'A';
                                                                                }

                                                                                cb_dL();
                                                                            }, function(err) {
                                                                                ///////// Attendance Start /////////
                                                                                db.attendance.findAll({
                                                                                    where: {
                                                                                        punch_time: {
                                                                                            between: [f, t]
                                                                                        },
                                                                                        employee: emp.id
                                                                                    },
                                                                                    attributes: ['id', 'punch_time'],
                                                                                    order: [
                                                                                        ['id', 'ASC']
                                                                                    ],
                                                                                }).complete(function(err, attData) {
                                                                                    async.each(attData, function(atd, cb_atd) {
                                                                                        var pT = atd.punch_time;
                                                                                        var pD = 'C' + pT.getUTCDate();
                                                                                        if (pT.getUTCMonth() == prM) {
                                                                                            pD = 'P' + pT.getUTCDate();
                                                                                        } else if (pT.getUTCMonth() == nxM) {
                                                                                            pD = 'N' + pT.getUTCDate();
                                                                                        } else {
                                                                                            pD = 'C' + pT.getUTCDate();
                                                                                        }
                                                                                        //var pD = pT.getUTCDate();

                                                                                        ////// INTIME INITIALIZE START ////////
                                                                                        var InTimeH = pT.getUTCHours();
                                                                                        var InTimeM = pT.getUTCMinutes();
                                                                                        var InTimeS = pT.getUTCSeconds();

                                                                                        if (InTimeH < pH[pD]) {
                                                                                            pH[pD] = InTimeH;
                                                                                            pM[pD] = InTimeM;
                                                                                            pS[pD] = InTimeS;
                                                                                        }
                                                                                        if (InTimeH == pH[pD]) {
                                                                                            if (InTimeM < pM[pD]) {
                                                                                                pM[pD] = InTimeM;
                                                                                                pS[pD] = InTimeS;
                                                                                            }
                                                                                        }
                                                                                        /////////// INTIME INITIALIZE END //////////

                                                                                        eD.atTime[pD] = pH[pD] + ':' + pM[pD] + ':' + pS[pD];
                                                                                        atTime[pD] = pH[pD] + ':' + pM[pD] + ':' + pS[pD];

                                                                                        cb_atd();
                                                                                    }, function(err) {
                                                                                        var tmpAbDtArr = [];

                                                                                        async.each(dateList, function(dL2, cb_dL2) {

                                                                                            if (folderName == 'FFL_FACTORY_HR') {
                                                                                                if (eD.section == 'SAMPLE & DESIGN' || eD.section == 'LOAD-UNLOAD') {
                                                                                                    /////////// TIME ZONE 9:5 START ////////////
                                                                                                    if (atdData[dL2] == 'A') {
                                                                                                        if (pH[dL2] < 24) {
                                                                                                            if (pH[dL2] <= 9) {
                                                                                                                if (pH[dL2] == 9 && pM[dL2] >= 5) {
                                                                                                                    atdData[dL2] = 'L';
                                                                                                                    eD.attData[dL2] = 'L';
                                                                                                                } else {
                                                                                                                    eD.attData[dL2] = 'P';
                                                                                                                    atdData[dL2] = 'P';
                                                                                                                }
                                                                                                            } else {
                                                                                                                atdData[dL2] = 'L';
                                                                                                                eD.attData[dL2] = 'L';
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                    ////////// TIME ZONE 9:5 END ///////////
                                                                                                } else {
                                                                                                    /////////// TIME ZONE 8:15 START ////////////
                                                                                                    if (atdData[dL2] == 'A') {
                                                                                                        if (pH[dL2] < 24) {
                                                                                                            if (pH[dL2] <= 8) {
                                                                                                                if (pH[dL2] == 8 && pM[dL2] >= 15) {
                                                                                                                    atdData[dL2] = 'L';
                                                                                                                    eD.attData[dL2] = 'L';
                                                                                                                } else {
                                                                                                                    eD.attData[dL2] = 'P';
                                                                                                                    atdData[dL2] = 'P';
                                                                                                                }
                                                                                                            } else {
                                                                                                                atdData[dL2] = 'L';
                                                                                                                eD.attData[dL2] = 'L';
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                    ////////// TIME ZONE 8:15 END ///////////
                                                                                                }
                                                                                            } else {
                                                                                                /////////// TIME ZONE 8:15 START ////////////
                                                                                                if (atdData[dL2] == 'A') {
                                                                                                    if (pH[dL2] < 24) {
                                                                                                        if (pH[dL2] <= 8) {
                                                                                                            if (pH[dL2] == 8 && pM[dL2] >= 15) {
                                                                                                                atdData[dL2] = 'L';
                                                                                                                eD.attData[dL2] = 'L';
                                                                                                            } else {
                                                                                                                eD.attData[dL2] = 'P';
                                                                                                                atdData[dL2] = 'P';
                                                                                                            }
                                                                                                        } else {
                                                                                                            atdData[dL2] = 'L';
                                                                                                            eD.attData[dL2] = 'L';
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                                ////////// TIME ZONE 8:15 END ///////////
                                                                                            }

                                                                                            if (atdData[dL2] == 'A' || atdData[dL2] == 'H' || atdData[dL2] == 'W') {
                                                                                                if (atdData[dL2] == 'A') {
                                                                                                    if (abFlag == 1) {
                                                                                                        abDtArr = abDtArr.concat(tmpAbDtArr);
                                                                                                        tmpAbDtArr = [];
                                                                                                    }
                                                                                                    abFlag = 1;
                                                                                                } else {
                                                                                                    if (abFlag == 1) {
                                                                                                        tmpAbDtArr.push(dL2);
                                                                                                    }
                                                                                                }
                                                                                            } else {
                                                                                                if (abFlag == 1) {
                                                                                                    abFlag = 0;
                                                                                                    tmpAbDtArr = [];
                                                                                                }
                                                                                            }
                                                                                            cb_dL2();
                                                                                        }, function(err) {
                                                                                            async.each(dateList, function(dL3, cb_dL3) {

                                                                                                ///////// APPLYING ABSENT BETWEEN ABSENT START /////////
                                                                                                if (abDtArr.indexOf(dL3) != -1) {
                                                                                                    atdData[dL3] = 'A';
                                                                                                    eD.attData[dL3] = 'A';
                                                                                                }
                                                                                                ////////// APPLYING ABSENT BETWEEN ABSENT END ////////

                                                                                                //////// APPLYING LEAVE START ////////////
                                                                                                if (lva.indexOf(dL3) != -1) {
                                                                                                    atdData[dL3] = lvj[dL3];
                                                                                                    eD.attData[dL3] = lvj[dL3];
                                                                                                }
                                                                                                ////////// APPLYING LEAVE END /////////

                                                                                                if (dL3[0] == 'C') {
                                                                                                    if (atdData[dL3] == 'A') {
                                                                                                        eD.aOnly++;
                                                                                                        eD.aDays++;
                                                                                                    } else if (atdData[dL3] == 'H') {
                                                                                                        eD.hDays++;
                                                                                                    } else if (atdData[dL3] == 'W') {
                                                                                                        eD.wDays++;
                                                                                                    } else if (atdData[dL3] == 'L') {
                                                                                                        eD.lDays++;
                                                                                                    } else {
                                                                                                        eD.oDays++;
                                                                                                    }
                                                                                                    if (lva.indexOf(dL3) != -1) {
                                                                                                        eD.Leave++;
                                                                                                    }
                                                                                                    //atTime[dL3] = atdData[dL3]
                                                                                                    //eD.atTime[dL3] = eD.attData[dL3]+'-'+atTime[dL3]
                                                                                                }
                                                                                                cb_dL3();
                                                                                            }, function(err) {
                                                                                                if (eD.lDays > 0 || eD.aDays > 0 || eD.Leave > 0) {
                                                                                                    eD.attBonus = 0;
                                                                                                }
                                                                                                var tLDays = eD.lDays - parseInt(eD.lDays / 3)
                                                                                                eD.pDays = eD.oDays + eD.wDays + eD.hDays + tLDays;
                                                                                                eD.aDays += parseInt(eD.lDays / 3);
                                                                                                eD.abcDeduct = Math.round((eD.gSalary / eD.tDays) * eD.aDays);
                                                                                                eD.ttlDeduct = eD.abcDeduct + eD.advDeduct + eD.mediDeduct + eD.stmpDeduct + eD.othDeduct + eD.aitDeduct;
                                                                                                eD.netPayable = eD.gSalary - eD.ttlDeduct + eD.attBonus;
                                                                                                dD.employee.push(eD);
                                                                                                cb_emp();
                                                                                            });
                                                                                        });
                                                                                    });
                                                                                });
                                                                                /////// Attendance End ////////
                                                                            });
                                                                            /////////// DateList End //////////
                                                                        });
                                                                    });
                                                                    ///////// Leave End /////////
                                                                });
                                                            });
                                                        })
                                                    })
                                                });
                                            });
                                            /////// Salary End ////////
                                        }, function(err) {
                                            dD.employee.sort(function(a, b) {
                                                return parseFloat(a.id) - parseFloat(b.id);
                                            });
                                            returnData.push(dD);
                                            cb_dep();
                                        });

                                    });
                                    ///////// Emp End /////////
                                }, function(err) {
                                    callback(returnData);
                                });
                            });
                            ///////// Dep End /////////
                        });
                    })
                    /////// Adjustment End ////////
            });
        })
        ///////// Holiday End ////////
}

function search_worker_salary_statement_report(db, values, callback) {
    var SD = (values.date) ? new Date(values.date) : new Date();
    var status = (values.status) ? values.status : 1;
    //var SD = new Date('9/9/2016');
    var ef = new Date(SD);
    var et = new Date(SD);
    ef.setDate(1);
    et.setMonth(et.getMonth() + 1);
    et.setDate(0);

    var f = new Date(SD);
    var t = new Date(SD);
    f.setMonth(f.getMonth() - 1);
    f.setDate(20);
    t.setMonth(t.getMonth() + 1);
    t.setDate(10);

    var prM = f.getMonth();
    var nxM = t.getMonth();

    var returnData = [];
    var holiday = [];
    var adjustment = [];
    var dateList = dArray3Month(SD);
    var tDays = SD.monthDays(); // Month Days Count
    ////// Holiday Start ///////
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
                    if (holid.date.getMonth() == prM)
                        holiday.push('P' + holid.date.getDate());
                    else if (holid.date.getMonth() == nxM)
                        holiday.push('N' + holid.date.getDate());
                    else
                        holiday.push('C' + holid.date.getDate());
                }
                cb_holid();
            }, function(err) {
                ////// Adjustment Start ///////
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
                                if (adj.date.getMonth() == prM)
                                    adjustment.push('P' + adj.date.getDate());
                                else if (adj.date.getMonth() == nxM)
                                    adjustment.push('N' + adj.date.getDate());
                                else
                                    adjustment.push('C' + adj.date.getDate());
                            }
                            cb_adj();
                        }, function(err) {
                            /////// Dep Start ///////////
                            db.section.findAll({
                                where: {
                                    id: values.section,
                                },
                                attributes: ['id', 'name']
                            }).complete(function(err, secData) {
                                async.each(secData, function(dep, cb_dep) {
                                    var dD = {};
                                    dD.id = dep.id;
                                    dD.name = dep.name.toUpperCase();
                                    dD.employee = [];
                                    /////// Emp Start ////////
                                    db.employee.findAll({
                                        where: {
                                            section: dep.id,
                                            status: status
                                        },
                                        include: [{
                                            model: db.user,
                                            attributes: [
                                                'id', 'first_name', 'last_name', 'card_no'
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
                                            model: db.employee_type,
                                            attributes: [
                                                'id', 'name'
                                            ]
                                        }, {
                                            model: db.section,
                                            attributes: [
                                                'id', 'name'
                                            ]
                                        }],
                                        order: [
                                            ['designation', 'ASC']
                                        ],
                                    }).complete(function(err, empData) {
                                        async.each(empData, function(emp, cb_emp) {
                                            var att = {};
                                            var pH = {};
                                            var outH = {};
                                            var pM = {};
                                            var pS = {};
                                            var lvj = {};
                                            var lva = [];
                                            var eD = {};
                                            eD.fp = emp.id;
                                            eD.id = (emp.designationTable) ?
                                                (emp.designationTable.id ?
                                                    emp.designationTable.id :
                                                    9999) :
                                                9999;
                                            eD.name = (emp.userTable) ?
                                                ((emp.userTable.first_name) ?
                                                    ((emp.userTable.last_name) ?
                                                        emp.userTable.first_name.toUpperCase() + ' ' + emp.userTable.last_name.toUpperCase() :
                                                        emp.userTable.first_name.toUpperCase()) :
                                                    'NOT GIVEN') :
                                                'NOT GIVEN';
                                            eD.card = (emp.userTable) ?
                                                (emp.userTable.card_no ?
                                                    emp.userTable.card_no :
                                                    0) :
                                                0;
                                            eD.department = (emp.departmentTable) ?
                                                (emp.departmentTable.name.toUpperCase() ?
                                                    emp.departmentTable.name.toUpperCase() :
                                                    'NOT GIVEN') :
                                                'NOT GIVEN';
                                            eD.designation = (emp.designationTable) ?
                                                (emp.designationTable.name.toUpperCase() ?
                                                    emp.designationTable.name.toUpperCase() :
                                                    'NOT GIVEN') :
                                                'NOT GIVEN';
                                            eD.employeeType = (emp.employeeTypeTable) ?
                                                (emp.employeeTypeTable.name.toUpperCase() ?
                                                    emp.employeeTypeTable.name.toUpperCase() :
                                                    'NOT GIVEN') :
                                                'NOT GIVEN';
                                            eD.section = (emp.sectionTable) ?
                                                (emp.sectionTable.name.toUpperCase() ?
                                                    emp.sectionTable.name.toUpperCase() :
                                                    'NOT GIVEN') :
                                                'NOT GIVEN';
                                            eD.sectionID = (emp.sectionTable) ?
                                                (emp.sectionTable.id ?
                                                    emp.sectionTable.id :
                                                    0) :
                                                0;
                                            eD.grade = (emp.grade) ? emp.grade : 0;
                                            eD.date_of_join = (emp.date_of_join) ? emp.date_of_join : new Date();
                                            eD.payment_method = emp.payment_method;
                                            eD.gSalary = 0;
                                            eD.tDays = tDays;
                                            eD.pDays = 0;
                                            eD.aDays = 0;
                                            eD.lDays = 0;
                                            eD.wDays = 0;
                                            eD.hDays = 0;
                                            eD.oDays = 0;
                                            eD.aOnly = 0;
                                            //eD.inLate = 0;
                                            //eD.outLate = 0;
                                            eD.Leave = 0;
                                            eD.withOutLate = 0;
                                            //eD.lLeave = 0;
                                            //eD.sLeave = 0;
                                            //eD.cLeave = 0;
                                            //eD.alLeave = 0;
                                            eD.basic = 0;
                                            eD.house_rent = 0;
                                            eD.medical = 0;
                                            eD.conveyance = 0;
                                            eD.food = 0;
                                            eD.abcDeduct = 0;
                                            eD.advDeduct = 0;
                                            eD.mediDeduct = 0;
                                            eD.stmpDeduct = 0;
                                            eD.othDeduct = 0;
                                            eD.aitDeduct = 0;
                                            eD.ttlDeduct = 0;
                                            eD.attBonus = (eD.employeeType == 'STAFF') ?
                                                (
                                                    (eD.designation == 'HELPER' || eD.designation == 'TRAINEE HELPER' || eD.designation == 'AYA' || eD.designation == 'CLEANER') ?
                                                    250 :
                                                    (
                                                        (folderName == 'DA_HR') ?
                                                        500 :
                                                        600
                                                    )
                                                ) :
                                                (
                                                    (eD.employeeType == 'WORKER') ?
                                                    (
                                                        (eD.designation == 'HELPER' || eD.designation == 'TRAINEE HELPER' || eD.designation == 'AYA' || eD.designation == 'CLEANER') ?
                                                        250 :
                                                        (eD.designation == 'LOADER') ? 0 : 450
                                                    ) :
                                                    0
                                                );
                                            if (eD.section == 'SECURITY' || eD.section == 'DEEN & CO' || eD.designation == 'LOADER') {
                                                eD.attBonus = 0;
                                            }
                                            if (eD.section == 'DEEN & CO. (LOADER & CLEANER)') {
                                                if (eD.designation == 'CLEANER') {
                                                    eD.attBonus = 250;
                                                }
                                            }
                                            eD.netPayable = 0;

                                            eD.attData = {};
                                            var atdData = {};
                                            eD.atTime = {};
                                            eD.outTime = {};
                                            var atTime = {};
                                            var outTime = {};
                                            //eD.leave = {};

                                            //////// HOLIDAY OR WEEKEND BETWEEN ABSENT INITIALIZING START ////////
                                            var abFlag = 0;
                                            //eD.abFlag = 0;
                                            var abDtArr = [];
                                            /////// HOLIDAY OR WEEKEND BETWEEN ABSENT INITIALIZING START ////////

                                            ///////// Salary Start ///////////
                                            db.salary.findAll({
                                                where: {
                                                    employee: emp.id,
                                                },
                                                order: [
                                                    ['approve_date', 'ASC']
                                                ]
                                            }).complete(function(err, salData) {
                                                async.each(salData, function(sal, cb_sal) {
                                                    eD.gSalary += sal.amount;
                                                    cb_sal();
                                                }, function(err) {
                                                    eD.medical = (eD.gSalary > 0) ? 250 : 0;
                                                    eD.conveyance = (eD.gSalary > 0) ? 200 : 0;
                                                    eD.food = (eD.gSalary > 0) ? 650 : 0;
                                                    eD.basic = (eD.gSalary) ? (eD.gSalary - 1100) / 1.4 : 0;
                                                    eD.house_rent = eD.basic * 0.4;
                                                    eD.branch_code = '000';
                                                    eD.account_type = '000';
                                                    eD.account_no = '0000000';
                                                    eD.account = '' + eD.branch_code + eD.account_type + eD.account_no;

                                                    db.bank_account.findAll({
                                                        where: {
                                                            employee: emp.id,
                                                        }
                                                    }).complete(function(err, bankAData) {
                                                        async.each(bankAData, function(bankA, cb_bankA) {
                                                            eD.branch_code = (bankA.branch_code) ? addLeadingZero(3, bankA.branch_code) : '000';
                                                            eD.account_type = (bankA.account_type) ? addLeadingZero(3, bankA.account_type) : '000';
                                                            eD.account_no = (bankA.account_no) ? addLeadingZero(7, bankA.account_no) : '000000';
                                                            eD.account = '' + eD.branch_code + eD.account_type + eD.account_no;
                                                            cb_bankA();
                                                        }, function(err) {
                                                            ////////// Deduction Start /////////
                                                            db.deduction.findAll({
                                                                where: {
                                                                    employee: emp.id,
                                                                    month: {
                                                                        between: [ef, et]
                                                                    }
                                                                },
                                                                attributes: ['id', 'month', 'advance', 'medical', 'stamp', 'ait', 'lunch_out', 'others'],
                                                            }).complete(function(err, deductData) {
                                                                async.each(deductData, function(deduct, cb_deduct) {
                                                                    eD.advDeduct += (deduct.advance) ? parseFloat(deduct.advance) : 0;
                                                                    eD.mediDeduct += (deduct.medical) ? parseFloat(deduct.medical) : 0;
                                                                    eD.stmpDeduct += (deduct.stamp) ? parseFloat(deduct.stamp) : 0;
                                                                    eD.loDeduct += (deduct.lunch_out) ? parseFloat(deduct.lunch_out) : 0;
                                                                    eD.othDeduct += (deduct.others) ? parseFloat(deduct.others) : 0;
                                                                    eD.aitDeduct += (deduct.ait) ? parseFloat(deduct.ait) : 0;
                                                                    cb_deduct();
                                                                }, function(err) {

                                                                    eD.mediDeduct = (folderName == 'DA_HR') ? 0 : ((eD.employeeType == 'STAFF') ? 20 : 0);
                                                                    eD.stmpDeduct = (eD.employeeType == 'WORKER') ? 10 : eD.stmpDeduct;
                                                                    ///////// Leave Start ////////
                                                                    db.leave.findAll({
                                                                        where: {
                                                                            employee: emp.id,
                                                                            date: {
                                                                                between: [f, t]
                                                                            }
                                                                        },
                                                                        attributes: ['id', 'date'],
                                                                        include: [{
                                                                            model: db.leave_type,
                                                                            attributes: ['id', 'name']
                                                                        }, ]
                                                                    }).complete(function(err, lvData) {
                                                                        async.each(lvData, function(lv, cb_lv) {
                                                                            if (lv.date.getMonth() == prM) {
                                                                                lva.push('P' + lv.date.getDate());
                                                                                lvj['P' + lv.date.getDate()] = (lv.leaveTypeTable.name) ? shortNames(lv.leaveTypeTable.name) : 'A';
                                                                            } else if (lv.date.getMonth() == nxM) {
                                                                                lva.push('N' + lv.date.getDate());
                                                                                lvj['N' + lv.date.getDate()] = (lv.leaveTypeTable.name) ? shortNames(lv.leaveTypeTable.name) : 'A';
                                                                            } else {
                                                                                lva.push('C' + lv.date.getDate());
                                                                                lvj['C' + lv.date.getDate()] = (lv.leaveTypeTable.name) ? shortNames(lv.leaveTypeTable.name) : 'A';
                                                                            }
                                                                            //eD.leave[shortNames(lv.leaveTypeTable.name)] = 0;
                                                                            cb_lv();
                                                                        }, function(err) {
                                                                            //////// DateList Start /////////
                                                                            async.each(dateList, function(dL, cb_dL) {
                                                                                var tmpDate1 = new Date(SD);
                                                                                var tdL = (dL[2]) ? dL[1] + dL[2] : dL[1];

                                                                                tmpDate1.setDate(parseInt(tdL));
                                                                                if (dL[0] == 'C') {
                                                                                    tmpDate1.setMonth(SD.getMonth());
                                                                                } else if (dL[0] == 'P') {
                                                                                    tmpDate1.setMonth(SD.getMonth() - 1);
                                                                                    if (SD.getMonth() == 0) {
                                                                                        tmpDate1.setFullYear(SD.getFullYear() - 1);
                                                                                    }
                                                                                } else {
                                                                                    tmpDate1.setMonth(SD.getMonth() + 1);
                                                                                    if (SD.getMonth() == 11) {
                                                                                        tmpDate1.setFullYear(SD.getFullYear() + 1);
                                                                                    }
                                                                                }

                                                                                pH[dL] = 24;
                                                                                pM[dL] = 60;
                                                                                pS[dL] = 60;
                                                                                outH[dL] = 0;
                                                                                eD.atTime[dL] = pH[dL] + ':' + pM[dL] + ':' + pS[dL];
                                                                                eD.outTime[dL] = outH[dL];
                                                                                atTime[dL] = pH[dL] + ':' + pM[dL] + ':' + pS[dL];

                                                                                ////// INITIALIZING DAYS ///////////
                                                                                eD.attData[dL] = 'A';
                                                                                atdData[dL] = 'A';

                                                                                /////// CHECKING WEEKENDS //////////
                                                                                if (tmpDate1.getDay() == 5) {
                                                                                    eD.attData[dL] = 'W';
                                                                                    atdData[dL] = 'W';
                                                                                }

                                                                                //////// CHECKING HOLIDAYS ///////
                                                                                if (holiday.indexOf(dL) != -1) {
                                                                                    eD.attData[dL] = 'H';
                                                                                    atdData[dL] = 'H';
                                                                                }

                                                                                ///////// INITIALIZING ADJUSTMENT DAYS //////////
                                                                                if (adjustment.indexOf(dL) != -1) {
                                                                                    eD.attData[dL] = 'A';
                                                                                    atdData[dL] = 'A';
                                                                                }

                                                                                cb_dL();
                                                                            }, function(err) {
                                                                                ///////// Attendance Start /////////
                                                                                db.attendance.findAll({
                                                                                    where: {
                                                                                        punch_time: {
                                                                                            between: [f, t]
                                                                                        },
                                                                                        employee: emp.id
                                                                                    },
                                                                                    attributes: ['id', 'punch_time'],
                                                                                    order: [
                                                                                        ['id', 'ASC']
                                                                                    ],
                                                                                }).complete(function(err, attData) {
                                                                                    async.each(attData, function(atd, cb_atd) {
                                                                                        var pT = atd.punch_time;
                                                                                        var pD = 'C' + pT.getUTCDate();
                                                                                        if (pT.getUTCMonth() == prM) {
                                                                                            pD = 'P' + pT.getUTCDate();
                                                                                        } else if (pT.getUTCMonth() == nxM) {
                                                                                            pD = 'N' + pT.getUTCDate();
                                                                                        } else {
                                                                                            pD = 'C' + pT.getUTCDate();
                                                                                        }
                                                                                        //var pD = pT.getUTCDate();

                                                                                        ////// INTIME INITIALIZE START ////////
                                                                                        var InTimeH = pT.getUTCHours();
                                                                                        var InTimeM = pT.getUTCMinutes();
                                                                                        var InTimeS = pT.getUTCSeconds();

                                                                                        if (InTimeH < pH[pD]) {
                                                                                            pH[pD] = InTimeH;
                                                                                            pM[pD] = InTimeM;
                                                                                            pS[pD] = InTimeS;
                                                                                        }
                                                                                        if (InTimeH > outH[pD]) {
                                                                                            outH[pD] = InTimeH;
                                                                                        }
                                                                                        if (InTimeH == pH[pD]) {
                                                                                            if (InTimeM < pM[pD]) {
                                                                                                pM[pD] = InTimeM;
                                                                                                pS[pD] = InTimeS;
                                                                                            }
                                                                                        }
                                                                                        /////////// INTIME INITIALIZE END //////////

                                                                                        eD.atTime[pD] = pH[pD] + ':' + pM[pD] + ':' + pS[pD];
                                                                                        eD.outTime[pD] = outH[pD];
                                                                                        atTime[pD] = pH[pD] + ':' + pM[pD] + ':' + pS[pD];

                                                                                        cb_atd();
                                                                                    }, function(err) {
                                                                                        var tmpAbDtArr = [];
                                                                                        eD.overTimeHour = 0;
                                                                                        async.each(dateList, function(dL2, cb_dL2) {
                                                                                            if (folderName == 'FFL_FACTORY_HR') {
                                                                                                if (eD.section == 'SAMPLE & DESIGN' || eD.section == 'LOAD-UNLOAD') {
                                                                                                    /////////// TIME ZONE 9:5 START ////////////
                                                                                                    if (atdData[dL2] == 'A') {
                                                                                                        if (pH[dL2] < 24) {
                                                                                                            if (pH[dL2] <= 9) {
                                                                                                                if (pH[dL2] == 9 && pM[dL2] >= 5) {
                                                                                                                    atdData[dL2] = 'L';
                                                                                                                    eD.attData[dL2] = 'L';
                                                                                                                } else {
                                                                                                                    eD.attData[dL2] = 'P';
                                                                                                                    atdData[dL2] = 'P';
                                                                                                                }
                                                                                                            } else {
                                                                                                                atdData[dL2] = 'L';
                                                                                                                eD.attData[dL2] = 'L';
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                    ////////// TIME ZONE 9:5 END ///////////
                                                                                                } else {
                                                                                                    /////////// TIME ZONE 8:15 START ////////////
                                                                                                    if (atdData[dL2] == 'A') {
                                                                                                        if (pH[dL2] < 24) {
                                                                                                            if (pH[dL2] <= 8) {
                                                                                                                if (pH[dL2] == 8 && pM[dL2] >= 15) {
                                                                                                                    atdData[dL2] = 'L';
                                                                                                                    eD.attData[dL2] = 'L';
                                                                                                                } else {
                                                                                                                    eD.attData[dL2] = 'P';
                                                                                                                    atdData[dL2] = 'P';
                                                                                                                }
                                                                                                            } else {
                                                                                                                atdData[dL2] = 'L';
                                                                                                                eD.attData[dL2] = 'L';
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                    ////////// TIME ZONE 8:15 END ///////////
                                                                                                }
                                                                                            } else {
                                                                                                /////////// TIME ZONE 8:15 START ////////////
                                                                                                if (atdData[dL2] == 'A') {
                                                                                                    if (pH[dL2] < 24) {
                                                                                                        if (pH[dL2] <= 8) {
                                                                                                            if (pH[dL2] == 8 && pM[dL2] >= 15) {
                                                                                                                atdData[dL2] = 'L';
                                                                                                                eD.attData[dL2] = 'L';
                                                                                                            } else {
                                                                                                                eD.attData[dL2] = 'P';
                                                                                                                atdData[dL2] = 'P';
                                                                                                            }
                                                                                                        } else {
                                                                                                            atdData[dL2] = 'L';
                                                                                                            eD.attData[dL2] = 'L';
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                                ////////// TIME ZONE 8:15 END ///////////
                                                                                            }

                                                                                            if (dL2[0] == 'C') {
                                                                                                if (outH[dL2] > 17) {
                                                                                                    if (atdData[dL2] == 'P' || atdData[dL2] == 'L') {
                                                                                                        var tmpOverTimeHour = parseInt(outH[dL2]) - 17;
                                                                                                        if (tmpOverTimeHour < 0) {
                                                                                                            tmpOverTimeHour = 0;
                                                                                                        }
                                                                                                        eD.overTimeHour += (tmpOverTimeHour >= 2) ? 2 : 1;
                                                                                                    }
                                                                                                }
                                                                                            }

                                                                                            if (atdData[dL2] == 'A' || atdData[dL2] == 'H' || atdData[dL2] == 'W') {
                                                                                                if (atdData[dL2] == 'A') {
                                                                                                    if (abFlag == 1) {
                                                                                                        abDtArr = abDtArr.concat(tmpAbDtArr);
                                                                                                        tmpAbDtArr = [];
                                                                                                    }
                                                                                                    abFlag = 1;
                                                                                                } else {
                                                                                                    if (abFlag == 1) {
                                                                                                        tmpAbDtArr.push(dL2);
                                                                                                    }
                                                                                                }
                                                                                            } else {
                                                                                                if (abFlag == 1) {
                                                                                                    abFlag = 0;
                                                                                                    tmpAbDtArr = [];
                                                                                                }
                                                                                            }
                                                                                            cb_dL2();
                                                                                        }, function(err) {
                                                                                            async.each(dateList, function(dL3, cb_dL3) {

                                                                                                ///////// APPLYING ABSENT BETWEEN ABSENT START /////////
                                                                                                if (abDtArr.indexOf(dL3) != -1) {
                                                                                                    atdData[dL3] = 'A';
                                                                                                    eD.attData[dL3] = 'A';
                                                                                                }
                                                                                                ////////// APPLYING ABSENT BETWEEN ABSENT END ////////

                                                                                                //////// APPLYING LEAVE START ////////////
                                                                                                if (lva.indexOf(dL3) != -1) {
                                                                                                    atdData[dL3] = lvj[dL3];
                                                                                                    eD.attData[dL3] = lvj[dL3];
                                                                                                }
                                                                                                ////////// APPLYING LEAVE END /////////

                                                                                                if (dL3[0] == 'C') {
                                                                                                    if (atdData[dL3] == 'A') {
                                                                                                        eD.aOnly++;
                                                                                                        eD.aDays++;
                                                                                                    } else if (atdData[dL3] == 'H') {
                                                                                                        eD.hDays++;
                                                                                                    } else if (atdData[dL3] == 'W') {
                                                                                                        eD.wDays++;
                                                                                                    } else if (atdData[dL3] == 'L') {
                                                                                                        eD.lDays++;
                                                                                                    } else {
                                                                                                        eD.oDays++;
                                                                                                    }
                                                                                                    if (lva.indexOf(dL3) != -1) {
                                                                                                        if (atdData[dL3] != 'LL' && atdData[dL3] != 'DWP') {
                                                                                                            eD.withOutLate++;
                                                                                                        }
                                                                                                        eD.Leave++;
                                                                                                    }
                                                                                                    //atTime[dL3] = atdData[dL3]
                                                                                                    //eD.atTime[dL3] = eD.attData[dL3]+'-'+atTime[dL3]
                                                                                                }
                                                                                                cb_dL3();
                                                                                            }, function(err) {
                                                                                                if (eD.lDays > 0 || eD.aDays > 0 || eD.Leave > 0) {
                                                                                                    eD.attBonus = 0;
                                                                                                }
                                                                                                var tLDays = eD.lDays - parseInt(eD.lDays / 3)
                                                                                                eD.pDays = eD.oDays + eD.wDays + eD.hDays + tLDays;
                                                                                                eD.aDays += parseInt(eD.lDays / 3);
                                                                                                eD.abcDeduct = (eD.aDays > 2) ? Math.round((eD.gSalary / eD.tDays) * eD.aDays) : Math.round((eD.basic / eD.tDays) * eD.aDays);
                                                                                                //if(eD.date_of_join.getFullYear()==SD.getFullYear()){
                                                                                                //  if(eD.date_of_join.getMonth()==SD.getMonth()){
                                                                                                //    eD.abcDeduct = (eD.date_of_join.getDate()>5)?Math.round((eD.basic / eD.tDays) * eD.aDays):Math.round((eD.gSalary / eD.tDays) * eD.aDays);
                                                                                                //  }
                                                                                                //}
                                                                                                eD.ttlDeduct = eD.abcDeduct + eD.advDeduct + eD.mediDeduct + eD.stmpDeduct + eD.othDeduct + eD.aitDeduct;
                                                                                                eD.netPayable = eD.gSalary - eD.ttlDeduct + eD.attBonus;
                                                                                                dD.employee.push(eD);
                                                                                                cb_emp();
                                                                                            });
                                                                                        });
                                                                                    });
                                                                                });
                                                                                /////// Attendance End ////////
                                                                            });
                                                                            /////////// DateList End //////////
                                                                        });
                                                                    });
                                                                    ///////// Leave End /////////
                                                                });
                                                            });
                                                        })
                                                    })
                                                });
                                            });
                                            /////// Salary End ////////
                                        }, function(err) {
                                            dD.employee.sort(function(a, b) {
                                                return parseFloat(a.id) - parseFloat(b.id);
                                            });
                                            returnData.push(dD);
                                            cb_dep();
                                        });

                                    });
                                    ///////// Emp End /////////
                                }, function(err) {
                                    callback(returnData);
                                });
                            });
                            ///////// Dep End /////////
                        });
                    })
                    /////// Adjustment End ////////
            });
        })
        ///////// Holiday End ////////
}




function routerInit(app, dbFull) {
    var db = dbFull.DA_HR

    app.get('/salary_statement_report/:DEPARTMENT_ID', /*isAuthenticated,*/ function(req, res) {
        var DEPARTMENT_ID = req.params.DEPARTMENT_ID;
        salary_statement_report(db, /*DEPARTMENT_ID, */ req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/salary_statement_report', /*isAuthenticated,*/ function(req, res) {
        var sM = new Date();
        salary_statement_report(db, sM, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/salaryLastUpdate', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        db.comparative_salary.sequelize.query('SELECT MAX(created_at) AS last_update FROM comparative_salary').complete(function(err, data) {
            res.send(data);
        });
    });

    app.get('/salaryLastUpdateB', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        db.comparative_salary.sequelize.query('SELECT MAX(created_at) AS last_update FROM comparative_salary_b').then(function(data) {
            res.send(data);
        });
    });

    app.get('/salary', /*isAuthenticated,*/ function(req, res) {
        salary_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/salary/:EID', /*isAuthenticated,*/ function(req, res) {
        var EID = req.params.EID;
        salary_details_list(db, EID, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getSalaryPayment', /*isAuthenticated,*/ function(req, res) {
        getSalaryPayment(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getSalary', /*isAuthenticated,*/ function(req, res) {
        // var QUERY = {};
        // QUERY.employee = 52;
        // QUERY.date = new Date('2016-11-01');
        getSalary(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getSalaryJson', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.employee = 4017;
        // QUERY.date = new Date('2016-11-01');
        getSalaryJson(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DownloadSalaryStatementReport', function(QUERY) {
        var d = new Date(QUERY.date);
        var r = 1;
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            salaryStatementReportHead() +
            '<div id="pageBody">' +
            '<b style="line-height:2"><big>SECTION: ' +
            QUERY.sectionName +
            '</big></b>' +
            '<table style="width:100%;">' +
            '<tr>' +
            '<th rowspan="2">#</th>' +
            '<th rowspan="2">FP ID</th>' +
            '<th rowspan="2">EMPLOYEE NAME</th>' +
            '<th rowspan="2">DESIGNATION</th>' +
            '<th rowspan="2" style="white-space:nowrap;">.JOIN DATE.</th>' +
            '<th rowspan="2"><small><small>CARD</small></small></th>' +
            '<th rowspan="2"><small><small>GR.</small></small></th>' +
            '<th rowspan="2"><small>T.D.</small></th>' +
            '<th rowspan="2"><small>P.D.</small></th>' +
            '<th rowspan="2"><small>A.D.</small></th>' +
            '<th rowspan="2">BASIC</th>';
        htmlData += (QUERY.employee_type == 2) ?
            '<th colspan="4">ALLOWANCES</th>' :
            '<th colspan="3">ALLOWANCES</th>';
        htmlData += '<th rowspan="2">GROSS<br />SALARY</th>';
        htmlData += (QUERY.employee_type == 2) ?
            '<th colspan="5">DEDUCTIONS</th>' :
            '<th colspan="7">DEDUCTIONS</th>';
        htmlData += '<th rowspan="2">TOTAL<br />DEDUCT.</th>' +
            '<th rowspan="2">ATT.<br />BONUS</th>';
        htmlData += (QUERY.employee_type == 2) ? '<th colspan="3">OVERTIME</th>' : '';
        htmlData += '<th rowspan="2">NET<br />PAYABLE</th>' +
            '<th rowspan="2">PAY.<br />MODE</th>' +
            '<th rowspan="2"><big>..SIGNATURE..</big></th>' +
            '</tr>' +
            '<tr>';
        htmlData += (QUERY.employee_type == 2) ?
            '<th><small>House Rent</small></th>' +
            '<th><small>Medical</small></th>' +
            '<th><small>Conveyance</small></th>' +
            '<th><small>Food</small></th>' +
            '<th><small>Absent</small></th>' +
            '<th><small>Lunch<br />Out</small></th>' +
            '<th><small>Advance</small></th>' +
            '<th><small>Stamp</small></th>' +
            '<th><small>Others</small></th>' :
            '<th><small>House Rent</small></th>' +
            '<th><small>Medical</small></th>' +
            '<th><small>Conveyance</small></th>' +
            '<th><small>Absent</small></th>' +
            '<th><small>Advance</small></th>' +
            '<th><small>Medical</small></th>' +
            '<th><small>Stamp</small></th>' +
            '<th><small>Lunch<br />Out</small></th>' +
            '<th><small>Others</small></th>' +
            '<th><small>AIT</small></th>';
        htmlData += (QUERY.employee_type == 2) ?
            '<th><small>Hour</small></th><th><small>Rate</small></th><th><small>Taka</small></th>' :
            '';
        htmlData += '</tr>';
        var basic = 0,
            house_rent = 0,
            medical = 0,
            conveyance = 0,
            food = 0,
            salary = 0,
            absentDeduct = 0,
            advanceDeduct = 0,
            medicalDeduct = 0,
            stampDeduct = 0,
            aitDeduct = 0,
            lunchOutDeduct = 0,
            othersDeduct = 0,
            totalDeduct = 0,
            attendanceBonus = 0,
            overTime = 0,
            tOverTimeAmount = 0,
            tNetPayable = 0;
        getEmployeeMonthSummaryV2(db, QUERY, function(empData) {
            async.each(empData, function(emp, cb_emp) {
                var payment_method = (emp.payment_method == 1) ? 'CASH' : 'BANK';
                basic += emp.basic;
                house_rent += emp.house_rent;
                medical += emp.medical;
                conveyance += emp.conveyance;
                food += emp.food;
                salary += emp.salary;
                absentDeduct += emp.absentDeduct;
                advanceDeduct += emp.advanceDeduct;
                medicalDeduct += emp.medicalDeduct;
                stampDeduct += emp.stampDeduct;
                aitDeduct += emp.aitDeduct;
                lunchOutDeduct += emp.lunchOutDeduct;
                othersDeduct += emp.othersDeduct;
                totalDeduct += emp.totalDeduct;
                attendanceBonus += emp.attendanceBonus;
                overTime += emp.overTime;
                tOverTimeAmount += emp.overTimeAmount;
                tNetPayable += emp.netPayable;
                htmlData += '<tr>' +
                    '<td height="60" align="center">' + r + '</td>' +
                    '<td>' + emp.fp + '</td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td>' + emp.name + '<br /><br />' + emp.name_bangla + '</td>' :
                    '<td>' + emp.name + '</td>';
                htmlData += '<td>' + emp.designation + '</td>' +
                    '<td>' + emp.date_of_join + '</td>' +
                    '<td align="center">' + emp.card_no + '</td>' +
                    '<td align="center">' + emp.grade + '</td>' +
                    '<td align="right">' + emp.totalDays + '</td>' +
                    '<td align="right">' + emp.totalPayableDays + '</td>' +
                    '<td align="right">' + emp.totalDeductDays + '</td>' +
                    '<td align="right">' + emp.basic.formatMoney(2, '.', ',') + '</td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + emp.house_rent.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.medical.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.conveyance.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.food.formatMoney(2, '.', ',') + '</td>' :
                    '<td align="right">' + emp.house_rent.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.medical.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.conveyance.formatMoney(2, '.', ',') + '</td>';
                htmlData += '<td align="right">' + emp.salary.formatMoney(2, '.', ',') + '</td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + emp.absentDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.lunchOutDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.advanceDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.stampDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.othersDeduct.formatMoney(2, '.', ',') + '</td>' :
                    '<td align="right">' + emp.absentDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.advanceDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.medicalDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.stampDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.lunchOutDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.othersDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.aitDeduct.formatMoney(2, '.', ',') + '</td>';
                htmlData += '<td align="right">' + emp.totalDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.attendanceBonus.formatMoney(2, '.', ',') + '</td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + emp.overTime + '</td>' +
                    '<td align="right">' + emp.overTimeRate.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.overTimeAmount.formatMoney(2, '.', ',') + '</td>' :
                    '';
                htmlData += '<td align="right"><big><b>' + emp.netPayable.formatMoney(2, '.', ',') + '</b></big></td>' +
                    '<td align="center">' + payment_method + '</td>' +
                    '<td></td>' +
                    '</tr>';
                r++;
                cb_emp();
            }, function(err) {
                var tOTAmount = Math.round(tOverTimeAmount);
                htmlData += '<tr>' +
                    '<td colspan="10"><b>TOTAL</b></td>' +
                    '<td align="right"><b>' + basic.formatMoney(2, '.', ',') + '</b></td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + house_rent.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + medical.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + conveyance.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + food.formatMoney(2, '.', ',') + '</td>' :
                    '<td align="right">' + house_rent.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + medical.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + conveyance.formatMoney(2, '.', ',') + '</td>';
                htmlData += '<td align="right">' + salary.formatMoney(2, '.', ',') + '</td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + absentDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + lunchOutDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + advanceDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + stampDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + othersDeduct.formatMoney(2, '.', ',') + '</td>' :
                    '<td align="right">' + absentDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + advanceDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + medicalDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + stampDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + lunchOutDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + othersDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + aitDeduct.formatMoney(2, '.', ',') + '</td>';
                htmlData += '<td align="right"><b>' + totalDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"><b>' + attendanceBonus.formatMoney(2, '.', ',') + '</b></td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right"><b>' + overTime + '</b></td>' +
                    '<td align="right"><b></b></td>' +
                    '<td align="right"><b>' + tOTAmount.formatMoney(2, '.', ',') + '</b></td>' :
                    '';
                htmlData += '<td align="right"><b>' + tNetPayable.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td colspan="2"></td>' +
                    '</tr>' +
                    '</table></div>';
                var m = 150;
                var h = 8.5 * m;
                var w = 14 * m;
                htmlData += '</body></html>';
                var options = {
                    format: 'Legal',
                    //width: '7120px', 
                    //height: '4320px',
                    header: {
                        height: "20mm",
                        contents: salaryStatementHeader(d)
                    },
                    footer: {
                        height: "20mm",
                        contents: footerSContents()
                    },
                    width: w + 'px',
                    height: h + 'px'
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadSalaryStatementReport", 'success');
                });
            });
        });
    });

    socket.on('SalaryListPDFDownload', function(site_url, file_name) {
        var QUERY = {};
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            dailyReportHead();
        var gross = 0;
        section_list(db, function(secList) {
            async.each(secList, function(sec, cb_sec) {
                QUERY.section = sec.id;
                QUERY.status = 1;
                var total = 0;
                getEmployeeDetails(db, QUERY, function(allEmpSall) {
                    htmlData +=
                        '<div id="pageBody">' +
                        '<big>' + sec.name.toUpperCase() + '</big>' +
                        '<table style="width:100%">' +
                        '<tr>' +
                        '<th>EMP. ID</th>' +
                        '<th>CARD NO.</th>' +
                        '<th>GRADE</th>' +
                        '<th>EMP. NAME (ENG.)</th>' +
                        '<th>EMP. NAME (BAN.)</th>' +
                        '<th>BIRTH DATE</th>' +
                        '<th>JOIN DATE</th>' +
                        '<th>SECTION</th>' +
                        '<th>DESIGNATION</th>' +
                        '<th>SALARY</th>' +
                        '<th>METHOD</th>' +
                        '<th>ACCOUNT NO.</th>' +
                        '</tr>';
                    async.each(allEmpSall, function(empSal, cb_empSal) {
                        total += empSal.salary;
                        htmlData += '<tr>';
                        htmlData += '<td align="center">';
                        htmlData += addLeadingZero(9, parseInt(empSal.id));
                        htmlData += '</td>';
                        htmlData += '<td align="center">';
                        htmlData += (parseInt(empSal.card_no)) ? addLeadingZero(9, parseInt(empSal.card_no)) : '000000000';
                        htmlData += '</td>';
                        htmlData += '<td align="center">';
                        htmlData += empSal.grade;
                        htmlData += '</td>';
                        htmlData += '<td align="left">';
                        htmlData += empSal.name;
                        htmlData += '</td>';
                        htmlData += '<td align="left">';
                        htmlData += empSal.name_bangla;
                        htmlData += '</td>';
                        htmlData += '<td align="center">';
                        htmlData += empSal.date_of_birth.formatDate();
                        htmlData += '</td>';
                        htmlData += '<td align="center">';
                        htmlData += empSal.date_of_join.formatDate();
                        htmlData += '</td>';
                        htmlData += '<td align="left">';
                        htmlData += empSal.sectionName;
                        htmlData += '</td>';
                        htmlData += '<td align="left">';
                        htmlData += empSal.designationName;
                        htmlData += '</td>';
                        htmlData += '<td align="right">';
                        htmlData += empSal.salary.formatMoney(2, '.', ',');
                        htmlData += '</td>';
                        htmlData += '<td align="center">';
                        htmlData += (empSal.payment_method == 1) ? 'CASH' : 'BANK';
                        htmlData += '</td>';
                        htmlData += '<td align="center">';
                        htmlData += empSal.account_no;
                        htmlData += '</td>';
                        htmlData += '</tr>';
                        cb_empSal();
                    }, function(err) {
                        gross += total;
                        htmlData +=
                            '<tr>' +
                            '<th colspan="9">TOTAL=></th>' +
                            '<th align="right">' + total.formatMoney(2, '.', ',') + '</th>' +
                            '<th colspan="2"></th>' +
                            '</tr>' +
                            '</table></div>';
                        cb_sec();
                    })
                });
            }, function(err) {
                htmlData +=
                    '<table style="width:100%">' +
                    '<tr>' +
                    '<th colspan="5">SALARY GROSS TOTAL=></th>' +
                    '<th align="right">' + gross.formatMoney(2, '.', ',') + '</th>' +
                    '</tr>' +
                    '</table>' +
                    '</body></html>';
                d = new Date();
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header: {
                        height: "25mm",
                        contents: headerContents() +
                            '<h4 style="' +
                            'line-height: 0;' +
                            '">EMPLOYEE SALARY DETAILS</h4>'
                    },
                    footer: {
                        height: "15mm",
                        contents: footerContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + file_name + '.pdf', function(err, res) {
                    socket.emit("SalaryListPDFDownload", 'success');
                });
            })
        });
    });

    socket.on('DownloadSalaryStatementReportB', function(QUERY) {
        var d = new Date(QUERY.date);
        var r = 1;
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            salaryStatementReportHead() +
            '<div id="pageBody">' +
            '<b style="line-height:2"><big>SECTION: ' +
            QUERY.sectionName +
            '</big></b>' +
            '<table style="width:100%;">' +
            '<tr>' +
            '<th rowspan="2">#</th>' +
            '<th rowspan="2">FP ID</th>' +
            '<th rowspan="2">EMPLOYEE NAME</th>' +
            '<th rowspan="2">DESIGNATION</th>' +
            '<th rowspan="2" style="white-space:nowrap;">.JOIN DATE.</th>' +
            '<th rowspan="2"><small><small>CARD</small></small></th>' +
            '<th rowspan="2"><small><small>GR.</small></small></th>' +
            '<th rowspan="2"><small>T.D.</small></th>' +
            '<th rowspan="2"><small>P.D.</small></th>' +
            '<th rowspan="2"><small>A.D.</small></th>' +
            '<th rowspan="2">BASIC</th>';
        htmlData += (QUERY.employee_type == 2) ?
            '<th colspan="4">ALLOWANCES</th>' :
            '<th colspan="3">ALLOWANCES</th>';
        htmlData += '<th rowspan="2">GROSS<br />SALARY</th>';
        htmlData += (QUERY.employee_type == 2) ?
            '<th colspan="5">DEDUCTIONS</th>' :
            '<th colspan="7">DEDUCTIONS</th>';
        htmlData += '<th rowspan="2">TOTAL<br />DEDUCT.</th>' +
            '<th rowspan="2">ATT.<br />BONUS</th>';
        htmlData += (QUERY.employee_type == 2) ? '<th colspan="3">OVERTIME</th>' : '';
        htmlData += '<th rowspan="2">NET<br />PAYABLE</th>' +
            '<th rowspan="2">PAY.<br />MODE</th>' +
            '<th rowspan="2"><big>..SIGNATURE..</big></th>' +
            '</tr>' +
            '<tr>';
        htmlData += (QUERY.employee_type == 2) ?
            '<th><small>House Rent</small></th>' +
            '<th><small>Medical</small></th>' +
            '<th><small>Conveyance</small></th>' +
            '<th><small>Food</small></th>' +
            '<th><small>Absent</small></th>' +
            '<th><small>Lunch<br />Out</small></th>' +
            '<th><small>Advance</small></th>' +
            '<th><small>Stamp</small></th>' +
            '<th><small>Others</small></th>' :
            '<th><small>House Rent</small></th>' +
            '<th><small>Medical</small></th>' +
            '<th><small>Conveyance</small></th>' +
            '<th><small>Absent</small></th>' +
            '<th><small>Advance</small></th>' +
            '<th><small>Medical</small></th>' +
            '<th><small>Stamp</small></th>' +
            '<th><small>Lunch<br />Out</small></th>' +
            '<th><small>Others</small></th>' +
            '<th><small>AIT</small></th>';
        htmlData += (QUERY.employee_type == 2) ?
            '<th><small>Hour</small></th><th><small>Rate</small></th><th><small>Taka</small></th>' :
            '';
        htmlData += '</tr>';
        var basic = 0,
            house_rent = 0,
            medical = 0,
            conveyance = 0,
            food = 0,
            salary = 0,
            absentDeduct = 0,
            advanceDeduct = 0,
            medicalDeduct = 0,
            stampDeduct = 0,
            aitDeduct = 0,
            lunchOutDeduct = 0,
            othersDeduct = 0,
            totalDeduct = 0,
            attendanceBonus = 0,
            overTime = 0,
            tOverTimeAmount = 0,
            tNetPayable = 0;
        getEmployeeMonthSummaryB(db, QUERY, function(empData) {
            async.each(empData, function(emp, cb_emp) {
                var payment_method = (emp.payment_method == 1) ? 'CASH' : 'BANK';
                basic += emp.basic;
                house_rent += emp.house_rent;
                medical += emp.medical;
                conveyance += emp.conveyance;
                food += emp.food;
                salary += emp.salary;
                absentDeduct += emp.absentDeduct;
                advanceDeduct += emp.advanceDeduct;
                medicalDeduct += emp.medicalDeduct;
                stampDeduct += emp.stampDeduct;
                aitDeduct += emp.aitDeduct;
                lunchOutDeduct += emp.lunchOutDeduct;
                othersDeduct += emp.othersDeduct;
                totalDeduct += emp.totalDeduct;
                attendanceBonus += emp.attendanceBonus;
                overTime += emp.overTime;
                tOverTimeAmount += emp.overTimeAmount;
                tNetPayable += emp.netPayable;
                htmlData += '<tr>' +
                    '<td height="60" align="center">' + r + '</td>' +
                    '<td>' + emp.fp + '</td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td>' + emp.name + '<br /><br />' + emp.name_bangla + '</td>' :
                    '<td>' + emp.name + '</td>';
                htmlData += '<td>' + emp.designation + '</td>' +
                    '<td>' + emp.date_of_join + '</td>' +
                    '<td align="center">' + emp.card_no + '</td>' +
                    '<td align="center">' + emp.grade + '</td>' +
                    '<td align="right">' + emp.totalDays + '</td>' +
                    '<td align="right">' + emp.totalPayableDays + '</td>' +
                    '<td align="right">' + emp.totalDeductDays + '</td>' +
                    '<td align="right">' + emp.basic.formatMoney(2, '.', ',') + '</td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + emp.house_rent.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.medical.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.conveyance.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.food.formatMoney(2, '.', ',') + '</td>' :
                    '<td align="right">' + emp.house_rent.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.medical.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.conveyance.formatMoney(2, '.', ',') + '</td>';
                htmlData += '<td align="right">' + emp.salary.formatMoney(2, '.', ',') + '</td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + emp.absentDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.lunchOutDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.advanceDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.stampDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.othersDeduct.formatMoney(2, '.', ',') + '</td>' :
                    '<td align="right">' + emp.absentDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.advanceDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.medicalDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.stampDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.lunchOutDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.othersDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.aitDeduct.formatMoney(2, '.', ',') + '</td>';
                htmlData += '<td align="right">' + emp.totalDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.attendanceBonus.formatMoney(2, '.', ',') + '</td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + emp.overTime + '</td>' +
                    '<td align="right">' + emp.overTimeRate.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.overTimeAmount.formatMoney(2, '.', ',') + '</td>' :
                    '';
                htmlData += '<td align="right"><big><b>' + emp.netPayable.formatMoney(2, '.', ',') + '</b></big></td>' +
                    '<td align="center">' + payment_method + '</td>' +
                    '<td></td>' +
                    '</tr>';
                r++;
                cb_emp();
            }, function(err) {
                var tOTAmount = Math.round(tOverTimeAmount);
                htmlData += '<tr>' +
                    '<td colspan="10"><b>TOTAL</b></td>' +
                    '<td align="right"><b>' + basic.formatMoney(2, '.', ',') + '</b></td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + house_rent.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + medical.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + conveyance.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + food.formatMoney(2, '.', ',') + '</td>' :
                    '<td align="right">' + house_rent.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + medical.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + conveyance.formatMoney(2, '.', ',') + '</td>';
                htmlData += '<td align="right">' + salary.formatMoney(2, '.', ',') + '</td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + absentDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + lunchOutDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + advanceDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + stampDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + othersDeduct.formatMoney(2, '.', ',') + '</td>' :
                    '<td align="right">' + absentDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + advanceDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + medicalDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + stampDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + lunchOutDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + othersDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + aitDeduct.formatMoney(2, '.', ',') + '</td>';
                htmlData += '<td align="right"><b>' + totalDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"><b>' + attendanceBonus.formatMoney(2, '.', ',') + '</b></td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right"><b>' + overTime + '</b></td>' +
                    '<td align="right"><b></b></td>' +
                    '<td align="right"><b>' + tOTAmount.formatMoney(2, '.', ',') + '</b></td>' :
                    '';
                htmlData += '<td align="right"><b>' + tNetPayable.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td colspan="2"></td>' +
                    '</tr>' +
                    '</table></div>';
                var m = 150;
                var h = 8.5 * m;
                var w = 14 * m;
                htmlData += '</body></html>';
                var options = {
                    format: 'Legal',
                    //width: '7120px', 
                    //height: '4320px',
                    header: {
                        height: "20mm",
                        contents: salaryStatementHeader(d)
                    },
                    footer: {
                        height: "20mm",
                        contents: footerSContents()
                    },
                    width: w + 'px',
                    height: h + 'px'
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadSalaryStatementReportB", 'success');
                });
            });
        });
    });

    socket.on('DownloadDisappointedSalaryStatementReport', function(QUERY) {
        var d = new Date(QUERY.date);
        var r = 1;
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            salaryStatementReportHead() +
            '<div id="pageBody">' +
            // '<b style="line-height:2"><big>SECTION: '+
            //   QUERY.sectionName+
            // '</big></b>'+
            '<table style="width:100%;">' +
            '<tr>' +
            '<th rowspan="2">#</th>' +
            '<th rowspan="2">FP ID</th>' +
            '<th rowspan="2">EMPLOYEE NAME</th>' +
            '<th rowspan="2">SECTION</th>' +
            '<th rowspan="2">DESIGNATION</th>' +
            '<th rowspan="2" style="white-space:nowrap;">.JOIN DATE.</th>' +
            '<th rowspan="2"><small><small>CARD</small></small></th>' +
            '<th rowspan="2"><small><small>GR.</small></small></th>' +
            '<th rowspan="2"><small>T.D.</small></th>' +
            '<th rowspan="2"><small>P.D.</small></th>' +
            '<th rowspan="2"><small>A.D.</small></th>' +
            '<th rowspan="2">BASIC</th>';
        htmlData += (QUERY.employee_type == 2) ?
            '<th colspan="4">ALLOWANCES</th>' :
            '<th colspan="3">ALLOWANCES</th>';
        htmlData += '<th rowspan="2">GROSS<br />SALARY</th>';
        htmlData += (QUERY.employee_type == 2) ?
            '<th colspan="5">DEDUCTIONS</th>' :
            '<th colspan="7">DEDUCTIONS</th>';
        htmlData += '<th rowspan="2">TOTAL<br />DEDUCT.</th>' +
            '<th rowspan="2">ATT.<br />BONUS</th>';
        htmlData += (QUERY.employee_type == 2) ? '<th colspan="3">OVERTIME</th>' : '';
        htmlData += '<th rowspan="2">NET<br />PAYABLE</th>' +
            '<th rowspan="2">PAY.<br />MODE</th>' +
            '<th rowspan="2"><big>..SIGNATURE..</big></th>' +
            '</tr>' +
            '<tr>';
        htmlData += (QUERY.employee_type == 2) ?
            '<th><small>House Rent</small></th>' +
            '<th><small>Medical</small></th>' +
            '<th><small>Conveyance</small></th>' +
            '<th><small>Food</small></th>' +
            '<th><small>Absent</small></th>' +
            '<th><small>Lunch<br />Out</small></th>' +
            '<th><small>Advance</small></th>' +
            '<th><small>Stamp</small></th>' +
            '<th><small>Others</small></th>' :
            '<th><small>House Rent</small></th>' +
            '<th><small>Medical</small></th>' +
            '<th><small>Conveyance</small></th>' +
            '<th><small>Absent</small></th>' +
            '<th><small>Advance</small></th>' +
            '<th><small>Medical</small></th>' +
            '<th><small>Stamp</small></th>' +
            '<th><small>Lunch<br />Out</small></th>' +
            '<th><small>Others</small></th>' +
            '<th><small>AIT</small></th>';
        htmlData += (QUERY.employee_type == 2) ?
            '<th><small>Hour</small></th><th><small>Rate</small></th><th><small>Taka</small></th>' :
            '';
        htmlData += '</tr>';
        var basic = 0,
            house_rent = 0,
            medical = 0,
            conveyance = 0,
            food = 0,
            salary = 0,
            absentDeduct = 0,
            advanceDeduct = 0,
            medicalDeduct = 0,
            stampDeduct = 0,
            aitDeduct = 0,
            lunchOutDeduct = 0,
            othersDeduct = 0,
            totalDeduct = 0,
            attendanceBonus = 0,
            overTime = 0,
            tOverTimeAmount = 0,
            tNetPayable = 0;
        getDisappointedEmployeeMonthSummaryB(db, QUERY, function(empData) {
            async.each(empData, function(emp, cb_emp) {
                if (emp.netPayable > 0) {
                    var payment_method = (emp.payment_method == 1) ? 'CASH' : 'BANK';
                    basic += emp.basic;
                    house_rent += emp.house_rent;
                    medical += emp.medical;
                    conveyance += emp.conveyance;
                    food += emp.food;
                    salary += emp.salary;
                    absentDeduct += emp.absentDeduct;
                    advanceDeduct += emp.advanceDeduct;
                    medicalDeduct += emp.medicalDeduct;
                    stampDeduct += emp.stampDeduct;
                    aitDeduct += emp.aitDeduct;
                    lunchOutDeduct += emp.lunchOutDeduct;
                    othersDeduct += emp.othersDeduct;
                    totalDeduct += emp.totalDeduct;
                    attendanceBonus += emp.attendanceBonus;
                    overTime += emp.overTime;
                    tOverTimeAmount += emp.overTimeAmount;
                    tNetPayable += emp.netPayable;
                    htmlData += '<tr>' +
                        '<td height="60" align="center">' + r + '</td>' +
                        '<td>' + emp.fp + '</td>';
                    htmlData += (QUERY.employee_type == 2) ?
                        '<td>' + emp.name + '<br /><br />' + emp.name_bangla + '</td>' :
                        '<td>' + emp.name + '</td>';
                    htmlData += '<td>' + emp.section + '</td>' +
                        '<td>' + emp.designation + '</td>' +
                        '<td>' + emp.date_of_join + '</td>' +
                        '<td align="center">' + emp.card_no + '</td>' +
                        '<td align="center">' + emp.grade + '</td>' +
                        '<td align="right">' + emp.totalDays + '</td>' +
                        '<td align="right">' + emp.totalPayableDays + '</td>' +
                        '<td align="right">' + emp.totalDeductDays + '</td>' +
                        '<td align="right">' + emp.basic.formatMoney(2, '.', ',') + '</td>';
                    htmlData += (QUERY.employee_type == 2) ?
                        '<td align="right">' + emp.house_rent.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.medical.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.conveyance.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.food.formatMoney(2, '.', ',') + '</td>' :
                        '<td align="right">' + emp.house_rent.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.medical.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.conveyance.formatMoney(2, '.', ',') + '</td>';
                    htmlData += '<td align="right">' + emp.salary.formatMoney(2, '.', ',') + '</td>';
                    htmlData += (QUERY.employee_type == 2) ?
                        '<td align="right">' + emp.absentDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.lunchOutDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.advanceDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.stampDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.othersDeduct.formatMoney(2, '.', ',') + '</td>' :
                        '<td align="right">' + emp.absentDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.advanceDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.medicalDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.stampDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.lunchOutDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.othersDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.aitDeduct.formatMoney(2, '.', ',') + '</td>';
                    htmlData += '<td align="right">' + emp.totalDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.attendanceBonus.formatMoney(2, '.', ',') + '</td>';
                    htmlData += (QUERY.employee_type == 2) ?
                        '<td align="right">' + emp.overTime + '</td>' +
                        '<td align="right">' + emp.overTimeRate.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.overTimeAmount.formatMoney(2, '.', ',') + '</td>' :
                        '';
                    htmlData += '<td align="right"><big><b>' + emp.netPayable.formatMoney(2, '.', ',') + '</b></big></td>' +
                        '<td align="center">' + payment_method + '</td>' +
                        '<td></td>' +
                        '</tr>';
                    r++;
                }
                cb_emp();
            }, function(err) {
                var tOTAmount = Math.round(tOverTimeAmount);
                htmlData += '<tr>' +
                    '<td colspan="11"><b>TOTAL</b></td>' +
                    '<td align="right"><b>' + basic.formatMoney(2, '.', ',') + '</b></td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + house_rent.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + medical.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + conveyance.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + food.formatMoney(2, '.', ',') + '</td>' :
                    '<td align="right">' + house_rent.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + medical.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + conveyance.formatMoney(2, '.', ',') + '</td>';
                htmlData += '<td align="right">' + salary.formatMoney(2, '.', ',') + '</td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + absentDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + lunchOutDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + advanceDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + stampDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + othersDeduct.formatMoney(2, '.', ',') + '</td>' :
                    '<td align="right">' + absentDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + advanceDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + medicalDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + stampDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + lunchOutDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + othersDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + aitDeduct.formatMoney(2, '.', ',') + '</td>';
                htmlData += '<td align="right"><b>' + totalDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"><b>' + attendanceBonus.formatMoney(2, '.', ',') + '</b></td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right"><b>' + overTime + '</b></td>' +
                    '<td align="right"><b></b></td>' +
                    '<td align="right"><b>' + tOTAmount.formatMoney(2, '.', ',') + '</b></td>' :
                    '';
                htmlData += '<td align="right"><b>' + tNetPayable.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td colspan="2"></td>' +
                    '</tr>' +
                    '</table></div>';
                var m = 150;
                var h = 8.5 * m;
                var w = 14 * m;
                htmlData += '</body></html>';
                var options = {
                    format: 'Legal',
                    //width: '7120px', 
                    //height: '4320px',
                    header: {
                        height: "20mm",
                        contents: salaryStatementHeader(d)
                    },
                    footer: {
                        height: "20mm",
                        contents: footerSContents()
                    },
                    width: w + 'px',
                    height: h + 'px'
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadDisappointedSalaryStatementReport", 'success');
                });
            });
        });
    });

    socket.on('DownloadComplianceROBanglaSalaryStatementReport', function(QUERY) {
        var d = new Date(QUERY.date);
        var r = 1;
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            salaryStatementReportHead() +
            '<div id="pageBody">' +
            '<b style="line-height:2"><big>সেকশন: ' +
            QUERY.sectionBanglaName +
            '</big></b>' +
            '<table style="width:100%;">' +
            '<tr>' +
            '<th rowspan="2">আইডি</th>' +
            '<th rowspan="2">নাম</th>' +
            '<th rowspan="2">পদবী</th>' +
            '<th rowspan="2"><small><small>কার্ড<br />নং</small></small></th>' +
            '<th rowspan="2" style="white-space:nowrap;">যোগদানের<br />তাং</th>' +
            '<th rowspan="2"><small><small>গ্রেড</small></small></th>' +
            '<th rowspan="2"><small>মোট<br />দিবস</small></th>' +
            '<th rowspan="2"><small>কর্ম<br />দিবস</small></th>' +
            '<th rowspan="2"><small>সাপ্তাহিক/<br />সরকারী<br />ছুটি</small></th>' +
            '<th rowspan="2"><small>মঞ্জুর<br />কৃত<br />ছুটি</small></th>' +
            '<th rowspan="2"><small>মোট<br />উপস্থিত<br />দিবস</small></th>' +
            '<th rowspan="2"><small>অনুপস্থিত<br />দিবস</small></th>' +
            '<th rowspan="2">মোট<br />মজুরী</th>';
        htmlData += (QUERY.employee_type == 2) ?
            '<th colspan="5">উপার্জন সমূহ</th>' :
            '<th colspan="4">উপার্জন সমূহ</th>';
        htmlData += (QUERY.employee_type == 2) ?
            '<th colspan="2">কর্তন<br />সমূহ</th>' :
            '<th colspan="2">কর্তন<br />সমূহ</th>';
        htmlData += '<th rowspan="2">মোট<br />কর্তন</th>' +
            '<th rowspan="2">নীট<br />মজুরী</th>' +
            '<th rowspan="2">হাজিরা<br />ভাতা</th>';
        htmlData += (QUERY.employee_type == 2) ? '<th colspan="3">অতিরিক্ত কাজ</th>' : '';
        htmlData += '<th rowspan="2">নীট প্রদেও<br />মজুরী</th>' +
            '<th width="40" rowspan="2"><big>স্ট্যাম্প ও সাক্ষর</big></th>' +
            '</tr>' +
            '<tr>';
        htmlData += '<th><small>মূল<br />মজুরী</small></th>';
        htmlData += (QUERY.employee_type == 2) ?
            '<th><small>বাড়ি ভাড়া<br />ভাতা</small></th>' +
            '<th><small>চিকিৎসা<br />ভাতা</small></th>' +
            '<th><small>যাতায়াত<br />ভাতা</small></th>' +
            '<th><small>খাদ্য<br />ভাতা</small></th>' +
            '<th><small>অনুপস্থিতির<br />জন্য</small></th>' +
            // '<th><small>লাঞ্চ<br />আউট</small></th>'+
            // '<th><small>অগ্রিম</small></th>'+
            '<th><small>স্ট্যাম্প</small></th>' :
            // '<th><small>অন্যান্য</small></th>':
            '<th><small>বাড়ি ভাড়া<br />ভাতা</small></th>' +
            '<th><small>চিকিৎসা<br />ভাতা</small></th>' +
            '<th><small>যাতায়াত<br />ভাতা</small></th>' +
            '<th><small>অনুপস্থিতির<br />জন্য</small></th>' +
            // '<th><small>অগ্রিম</small></th>'+
            // '<th><small>চিকিৎসা<br />ভাতা</small></th>'+
            '<th><small>স্ট্যাম্প</small></th>';
        // '<th><small>লাঞ্চ<br />আউট</small></th>'+
        // '<th><small>অন্যান্য</small></th>'+
        // '<th><small>এ.আই.টি</small></th>';
        htmlData += (QUERY.employee_type == 2) ?
            '<th><small>ঘণ্টা</small></th><th><small>হার</small></th><th><small>টাকা</small></th>' :
            '';
        htmlData += '</tr>';
        var basic = 0,
            house_rent = 0,
            medical = 0,
            conveyance = 0,
            food = 0,
            salary = 0,
            absentDeduct = 0,
            advanceDeduct = 0,
            medicalDeduct = 0,
            stampDeduct = 0,
            aitDeduct = 0,
            lunchOutDeduct = 0,
            othersDeduct = 0,
            totalDeduct = 0,
            attendanceBonus = 0,
            overTime = 0,
            tOverTimeAmount = 0,
            netSalary = 0,
            tNetPayable = 0;
        getComplianceEmployeeMonthSummary(db, QUERY, function(empData) {
            async.each(empData, function(emp, cb_emp) {
                var payment_method = (emp.payment_method == 1) ? 'CASH' : 'BANK';
                basic += emp.basic;
                house_rent += emp.house_rent;
                medical += emp.medical;
                conveyance += emp.conveyance;
                food += emp.food;
                salary += emp.salary;
                absentDeduct += emp.absentDeduct;
                advanceDeduct += emp.advanceDeduct;
                medicalDeduct += emp.medicalDeduct;
                stampDeduct += emp.stampDeduct;
                aitDeduct += emp.aitDeduct;
                lunchOutDeduct += emp.lunchOutDeduct;
                othersDeduct += emp.othersDeduct;
                totalDeduct += emp.totalDeduct;
                attendanceBonus += emp.attendanceBonus;
                overTime += emp.overTime;
                tOverTimeAmount += emp.overTimeAmount;
                netSalary += emp.netSalary;
                tNetPayable += emp.netPayable;
                htmlData += '<tr>' +
                    '<td height="60" style="word-spacing:0px;">' + numEngToBan(emp.fp) + '</td>' +
                    '<td>' + emp.name_bangla + '</td>' +
                    '<td>' + emp.designationBanglaName + '</td>' +
                    '<td align="center">' + numEngToBan(emp.card_no) + '</td>' +
                    '<td>' + new Date(emp.date_of_join).formatBanglaDate() + '</td>' +
                    '<td align="center">' + numEngToBan(emp.grade) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.totalDays) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.totalDays - (emp.weekend + emp.holiday)) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.weekend + emp.holiday) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.leave) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.totalPayableDays) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.totalDeductDays) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.salary.formatMoney(2, '.', ',')) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.basic.formatMoney(2, '.', ',')) + '</td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + numEngToBan(emp.house_rent.formatMoney(2, '.', ',')) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.medical.formatMoney(2, '.', ',')) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.conveyance.formatMoney(2, '.', ',')) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.food.formatMoney(2, '.', ',')) + '</td>' :
                    '<td align="right">' + numEngToBan(emp.house_rent.formatMoney(2, '.', ',')) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.medical.formatMoney(2, '.', ',')) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.conveyance.formatMoney(2, '.', ',')) + '</td>';
                // htmlData+='<td align="right">'+numEngToBan(emp.salary.formatMoney(2, '.', ','))+'</td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + numEngToBan(emp.absentDeduct.formatMoney(2, '.', ',')) + '</td>' +
                    // '<td align="right">'+numEngToBan(emp.lunchOutDeduct.formatMoney(2, '.', ','))+'</td>'+
                    // '<td align="right">'+numEngToBan(emp.advanceDeduct.formatMoney(2, '.', ','))+'</td>'+
                    '<td align="right">' + numEngToBan(emp.stampDeduct.formatMoney(2, '.', ',')) + '</td>' :
                    // '<td align="right">'+numEngToBan(emp.othersDeduct.formatMoney(2, '.', ','))+'</td>':
                    '<td align="right">' + numEngToBan(emp.absentDeduct.formatMoney(2, '.', ',')) + '</td>' +
                    // '<td align="right">'+numEngToBan(emp.advanceDeduct.formatMoney(2, '.', ','))+'</td>'+
                    // '<td align="right">'+numEngToBan(emp.medicalDeduct.formatMoney(2, '.', ','))+'</td>'+
                    '<td align="right">' + numEngToBan(emp.stampDeduct.formatMoney(2, '.', ',')) + '</td>';
                // '<td align="right">'+numEngToBan(emp.lunchOutDeduct.formatMoney(2, '.', ','))+'</td>'+
                // '<td align="right">'+numEngToBan(emp.othersDeduct.formatMoney(2, '.', ','))+'</td>'+
                // '<td align="right">'+numEngToBan(emp.aitDeduct.formatMoney(2, '.', ','))+'</td>';
                htmlData += '<td align="right">' + numEngToBan(emp.totalDeduct.formatMoney(2, '.', ',')) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.netSalary.formatMoney(2, '.', ',')) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.attendanceBonus.formatMoney(2, '.', ',')) + '</td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + numEngToBan(emp.overTime) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.overTimeRate.formatMoney(2, '.', ',')) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.overTimeAmount.formatMoney(2, '.', ',')) + '</td>' :
                    '';
                htmlData += '<td align="right"><big><b>' + numEngToBan(emp.netPayable.formatMoney(2, '.', ',')) + '</b></big></td>' +
                    '<td></td>' +
                    '</tr>';
                r++;
                cb_emp();
            }, function(err) {
                var tOTAmount = Math.round(tOverTimeAmount);
                htmlData += '<tr>' +
                    '<td colspan="12"><b>মোট</b></td>' +
                    '<td align="right">' + numEngToBan(salary.formatMoney(2, '.', ',')) + '</td>' +
                    '<td align="right"><b>' + numEngToBan(basic.formatMoney(2, '.', ',')) + '</b></td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + numEngToBan(house_rent.formatMoney(2, '.', ',')) + '</td>' +
                    '<td align="right">' + numEngToBan(medical.formatMoney(2, '.', ',')) + '</td>' +
                    '<td align="right">' + numEngToBan(conveyance.formatMoney(2, '.', ',')) + '</td>' +
                    '<td align="right">' + numEngToBan(food.formatMoney(2, '.', ',')) + '</td>' :
                    '<td align="right">' + numEngToBan(house_rent.formatMoney(2, '.', ',')) + '</td>' +
                    '<td align="right">' + numEngToBan(medical.formatMoney(2, '.', ',')) + '</td>' +
                    '<td align="right">' + numEngToBan(conveyance.formatMoney(2, '.', ',')) + '</td>';
                // htmlData+='<td align="right">'+salary.formatMoney(2, '.', ',')+'</td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + numEngToBan(absentDeduct.formatMoney(2, '.', ',')) + '</td>' +
                    // '<td align="right">'+lunchOutDeduct.formatMoney(2, '.', ',')+'</td>'+
                    // '<td align="right">'+advanceDeduct.formatMoney(2, '.', ',')+'</td>'+
                    '<td align="right">' + numEngToBan(stampDeduct.formatMoney(2, '.', ',')) + '</td>' :
                    // '<td align="right">'+othersDeduct.formatMoney(2, '.', ',')+'</td>':
                    '<td align="right">' + numEngToBan(absentDeduct.formatMoney(2, '.', ',')) + '</td>' +
                    // '<td align="right">'+advanceDeduct.formatMoney(2, '.', ',')+'</td>'+
                    // '<td align="right">'+medicalDeduct.formatMoney(2, '.', ',')+'</td>'+
                    '<td align="right">' + numEngToBan(stampDeduct.formatMoney(2, '.', ',')) + '</td>';
                // '<td align="right">'+lunchOutDeduct.formatMoney(2, '.', ',')+'</td>'+
                // '<td align="right">'+othersDeduct.formatMoney(2, '.', ',')+'</td>'+
                // '<td align="right">'+aitDeduct.formatMoney(2, '.', ',')+'</td>';
                htmlData += '<td align="right"><b>' + numEngToBan(totalDeduct.formatMoney(2, '.', ',')) + '</b></td>' +
                    '<td align="right"><b>' + numEngToBan(netSalary.formatMoney(2, '.', ',')) + '</b></td>' +
                    '<td align="right"><b>' + numEngToBan(attendanceBonus.formatMoney(2, '.', ',')) + '</b></td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right"><b>' + numEngToBan(overTime) + '</b></td>' +
                    '<td align="right"><b></b></td>' +
                    '<td align="right"><b>' + numEngToBan(tOTAmount.formatMoney(2, '.', ',')) + '</b></td>' :
                    '';
                htmlData += '<td align="right"><b>' + numEngToBan(tNetPayable.formatMoney(2, '.', ',')) + '</b></td>' +
                    '<td></td>' +
                    '</tr>' +
                    '</table></div>';
                var m = 150;
                var h = 8.5 * m;
                var w = 14 * m;
                htmlData += '</body></html>';
                var options = {
                    format: 'Legal',
                    //width: '7120px', 
                    //height: '4320px',
                    header: {
                        height: "20mm",
                        contents: salaryStatementBanglaHeader(d)
                    },
                    footer: {
                        height: "20mm",
                        contents: footerSContents()
                    },
                    width: w + 'px',
                    height: h + 'px'
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadComplianceROBanglaSalaryStatementReport", 'success');
                });
            });
        });
    });



    socket.on('DestroySalary', function(data) {
        DestroySalary(db, data, function(data) {
            socket.emit("DestroySalary", data)
        });
    });

    socket.on('DestroySalaryDeduction', function(data) {
        DestroySalaryDeduction(db, data, function(data) {
            socket.emit("DestroySalaryDeduction", data)
        });
    });

    socket.on('UpdateSalaryApproveDate', function(data) {
        UpdateSalaryApproveDate(db, data, function(data) {
            socket.emit("UpdateSalaryApproveDate", data)
        });
    });

    socket.on('UpdateSalaryAmount', function(data) {
        UpdateSalaryAmount(db, data, function(data) {
            socket.emit("UpdateSalaryAmount", data)
        });
    });

    socket.on('CreateSalary', function(data) {
        CreateSalary(db, data, function(data) {
            socket.emit("CreateSalary", data)
        });
    });

    socket.on('CreateSalaryDeduction', function(data) {
        CreateSalaryDeduction(db, data, function(data) {
            socket.emit("CreateSalaryDeduction", data)
        });
    });

    socket.on('CreateUpdateSalaryPayment', function(QUERY) {
        var InputData = [];
        var SEARCH = {};
        SEARCH.section = QUERY.section;
        SEARCH.status = QUERY.status;
        SEARCH.date = QUERY.date;
        getEmployeeMonthSummaryV2(db, SEARCH, function(monthData) {
            async.each(monthData, function(md, cb_md) {
                var o = {};
                o.employee = md.id;
                o.year = QUERY.year;
                o.month = QUERY.month;
                o.payment_type = QUERY.payment_type;
                o.salary_amount = md.salary;
                o.deduct_amount = md.totalDeduct;
                o.paid_amount = md.netPayable;
                o.payment_status = 1;
                o.user = QUERY.user.id;
                InputData.push(o);
                cb_md();
            }, function(err) {
                CreateUpdateSalaryPayment(db, InputData, function(data) {
                    socket.emit("CreateUpdateSalaryPayment" + QUERY.section, data)
                });
            });
        });
    });

    socket.on('CreateUpdateSalaryPaymentB', function(QUERY) {
        var InputData = [];
        var SEARCH = {};
        SEARCH.section = QUERY.section;
        SEARCH.status = QUERY.status;
        SEARCH.date = QUERY.date;
        getEmployeeMonthSummaryB(db, SEARCH, function(monthData) {
            async.each(monthData, function(md, cb_md) {
                var o = {};
                o.employee = md.id;
                o.year = QUERY.year;
                o.month = QUERY.month;
                o.payment_type = QUERY.payment_type;
                o.salary_amount = md.salary;
                o.deduct_amount = md.totalDeduct;
                o.paid_amount = md.netPayable;
                o.payment_status = 1;
                o.user = QUERY.user.id;
                InputData.push(o);
                cb_md();
            }, function(err) {
                CreateUpdateSalaryPayment(db, InputData, function(data) {
                    socket.emit("CreateUpdateSalaryPaymentB" + QUERY.section, data)
                });
            });
        });
    });

    socket.on('CreateSalaryStatementReport', function(site_url, values) {
        var ms = new Date(values.date);
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            salaryStatementReportHead();
        search_salary_statement_report(db, values, function(ssList) {
            async.each(ssList, function(depList, cb_dep) {
                htmlData += '<div id="pageBody">' +
                    '<b style="line-height:2">' +
                    depList.name +
                    ':- </b>' +
                    '<table style="width:100%;">' +
                    '<tr>' +
                    '<th rowspan="2">#</th>' +
                    '<th rowspan="2">EMPLOYEE NAME</th>' +
                    '<th rowspan="2">DESIGNATION</th>' +
                    '<th rowspan="2">JOINING<br />DATE</th>' +
                    '<th rowspan="2"><small>T.D.</small></th>' +
                    '<th rowspan="2"><small>P.D.</small></th>' +
                    '<th rowspan="2"><small>A.D.</small></th>' +
                    '<th rowspan="2">BASIC</th>' +
                    '<th colspan="3">ALLOWANCES</th>' +
                    '<th rowspan="2">GROSS<br />SALARY</th>' +
                    '<th colspan="7">DEDUCTIONS</th>' +
                    '<th rowspan="2">TOTAL<br />DEDUCT.</th>' +
                    '<th rowspan="2">ATT.<br />BONUS</th>' +
                    '<th rowspan="2">NET<br />PAYABLE</th>' +
                    '<th rowspan="2">PAY.<br />MODE</th>' +
                    '<th rowspan="2">SIGNATURE</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th><small>House Rent</small></th>' +
                    '<th><small>Medical</small></th>' +
                    '<th><small>Conveyance</small></th>' +
                    '<th><small>Absent</small></th>' +
                    '<th><small>Advance</small></th>' +
                    '<th><small>Medical</small></th>' +
                    '<th><small>Stamp</small></th>' +
                    '<th><small>Lunch Out</small></th>' +
                    '<th><small>Others</small></th>' +
                    '<th><small>AIT</small></th>' +
                    '</tr>';
                var basic = 0,
                    house_rent = 0,
                    medical = 0,
                    conveyance = 0,
                    gSalary = 0,
                    abcDeduct = 0,
                    advDeduct = 0,
                    mediDeduct = 0,
                    stmpDeduct = 0,
                    loDeduct = 0,
                    othDeduct = 0,
                    aitDeduct = 0,
                    ttlDeduct = 0,
                    attBonus = 0,
                    netPayable = 0;
                var i = 0;
                async.each(depList.employee, function(emp, cb_emp) {
                    i++;
                    var dj = new Date(emp.date_of_join);
                    var payment_method = (emp.payment_method == 1) ? 'CASH' : 'BANK';
                    basic += emp.basic;
                    house_rent += emp.house_rent;
                    medical += emp.medical;
                    conveyance += emp.conveyance;
                    gSalary += emp.gSalary;
                    abcDeduct += emp.abcDeduct;
                    advDeduct += emp.advDeduct;
                    mediDeduct += emp.mediDeduct;
                    stmpDeduct += emp.stmpDeduct;
                    loDeduct += emp.loDeduct;
                    othDeduct += emp.othDeduct;
                    aitDeduct += emp.aitDeduct;
                    ttlDeduct += emp.ttlDeduct;
                    attBonus += emp.attBonus;
                    var empNetPayable = Math.round(emp.netPayable);
                    netPayable += empNetPayable;
                    htmlData += '<tr>' +
                        '<td height="60" align="center">' + i + '</td>' +
                        '<td>' + emp.name + '</td>' +
                        '<td>' + emp.designation + '</td>' +
                        '<td>' + dateFormatDMY(dj) + '</td>' +
                        '<td align="right">' + emp.tDays + '</td>' +
                        '<td align="right">' + emp.pDays + '</td>' +
                        '<td align="right">' + emp.aDays + '</td>' +
                        '<td align="right">' + emp.basic.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.house_rent.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.medical.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.conveyance.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.gSalary.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.abcDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.advDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.mediDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.stmpDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.loDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.othDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.aitDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.ttlDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.attBonus.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + empNetPayable.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="center">' + payment_method + '</td>' +
                        '<td></td>' +
                        '</tr>';
                    cb_emp();
                }, function(err) {
                    htmlData += '<tr>' +
                        '<td colspan="8"><b>TOTAL</b></td>' +
                        '<td align="right"><b>' + basic.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + house_rent.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + medical.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + conveyance.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + gSalary.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + abcDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + advDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + mediDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + stmpDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + loDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + othDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + aitDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + ttlDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + attBonus.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + netPayable.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td colspan="2"></td>' +
                        '</tr>' +
                        '</table></div>';
                    cb_dep();
                });
            }, function(err) {
                htmlData += '</body></html>';
                var pt = new Date();
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    //width: '7120px', 
                    //height: '4320px',
                    header: {
                        height: "20mm",
                        contents: salaryStatementHeader(ms)
                    },
                    footer: {
                        height: "25mm",
                        contents: footerSContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + values.file_name + '.pdf', function(err, res) {
                    socket.emit("CreateSalaryStatementReport", 'success');
                });
            });
        })
    });

    socket.on('CreateWorkerSalaryStatementReport', function(site_url, values) {
        var ms = new Date(values.date);
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            salaryStatementReportHead();
        search_worker_salary_statement_report(db, values, function(ssList) {
            async.each(ssList, function(depList, cb_dep) {
                htmlData += '<div id="pageBody">' +
                    '<b style="line-height:2"><big>SECTION: ' +
                    depList.name.toUpperCase() +
                    '</big></b>' +
                    '<table style="width:100%;">' +
                    '<tr>' +
                    '<th rowspan="2">#</th>' +
                    '<th rowspan="2">FP ID</th>' +
                    '<th rowspan="2">EMPLOYEE NAME</th>' +
                    '<th rowspan="2">DESIGNATION</th>' +
                    '<th rowspan="2" style="white-space:nowrap;">.JOIN DATE.</th>' +
                    '<th rowspan="2"><small><small>CARD</small></small></th>' +
                    '<th rowspan="2"><small><small>GR.</small></small></th>' +
                    '<th rowspan="2"><small>T.D.</small></th>' +
                    '<th rowspan="2"><small>P.D.</small></th>' +
                    '<th rowspan="2"><small>A.D.</small></th>' +
                    '<th rowspan="2">BASIC</th>' +
                    '<th colspan="4">ALLOWANCES</th>' +
                    '<th rowspan="2">GROSS<br />SALARY</th>' +
                    '<th colspan="4">DEDUCTIONS</th>' +
                    '<th rowspan="2">TOTAL<br />DEDUCT.</th>' +
                    '<th rowspan="2">ATT.<br />BONUS</th>' +
                    //'<th colspan="3">OVERTIME</th>'+
                    '<th rowspan="2">NET<br />PAYABLE</th>' +
                    '<th rowspan="2">PAY.<br />MODE</th>' +
                    '<th rowspan="2"><big>..SIGNATURE..</big></th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th><small>House Rent</small></th>' +
                    '<th><small>Medical</small></th>' +
                    '<th><small>Conveyance</small></th>' +
                    '<th><small>Food</small></th>' +
                    '<th><small>Absent</small></th>' +
                    '<th><small>Lunch<br />Out</small></th>' +
                    '<th><small>Advance</small></th>' +
                    '<th><small>Stamp</small></th>' +
                    //'<th><small>Hour</small></th>'+
                    //'<th><small>Rate</small></th>'+
                    //'<th><small>Taka</small></th>'+
                    '</tr>';
                var basic = 0,
                    house_rent = 0,
                    medical = 0,
                    conveyance = 0,
                    gSalary = 0,
                    abcDeduct = 0,
                    advDeduct = 0,
                    stmpDeduct = 0,
                    othDeduct = 0,
                    ttlDeduct = 0,
                    attBonus = 0,
                    overTimeHour = 0,
                    tOverTimeAmount = 0,
                    netPayable = 0;
                var i = 0;
                async.each(depList.employee, function(emp, cb_emp) {
                    var overTimeRate = emp.basic / 208 * 2;
                    var overTimeAmount = emp.overTimeHour * overTimeRate;
                    //var netPayableO = Math.round(overTimeAmount+emp.netPayable);
                    var netPayableO = Math.round(emp.netPayable);
                    var dj = new Date(emp.date_of_join);
                    var payment_method = (emp.payment_method == 1) ? 'CASH' : 'BANK';
                    basic += emp.basic;
                    house_rent += emp.house_rent;
                    medical += emp.medical;
                    conveyance += emp.conveyance;
                    gSalary += emp.gSalary;
                    abcDeduct += emp.abcDeduct;
                    advDeduct += emp.advDeduct;
                    stmpDeduct += emp.stmpDeduct;
                    othDeduct += emp.othDeduct;
                    ttlDeduct += emp.ttlDeduct;
                    attBonus += emp.attBonus;
                    overTimeHour += emp.overTimeHour;
                    tOverTimeAmount += overTimeAmount;
                    netPayable += netPayableO;
                    i++;
                    htmlData += '<tr>' +
                        '<td height="60" align="center">' + i + '</td>' +
                        '<td>' + addLeadingZero(9, parseInt(emp.fp)) + '</td>' +
                        '<td>' + emp.name + '</td>' +
                        '<td>' + emp.designation + '</td>' +
                        '<td>' + dateFormatDMY(dj) + '</td>' +
                        '<td align="center">' + emp.card + '</td>' +
                        '<td align="center">' + emp.grade + '</td>' +
                        '<td align="right">' + emp.tDays + '</td>' +
                        '<td align="right">' + emp.pDays + '</td>' +
                        '<td align="right">' + emp.aDays + '</td>' +
                        '<td align="right">' + emp.basic.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.house_rent.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.medical.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.conveyance.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.food.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.gSalary.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.abcDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.othDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.advDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.stmpDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.ttlDeduct.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="right">' + emp.attBonus.formatMoney(2, '.', ',') + '</td>' +
                        // '<td align="right">'+emp.overTimeHour+'</td>'+
                        // '<td align="right">'+overTimeRate.formatMoney(2, '.', ',')+'</td>'+
                        // '<td align="right">'+overTimeAmount.formatMoney(2, '.', ',')+'</td>'+
                        '<td align="right">' + netPayableO.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="center">' + payment_method + '</td>' +
                        '<td></td>' +
                        '</tr>';
                    cb_emp();
                }, function(err) {
                    var tOTAmount = Math.round(tOverTimeAmount);
                    htmlData += '<tr>' +
                        '<td colspan="10"><b>TOTAL</b></td>' +
                        '<td align="right"><b>' + basic.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + house_rent.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + medical.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + conveyance.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + conveyance.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + gSalary.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + abcDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + othDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + advDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + stmpDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + ttlDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + attBonus.formatMoney(2, '.', ',') + '</b></td>' +
                        // '<td align="right"><b>'+overTimeHour+'</b></td>'+
                        // '<td align="right"><b></b></td>'+
                        // '<td align="right"><b>'+tOTAmount.formatMoney(2, '.', ',')+'</b></td>'+
                        '<td align="right"><b>' + netPayable.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td colspan="2"></td>' +
                        '</tr>' +
                        '</table></div>';
                    cb_dep();
                });
            }, function(err) {
                var m = 150;
                var h = 8.5 * m;
                var w = 14 * m;
                htmlData += '</body></html>';
                var pt = new Date();
                var options = {
                    format: 'Legal',
                    //width: '7120px', 
                    //height: '4320px',
                    header: {
                        height: "20mm",
                        contents: salaryStatementHeader(ms)
                    },
                    footer: {
                        height: "20mm",
                        contents: footerSContents()
                    },
                    width: w + 'px',
                    height: h + 'px'
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + values.file_name + '.pdf', function(err, res) {
                    socket.emit("CreateWorkerSalaryStatementReport", 'success');
                });
            });
        })
    });

    socket.on('CreateSalaryBankStatementReport', function(site_url, values) {
        var ms = new Date(values.date);
        var GPayable = 0;
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            bankStatementReportHead() +
            '<div id="pageBody">' +
            //'<big>SECTION: '+values.sectionName+'</big>'+
            '<table style="width:100%">' +
            '<tr>' +
            '<th>#</th>' +
            '<th>EMPLOYEE NAME</th>' +
            '<th colspan="3">ACCOUNT NUMBER</th>' +
            '<th style="width:12%">AMOUNT IN TAKA</th>' +
            '<th>ACCOUNT NUMBER</th>' +
            '</tr>';
        var i = 0;
        salary_statement_report(db, ms, function(ssList) {
            async.each(ssList, function(depList, cb_dep) {
                var gNetPayable = 0;
                async.each(depList.employee, function(emp, cb_emp) {
                    var payment_method = emp.payment_method;
                    if (payment_method == 2) {
                        if (emp.employeeType == values.employeeType) {
                            i++;
                            var dj = new Date(emp.date_of_join);
                            var netPayable = Math.round(emp.netPayable);
                            gNetPayable += netPayable;
                            htmlData += '<tr>' +
                                '<td align="center">' + i + '</td>' +
                                '<td>' + emp.name + '</td>' +
                                '<td align="center">' + emp.branch_code + '</td>' +
                                '<td align="center">' + emp.account_type + '</td>' +
                                '<td align="center">' + emp.account_no + '</td>' +
                                '<td align="right">' + netPayable.formatMoney(2, '.', ',') + '</td>' +
                                '<td align="center">' + emp.account + '</td>' +
                                '</tr>';
                        }
                    }
                    cb_emp();
                }, function(err) {
                    GPayable += gNetPayable;
                    cb_dep();
                });
            }, function(err) {
                htmlData += '<tr>' +
                    '<td colspan="5"><b>TOTAL</b></td>' +
                    '<td align="right"><b>' + GPayable.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"></td>' +
                    '</tr>' +
                    '</table></div>';
                htmlData += '</body></html>';
                var pt = new Date();
                var options = {
                    format: 'A4',
                    orientation: "portrait",
                    //width: '7120px', 
                    //height: '4320px',
                    header: {
                        height: "20mm",
                        contents: salaryStatementHeader(ms)
                    },
                    footer: {
                        height: "30mm",
                        contents: footerContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + values.file_name + '.pdf', function(err, res) {
                    socket.emit("CreateSalaryBankStatementReport", 'success');
                });
            });
        })
    });

    socket.on('DownloadComplianceROSalaryStatementReport', function(QUERY) {
        var d = new Date(QUERY.date);
        var r = 1;
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            salaryStatementReportHead() +
            '<div id="pageBody">' +
            '<b style="line-height:2"><big>SECTION: ' +
            QUERY.sectionName +
            '</big></b>' +
            '<table style="width:100%;">' +
            '<tr>' +
            '<th rowspan="2">#</th>' +
            '<th rowspan="2">FP ID</th>' +
            '<th rowspan="2">EMPLOYEE NAME</th>' +
            '<th rowspan="2">DESIGNATION</th>' +
            '<th rowspan="2" style="white-space:nowrap;">.JOIN DATE.</th>' +
            '<th rowspan="2"><small><small>CARD</small></small></th>' +
            '<th rowspan="2"><small><small>GR.</small></small></th>' +
            '<th rowspan="2"><small>T.D.</small></th>' +
            '<th rowspan="2"><small>P.D.</small></th>' +
            '<th rowspan="2"><small>A.D.</small></th>' +
            '<th rowspan="2">BASIC</th>';
        htmlData += (QUERY.employee_type == 2) ?
            '<th colspan="4">ALLOWANCES</th>' :
            '<th colspan="3">ALLOWANCES</th>';
        htmlData += '<th rowspan="2">GROSS<br />SALARY</th>';
        htmlData += (QUERY.employee_type == 2) ?
            '<th colspan="5">DEDUCTIONS</th>' :
            '<th colspan="7">DEDUCTIONS</th>';
        htmlData += '<th rowspan="2">TOTAL<br />DEDUCT.</th>' +
            '<th rowspan="2">ATT.<br />BONUS</th>';
        htmlData += (QUERY.employee_type == 2) ? '<th colspan="3">OVERTIME</th>' : '';
        htmlData += '<th rowspan="2">NET<br />PAYABLE</th>' +
            '<th rowspan="2">PAY.<br />MODE</th>' +
            '<th rowspan="2"><big>..SIGNATURE..</big></th>' +
            '</tr>' +
            '<tr>';
        htmlData += (QUERY.employee_type == 2) ?
            '<th><small>House Rent</small></th>' +
            '<th><small>Medical</small></th>' +
            '<th><small>Conveyance</small></th>' +
            '<th><small>Food</small></th>' +
            '<th><small>Absent</small></th>' +
            '<th><small>Lunch<br />Out</small></th>' +
            '<th><small>Advance</small></th>' +
            '<th><small>Stamp</small></th>' +
            '<th><small>Others</small></th>' :
            '<th><small>House Rent</small></th>' +
            '<th><small>Medical</small></th>' +
            '<th><small>Conveyance</small></th>' +
            '<th><small>Absent</small></th>' +
            '<th><small>Advance</small></th>' +
            '<th><small>Medical</small></th>' +
            '<th><small>Stamp</small></th>' +
            '<th><small>Lunch<br />Out</small></th>' +
            '<th><small>Others</small></th>' +
            '<th><small>AIT</small></th>';
        htmlData += (QUERY.employee_type == 2) ?
            '<th><small>Hour</small></th><th><small>Rate</small></th><th><small>Taka</small></th>' :
            '';
        htmlData += '</tr>';
        var basic = 0,
            house_rent = 0,
            medical = 0,
            conveyance = 0,
            food = 0,
            salary = 0,
            absentDeduct = 0,
            advanceDeduct = 0,
            medicalDeduct = 0,
            stampDeduct = 0,
            aitDeduct = 0,
            lunchOutDeduct = 0,
            othersDeduct = 0,
            totalDeduct = 0,
            attendanceBonus = 0,
            overTime = 0,
            tOverTimeAmount = 0,
            tNetPayable = 0;
        getComplianceEmployeeMonthSummary(db, QUERY, function(empData) {
            async.each(empData, function(emp, cb_emp) {
                var payment_method = (emp.payment_method == 1) ? 'CASH' : 'BANK';
                basic += emp.basic;
                house_rent += emp.house_rent;
                medical += emp.medical;
                conveyance += emp.conveyance;
                food += emp.food;
                salary += emp.salary;
                absentDeduct += emp.absentDeduct;
                advanceDeduct += emp.advanceDeduct;
                medicalDeduct += emp.medicalDeduct;
                stampDeduct += emp.stampDeduct;
                aitDeduct += emp.aitDeduct;
                lunchOutDeduct += emp.lunchOutDeduct;
                othersDeduct += emp.othersDeduct;
                totalDeduct += emp.totalDeduct;
                attendanceBonus += emp.attendanceBonus;
                overTime += emp.overTime;
                tOverTimeAmount += emp.overTimeAmount;
                tNetPayable += emp.netPayable;
                htmlData += '<tr>' +
                    '<td height="60" align="center">' + r + '</td>' +
                    '<td>' + emp.fp + '</td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td>' + emp.name + '<br /><br />' + emp.name_bangla + '</td>' :
                    '<td>' + emp.name + '</td>';
                htmlData += '<td>' + emp.designation + '</td>' +
                    '<td>' + emp.date_of_join + '</td>' +
                    '<td align="center">' + emp.card_no + '</td>' +
                    '<td align="center">' + emp.grade + '</td>' +
                    '<td align="right">' + emp.totalDays + '</td>' +
                    '<td align="right">' + emp.totalPayableDays + '</td>' +
                    '<td align="right">' + emp.totalDeductDays + '</td>' +
                    '<td align="right">' + emp.basic.formatMoney(2, '.', ',') + '</td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + emp.house_rent.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.medical.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.conveyance.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.food.formatMoney(2, '.', ',') + '</td>' :
                    '<td align="right">' + emp.house_rent.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.medical.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.conveyance.formatMoney(2, '.', ',') + '</td>';
                htmlData += '<td align="right">' + emp.salary.formatMoney(2, '.', ',') + '</td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + emp.absentDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.lunchOutDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.advanceDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.stampDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.othersDeduct.formatMoney(2, '.', ',') + '</td>' :
                    '<td align="right">' + emp.absentDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.advanceDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.medicalDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.stampDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.lunchOutDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.othersDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.aitDeduct.formatMoney(2, '.', ',') + '</td>';
                htmlData += '<td align="right">' + emp.totalDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.attendanceBonus.formatMoney(2, '.', ',') + '</td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + emp.overTime + '</td>' +
                    '<td align="right">' + emp.overTimeRate.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.overTimeAmount.formatMoney(2, '.', ',') + '</td>' :
                    '';
                htmlData += '<td align="right"><big><b>' + emp.netPayable.formatMoney(2, '.', ',') + '</b></big></td>' +
                    '<td align="center">' + payment_method + '</td>' +
                    '<td></td>' +
                    '</tr>';
                r++;
                cb_emp();
            }, function(err) {
                var tOTAmount = Math.round(tOverTimeAmount);
                htmlData += '<tr>' +
                    '<td colspan="10"><b>TOTAL</b></td>' +
                    '<td align="right"><b>' + basic.formatMoney(2, '.', ',') + '</b></td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + house_rent.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + medical.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + conveyance.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + food.formatMoney(2, '.', ',') + '</td>' :
                    '<td align="right">' + house_rent.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + medical.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + conveyance.formatMoney(2, '.', ',') + '</td>';
                htmlData += '<td align="right">' + salary.formatMoney(2, '.', ',') + '</td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right">' + absentDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + lunchOutDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + advanceDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + stampDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + othersDeduct.formatMoney(2, '.', ',') + '</td>' :
                    '<td align="right">' + absentDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + advanceDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + medicalDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + stampDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + lunchOutDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + othersDeduct.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + aitDeduct.formatMoney(2, '.', ',') + '</td>';
                htmlData += '<td align="right"><b>' + totalDeduct.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"><b>' + attendanceBonus.formatMoney(2, '.', ',') + '</b></td>';
                htmlData += (QUERY.employee_type == 2) ?
                    '<td align="right"><b>' + overTime + '</b></td>' +
                    '<td align="right"><b></b></td>' +
                    '<td align="right"><b>' + tOTAmount.formatMoney(2, '.', ',') + '</b></td>' :
                    '';
                htmlData += '<td align="right"><b>' + tNetPayable.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td colspan="2"></td>' +
                    '</tr>' +
                    '</table></div>';
                var m = 150;
                var h = 8.5 * m;
                var w = 14 * m;
                htmlData += '</body></html>';
                var options = {
                    format: 'Legal',
                    //width: '7120px', 
                    //height: '4320px',
                    header: {
                        height: "20mm",
                        contents: salaryStatementHeader(d)
                    },
                    footer: {
                        height: "20mm",
                        contents: footerSContents()
                    },
                    width: w + 'px',
                    height: h + 'px'
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadComplianceROSalaryStatementReport", 'success');
                });
            });
        });
    });




}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;