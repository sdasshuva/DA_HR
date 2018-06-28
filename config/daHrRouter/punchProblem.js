module.exports = function() {};

function overTimeHourCount(wh, wm, oh, om) {
    var a = (parseInt(wh)) ? parseInt(wh) : 0;
    var b = (parseInt(wm)) ? parseInt(wm) : 0;
    var c = (parseInt(oh)) ? parseInt(oh) : 0;
    var d = (parseInt(om)) ? ((parseInt(om) >= 48) ? 60 : parseInt(om)) : 0; //// Here 48 overtime last hour accept.
    return (((c * 60 + d) - (a * 60 + b)) > 0) ? Math.floor(((c * 60 + d) - (a * 60 + b)) / 60) : 0;
}

function totalWorkingMinute(ih, im, oh, om) {
    var a = (parseInt(ih)) ? parseInt(ih) : 0;
    var b = (parseInt(im)) ? parseInt(im) : 0;
    var c = (parseInt(oh)) ? parseInt(oh) : 0;
    var d = (parseInt(om)) ? parseInt(om) : 0;
    var o = a * 60 + b;
    var n = c * 60 + d;
    return ((n - o) > 0) ? n - o : 0;
}

function timeGreater(oh, om, nh, nm) {
    var a = (parseInt(oh)) ? parseInt(oh) : 0;
    var b = (parseInt(om)) ? parseInt(om) : 0;
    var c = (parseInt(nh)) ? parseInt(nh) : 0;
    var d = (parseInt(nm)) ? parseInt(nm) : 0;
    var o = a * 60 + b;
    var n = c * 60 + d;
    return (n <= o) ? true : false;
}

function CreatePunchProblem(db, DATA, callback) {
    db.punch_problem.create({
        employee: DATA.employee,
        date: DATA.date,
        time: DATA.time,
        reason: DATA.reason
    }).complete(function(err, employee) {
        if (err) {
            callback("error");
            //throw err;
        } else {
            callback("success")
        }
    })
}

function validBetweenInteger(a,b,c){
  if(parseInt(a)>=parseInt(b)&&parseInt(a)<=parseInt(c))
    return true;
  return false;
}

function UpdatePunchProblem(db, DATA, callback) {
    if (DATA.type < 4 || DATA.type == 5) {
        async.each(DATA.array, function(pP, cb_pP) {
            db.punch_problem.update({
                permission: DATA.type,
                reason: pP.reason + DATA.reason
            }, {
                id: pP.id
            }).complete(function(err, punch_problem) {
                cb_pP();
            });
        }, function(err) {
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
    } else if (DATA.type == 4) {
        var bulkArray = []
        async.each(DATA.array, function(pP, cb_pP) {
            db.punch_problem.update({
                permission: DATA.type,
                reason: pP.reason + DATA.reason
            }, {
                id: pP.id
            }).complete(function(err, punch_problem) {
                db.punch_problem.findAll({
                    where: {
                        id: pP.id
                    },
                    limit: 1
                }).complete(function(err, pProbList) {
                    async.each(pProbList, function(pProb, cb_pProb) {
                        var date = new Date(pProb.date);
                        var year = date.getFullYear();
                        var month = date.getMonth();
                        var day = date.getDate();
                        var time = pProb.time.split(":");
                        var hours = parseInt(time[0]);
                        var minutes = parseInt(time[1]);
                        var seconds = parseInt(time[2]);
                        var o = {};
                        o.employee = pProb.employee;
                        o.punch_time = Date.UTC(year, month, day, hours, minutes, seconds, 00);
                        o.type = 5;
                        bulkArray.push(o);
                        cb_pProb()
                    }, function(err) {
                        cb_pP();
                    });
                })
            });
        }, function(err) {
            db.attendance.bulkCreate(bulkArray).complete(function(err, attendance) {
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
        });
    } else {
        callback("error");
    }
}

function overTimeCount(tH, tM, oH, oM, mH) {
    tH = parseInt(tH);
    tM = parseInt(tM);
    oH = parseInt(oH);
    oM = parseInt(oM);
    mH = parseInt(mH);
    var rH = 0;
    var rM = 0;
    var tT = (tH * 60) + tM;
    var oT = (oH * 60) + oM;
    if (oH >= tH) {
        rH = (oT - tT) / 60;
        rH = rH.toFixed(2);
        rH = rH.toString();
        var f = rH.split(".");
        var fM = (parseInt(f[1]) * 60) / 100;
        var fH = (fM > mH) ? parseInt(f[0]) + 1 : parseInt(f[0]);
        return fH;
    } else {
        return 0;
    }
}


function getPunchProblemList(db, QUERY, callback) {
    var returnData = {};
    returnData.count = 0;
    var SEARCH = {};
    var SEARCH2 = {};
    var findData = {};
    var findData2 = {};
    findData.where = [];
    findData2.where = [];
    var date = (QUERY.date) ? new Date(QUERY.date) : new Date();
    var SM = date.getMonth() + 1;
    var SY = date.getFullYear();
    if (QUERY.date) {
        findData.where.push(['MONTH(date)=? AND YEAR(date)=?', SM, SY]);
        findData2.where.push(['MONTH(date)=? AND YEAR(date)=?', SM, SY]);
    }
    if (QUERY.id) {
        SEARCH.employee = QUERY.id
        SEARCH2.employee = QUERY.id
    }
    if (QUERY.type) {
        SEARCH.permission = QUERY.type;
        SEARCH2.permission = QUERY.type;
    }
    findData.where.push(SEARCH);
    findData2.where.push(SEARCH2);
    findData.attributes = [
        'id', 'employee', 'date',
        'time', 'reason', 'permission'
    ];
    findData2.attributes = [
        'id'
    ];
    findData.include = [{
        model: db.employee,
        attributes: [
            'id', 'user', 'grade', 'designation', 'department',
            'section', 'employee_type', 'date_of_join',
            'duty_shift', 'work_time', 'payment_method', 'status'
        ],
        include: [{
            model: db.user,
            attributes: [
                'id', 'card_no', 'finger_print_id', 'first_name',
                'last_name', 'name_bangla', 'email', 'access_level'
            ]
        }, {
            model: db.designation,
            attributes: [
                'id', 'name'
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
    }, {
        model: db.permission,
        attributes: [
            'id', 'name'
        ]
    }, ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'employee';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.punch_problem.findAll(findData).complete(function(err, punchProbData) {
        returnData.data = punchProbData
        db.punch_problem.findAll(findData2).complete(function(err, punchProbData1) {
            returnData.count = (punchProbData1) ? punchProbData1.length : 0;
            callback(returnData);
        });
        // async.each(punchProbData, function (punchProb, cb_punchProb) {
        //   var e = {};
        //   e.id = punchProb.id;
        //   e.employee = promt.employee;
        //   e.date = promt.date;
        //   e.time = promt.time;
        //   e.reason = promt.reason;
        //   cb_punchProb();
        // }, function (err) {
        //   if (err) { throw err; }
        //   callback(returnData);
        // });
    });
}

function getHourlyPunchReport(db, QUERY, secData, callback) {
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
        getEmployeeDayAttendance(db, QUERY, function(attData) {
            async.each(attData, function(att, cb_att) {
                var OT = att.overTime + att.excessOverTime;
                var workInTime = att.workInTime.split(":");
                var workOutTime = att.workOutTime.split(":");
                var InH = parseInt(workInTime[0]);
                var InM = parseInt(workInTime[1]);
                var OutH = parseInt(workOutTime[0]);
                var OutM = parseInt(workOutTime[1]);
                switch (att.attendanceStatus) {
                    case 'P':
                        o.present++;
                        if (att.officeIn.h > InH || (att.officeIn.h == InH && att.officeIn.m > InM))
                            o.in_late++;
                        if (!(att.officeOut.h >= 17))
                            o.out_late++;
                        break;
                    case 'A':
                        o.absent++;
                        break;
                }
                switch (OT) {
                    case 1:
                        o.ot1h++;
                        break;
                    case 2:
                        o.ot2h++;
                        break;
                    case 3:
                        o.ot3h++;
                        break;
                    case 4:
                        o.ot4h++;
                        break;
                    case 5:
                        o.ot5h++;
                        break;
                    case 6:
                        o.ot6h++;
                        break;
                    case 7:
                        o.ot7h++;
                        break;
                    case 8:
                        o.ot8h++;
                        break;
                    case 9:
                        o.ot9h++;
                        break;
                    case 10:
                        o.ot10h++;
                        break;
                    case 11:
                        o.ot11h++;
                        break;
                    case 12:
                        o.ot12h++;
                        break;
                    case 13:
                        o.ot13h++;
                        break;
                }
                // o.emp.push(b);
                cb_att();
            }, function(err) {
                returnData.push(o);
                cb_sec();
            });
        });
    }, function(err) {
        callback(returnData);
    });
}

function getEmployeeMonthPunchV2(db, QUERY, callback) {
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    d.setDate(10);
    d.setHours(d.getHours() + 6);
    // var dayArray = dayArrayFunc(d.monthDays());
    var rangeMArray = rangeMArrayFunc(d);
    var o = {};
    async.each(rangeMArray, function(YMD, cb_day) {
        QUERY.date = YMD;
        getEmployeeDayPunch(db, QUERY, function(attData) {
            var dt = new Date(YMD);
            dt.setHours(dt.getHours() + 6);
            o[YMD] = {};
            o[YMD].day = attData[YMD].day;
            o[YMD].date = attData[YMD].date;
            o[YMD].dateTime = attData[YMD].dateTime;
            o[YMD].overTime = attData[YMD].overTime;
            o[YMD].excessOverTime = attData[YMD].excessOverTime;
            o[YMD].workingHour = attData[YMD].workingHour;
            o[YMD].status = attData[YMD].status;
            o[YMD].leave = false;
            o[YMD].leaveName = '';
            o[YMD].leaveType = '';
            o[YMD].payable = (dt.getDay() == 5) ? true : false;
            o[YMD].attend = (attData[YMD].status == 'P') ? true : false;
            o[YMD].adjust = false;
            o[YMD].holiday = false;
            o[YMD].weekend = (dt.getDay() == 5) ? true : false;
            // o[YMD].overTime=(dt.getDay()==5)?0:attData[YMD].overTime;
            o[YMD].officeIn = attData[YMD].officeIn;
            o[YMD].lunchOut = attData[YMD].lunchOut;
            o[YMD].lunchIn = attData[YMD].lunchIn;
            o[YMD].officeOut = attData[YMD].officeOut;
            cb_day();
        })
    }, function(err) {
        callback(o);
    });
}

function getEmployeeMonthPunch(db, QUERY, callback) {
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    d.setDate(1);
    var dayArray = dayArrayFunc(d.monthDays());
    var o = {};
    async.each(dayArray, function(day, cb_day) {
        d.setDate(day);
        var Y = d.getFullYear();
        var M = d.getMonth() + 1;
        var D = d.getDate();
        var YMD = Y + '-' + M + '-' + D;
        QUERY.date = YMD;
        getEmployeeDayPunch(db, QUERY, function(attData) {
            var dt = new Date(YMD);
            o[YMD] = {};
            o[YMD].day = attData[YMD].day;
            o[YMD].date = attData[YMD].date;
            o[YMD].dateTime = attData[YMD].dateTime;
            o[YMD].overTime = attData[YMD].overTime;
            o[YMD].excessOverTime = attData[YMD].excessOverTime;
            o[YMD].workingHour = attData[YMD].workingHour;
            o[YMD].status = attData[YMD].status;
            o[YMD].leave = false;
            o[YMD].leaveName = '';
            o[YMD].leaveType = '';
            o[YMD].payable = (dt.getDay() == 5) ? true : false;
            o[YMD].attend = (attData[YMD].status == 'P') ? true : false;
            o[YMD].adjust = false;
            o[YMD].holiday = false;
            o[YMD].weekend = (dt.getDay() == 5) ? true : false;
            // o[YMD].overTime=(dt.getDay()==5)?0:attData[YMD].overTime;
            o[YMD].officeIn = attData[YMD].officeIn;
            o[YMD].lunchOut = attData[YMD].lunchOut;
            o[YMD].lunchIn = attData[YMD].lunchIn;
            o[YMD].officeOut = attData[YMD].officeOut;
            cb_day();
        })
    }, function(err) {
        callback(o);
    });
}

function getEmployeeDayPunchDetails(db, QUERY, callback) {
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    var Y = d.getFullYear();
    var M = d.getMonth() + 1;
    var D = d.getDate();
    var YMD = Y + '-' + M + '-' + D;
    QUERY.date = YMD;
    var o = {};
    // o.data = [];
    o[YMD] = {};
    o[YMD].employee = QUERY.employee;
    o[YMD].day = D;
    o[YMD].month = M;
    o[YMD].year = Y;
    o[YMD].work_time = 1;
    o[YMD].in_hour = 0;
    o[YMD].in_minute = 0;
    o[YMD].in_late_minute = 0;
    o[YMD].out_hour = 0;
    o[YMD].out_minute = 0;
    o[YMD].out_late_minute = 0;
    o[YMD].attend_status = 1;
    o[YMD].working_minute = 0;
    o[YMD].overtime = 0;
    o[YMD].break_minute = 60;
    o[YMD].punches = [];
    getAttendance(db, QUERY, function(attData) {
        async.each(attData, function(att, cb_att) {
            var aDo = {};
            var workTimeTable = JSON.parse(JSON.stringify(att.employeeTable.workTimeTable, null, 4));
            aDo.staff = (att.employeeTable.employee_type == 1) ? true : false;
            aDo.w_in_h = parseInt(workTimeTable.in_hour);
            aDo.w_in_m = parseInt(workTimeTable.in_minute);
            // aDo.w_in_lam = parseInt(workTimeTable.in_late_allowed_minute);
            // aDo.w_in_blam = parseInt(workTimeTable.in_bonus_late_allowed_minute);
            aDo.w_out_h = parseInt(workTimeTable.out_hour);
            aDo.w_out_m = parseInt(workTimeTable.out_minute);
            // aDo.w_out_lam = parseInt(workTimeTable.out_late_allowed_minute);
            // aDo.w_out_blam = parseInt(workTimeTable.out_bonus_late_allowed_minute);
            aDo.mid_h = Math.round((aDo.w_in_h + aDo.w_out_h) / 2);
            aDo.punch = new Date(att.punch_time);
            aDo.punch.setHours(aDo.punch.getHours() - ((aDo.w_in_h - 2) + 6));
            aDo.punch_h = parseInt(aDo.punch.getHours()) + (aDo.w_in_h - 2);
            aDo.punch_m = parseInt(aDo.punch.getMinutes());
            var tY = aDo.punch.getFullYear();
            var tM = aDo.punch.getMonth() + 1;
            var tD = aDo.punch.getDate();
            var tYMD = tY + '-' + tM + '-' + tD;
            if (tYMD == YMD) {
                if (aDo.punch_h < aDo.mid_h) {
                    /////////////// IN PUNCH ////////////////
                    if (o[YMD].in_hour == 0) {
                        o[YMD].in_hour = aDo.punch_h
                        o[YMD].in_minute = aDo.punch_m
                    } else {
                        if (timeGreater(o[YMD].in_hour, o[YMD].in_minute, aDo.punch_h, aDo.punch_m)) {
                            o[YMD].in_hour = aDo.punch_h
                            o[YMD].in_minute = aDo.punch_m
                        }
                    }
                } else {
                    /////////////// OUT PUNCH ////////////////
                    if (o[YMD].out_hour == 0) {
                        o[YMD].out_hour = aDo.punch_h
                        o[YMD].out_minute = aDo.punch_m
                    } else {
                        if (!timeGreater(o[YMD].out_hour, o[YMD].out_minute, aDo.punch_h, aDo.punch_m)) {
                            o[YMD].out_hour = aDo.punch_h
                            o[YMD].out_minute = aDo.punch_m
                        }
                    }
                }
            }
            o[YMD].working_minute = totalWorkingMinute(o[YMD].in_hour, o[YMD].in_minute, o[YMD].out_hour, o[YMD].out_minute);
            o[YMD].overtime = (aDo.staff) ? 0 : overTimeHourCount(aDo.w_out_h, aDo.w_out_m, o[YMD].out_hour, o[YMD].out_minute);
            var in_late_minute = (o[YMD].in_hour > 0) ? totalWorkingMinute(aDo.w_in_h, aDo.w_in_m, o[YMD].in_hour, o[YMD].in_minute) : 0;
            o[YMD].in_late_minute = (in_late_minute > 0) ? in_late_minute : 0;
            var out_late_minute = (o[YMD].out_hour > 0) ? totalWorkingMinute(aDo.w_out_h, aDo.w_out_m, o[YMD].out_hour, o[YMD].out_minute) * (-1) : 0;
            o[YMD].out_late_minute = (out_late_minute > 0) ? out_late_minute : 0;
            o[YMD].punches.push(att.punch_time);
            cb_att();
        }, function(err) {
            callback(o);
        });
    });
}

function getEmployeeDayPunch(db, QUERY, callback) {
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    d.setHours(d.getHours() + 6);
    var Y = d.getFullYear();
    var M = d.getMonth() + 1;
    var D = d.getDate();
    var YMD = Y + '-' + M + '-' + D;
    QUERY.date = YMD;
    var o = {};
    o[YMD] = {};

    o[YMD].day = D;
    o[YMD].date = YMD;
    o[YMD].dateTime = new Date(Date.UTC(Y, M - 1, D));
    o[YMD].overTime = 0;
    o[YMD].excessOverTime = 0;
    o[YMD].workingHour = 0;
    o[YMD].status = 'A';

    o[YMD].lastDayOut = {};
    o[YMD].officeIn = {};
    o[YMD].lunchOut = {};
    o[YMD].lunchIn = {};
    o[YMD].officeOut = {};

    o[YMD].lastDayOut.flag = 0;
    o[YMD].officeIn.flag = 0;
    o[YMD].lunchOut.flag = 0;
    o[YMD].lunchIn.flag = 0;
    o[YMD].officeOut.flag = 0;

    o[YMD].lastDayOut.h = 0;
    o[YMD].officeIn.h = 0;
    o[YMD].lunchOut.h = 0;
    o[YMD].lunchIn.h = 0;
    o[YMD].officeOut.h = 0;

    o[YMD].lastDayOut.m = 0;
    o[YMD].officeIn.m = 0;
    o[YMD].lunchOut.m = 0;
    o[YMD].lunchIn.m = 0;
    o[YMD].officeOut.m = 0;

    o[YMD].lastDayOut.HM = 0;
    o[YMD].officeIn.HM = 0;
    o[YMD].lunchOut.HM = 0;
    o[YMD].lunchIn.HM = 0;
    o[YMD].officeOut.HM = 0;

    o[YMD].lastDayOut.time = '00:00 NN';
    o[YMD].officeIn.time = '00:00 NN';
    o[YMD].lunchOut.time = '00:00 NN';
    o[YMD].lunchIn.time = '00:00 NN';
    o[YMD].officeOut.time = '00:00 NN';

    getAttendance(db, QUERY, function(attData) {
        async.each(attData, function(att, cb_att) {
            try {
                o[YMD].id = att.employee;
                o[YMD].department = att.employeeTable.departmentTable.id;
                o[YMD].section = att.employeeTable.sectionTable.id;
            } catch (err) {
                o[YMD].id = 0;
                o[YMD].department = 0;
                o[YMD].section = 0;
            }
            var workInTime = att.employeeTable.workTimeTable.in_time.split(":");
            var workOutTime = att.employeeTable.workTimeTable.out_time.split(":");
            var inH = parseInt(workInTime[0]);
            var inM = parseInt(workInTime[1]);
            var outH = parseInt(workOutTime[0]);
            var outM = parseInt(workOutTime[1]);
            var dt = new Date(att.punch_time);
            dt.setHours(dt.getHours() - 12);
            var HR = parseInt(dt.getHours()) + 6;
            var MT = parseInt(dt.getMinutes());
            if (D == 1) {
                if ((dt.getMonth() + 2) == M) {
                    if (dt.monthDays() == dt.getDate()) {
                        ////////////// Last Day Out Punch //////////////
                        if (validBetweenInteger(HR, 12, 29)) {
                            if (!o[YMD].lastDayOut.flag) {
                                o[YMD].lastDayOut.h = HR;
                                o[YMD].lastDayOut.m = MT;
                                o[YMD].lastDayOut.flag = 1;
                            } else {
                                if (HR >= o[YMD].lastDayOut.h) {
                                    if (HR == o[YMD].lastDayOut.h) {
                                        if (MT > o[YMD].lastDayOut.m) {
                                            o[YMD].lastDayOut.h = HR;
                                            o[YMD].lastDayOut.m = MT;
                                        }
                                    } else {
                                        o[YMD].lastDayOut.h = HR;
                                        o[YMD].lastDayOut.m = MT;
                                    }
                                }
                            }
                            var tmpH = o[YMD].lastDayOut.h - 12;
                            var tmpM = o[YMD].lastDayOut.m;
                            var tmpA = '';
                            var tmpAH = 0;
                            var tmpAM = 0;
                            if (o[YMD].lastDayOut.h > 23) {
                                tmpH = 12;
                                tmpM = 0;
                                tmpAH = o[YMD].lastDayOut.h - 24;
                                tmpAM = o[YMD].lastDayOut.m;
                                tmpA = ' + (' + addLeadingZero(2, tmpAH) + ':' + addLeadingZero(2, tmpAM) + ')'
                            }
                            o[YMD].lastDayOut.time = addLeadingZero(2, tmpH) + ':' + addLeadingZero(2, tmpM) + ' PM' + tmpA;
                        }
                    }
                }
            } else {
                if (D == (dt.getDate() + 1)) {
                    ////////////// Last Day Out Punch //////////////
                    if (validBetweenInteger(HR, 12, 29)) {
                        if (!o[YMD].lastDayOut.flag) {
                            o[YMD].lastDayOut.h = HR;
                            o[YMD].lastDayOut.m = MT;
                            o[YMD].lastDayOut.flag = 1;
                        } else {
                            if (HR >= o[YMD].lastDayOut.h) {
                                if (HR == o[YMD].lastDayOut.h) {
                                    if (MT > o[YMD].lastDayOut.m) {
                                        o[YMD].lastDayOut.h = HR;
                                        o[YMD].lastDayOut.m = MT;
                                    }
                                } else {
                                    o[YMD].lastDayOut.h = HR;
                                    o[YMD].lastDayOut.m = MT;
                                }
                            }
                        }
                        var tmpH = o[YMD].lastDayOut.h - 12;
                        var tmpM = o[YMD].lastDayOut.m;
                        var tmpA = '';
                        var tmpAH = 0;
                        var tmpAM = 0;
                        if (o[YMD].lastDayOut.h > 23) {
                            tmpH = 12;
                            tmpM = 0;
                            tmpAH = o[YMD].lastDayOut.h - 24;
                            tmpAM = o[YMD].lastDayOut.m;
                            tmpA = ' + (' + addLeadingZero(2, tmpAH) + ':' + addLeadingZero(2, tmpAM) + ')'
                        }
                        o[YMD].lastDayOut.time = addLeadingZero(2, tmpH) + ':' + addLeadingZero(2, tmpM) + ' PM' + tmpA;
                    }
                }
            }

            if (dt.getDate() == D) {
                ////////////// Office In Punch //////////////
                if (validBetweenInteger(HR, 6, 12)) {
                    if (!o[YMD].officeIn.flag) {
                        o[YMD].officeIn.h = HR;
                        o[YMD].officeIn.m = MT;
                        o[YMD].officeIn.flag = 1;
                    } else {
                        if (HR <= o[YMD].officeIn.h) {
                            if (HR == o[YMD].officeIn.h) {
                                if (MT < o[YMD].officeIn.m) {
                                    o[YMD].officeIn.h = HR;
                                    o[YMD].officeIn.m = MT;
                                }
                            } else {
                                o[YMD].officeIn.h = HR;
                                o[YMD].officeIn.m = MT;
                            }
                        }
                    }
                    o[YMD].officeIn.time = addLeadingZero(2, o[YMD].officeIn.h) + ':' + addLeadingZero(2, o[YMD].officeIn.m) + ' AM';
                }
                ////////////// Lunch Out Punch //////////////
                if (validBetweenInteger(HR, 13, 14)) {
                    if (!o[YMD].lunchOut.flag) {
                        o[YMD].lunchOut.h = HR;
                        o[YMD].lunchOut.m = MT;
                        o[YMD].lunchOut.flag = 1;
                    } else {
                        if (HR <= o[YMD].lunchOut.h) {
                            if (HR == o[YMD].lunchOut.h) {
                                if (MT < o[YMD].lunchOut.m) {
                                    o[YMD].lunchOut.h = HR;
                                    o[YMD].lunchOut.m = MT;
                                }
                            } else {
                                o[YMD].lunchOut.h = HR;
                                o[YMD].lunchOut.m = MT;
                            }
                        }
                    }
                    var tmpH = (o[YMD].lunchOut.h == 13) ? 1 : 2;
                    o[YMD].lunchOut.time = addLeadingZero(2, tmpH) + ':' + addLeadingZero(2, o[YMD].lunchOut.m) + ' PM';
                }
                ////////////// Lunch In Punch //////////////
                if (validBetweenInteger(HR, 14, 15)) {
                    if (!o[YMD].lunchIn.flag) {
                        o[YMD].lunchIn.h = HR;
                        o[YMD].lunchIn.m = MT;
                        o[YMD].lunchIn.flag = 1;
                    } else {
                        if (HR >= o[YMD].lunchIn.h) {
                            if (HR == o[YMD].lunchIn.h) {
                                if (MT > o[YMD].lunchIn.m) {
                                    o[YMD].lunchIn.h = HR;
                                    o[YMD].lunchIn.m = MT;
                                }
                            } else {
                                o[YMD].lunchIn.h = HR;
                                o[YMD].lunchIn.m = MT;
                            }
                        }
                    }
                    var tmpH = (o[YMD].lunchIn.h == 15) ? 3 : 2;
                    o[YMD].lunchIn.time = addLeadingZero(2, tmpH) + ':' + addLeadingZero(2, o[YMD].lunchIn.m) + ' PM';
                }
                ////////////// Office Out Punch //////////////
                if (validBetweenInteger(HR, 12, 29)) {
                    if (!o[YMD].officeOut.flag) {
                        o[YMD].officeOut.h = HR;
                        o[YMD].officeOut.m = MT;
                        o[YMD].officeOut.flag = 1;
                    } else {
                        if (HR >= o[YMD].officeOut.h) {
                            if (HR == o[YMD].officeOut.h) {
                                if (MT > o[YMD].officeOut.m) {
                                    o[YMD].officeOut.h = HR;
                                    o[YMD].officeOut.m = MT;
                                }
                            } else {
                                o[YMD].officeOut.h = HR;
                                o[YMD].officeOut.m = MT;
                            }
                        }
                    }

                    o[YMD].overTime = overTimeCount(outH, outM, o[YMD].officeOut.h, o[YMD].officeOut.m, 48);

                    var tmpH = o[YMD].officeOut.h - 12;
                    var tmpM = o[YMD].officeOut.m;
                    var tmpA = '';
                    var tmpAH = 0;
                    var tmpAM = 0;
                    if (o[YMD].officeOut.h > 23) {
                        tmpH = 12;
                        tmpM = 0;
                        tmpAH = o[YMD].officeOut.h - 24;
                        tmpAM = o[YMD].officeOut.m;
                        tmpA = ' + (' + addLeadingZero(2, tmpAH) + ':' + addLeadingZero(2, tmpAM) + ')'
                    }
                    o[YMD].officeOut.time = addLeadingZero(2, tmpH) + ':' + addLeadingZero(2, tmpM) + ' PM' + tmpA;
                }

                o[YMD].lastDayOut.HM = (o[YMD].lastDayOut.m > 49) ? o[YMD].lastDayOut.h + 1 : o[YMD].lastDayOut.h;
                o[YMD].officeIn.HM = (o[YMD].officeIn.h < 8 && o[YMD].officeIn.h > 0) ?
                    8 : ((o[YMD].officeIn.m > 49) ? o[YMD].officeIn.h + 1 : o[YMD].officeIn.h);
                o[YMD].lunchOut.HM = (o[YMD].lunchOut.m > 49) ? o[YMD].lunchOut.h + 1 : o[YMD].lunchOut.h;
                o[YMD].lunchIn.HM = (o[YMD].lunchIn.m > 49) ? o[YMD].lunchIn.h + 1 : o[YMD].lunchIn.h;
                o[YMD].officeOut.HM = (o[YMD].officeOut.m > 49) ? o[YMD].officeOut.h + 1 : o[YMD].officeOut.h;

                if (o[YMD].officeIn.flag || o[YMD].lunchOut.flag || o[YMD].lunchIn.flag || o[YMD].officeOut.flag)
                    o[YMD].status = 'P';
                o[YMD].workingHour = (o[YMD].officeIn.flag && o[YMD].officeOut.flag) ?
                    (
                        (o[YMD].officeOut.HM > o[YMD].officeIn.HM) ?
                        (o[YMD].officeOut.HM - o[YMD].officeIn.HM) :
                        0
                    ) :
                    (
                        (o[YMD].officeIn.flag && o[YMD].lunchIn.flag) ?
                        (
                            (o[YMD].lunchIn.HM > o[YMD].officeIn.HM) ?
                            (o[YMD].lunchIn.HM - o[YMD].officeIn.HM) :
                            0
                        ) :
                        (
                            (o[YMD].officeIn.flag && o[YMD].lunchOut.flag) ?
                            (
                                (o[YMD].lunchOut.HM > o[YMD].officeIn.HM) ?
                                (o[YMD].lunchOut.HM - o[YMD].officeIn.HM) :
                                0
                            ) :
                            0
                        )
                    );
                o[YMD].workingHour = (o[YMD].workingHour > 5) ? o[YMD].workingHour - 1 : o[YMD].workingHour;
                if (o[YMD].overTime > 2) {
                    o[YMD].excessOverTime = o[YMD].overTime - 2;
                    o[YMD].overTime = 2;
                }
            }
            cb_att();
        }, function(err) {
            callback(o);
        });
    });
}

function getEmployeeDailyPunchDetails(db, QUERY, callback) {
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    d.setUTCHours(d.getUTCHours() + 6)
    var Y = d.getUTCFullYear();
    var M = d.getUTCMonth() + 1;
    var D = d.getUTCDate();
    var YMD = Y + '-' + M + '-' + D;
    QUERY.date = YMD;
    var o = {};
    o[YMD] = {};

    o[YMD].day = D;
    o[YMD].date = YMD;
    o[YMD].dateTime = new Date(Date.UTC(Y, M - 1, D));
    o[YMD].overTime = 0;
    o[YMD].excessOverTime = 0;
    o[YMD].workingHour = 0;
    o[YMD].status = 'A';

    o[YMD].lastDayOut = {};
    o[YMD].officeIn = {};
    o[YMD].officeOut = {};

    o[YMD].lastDayOut.flag = 0;
    o[YMD].officeIn.flag = 0;
    o[YMD].officeOut.flag = 0;

    o[YMD].lastDayOut.h = 0;
    o[YMD].officeIn.h = 0;
    o[YMD].officeOut.h = 0;

    o[YMD].lastDayOut.m = 0;
    o[YMD].officeIn.m = 0;
    o[YMD].officeOut.m = 0;

    o[YMD].lastDayOut.HM = 0;
    o[YMD].officeIn.HM = 0;
    o[YMD].officeOut.HM = 0;

    o[YMD].lastDayOut.time = '00:00 NN';
    o[YMD].officeIn.time = '00:00 NN';
    o[YMD].officeOut.time = '00:00 NN';

    getAttendance(db, QUERY, function(attData) {
        async.each(attData, function(att, cb_att) {
            try {
                o[YMD].id = att.employee;
                o[YMD].department = att.employeeTable.department;
                o[YMD].section = att.employeeTable.section;
            } catch (err) {
                o[YMD].id = 0;
                o[YMD].department = 0;
                o[YMD].section = 0;
            }
            var WTTable = JSON.parse(JSON.stringify(att.employeeTable.workTimeTable));
            var inH = parseInt(WTTable.in_hour);
            var inM = parseInt(WTTable.in_minute);
            var inLM = parseInt(WTTable.in_late_allowed_minute);
            var inBM = parseInt(WTTable.in_bonus_late_allowed_minute);
            var outH = parseInt(WTTable.out_hour);
            var outM = parseInt(WTTable.out_minute);
            var outLM = parseInt(WTTable.out_late_allowed_minute);
            var outBM = parseInt(WTTable.out_bonus_late_allowed_minute);
            var ExOutH = inH - 2;
            var MaxOutH = 23 + ExOutH;
            var MidH = inH + Math.round((outH - inH) / 2);
            var dt = new Date(att.punch_time);
            dt.setUTCHours(dt.getUTCHours() - ExOutH);

            var HR = parseInt(dt.getUTCHours() + ExOutH);
            var MT = parseInt(dt.getUTCMinutes());
            if (D == 1) {
                if ((dt.getUTCMonth() + 2) == M) {
                    if (dt.monthDayCount() == dt.getUTCDate()) {
                        ////////////// Last Day Out Punch //////////////
                        if (validBetweenInteger(HR, MidH, MaxOutH)) {
                            if (!o[YMD].lastDayOut.flag) {
                                o[YMD].lastDayOut.h = HR;
                                o[YMD].lastDayOut.m = MT;
                                o[YMD].lastDayOut.flag = 1;
                            } else {
                                if (HR >= o[YMD].lastDayOut.h) {
                                    if (HR == o[YMD].lastDayOut.h) {
                                        if (MT > o[YMD].lastDayOut.m) {
                                            o[YMD].lastDayOut.h = HR;
                                            o[YMD].lastDayOut.m = MT;
                                        }
                                    } else {
                                        o[YMD].lastDayOut.h = HR;
                                        o[YMD].lastDayOut.m = MT;
                                    }
                                }
                            }
                            var tmpH = o[YMD].lastDayOut.h - 12;
                            var tmpM = o[YMD].lastDayOut.m;
                            var tmpA = '';
                            var tmpAH = 0;
                            var tmpAM = 0;
                            if (o[YMD].lastDayOut.h > 23) {
                                tmpH = 12;
                                tmpM = 0;
                                tmpAH = o[YMD].lastDayOut.h - 24;
                                tmpAM = o[YMD].lastDayOut.m;
                                tmpA = ' + (' + addLeadingZero(2, tmpAH) + ':' + addLeadingZero(2, tmpAM) + ')'
                            }
                            var Meridiem = (o[YMD].lastDayOut.h < 12) ? ' AM' : ' PM';
                            o[YMD].lastDayOut.time = addLeadingZero(2, tmpH) + ':' + addLeadingZero(2, tmpM) + Meridiem + tmpA;
                        }
                    }
                }
            } else {
                if (D == (dt.getUTCDate() + 1)) {
                    ////////////// Last Day Out Punch //////////////
                    if (validBetweenInteger(HR, MidH, MaxOutH)) {
                        if (!o[YMD].lastDayOut.flag) {
                            o[YMD].lastDayOut.h = HR;
                            o[YMD].lastDayOut.m = MT;
                            o[YMD].lastDayOut.flag = 1;
                        } else {
                            if (HR >= o[YMD].lastDayOut.h) {
                                if (HR == o[YMD].lastDayOut.h) {
                                    if (MT > o[YMD].lastDayOut.m) {
                                        o[YMD].lastDayOut.h = HR;
                                        o[YMD].lastDayOut.m = MT;
                                    }
                                } else {
                                    o[YMD].lastDayOut.h = HR;
                                    o[YMD].lastDayOut.m = MT;
                                }
                            }
                        }
                        var tmpH = o[YMD].lastDayOut.h - 12;
                        var tmpM = o[YMD].lastDayOut.m;
                        var tmpA = '';
                        var tmpAH = 0;
                        var tmpAM = 0;
                        if (o[YMD].lastDayOut.h > 23) {
                            tmpH = 12;
                            tmpM = 0;
                            tmpAH = o[YMD].lastDayOut.h - 24;
                            tmpAM = o[YMD].lastDayOut.m;
                            tmpA = ' + (' + addLeadingZero(2, tmpAH) + ':' + addLeadingZero(2, tmpAM) + ')'
                        }
                        var Meridiem = (o[YMD].lastDayOut.h < 12) ? ' AM' : ' PM';
                        o[YMD].lastDayOut.time = addLeadingZero(2, tmpH) + ':' + addLeadingZero(2, tmpM) + Meridiem + tmpA;
                    }
                }
            }

            if (dt.getUTCDate() == D) {
                ////////////// Office In Punch //////////////
                if (validBetweenInteger(HR, ExOutH, MidH)) {
                    if (!o[YMD].officeIn.flag) {
                        o[YMD].officeIn.h = HR;
                        o[YMD].officeIn.m = MT;
                        o[YMD].officeIn.flag = 1;
                    } else {
                        if (HR <= o[YMD].officeIn.h) {
                            if (HR == o[YMD].officeIn.h) {
                                if (MT < o[YMD].officeIn.m) {
                                    o[YMD].officeIn.h = HR;
                                    o[YMD].officeIn.m = MT;
                                }
                            } else {
                                o[YMD].officeIn.h = HR;
                                o[YMD].officeIn.m = MT;
                            }
                        }
                    }
                    var Meridiem = (o[YMD].officeIn.h < 12) ? ' AM' : ' PM';
                    o[YMD].officeIn.time = addLeadingZero(2, o[YMD].officeIn.h) + ':' + addLeadingZero(2, o[YMD].officeIn.m) + Meridiem;
                }
                ////////////// Office Out Punch //////////////
                if (validBetweenInteger(HR, MidH, MaxOutH)) {
                    if (!o[YMD].officeOut.flag) {
                        o[YMD].officeOut.h = HR;
                        o[YMD].officeOut.m = MT;
                        o[YMD].officeOut.flag = 1;
                    } else {
                        if (HR >= o[YMD].officeOut.h) {
                            if (HR == o[YMD].officeOut.h) {
                                if (MT > o[YMD].officeOut.m) {
                                    o[YMD].officeOut.h = HR;
                                    o[YMD].officeOut.m = MT;
                                }
                            } else {
                                o[YMD].officeOut.h = HR;
                                o[YMD].officeOut.m = MT;
                            }
                        }
                    }
                    o[YMD].overTime = overTimeCount(outH, outM, o[YMD].officeOut.h, o[YMD].officeOut.m, 48);

                    var tmpH = o[YMD].officeOut.h - 12;
                    var tmpM = o[YMD].officeOut.m;
                    var tmpA = '';
                    var tmpAH = 0;
                    var tmpAM = 0;
                    if (o[YMD].officeOut.h > 23) {
                        tmpH = 12;
                        tmpM = 0;
                        tmpAH = o[YMD].officeOut.h - 24;
                        tmpAM = o[YMD].officeOut.m;
                        tmpA = ' + (' + addLeadingZero(2, tmpAH) + ':' + addLeadingZero(2, tmpAM) + ')'
                    }
                    var Meridiem = (o[YMD].officeOut.h < 12) ? ' AM' : ' PM';
                    o[YMD].officeOut.time = addLeadingZero(2, tmpH) + ':' + addLeadingZero(2, tmpM) + Meridiem + tmpA;
                }

                o[YMD].lastDayOut.HM = (o[YMD].lastDayOut.m > 49) ? o[YMD].lastDayOut.h + 1 : o[YMD].lastDayOut.h;
                o[YMD].officeIn.HM = (o[YMD].officeIn.h < 8 && o[YMD].officeIn.h > 0) ?
                    8 : ((o[YMD].officeIn.m > 49) ? o[YMD].officeIn.h + 1 : o[YMD].officeIn.h);
                o[YMD].officeOut.HM = (o[YMD].officeOut.m > 49) ? o[YMD].officeOut.h + 1 : o[YMD].officeOut.h;

                if (o[YMD].officeIn.flag || o[YMD].officeOut.flag)
                    o[YMD].status = 'P';
                o[YMD].workingHour = (o[YMD].officeIn.flag && o[YMD].officeOut.flag) ?
                    (
                        (o[YMD].officeOut.HM > o[YMD].officeIn.HM) ?
                        ((o[YMD].officeOut.HM - o[YMD].officeIn.HM) - 1) :
                        0
                    ) : 0;
                if (o[YMD].overTime > 2) {
                    o[YMD].excessOverTime = o[YMD].overTime - 2;
                    o[YMD].overTime = 2;
                }
            }
            cb_att();
        }, function(err) {
            callback(o);
        });
    });
}


function routerInit(app, dbFull) {
    var db = dbFull.DA_HR

    app.get('/getEmployeeDailyPunchDetails', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.employee = 3004;
        QUERY.date = new Date('2017-10-01');
        getEmployeeDailyPunchDetails(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getEmployeeDayPunch', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.id = 2311;
        QUERY.employee = 2311;
        QUERY.date = new Date('2017-06-18');
        getEmployeeDayPunch(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send([d]);
        })
    });

    app.get('/getEmployeeDayPunchDetails', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.id = 2311;
        QUERY.employee = 2311;
        QUERY.date = new Date('2017-09-18');
        getEmployeeDayPunchDetails(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send([d]);
        })
    });

    app.get('/getEmployeeMonthPunch', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.id = 3209;
        QUERY.employee = 3209;
        QUERY.date = new Date('2017-01-1');
        getEmployeeMonthPunch(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getEmployeeMonthPunchV2', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.id = 3004;
        QUERY.employee = 3004;
        QUERY.date = new Date('2017-9-20');
        getEmployeeMonthPunchV2(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getHourlyPunchReport', /*isAuthenticated,*/ function(req, res) {
        var QUERY = req.query;
        QUERY.date = (req.query.date) ? new Date(req.query.date) : new Date();
        QUERY.status = [1, 2];
        database.sequelize.query(
            "SELECT  `section`.`id`, `section`.`name`,  COUNT(`employee`.`id`) AS `emp_count` " +
            "FROM  `section` " +
            "LEFT JOIN  `employee` ON  `employee`.`section` =  `section`.`id` " +
            "WHERE  `employee`.`status` IN (1, 2) " +
            "GROUP BY  `section`. `id`;"
        ).complete(function(err, secData) {
            getHourlyPunchReport(db, QUERY, secData, function(d) {
                res.setHeader('Content-Type', 'application/json');
                res.send(d);
            })
        });
    });

    app.get('/getPunchProblemList/:TYPE', /*isAuthenticated,*/ function(req, res) {
        req.query.type = req.params.TYPE;
        getPunchProblemList(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });
}


function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('CreatePunchProblem', function(data) {
        CreatePunchProblem(db, data, function(data) {
            socket.emit("CreatePunchProblem", data)
        });
    });

    socket.on('UpdatePunchProblem', function(data) {
        UpdatePunchProblem(db, data, function(data) {
            socket.emit("UpdatePunchProblem", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;