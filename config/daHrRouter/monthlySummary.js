module.exports = function() {};

function getComplianceEmployeeMonthSummary(db, QUERY, callback) {
    var returnData = [];
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    var dayArray = dayArrayFunc(d.monthDays());
    var rangeMArray = rangeMArrayFunc(d);
    getComplianceEmployeeMonthAttendance(db, QUERY, function(empData) {
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
            o.netSalary = 0;
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
                inH = parseInt(workInTime[0]);
                outH = parseInt(workOutTime[0]);
                outM = parseInt(workOutTime[1]);

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
                } else if (emp.attendance[YMD].holiday) {
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
                } else if (emp.attendance[YMD].weekend) {
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
                o.attendance[YMD + 'OT'] = (empStatus == 'P' || empStatus == 'L') ? emp.attendance[YMD].overTime : 0;
                o.overTime += (empStatus == 'P' || empStatus == 'L') ? emp.attendance[YMD].overTime : 0;
                o.excessOverTime += emp.attendance[YMD].excessOverTime;
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
                // o.absentForInLate=parseInt(o.inLate/3);
                o.absentForInLate = 0;
                // o.absentForOutLate=parseInt(o.outLate/3);
                o.absentForOutLate = 0;
                // o.absentForLate=parseInt(o.inLate/3)+parseInt(o.outLate/3);
                o.absentForLate = 0;
                o.totalDays = o.absent + o.present + o.late + o.leave + o.outLeave + o.compensation + o.directWorkPlace + o.holiday + o.weekend;
                o.totalDeductDays = o.absent;
                o.totalPayableDays = o.totalDays - o.totalDeductDays;
                if (o.inBonusLateCount > 0 || o.inLate > 0 || o.outLate > 0 || o.totalDeductDays > 0 || o.leave > 0) {
                    o.attendanceBonus = 0;
                }

                o.absentDeduct = (o.employee_type == 'WORKER') ?
                    Math.round(o.basic / 30 * o.totalDeductDays) :
                    Math.round(o.salary / o.totalDays * o.totalDeductDays);

                var tmpMFirstDay = (QUERY.date) ? new Date(QUERY.date) : new Date();
                var tmpMLastDay = (QUERY.date) ? new Date(QUERY.date) : new Date();
                var tmpEmpDOJ = (emp.date_of_join) ? new Date(emp.date_of_join) : new Date();
                tmpEmpDOJ.setHours(10);
                tmpMFirstDay.setMonth(tmpMFirstDay.getMonth() - 1);
                tmpMFirstDay.setHours(10);
                tmpMFirstDay.setDate(26);
                tmpMLastDay.setHours(10);
                tmpMLastDay.setDate(25);
                var dayBeforeJoin = parseInt(dayDiff(tmpMFirstDay, tmpEmpDOJ));
                var dBJoin = (dayBeforeJoin > 0) ? dayBeforeJoin : 0;

                if (
                    dBJoin > 0 &&
                    o.employee_type == 'WORKER'
                ) {
                    var abcentDaysBeforeJoin = dBJoin;
                    var abcentDaysAfterJoin = parseInt(o.totalDeductDays) - dBJoin;
                    var absentDeductBeforeJoin = Math.round((o.salary / o.totalDays) * abcentDaysBeforeJoin);
                    var absentDeductAfterJoin = Math.round(o.basic / 30 * abcentDaysAfterJoin);
                    o.absentDeduct = absentDeductBeforeJoin + absentDeductAfterJoin;
                }

                o.totalDeduct = o.absentDeduct + o.advanceDeduct + o.medicalDeduct + o.stampDeduct + o.lunchOutDeduct + o.othersDeduct + o.aitDeduct;
                o.netPayable = o.salary - o.totalDeduct + o.attendanceBonus;
                o.netPayable = (o.employee_type == 'WORKER') ?
                    Math.round(o.overTimeAmount + o.netPayable) :
                    Math.round(o.netPayable);
                o.netSalary = o.salary - o.totalDeduct;
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

function getEmployeeMonthSummary(db, QUERY, callback) {
    var returnData = [];
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    var dayArray = dayArrayFunc(d.monthDays());
    getEmployeeMonthAttendance(db, QUERY, function(empData) {
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
            async.each(dayArray, function(day, cb_day) {
                d.setDate(day);
                var Y = d.getFullYear();
                var M = d.getMonth() + 1;
                var D = d.getDate();
                var YMD = Y + '-' + M + '-' + D;
                inH = (ramadan2017.indexOf(YMD) != -1) ? parseInt(workInTime[0]) - 1 : parseInt(workInTime[0]);
                outH = (ramadan1p2017.indexOf(YMD) != -1) ? parseInt(workOutTime[0]) - 1 : (ramadan2p2017.indexOf(YMD) != -1) ? parseInt(workOutTime[0]) - 2 : parseInt(workOutTime[0]);
                outM = (ramadan2p2017.indexOf(YMD) != -1) ? ((parseInt(workOutTime[1]) == 30) ? 0 : 30) : parseInt(workOutTime[1]);

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

                /////////// Temporary Space For OCT 2017 Only /////////
                var tmpOCT2017 = ['2017-10-26', '2017-10-27', '2017-10-28', '2017-10-29', '2017-10-30', '2017-10-31'];
                if (tmpOCT2017.indexOf(YMD) != -1) {
                    emp.attendance[YMD].holiday = true;
                    emp.attendance[YMD].payable = true;
                    empStatus = 'H';
                    // o.attendance[YMD]='H';
                }
                /////////// Temporary Space For OCT 2017 Only /////////

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


                // o.overTime+=(empStatus=='P'||empStatus=='L')?emp.attendance[YMD].overTime:0;
                // o.excessOverTime+=(empStatus=='H'||empStatus=='W')?emp.attendance[YMD].workingHour:emp.attendance[YMD].excessOverTime;

                /////////// Temporary Space For OCT 2017 Only /////////
                if (tmpOCT2017.indexOf(YMD) == -1) {
                    o.overTime += (empStatus == 'P' || empStatus == 'L') ? emp.attendance[YMD].overTime : 0;
                    o.excessOverTime += (empStatus == 'H' || empStatus == 'W') ? emp.attendance[YMD].workingHour : emp.attendance[YMD].excessOverTime;

                }
                /////////// Temporary Space For OCT 2017 Only /////////

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
                o.totalDays = o.absent + o.present + o.late + o.leave + o.outLeave + o.compensation + o.directWorkPlace + o.holiday + o.weekend;
                o.totalDeductDays = o.absent + o.absentForLate + o.compensation;
                o.totalPayableDays = o.totalDays - o.totalDeductDays;
                if (o.inBonusLateCount > 0 || o.inLate > 0 || o.outLate > 0 || o.totalDeductDays > 0 || o.leave > 0) {
                    o.attendanceBonus = 0;
                }

                o.absentDeduct = (o.employee_type == 'WORKER') ?
                    (
                        (o.totalDeductDays > 2) ?
                        Math.round(o.salary / o.totalDays * o.totalDeductDays) :
                        Math.round(o.basic / o.totalDays * o.totalDeductDays)
                    ) :
                    Math.round(o.salary / o.totalDays * o.totalDeductDays);

                /////////// Temporary Space For OCT 2017 Only /////////
                var OCT2017Deduct = Math.round(o.salary / o.totalDays * 6);
                o.absentDeduct = o.absentDeduct + OCT2017Deduct;
                o.totalDeductDays = o.totalDeductDays + 6;
                o.totalPayableDays = o.totalPayableDays - 6;
                /////////// Temporary Space For OCT 2017 Only /////////

                if (
                    tmpDOJY == tmpSD2Y &&
                    tmpDOJM == tmpSD2M &&
                    o.employee_type == 'WORKER'
                ) {
                    var abcentDaysBeforeJoin = parseInt(tmpDOJD) - 1;
                    var abcentDaysAfterJoin = (parseInt(o.totalDeductDays) > abcentDaysBeforeJoin) ?
                        parseInt(o.totalDeductDays) - abcentDaysBeforeJoin :
                        0;
                    var absentDeductBeforeJoin = Math.round((o.salary / o.totalDays) * abcentDaysBeforeJoin);
                    var absentDeductAfterJoin = (abcentDaysAfterJoin > 2) ?
                        Math.round(o.salary / o.totalDays * abcentDaysAfterJoin) :
                        Math.round(o.basic / o.totalDays * abcentDaysAfterJoin);
                    o.absentDeduct = absentDeductBeforeJoin + absentDeductAfterJoin;
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

function getEmployeeMonthSummaryB(db, QUERY, callback) {
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
                o.absentDeduct = (o.employee_type == 'WORKER') ?
                    Math.round(o.basic / 30 * o.totalDeductDays) :
                    Math.round(o.salary / o.totalDays * o.totalDeductDays);

                var tmpMFirstDay = (QUERY.date) ? new Date(QUERY.date) : new Date();
                var tmpMLastDay = (QUERY.date) ? new Date(QUERY.date) : new Date();
                var tmpEmpDOJ = (emp.date_of_join) ? new Date(emp.date_of_join) : new Date();
                tmpEmpDOJ.setHours(10);
                tmpMFirstDay.setMonth(tmpMFirstDay.getMonth() - 1);
                tmpMFirstDay.setHours(10);
                tmpMFirstDay.setDate(26);
                tmpMLastDay.setHours(10);
                tmpMLastDay.setDate(25);
                var dayBeforeJoin = parseInt(dayDiff(tmpMFirstDay, tmpEmpDOJ));
                var dBJoin = (dayBeforeJoin > 0) ? dayBeforeJoin : 0;

                if (
                    dBJoin > 0 &&
                    o.employee_type == 'WORKER'
                ) {
                    var abcentDaysBeforeJoin = dBJoin;
                    var abcentDaysAfterJoin = parseInt(o.totalDeductDays) - dBJoin;
                    var absentDeductBeforeJoin = Math.round((o.salary / 30) * abcentDaysBeforeJoin);
                    var absentDeductAfterJoin = Math.round(o.basic / 30 * abcentDaysAfterJoin);
                    o.absentDeduct = absentDeductBeforeJoin + absentDeductAfterJoin;
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

function attendance_report2(db, DEPARTMENT_ID, DATA, WP, SEC, callback) {
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
    empS.department = DEPARTMENT_ID;
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


function getMonthlySummary(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    findData.where = {
        year: QUERY.year,
        month: QUERY.month
    };
    findData.attributes = [
            'id', 'employee', 'year', 'month', 'present_days',
            'absent_days', 'overtime', 'excess_overtime', 'in_late',
            'out_late', 'bonus', 'created_at', 'updated_at'
        ],
        findData.include = [{
            model: db.employee,
            where: {
                section: QUERY.section,
                status: QUERY.status
            },
            attributes: [
                'id', 'user', 'grade', 'designation', 'department',
                'section', 'employee_type', 'date_of_join',
                'work_time', 'status', 'payment_method'
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
    findData.order = [
        [SORT, DIR]
    ];
    db.monthly_attendance.findAll(findData).complete(function(err, mtData) {
        callback(mtData);
    })
}


function DestroyMonthlySummary(db, DATA, callback) {
    db.monthly_attendance.destroy({
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

function monthlyReportHead() {
    var mRH = '<head>' +
        '<style>' +
        'table, th, td {' +
        'border: 1px solid black;' +
        'border-collapse: collapse;' +
        '}' +
        'th, td {' +
        'padding: 5px;' +
        'line-height: 1.2;' +
        'align: center;' +
        '}' +
        'h1, h2, h4 {' +
        'line-height: 0.8;' +
        'text-align: center;' +
        '}' +
        'div {' +
        'font-size: 20px;' +
        'padding: 0px 30px;' +
        '}' +
        'hr {' +
        'page-break-after: always;' +
        '}' +
        '</style>' +
        '</head>';
    return mRH;
}

function getEmployeeMonthSummaryV2(db, QUERY, callback) {
    var returnData = [];
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    var dayArray = dayArrayFunc(d.monthDays());
    var rangeMArray = rangeMArrayFunc(d);
    getEmployeeMonthAttendanceV2(db, QUERY, function(empData) {
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
                o.totalDays = o.absent + o.present + o.late + o.leave + o.outLeave + o.compensation + o.directWorkPlace + o.holiday + o.weekend;
                o.totalDeductDays = o.absent + o.absentForLate + o.compensation;
                o.totalPayableDays = o.totalDays - o.totalDeductDays;
                if (o.inBonusLateCount > 0 || o.inLate > 0 || o.outLate > 0 || o.totalDeductDays > 0 || o.leave > 0) {
                    o.attendanceBonus = 0;
                }

                o.absentDeduct = (o.employee_type == 'WORKER') ?
                    (
                        (o.totalDeductDays > 2) ?
                        Math.round(o.salary / o.totalDays * o.totalDeductDays) :
                        Math.round(o.basic / o.totalDays * o.totalDeductDays)
                    ) :
                    Math.round(o.salary / o.totalDays * o.totalDeductDays);

                var tmpMFirstDay = (QUERY.date) ? new Date(QUERY.date) : new Date();
                var tmpMLastDay = (QUERY.date) ? new Date(QUERY.date) : new Date();
                var tmpEmpDOJ = (emp.date_of_join) ? new Date(emp.date_of_join) : new Date();
                tmpEmpDOJ.setHours(10);
                tmpMFirstDay.setMonth(tmpMFirstDay.getMonth() - 1);
                tmpMFirstDay.setHours(10);
                tmpMFirstDay.setDate(26);
                tmpMLastDay.setHours(10);
                tmpMLastDay.setDate(25);
                var dayBeforeJoin = parseInt(dayDiff(tmpMFirstDay, tmpEmpDOJ));
                var dBJoin = (dayBeforeJoin > 0) ? dayBeforeJoin : 0;

                if (
                    dBJoin > 0 &&
                    o.employee_type == 'WORKER'
                ) {
                    var abcentDaysBeforeJoin = dBJoin;
                    var abcentDaysAfterJoin = parseInt(o.totalDeductDays) - dBJoin;
                    var absentDeductBeforeJoin = Math.round((o.salary / o.totalDays) * abcentDaysBeforeJoin);
                    var absentDeductAfterJoin = (abcentDaysAfterJoin > 2) ?
                        Math.round(o.salary / o.totalDays * abcentDaysAfterJoin) :
                        Math.round(o.basic / o.totalDays * abcentDaysAfterJoin);
                    o.absentDeduct = absentDeductBeforeJoin + absentDeductAfterJoin;
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

function routerInit(app, dbFull) {
    var db = dbFull.DA_HR

    app.get('/getMonthlySummary', /*isAuthenticated,*/ function(req, res) {
        getMonthlySummary(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getComplianceEmployeeMonthSummary', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.id = 2193;
        QUERY.employee = 2193;
        QUERY.date = new Date('2018-02-02');
        getComplianceEmployeeMonthSummary(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getEmployeeMonthSummary', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.id = 120118313;
        QUERY.employee = 120118313;
        QUERY.status = [1, 2];
        QUERY.date = new Date('2018-02-10');
        getEmployeeMonthSummary(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getEmployeeMonthSummaryB', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.id = 120118313;
        QUERY.employee = 120118313;
        // QUERY.section = 12;
        QUERY.status = [1, 2];
        QUERY.date = new Date('2018-02-10');
        getEmployeeMonthSummaryB(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getEmployeeMonthSummary/:EID', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.id = req.params.EID;
        QUERY.employee = req.params.EID;
        //QUERY.section = 12;
        QUERY.date = new Date('2017-1-01');
        getEmployeeMonthSummary(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });


}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DestroyMonthlySummary', function(data) {
        DestroyMonthlySummary(db, data, function(data) {
            socket.emit("DestroyMonthlySummary", data)
        });
    });

    socket.on('DownloadOverTimeReport', function(QUERY) {
        var d = new Date(QUERY.date);
        var r = 1;
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            overtimeStatementReportHead() +
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
            '<th><small><small>CARD</small></small></th>' +
            '<th><small><small>GR.</small></small></th>' +
            '<th>BASIC</th>' +
            '<th><small><small>HOUR</small></small></th>' +
            '<th><small><small>RATE</small></small></th>' +
            '<th>NET<br />PAYABLE</th>' +
            '<th><big>..SIGNATURE..</big></th>' +
            '</tr>';
        var basic = 0,
            excessOverTime = 0,
            excessOverTimeRate = 0,
            excessOverTimeAmount = 0;
        getEmployeeMonthOvertimeSummary(db, QUERY, function(empData) {
            async.each(empData, function(emp, cb_emp) {
                var payment_method = (emp.payment_method == 1) ? 'CASH' : 'BANK';
                basic += emp.basic;
                excessOverTime += emp.excessOverTime;
                excessOverTimeRate += emp.overTimeRate;
                excessOverTimeAmount += emp.excessOverTimeAmount;
                htmlData += '<tr>' +
                    '<td height="60" align="center">' + r + '</td>' +
                    '<td>' + emp.fp + '</td>' +
                    '<td>' + emp.name + '</td>' +
                    '<td>' + emp.designation + '</td>' +
                    '<td align="center">' + emp.card_no + '</td>' +
                    '<td align="center">' + emp.grade + '</td>' +
                    '<td align="right">' + emp.basic.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.excessOverTime + '</td>' +
                    '<td align="right">' + emp.overTimeRate.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.excessOverTimeAmount.formatMoney(2, '.', ',') + '</td>' +
                    '<td></td>' +
                    '</tr>';
                r++;
                cb_emp();
            }, function(err) {
                htmlData += '<tr>' +
                    '<td colspan="6"><b>TOTAL</b></td>' +
                    '<td align="right"><b>' + basic.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"><b>' + excessOverTime + '</b></td>' +
                    '<td align="right"><b>' + excessOverTimeRate.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"><b>' + excessOverTimeAmount.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td></td>' +
                    '</tr>' +
                    '</table></div></body></html>';
                var options = {
                    format: 'A4',
                    orientation: "portrait",
                    header: {
                        height: "20mm",
                        contents: overTimeStatementHeader(d)
                    },
                    footer: {
                        height: "25mm",
                        contents: footerSContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadOverTimeReport", 'success');
                });
            });
        });
    });

    socket.on('DownloadOverTimeStatementReportB', function(QUERY) {
        var d = new Date(QUERY.date);
        var r = 1;
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            overtimeStatementReportHead() +
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
            '<th><small><small>CARD</small></small></th>' +
            '<th><small><small>GR.</small></small></th>' +
            '<th>BASIC</th>' +
            '<th><small><small>HOUR</small></small></th>' +
            '<th><small><small>RATE</small></small></th>' +
            '<th>NET<br />PAYABLE</th>' +
            '<th>PAY.<br />MODE</th>' +
            '<th><big>..SIGNATURE..</big></th>' +
            '</tr>';
        var basic = 0,
            excessOverTime = 0,
            excessOverTimeRate = 0,
            excessOverTimeAmount = 0;
        getEmployeeMonthSummaryB(db, QUERY, function(empData) {
            async.each(empData, function(emp, cb_emp) {
                var payment_method = (emp.payment_method == 1) ? 'CASH' : 'BANK';
                basic += emp.basic;
                excessOverTime += emp.excessOverTime;
                excessOverTimeRate += emp.overTimeRate;
                excessOverTimeAmount += emp.excessOverTimeAmount;
                htmlData += '<tr>' +
                    '<td height="60" align="center">' + r + '</td>' +
                    '<td>' + emp.fp + '</td>' +
                    '<td>' + emp.name + '</td>' +
                    '<td>' + emp.designation + '</td>' +
                    '<td align="center">' + emp.card_no + '</td>' +
                    '<td align="center">' + emp.grade + '</td>' +
                    '<td align="right">' + emp.basic.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.excessOverTime + '</td>' +
                    '<td align="right">' + emp.overTimeRate.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.excessOverTimeAmount.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="center">' + payment_method + '</td>' +
                    '<td></td>' +
                    '</tr>';
                r++;
                cb_emp();
            }, function(err) {
                htmlData += '<tr>' +
                    '<td colspan="6"><b>TOTAL</b></td>' +
                    '<td align="right"><b>' + basic.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"><b>' + excessOverTime + '</b></td>' +
                    '<td align="right"><b>' + excessOverTimeRate.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"><b>' + excessOverTimeAmount.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td colspan="2"></td>' +
                    '</tr>' +
                    '</table></div></body></html>';
                var options = {
                    format: 'A4',
                    orientation: "portrait",
                    //width: '7120px', 
                    //height: '4320px',
                    header: {
                        height: "20mm",
                        contents: overTimeStatementHeader(d)
                    },
                    footer: {
                        height: "25mm",
                        contents: footerSContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadOverTimeStatementReportB", 'success');
                });
            });
        });
    });

    socket.on('DownloadOverTimeStatementReport', function(QUERY) {
        var d = new Date(QUERY.date);
        var r = 1;
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            overtimeStatementReportHead() +
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
            '<th><small><small>CARD</small></small></th>' +
            '<th><small><small>GR.</small></small></th>' +
            '<th>BASIC</th>' +
            '<th><small><small>HOUR</small></small></th>' +
            '<th><small><small>RATE</small></small></th>' +
            '<th>NET<br />PAYABLE</th>' +
            '<th>PAY.<br />MODE</th>' +
            '<th><big>..SIGNATURE..</big></th>' +
            '</tr>';
        var basic = 0,
            excessOverTime = 0,
            excessOverTimeRate = 0,
            excessOverTimeAmount = 0;
        getEmployeeMonthSummaryV2(db, QUERY, function(empData) {
            async.each(empData, function(emp, cb_emp) {
                var payment_method = (emp.payment_method == 1) ? 'CASH' : 'BANK';
                basic += emp.basic;
                excessOverTime += emp.excessOverTime;
                excessOverTimeRate += emp.overTimeRate;
                excessOverTimeAmount += emp.excessOverTimeAmount;
                htmlData += '<tr>' +
                    '<td height="60" align="center">' + r + '</td>' +
                    '<td>' + emp.fp + '</td>' +
                    '<td>' + emp.name + '</td>' +
                    '<td>' + emp.designation + '</td>' +
                    '<td align="center">' + emp.card_no + '</td>' +
                    '<td align="center">' + emp.grade + '</td>' +
                    '<td align="right">' + emp.basic.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.excessOverTime + '</td>' +
                    '<td align="right">' + emp.overTimeRate.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="right">' + emp.excessOverTimeAmount.formatMoney(2, '.', ',') + '</td>' +
                    '<td align="center">' + payment_method + '</td>' +
                    '<td></td>' +
                    '</tr>';
                r++;
                cb_emp();
            }, function(err) {
                htmlData += '<tr>' +
                    '<td colspan="6"><b>TOTAL</b></td>' +
                    '<td align="right"><b>' + basic.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"><b>' + excessOverTime + '</b></td>' +
                    '<td align="right"><b>' + excessOverTimeRate.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"><b>' + excessOverTimeAmount.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td colspan="2"></td>' +
                    '</tr>' +
                    '</table></div></body></html>';
                var options = {
                    format: 'A4',
                    orientation: "portrait",
                    //width: '7120px', 
                    //height: '4320px',
                    header: {
                        height: "20mm",
                        contents: overTimeStatementHeader(d)
                    },
                    footer: {
                        height: "25mm",
                        contents: footerSContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadOverTimeStatementReport", 'success');
                });
            });
        });
    });

    socket.on('CreateMonthlyReportPDF', function(site_url, vr) {
        var sd = vr.ms
        var sec = vr.sec
        var wp = vr.wp
        var dp = vr.dp
        var ms = new Date(sd);
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
                        list.department_search_list(db, dp, function(depList) {
                            dataValues.holiday = holiday;
                            dataValues.holiday_array = holiday_array;
                            dataValues.adjustment = adjustment;
                            async.each(depList, function(dep, cb_dep) {
                                list.attendance_report2(db, dep.id, dataValues, wp, sec, function(monthlyReport) {
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
                                            '</th>';
                                        htmlData += '</th>' +
                                            '</tr>' +
                                            '</table>' +
                                            '<table style="width:100%">' +
                                            '<tr>' +
                                            '<th>EMP. ID</th>' +
                                            '<th>CARD</th>';
                                        htmlData += (dp) ? ('<th>SECTION</th>') : '';
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
                                            htmlData += (dp) ? ('<td align="left" style="width:100px"><b>' +
                                                ((storeData[j].section) ? storeData[j].section : '') +
                                                '</b></td>') : '';
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
                                    socket.emit("CreateMonthlyReportPDF", 'success');
                                });
                            });
                        })
                    })
                })
            });
        })
    });

    socket.on('CreateMonthlyReportPDFNew', function(site_url, sd) {
        var ms = new Date(sd);
        var dateList = dateListFromMonth(ms);
        var file_name = monthNames[ms.getMonth()] + '_' + ms.getUTCFullYear() + '_Monthly_Report';
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>.' +
            monthlyReportHead();
        list.salary_statement_report(db, ms, function(depList) {
            async.each(depList, function(dep, cb_dep) {
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
                    '<th width="60px">EMP. ID</th>' +
                    '<th width="260px">EMP. NAME</th>';
                htmlData += '<th>P</th>' +
                    '<th>A</th>' +
                    '<th>L</th>' +
                    '<th>W</th>' +
                    '<th>H</th>' +
                    '<th>LA</th>' +
                    '<th>PD</th>' +
                    '<th>AD</th>' +
                    '<th>TD</th>';
                for (var j = 0; j < dateList.length; j++) {
                    htmlData += '<th width="65px"><small><small>' + mthCPNames[ms.getMonth()] + ' <big><big>' + dateList[j] + '</big></big></small></small></th>';
                };
                htmlData += '</tr>';
                async.each(dep.employee, function(emp, cb_emp) {
                    htmlData += '<tr>' +
                        '<td><b>' + addLeadingZero(9, parseInt(emp.fp)) + '</b></td>' +
                        '<td><b>' + emp.name + '</td>' +
                        '<td align="center">' + (emp.oDays - emp.Leave) + '</b></td>' +
                        '<td align="center">' + emp.aOnly + '</td>' +
                        '<td align="center">' + emp.lDays + '</td>' +
                        '<td align="center">' + emp.wDays + '</td>' +
                        '<td align="center">' + emp.hDays + '</td>' +
                        '<td align="center">' + emp.Leave + '</td>' +
                        '<td align="center"><b>' + emp.pDays + '</b></td>' +
                        '<td align="center">' + emp.aDays + '</td>' +
                        '<td align="center">' + emp.tDays + '</td>';
                    for (var j = 0; j < dateList.length; j++) {
                        htmlData += '<td align="center"><b>' + emp.attData['C' + dateList[j]] + '</b></td>';
                    };
                    htmlData += '</tr>';

                    cb_emp();
                }, function(err) {
                    htmlData += '</table></div><br /><br />';
                    cb_dep();
                })
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
                    socket.emit("CreateMonthlyReportPDFNew", 'success');
                });
            });
        });
    });

}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;