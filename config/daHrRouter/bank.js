module.exports = function() {};

function secDiff(a, b) {
    a = new Date(a);
    b = new Date(b);
    var c = Math.abs(b - a) / 1000; //// IN SECONDS
    return c;
}

function minDiff(a, b) {
    var c = Math.floor(secDiff(a, b) / 60); //// IN MINUTES
}

function dayDiff(a, b) {
    var x = new Date(a);
    var y = new Date(b);
    var d = y.getTime() - x.getTime();
    return Math.ceil(d / (1000 * 3600 * 24)); //// IN Days
}

function getBankAccount(db, QUERY, callback) {
    var SEARCH = {};
    if (QUERY.employee)
        SEARCH.employee = QUERY.employee;
    db.bank_account.findAll({
        where: SEARCH,
        attributes: [
            'id', 'bank', 'branch_code', 'account_type',
            'employee', 'account_no', 'is_active'
        ],
        include: [{
            model: db.bank,
            attributes: [
                'id', 'name'
            ]
        }],
        order: [
            ['employee', 'ASC']
        ]
    }).complete(function(err, d) {
        callback(d);
    })
}

function getSalaryPaymentSecurity(db, QUERY, callback) {
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
                                if (o.sectionName == 'SECURITY') {
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

function overtimeStatementReportHead() {
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
        'font-size: 9px;' +
        'padding: 0px 20px 0px 20px;' +
        'page-break-after: always;' +
        '}' +
        '#pageBody:last-child {' +
        'page-break-after: avoid;' +
        '}' +
        '</style>' +
        '</head>';
    return sSRH;
}

function getEmployeeMonthOvertimeSummary(db, QUERY, callback) {
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
            o.excessOverTime1h = 0;
            o.excessOverTime2h = 0;
            o.excessOverTime2ndh = 0;
            o.holidayOverTime = 0;
            o.excessOverTimeAmount = 0;
            o.excessOverTime1hAmount = 0;
            o.excessOverTime2hAmount = 0;
            o.excessOverTime2ndhAmount = 0;
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
                // o.excessOverTime+=(empStatus=='H'||empStatus=='W')?emp.attendance[YMD].workingHour:emp.attendance[YMD].excessOverTime;
                var TmpExOT = emp.attendance[YMD].excessOverTime;

                if (empStatus == 'W' || empStatus == 'H') {
                    if (QUERY.overtime > 3) {
                        o.excessOverTime += emp.attendance[YMD].workingHour;
                    }
                } else {
                    switch (QUERY.overtime) {
                        case 1:
                            o.excessOverTime += (TmpExOT >= 1) ? 1 : 0;
                            break;
                        case 2:
                            o.excessOverTime += (TmpExOT >= 2) ? 1 : 0;
                            break;
                        case 3:
                            o.excessOverTime += (TmpExOT >= 2) ? 2 : TmpExOT;
                            break;
                        case 4:
                            o.excessOverTime += (TmpExOT > 2) ? TmpExOT - 2 : 0;
                            break;
                        case 5:
                            o.excessOverTime += TmpExOT;
                            break;
                    }
                }
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
                // o.excessOverTime1hAmount=Math.round(o.excessOverTime1h*o.overTimeRate);
                // o.excessOverTime2hAmount=Math.round(o.excessOverTime2h*o.overTimeRate);
                // o.excessOverTime2ndhAmount=Math.round(o.excessOverTime2ndh*o.overTimeRate);
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
                    if (o.excessOverTime > 0) {
                        returnData.push(o);
                    }
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

function overTimeStatementBanglaHeader(ms) {
    var t = new Date(ms);
    t.setDate(25);
    var f = new Date(ms);
    f.setDate(26);
    f.setMonth(t.getMonth() - 1);
    var sSH = '<div style="' +
        'color: #444;' +
        'font-size: 8px;' +
        'position: fixed;' +
        'top: 15;' +
        'right: 15;' +
        '">' +
        '<span>মুদ্রণ সময়: ' +
        getBanglaDateTime(new Date()) +
        '</span>' +
        '</div>' +
        '<br />' +
        '<h1 style="line-height: 0.5;font-size: 80%;">' +
        factoryBanglaName +
        '</h1>' +
        '<h2 style="line-height: 0.5;font-size: 65%;">' +
        'অতিরিক্ত সময় বিবরণী' +
        '</h2>' +
        '<h3 style="line-height: 0.5;font-size: 55%;">' +
        'FOR THE PERIOD OF ' +
        f.formatDate2() + ' TO ' +
        t.formatDate2() +
        '</h3>';
    return sSH;
}

function footerSContents() {
    var fC = '<div style="' +
        'color: #444;' +
        'font-size: 8px;' +
        'position: fixed;' +
        'bottom: 15;' +
        'right: 15;' +
        '">' +
        '<span>PAGE {{page}}</span>' +
        ' OF ' +
        '<span>{{pages}}</span>' +
        '</div>';
    fC += '<br />';
    fC += '<table style="width:100%;border: 0px solid white;';
    fC += (folderName == 'DA_HR') ? 'font-size: 11px;' : '';
    fC += '">';
    fC += '<tr style="border: 0px solid white;">';
    if (folderName == 'DA_HR') {
        fC += '<td style="border: 0px solid white;" align="center">Prepared By</td>';
        // fC+='<td style="border: 0px solid white;" align="left">Compliance</td>';
        // fC+='<td style="border: 0px solid white;" align="center"></td>';
        fC += '<td style="border: 0px solid white;" align="center">HR Admin</td>';
        fC += '<td style="border: 0px solid white;" align="center">DGM</td>';
        // fC+='<td style="border: 0px solid white;" align="center"></td>';
        fC += '<td style="border: 0px solid white;" align="center">E. Director</td>';
        fC += '<td style="border: 0px solid white;" align="center">M. Director</td>';
        fC += '<td style="border: 0px solid white;" align="center"></td>';
    } else {
        fC += '<td style="border: 0px solid white;" align="center"><small>Executive (F&A)</small></td>';
        fC += '<td style="border: 0px solid white;" align="center"><small>DGM (HR)</small></td>';
        fC += '<td style="border: 0px solid white;" align="center"><small>Managing Director</small></td>';
    }
    fC += '</tr>';
    fC += '</table>';
    return fC;
}


function getBankList(db, QUERY, callback) {
    var SEARCH = {};
    if (QUERY.id)
        SEARCH.id = QUERY.id;
    if (QUERY.name)
        SEARCH.name = QUERY.name;
    db.bank.findAll({
        where: SEARCH,
        attributes: [
            'id', 'name'
        ],
        order: [
            ['id', 'ASC']
        ]
    }).complete(function(err, d) {
        callback(d);
    })
}

function getBankAccountNo(db, QUERY, callback) {
    var SEARCH = {};
    if (QUERY.employee)
        SEARCH.employee = QUERY.employee
    SEARCH.is_active = 1;
    var o = {};
    o.branch_code = '000';
    o.account_type = '000';
    o.account_no = '0000000';
    o.account = '000-000-0000000';
    db.bank_account.findAll({
        where: SEARCH,
        attributes: [
            'id', 'branch_code', 'account_type',
            'account_no', 'is_active'
        ],
        order: [
            ['employee', 'ASC']
        ],
        limit: 1
    }).complete(function(err, baData) {
        async.each(baData, function(ba, cb_ba) {
            o.branch_code = addLeadingZero(3, ba.branch_code);
            o.account_type = addLeadingZero(3, ba.account_type);
            o.account_no = addLeadingZero(7, ba.account_no);
            o.account = addLeadingZero(3, ba.branch_code) +
                '-' + addLeadingZero(3, ba.account_type) +
                '-' + addLeadingZero(7, ba.account_no);
            cb_ba();
        }, function(err) {
            callback(o);
        })
    })
}

function getEMPBankAccountList(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    if (QUERY.employee)
        SEARCH.employee = QUERY.employee;
    db.bank_account.findAll({
        where: SEARCH,
        attributes: [
            'id', 'bank', 'branch_code', 'account_type',
            'employee', 'account_no', 'is_active'
        ],
        include: [{
            model: db.bank,
            attributes: [
                'id', 'name'
            ]
        }],
        order: [
            ['employee', 'ASC']
        ],
    }).complete(function(err, baData) {
        async.each(baData, function(ba, cb_ba) {
            var o = {};
            o.id = ba.id;
            o.employee = ba.employee;
            o.branch_code = addLeadingZero(3, ba.branch_code);
            o.account_type = addLeadingZero(3, ba.account_type);
            o.account_no = addLeadingZero(7, ba.account_no);
            o.account = addLeadingZero(3, ba.branch_code) +
                '-' + addLeadingZero(3, ba.account_type) +
                '-' + addLeadingZero(7, ba.account_no);
            o.bank = ba.bank;
            o.bankName = ba.bankTable.name;
            o.bankTable = ba.bankTable;
            o.is_active = ba.is_active;
            returnData.push(o);
            cb_ba();
        }, function(err) {
            callback(returnData);
        })
    })
}

function getBankAccountDetails(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    if (QUERY.employee)
        SEARCH.employee = QUERY.employee;
    var branch_code = '000';
    var account_type = '000';
    var account_no = '0000000';
    var account = '000-000-0000000';
    db.bank_account.findAll({
        where: SEARCH,
        attributes: [
            'id', 'bank', 'branch_code', 'account_type',
            'employee', 'account_no', 'is_active'
        ],
        include: [{
            model: db.bank,
            attributes: [
                'id', 'name'
            ]
        }],
        order: [
            ['employee', 'ASC']
        ]
    }).complete(function(err, baData) {
        async.each(baData, function(ba, cb_ba) {
            var o = {};
            o.id = ba.id;
            o.branch_code = addLeadingZero(3, ba.branch_code);
            o.account_type = addLeadingZero(3, ba.account_type);
            o.account_no = addLeadingZero(7, ba.account_no);
            o.account = addLeadingZero(3, ba.branch_code) +
                '-' + addLeadingZero(3, ba.account_type) +
                '-' + addLeadingZero(7, ba.account_no);
            o.bank = ba.bank;
            o.bankName = ba.bankTable.name;
            o.bankTable = ba.bankTable;
            o.is_active = ba.is_active;
            returnData.push(o);
            cb_ba();
        }, function(err) {
            callback(returnData);
        })
    })
}

function bankStatementReportHead() {
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
        'font-size: 9px;' +
        'padding: 0px 20px 0px 20px;' +
        //'page-break-after: always;'+
        '}' +
        '#pageBody:last-child {' +
        //'page-break-after: avoid;'+
        '}' +
        '</style>' +
        '</head>';
    return sSRH;
}

function numEngToBan(a) {
    var b = a.toString();
    var c = '';
    for (var i = 0, len = b.length; i < len; i++) {
        switch (b[i]) {
            case '0':
                c += '০';
                break;
            case '1':
                c += '১';
                break;
            case '2':
                c += '২';
                break;
            case '3':
                c += '৩';
                break;
            case '4':
                c += '৪';
                break;
            case '5':
                c += '৫';
                break;
            case '6':
                c += '৬';
                break;
            case '7':
                c += '৭';
                break;
            case '8':
                c += '৮';
                break;
            case '9':
                c += '৯';
                break;
            case '.':
                c += '.';
                break;
            case ',':
                c += ',';
                break;
            default:
                c += b[i];
        }
    }
    return c;
}

function CreateUpdateEMPBankAccount(db, DATA, EMP, callback) {
    db.bank_account.create({
        employee: EMP.id,
        bank: DATA.bank,
        branch_code: DATA.branch_code,
        account_type: DATA.account_type,
        account_no: DATA.account_no,
        is_active: DATA.is_active
    }).complete(function(err, r) {
        if (err) {
            callback("error");
            //throw err;
        } else {
            callback("success")
        }
    })
}

function CreateBankAccount(db, DATA, callback) {
    db.bank_account.create({
        bank: DATA.bank,
        employee: DATA.employee,
        branch_code: DATA.branch_code,
        account_type: DATA.account_type,
        account_no: DATA.account_no,
        is_active: DATA.is_active,
    }).complete(function(err, bank_account) {
        if (err) {
            callback("error");
            //throw err;
        } else {
            db.employee.update({
                payment_method: 2
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
                    callback("success")
                }
            })
        }
    })
}

/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////Socket Init And route init //////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function routerInit(app, dbFull) {
    var db = dbFull.DA_HR

    app.get('/getBankAccount', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.employee = 1078;
        //QUERY.date = new Date('2016-09-01');
        getBankAccount(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getBankList', /*isAuthenticated,*/ function(req, res) {
        getBankList(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getBankAccountNo', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.employee = 1078;
        //QUERY.date = new Date('2016-09-01');
        getBankAccountNo(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getEMPBankAccountList/:EID', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.employee = req.params.EID;
        getEMPBankAccountList(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getBankAccountDetails', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.employee = 140817307;
        getBankAccountDetails(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DownloadBankPaymentStatement', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
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
            '<th>FP ID</th>' +
            ((QUERY.employeeType == 'WORKER') ? '<th>CARD</th>' : '') +
            '<th colspan="3">ACCOUNT NUMBER</th>' +
            '<th style="width:12%">AMOUNT IN TAKA</th>' +
            '<th>ACCOUNT NUMBER</th>' +
            '</tr>';
        var i = 0;
        var netPayable = 0;
        var SEARCH = {};
        SEARCH.download = true;
        SEARCH.date = QUERY.date;
        SEARCH.year = QUERY.year;
        SEARCH.month = QUERY.month;
        SEARCH.employee_type = QUERY.employee_type;
        SEARCH.payment_method = 2;
        SEARCH.status = QUERY.status;
        getSalaryPayment(db, SEARCH, function(empData) {
            async.each(empData, function(emp, cb_emp) {
                if (parseInt(QUERY.bank) == parseInt(emp.bankID)) {
                    netPayable += emp.paid_amount;
                    i++;
                    htmlData += '<tr>' +
                        '<td align="center">' + i + '</td>' +
                        '<td>' + emp.name + '</td>' +
                        '<td align="center">' + addLeadingZero(9, emp.id) + '</td>' +
                        ((QUERY.employeeType == 'WORKER') ? '<td align="center">' + addLeadingZero(9, emp.card_no) + '</td>' : '') +
                        '<td align="center">' + emp.branch_code + '</td>' +
                        '<td align="center">' + emp.account_type + '</td>' +
                        '<td align="center">' + emp.account_no + '</td>' +
                        '<td align="right">' + emp.paid_amount.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="center">' + emp.account + '</td>' +
                        '</tr>';
                }
                cb_emp();
            }, function(err) {
                htmlData += '<tr>' +
                    '<td colspan="' + ((QUERY.employeeType == 'WORKER') ? 7 : 6) + '"><b>TOTAL</b></td>' +
                    '<td align="right"><b>' + netPayable.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"></td>' +
                    '</tr>' +
                    '</table></div>' +
                    '</body></html>';
                var pt = new Date();
                var options = {
                    format: 'A4',
                    orientation: "portrait",
                    //width: '7120px', 
                    //height: '4320px',
                    header: {
                        height: "20mm",
                        contents: salaryStatementHeader(d)
                    },
                    footer: {
                        height: "30mm",
                        contents: footerContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadBankPaymentStatement", 'success');
                });
            });
        });
    });


    socket.on('DownloadSecurityBankPaymentStatement', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
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
            '<th>FP ID</th>' +
            ((QUERY.employeeType == 'WORKER') ? '<th>CARD</th>' : '') +
            '<th colspan="3">ACCOUNT NUMBER</th>' +
            '<th style="width:12%">AMOUNT IN TAKA</th>' +
            '<th>ACCOUNT NUMBER</th>' +
            '</tr>';
        var i = 0;
        var netPayable = 0;
        var SEARCH = {};
        SEARCH.download = true;
        SEARCH.date = QUERY.date;
        SEARCH.year = QUERY.year;
        SEARCH.month = QUERY.month;
        SEARCH.employee_type = QUERY.employee_type;
        SEARCH.payment_method = 2;
        SEARCH.status = QUERY.status;
        getSalaryPaymentSecurity(db, SEARCH, function(empData) {
            async.each(empData, function(emp, cb_emp) {
                if (parseInt(QUERY.bank) == parseInt(emp.bankID)) {
                    netPayable += emp.paid_amount;
                    i++;
                    htmlData += '<tr>' +
                        '<td align="center">' + i + '</td>' +
                        '<td>' + emp.name + '</td>' +
                        '<td align="center">' + addLeadingZero(9, emp.id) + '</td>' +
                        ((QUERY.employeeType == 'WORKER') ? '<td align="center">' + addLeadingZero(9, emp.card_no) + '</td>' : '') +
                        '<td align="center">' + emp.branch_code + '</td>' +
                        '<td align="center">' + emp.account_type + '</td>' +
                        '<td align="center">' + emp.account_no + '</td>' +
                        '<td align="right">' + emp.paid_amount.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="center">' + emp.account + '</td>' +
                        '</tr>';
                }
                cb_emp();
            }, function(err) {
                htmlData += '<tr>' +
                    '<td colspan="' + ((QUERY.employeeType == 'WORKER') ? 7 : 6) + '"><b>TOTAL</b></td>' +
                    '<td align="right"><b>' + netPayable.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"></td>' +
                    '</tr>' +
                    '</table></div>' +
                    '</body></html>';
                var pt = new Date();
                var options = {
                    format: 'A4',
                    orientation: "portrait",
                    //width: '7120px', 
                    //height: '4320px',
                    header: {
                        height: "20mm",
                        contents: salaryStatementHeader(d)
                    },
                    footer: {
                        height: "30mm",
                        contents: footerContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadSecurityBankPaymentStatement", 'success');
                });
            });
        });
    });

    socket.on('DownloadSalaryBankStatement', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
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
            '<th>FP ID</th>' +
            ((QUERY.employeeType == 'WORKER') ? '<th>CARD</th>' : '') +
            '<th colspan="3">ACCOUNT NUMBER</th>' +
            '<th style="width:12%">AMOUNT IN TAKA</th>' +
            '<th>ACCOUNT NUMBER</th>' +
            '</tr>';
        var i = 0;
        var netPayable = 0;
        getEmployeeMonthSummary(db, QUERY, function(empData) {
            async.each(empData, function(emp, cb_emp) {
                if (emp.payment_method == 2) {
                    netPayable += emp.netPayable;
                    i++;
                    htmlData += '<tr>' +
                        '<td align="center">' + i + '</td>' +
                        '<td>' + emp.name + '</td>' +
                        '<td align="center">' + emp.fp + '</td>' +
                        ((QUERY.employeeType == 'WORKER') ? '<td align="center">' + emp.card_no + '</td>' : '') +
                        '<td align="center">' + emp.branch_code + '</td>' +
                        '<td align="center">' + emp.account_type + '</td>' +
                        '<td align="center">' + emp.account_no + '</td>' +
                        '<td align="right">' + emp.netPayable.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="center">' + emp.account + '</td>' +
                        '</tr>';
                }
                cb_emp();
            }, function(err) {
                htmlData += '<tr>' +
                    '<td colspan="' + ((QUERY.employeeType == 'WORKER') ? 7 : 6) + '"><b>TOTAL</b></td>' +
                    '<td align="right"><b>' + netPayable.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"></td>' +
                    '</tr>' +
                    '</table></div>' +
                    '</body></html>';
                var pt = new Date();
                var options = {
                    format: 'A4',
                    orientation: "portrait",
                    //width: '7120px', 
                    //height: '4320px',
                    header: {
                        height: "20mm",
                        contents: salaryStatementHeader(d)
                    },
                    footer: {
                        height: "30mm",
                        contents: footerContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadSalaryBankStatement", 'success');
                });
            });
        });
    });

    socket.on('DownloadBonusBankStatement', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var GPayable = 0;
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            bankStatementReportHead() +
            '<div id="pageBody">' +
            '<table style="width:100%">' +
            '<tr>' +
            '<th>#</th>' +
            '<th>EMPLOYEE NAME</th>' +
            '<th colspan="3">ACCOUNT NUMBER</th>' +
            '<th style="width:12%">AMOUNT IN TAKA</th>' +
            '<th>ACCOUNT NUMBER</th>' +
            '</tr>';
        var i = 0;
        var netPayable = 0;
        QUERY.payment_method = 2;
        getEmployeeDetails(db, QUERY, function(empData) {
            async.each(empData, function(emp, cb_emp) {
                var empDOJ = new Date(emp.date_of_join);
                var tmpSD = new Date(QUERY.date);
                tmpSD.setDate(1);
                tmpSD.setMonth(tmpSD.getMonth() + 1);
                tmpSD.setFullYear(tmpSD.getFullYear() - 1);
                if (empDOJ <= tmpSD) {
                    var stamp = (emp.employeeTypeName != "STAFF" && parseInt(emp.salary) > 0) ? 10 : 0;
                    var payAmount = (QUERY.bonus_type == 'BASIC') ? Math.round(emp.basic) - stamp : Math.round(emp.salary / 2) - stamp;
                    netPayable += payAmount;
                    i++;
                    htmlData += '<tr>' +
                        '<td align="center">' + i + '</td>' +
                        '<td>' + emp.name + '</td>' +
                        '<td align="center">' + emp.branch_code + '</td>' +
                        '<td align="center">' + emp.account_type + '</td>' +
                        '<td align="center">' + emp.account_no + '</td>' +
                        '<td align="right">' + payAmount.formatMoney(2, '.', ',') + '</td>' +
                        '<td align="center">' + emp.account + '</td>' +
                        '</tr>';
                }
                cb_emp();
            }, function(err) {
                htmlData += '<tr>' +
                    '<td colspan="5"><b>TOTAL</b></td>' +
                    '<td align="right"><b>' + netPayable.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"></td>' +
                    '</tr>' +
                    '</table></div>' +
                    '</body></html>';
                var pt = new Date();
                var options = {
                    format: 'A4',
                    orientation: "portrait",
                    header: {
                        height: "20mm",
                        contents: bonusStatementHeader(d, QUERY.festive_type)
                    },
                    footer: {
                        height: "30mm",
                        contents: footerContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadBonusBankStatement", 'success');
                });
            });
        });
    });

    socket.on('PrintBanglaIDCardFront', function(empData, siteURL) {
        var fileName = 'IDCardFront.pdf';
        var cardBackGround = siteURL + 'uploads/images/id_card_bg_bangla.jpg';
        var IDName = 'নাম ';
        var IDCard = 'কার্ড নং';
        var IDDesignation = 'পদবি ';
        var IDWorkerType = 'কাজের ধরন';
        var IDSection = 'সেকশন ';
        var IDBloodGroup = 'রক্তের গ্রুপ ';
        var IDDOJ = 'যোগদানের তারিখ ';
        var IDCardIssue = 'ইস্যু তারিখ ';
        var IDCardExpire = 'মেয়াদ ';
        var IDContactNo = 'ফোন নং ';
        var IDAddress = 'স্থায়ী ঠিকানা ';
        var default_photo = "http://sparky.ff-ltd.com/id_maker/photo/default_photo.png";
        var default_signature = "http://sparky.ff-ltd.com/id_maker/signature/signature.png";
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
            'font-size: 60%;' +
            '}' +
            '.tdZero {' +
            'padding-top:0px;' +
            'padding-bottom:0px;' +
            '}' +
            '.container {' +
            'width: 100%;' +
            'overflow: auto;' +
            // 'background: #eee;'+
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

        var i = 0;
        async.each(empData, function(emp, cb_emp) {
            var fp_id = numEngToBan(addLeadingZero(9, parseInt(emp.id)));
            var card = numEngToBan(parseInt(emp.card_no));
            // var photo = default_photo;
            var photo = siteURL + "uploads/images/id_card/photos/" + factoryShort + "-" + parseInt(emp.id) + ".jpg";

            var userTable = JSON.parse(JSON.stringify(emp.userTable, null, 4));
            var name = (userTable) ? userTable.name_bangla : "N/A";

            var designationTable = JSON.parse(JSON.stringify(emp.designationTable, null, 4));
            var designation = (designationTable) ? designationTable.name_bangla : "N/A";

            var sectionTable = JSON.parse(JSON.stringify(emp.sectionTable, null, 4));
            var section = (sectionTable) ? sectionTable.name_bangla : "";

            var bloodGroupTable = JSON.parse(JSON.stringify(emp.bloodGroupTable, null, 4));
            var blood_group = (bloodGroupTable) ? bloodGroupTable.name_bangla : "N/A";

            var doj = (emp.date_of_join) ? new Date(emp.date_of_join).dateToBangla() : new Date().dateToBangla();

            var card_issue = (emp.card_issue) ? new Date(emp.card_issue).dateToBangla() : new Date().dateToBangla();
            var CE = (emp.card_issue) ? new Date(emp.card_issue) : new Date();

            CE.setFullYear(CE.getFullYear() + 2);
            var card_expire = (emp.card_expire) ? new Date(emp.card_expire).dateToBangla() : CE.dateToBangla();

            var contact_no = (emp.contact_no) ? numEngToBan(emp.contact_no) : 'N/A';

            var address = (emp.address_bangla) ? emp.address_bangla : 'N/A';

            // var signature = default_signature;
            var signature = siteURL + "uploads/images/id_card/signature/" + factoryShort + "-" + parseInt(emp.id) + ".jpg";

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
                '<img class="photo" src="' + photo + '" width="70" height="90" border="1">' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="2" class="tdZero"> ' + IDName + ': <big><b>' + name + '</b></big></td>' +
                '</tr>' +
                '<tr>' +
                '<td width="30%" class="tdZero"> ' + IDCard + ' </td>' +
                '<td class="tdZero">: <small>' + card + '</small></td>' +
                '</tr>' +
                '<tr>' +
                '<td width="30%" class="tdZero"> ' + IDDesignation + ' </td>' +
                '<td class="tdZero">: <small>' + designation + '</small></td>' +
                '</tr>' +
                '<tr>' +
                '<td width="30%" class="tdZero"> ' + IDWorkerType + ' </td>' +
                '<td class="tdZero">: <small>স্থায়ী</small></td>' +
                '</tr>' +
                '<tr>' +
                '<td class="tdZero"> ' + IDSection + ' </td>' +
                '<td class="tdZero">: <small>' + section + '</small></td>' +
                '</tr>' +
                // '<tr>'+
                //   '<td class="tdZero"> '+IDBloodGroup+' </td>'+
                //   '<td class="tdZero">: '+blood_group+'</td>'+
                // '</tr>'+
                '<tr>' +
                '<td class="tdZero"> <small>' + IDDOJ + ' </small></td>' +
                '<td class="tdZero">: ' + doj + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td class="tdZero"> ' + IDCardIssue + ' </td>' +
                '<td class="tdZero">: ' + card_issue + '</td>' +
                '</tr>' +
                // '<tr>'+
                //   '<td class="tdZero"> '+IDCardExpire+' </td>'+
                //   '<td class="tdZero">: '+card_expire+'</td>'+
                // '</tr>'+
                // '<tr>'+
                //   '<td class="tdZero"> '+IDContactNo+' </td>'+
                //   '<td class="tdZero">: '+contact_no+'</td>'+
                // '</tr>'+
                // '<tr>'+
                //   '<td class="tdZero"> '+IDAddress+' </td>'+
                //   '<td class="tdZero">: <small>'+address+'</small></td>'+
                // '</tr>'+
                '<tr>' +
                '<td colspan="2" width="100%" align="left">' +
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
                var fileURL = siteURL + 'uploads/pdf/' + fileName
                    // res.redirect('http://localhost:8000/uploads/pdf/myTest.pdf');

                socket.emit("PrintBanglaIDCardFront", fileURL);
            });

        });
    });

    socket.on('PrintBanglaIDCardBack', function(empData, siteURL) {
        var fileName = 'IDCardBack.pdf';
        var cardBackGround = siteURL + 'uploads/images/id_card_bg_bangla.jpg';
        var IDName = 'নাম ';
        var IDDesignation = 'পদবি ';
        var IDSection = 'সেকশন ';
        var IDBloodGroup = 'রক্তের গ্রুপ ';
        var IDDOJ = 'যোগদানের তারিখ ';
        var IDCardIssue = 'ইস্যু তারিখ ';
        var IDCardExpire = 'মেয়াদ ';
        var IDContactNo = 'ফোন নং ';
        var IDAddress = 'স্থায়ী ঠিকানা ';
        var IDEmgNo = 'জরুরী ফোন নং:';
        var IDNationalID = 'জাতীয় পরিচয়পত্র নং:';
        var default_photo = "http://sparky.ff-ltd.com/id_maker/photo/default_photo.png";
        var default_signature = "http://sparky.ff-ltd.com/id_maker/signature/signature.png";
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
            'font-size: 60%;' +
            '}' +
            '.tdZero {' +
            'padding-top:0px;' +
            'padding-bottom:0px;' +
            '}' +
            '.container {' +
            'width: 100%;' +
            'overflow: auto;' +
            // 'background: #eee;'+
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
            // 'background: url("'+cardBackGround+'") no-repeat center center;'+
            'border-style: dotted;' +
            'border-width: 2px;' +
            // 'word-wrap: break-word'+
            // 'overflow: auto;'+
            'width: ' + (cardWidth * 35) + 'px; height: ' + (cardHeight * 35) + 'px;' +
            'margin-bottom: 20px;' +
            'margin-left: 20px;' +
            '}' +
            '.cubeWithPB {' +
            'page-break-before:always;' +
            'background: url("' + cardBackGround + '") no-repeat center center;' +
            'border-style: dotted;' +
            'border-width: 2px;' +
            // 'word-wrap: break-word'+
            // 'overflow: auto;'+
            'width: ' + (cardWidth * 35) + 'px; height: ' + (cardHeight * 35) + 'px;' +
            'margin-bottom: 20px;' +
            'margin-left: 20px;' +
            '}' +
            '</style>' +
            '</head>' +
            '<body>' +
            '<table class="container">';

        var i = 0;
        async.each(empData, function(emp, cb_emp) {
            var fp_id = numEngToBan(addLeadingZero(9, parseInt(emp.id)));
            var photo = default_photo;

            var userTable = JSON.parse(JSON.stringify(emp.userTable, null, 4));
            var name = (userTable) ? userTable.name_bangla : "N/A";

            var designationTable = JSON.parse(JSON.stringify(emp.designationTable, null, 4));
            var designation = (designationTable) ? designationTable.name_bangla : "N/A";

            var sectionTable = JSON.parse(JSON.stringify(emp.sectionTable, null, 4));
            var section = (sectionTable) ? sectionTable.name_bangla : "";

            var bloodGroupTable = JSON.parse(JSON.stringify(emp.bloodGroupTable, null, 4));
            var blood_group = (bloodGroupTable) ? bloodGroupTable.name_bangla : "N/A";

            var doj = (emp.date_of_join) ? new Date(emp.date_of_join).dateToBangla() : new Date().dateToBangla();

            var card_issue = (emp.card_issue) ? new Date(emp.card_issue).dateToBangla() : new Date().dateToBangla();
            var CE = (emp.card_issue) ? new Date(emp.card_issue) : new Date();

            CE.setFullYear(CE.getFullYear() + 2);
            var card_expire = (emp.card_expire) ? new Date(emp.card_expire).dateToBangla() : CE.dateToBangla();

            var contact_no = (emp.contact_no) ? numEngToBan(emp.contact_no) : 'N/A';
            var national_id = (emp.national_id) ? numEngToBan(emp.national_id) : 'N/A';

            var address = (emp.address_bangla) ? emp.address_bangla : 'N/A';

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
                '<td colspan="2" width="100%" height="20" align="center"> </td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="2" width="90%" align="center" class="tdZero" style="padding-right:26px;font-size: 90%;"> <span>উক্ত পরিচয়পত্র হারানো গেলে<br />তাৎক্ষনিক ব্যবস্থাপনা<br />কর্তৃপক্ষকে জানাতে হবে</span></td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="2" width="100%" height="10" align="center"> </td>' +
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
                '<td class="tdZero"> ' + IDBloodGroup + ' </td>' +
                '<td class="tdZero">: ' + blood_group + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td class="tdZero"> ' + IDAddress + ' </td>' +
                '<td class="tdZero">: <small>' + address + '</small></td>' +
                '</tr>' +
                '<tr>' +
                '<td class="tdZero" style="font-size: 90%;"> ' + IDEmgNo + ' </td>' +
                '<td class="tdZero">: <small>' + contact_no + '</small></td>' +
                '</tr>' +
                '<tr>' +
                '<td class="tdZero" style="font-size: 80%;"> ' + IDNationalID + ' </td>' +
                '<td class="tdZero">: <small>' + national_id + '</small></td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="2" width="100%" height="30" align="center"> </td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="2" width="90%" align="center" class="tdZero" style="padding-right:0px;"> <span>_______________________________</span></td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="2" width="90%" align="center" class="tdZero" style="padding-right:26px;font-size: 90%;"> <span>১৪৯ শাহ কবির মাজার রোড,<br />আজমপুর, উত্তরা, ঢাকা-১২৩০</span></td>' +
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
                var fileURL = siteURL + 'uploads/pdf/' + fileName
                    // res.redirect('http://localhost:8000/uploads/pdf/myTest.pdf');

                socket.emit("PrintBanglaIDCardBack", fileURL);
            });

        });
    });

    socket.on('DownloadBanglaOverTimeReport', function(QUERY) {
        var d = new Date(QUERY.date);
        var r = 1;
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            overtimeStatementReportHead() +
            '<div id="pageBody">' +
            '<b style="line-height:2"><big>সেকশন: ' +
            QUERY.sectionBanglaName +
            '</big></b>' +
            '<table style="width:100%;">' +
            '<tr>' +
            '<th>#</th>' +
            '<th>আইডি /<br />কার্ড</th>' +
            '<th>নাম</th>' +
            '<th>পদবী</th>' +
            // '<th><small><small>কার্ড</small></small></th>'+
            '<th><small><small>গ্রেড</small></small></th>' +
            '<th>মূল<br />মজুরী</th>' +
            '<th><small><small>ঘণ্টা</small></small></th>' +
            '<th><small><small>হার</small></small></th>' +
            '<th>নীট প্রদেও<br />মজুরী</th>' +
            '<th><big>.....সাক্ষর.....</big></th>' +
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
                    '<td height="60" align="center">' + numEngToBan(r) + '</td>' +
                    '<td>' + numEngToBan(emp.fp) + ' /<br />' + numEngToBan(emp.card_no) + '</td>' +
                    '<td>' + emp.name_bangla + '</td>' +
                    '<td>' + emp.designationBanglaName + '</td>' +
                    // '<td align="center">'+numEngToBan(emp.card_no)+'</td>'+
                    '<td align="center">' + numEngToBan(emp.grade) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.basic.formatMoney(2, '.', ',')) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.excessOverTime) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.overTimeRate.formatMoney(2, '.', ',')) + '</td>' +
                    '<td align="right">' + numEngToBan(emp.excessOverTimeAmount.formatMoney(2, '.', ',')) + '</td>' +
                    '<td></td>' +
                    '</tr>';
                r++;
                cb_emp();
            }, function(err) {
                htmlData += '<tr>' +
                    '<td colspan="6"><b>TOTAL</b></td>' +
                    '<td align="right"><b>' + numEngToBan(basic.formatMoney(2, '.', ',')) + '</b></td>' +
                    '<td align="right"><b>' + numEngToBan(excessOverTime) + '</b></td>' +
                    '<td align="right"><b>' + numEngToBan(excessOverTimeRate.formatMoney(2, '.', ',')) + '</b></td>' +
                    '<td align="right"><b>' + numEngToBan(excessOverTimeAmount.formatMoney(2, '.', ',')) + '</b></td>' +
                    '<td></td>' +
                    '</tr>' +
                    '</table></div></body></html>';
                var options = {
                    format: 'A4',
                    orientation: "portrait",
                    header: {
                        height: "20mm",
                        contents: overTimeStatementBanglaHeader(d)
                    },
                    footer: {
                        height: "25mm",
                        contents: footerSContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadBanglaOverTimeReport", 'success');
                });
            });
        });
    });

    socket.on('CreateUpdateEMPBankAccount', function(data, emp) {
        CreateUpdateEMPBankAccount(db, data, emp, function(data1) {
            var UpdateData = {};
            UpdateData.employee = emp.id;
            UpdateData.bank = data.bank;
            ActivateEMPBankAccount(db, UpdateData, function(data2) {
                socket.emit("CreateUpdateEMPBankAccount", data2)
            });
        });
    });

    socket.on('CreateBankAccount', function(data) {
        CreateBankAccount(db, data, function(data) {
            socket.emit("CreateBankAccount", data)
        });
    });

}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;