module.exports = function() {};

function salaryStatementSectionRow(emp, t) {
    var designationName = (t == 2) ? emp.designationBanglaName : emp.designationName;
    var r = (t == 2) ? numEngToBan(emp.r) : emp.r;
    var fp_id = (t == 2) ? numEngToBan(emp.fp_id) : emp.fp_id;
    var card_no = (t == 2) ? numEngToBan(emp.card_no) : emp.card_no;
    var grade = (t == 2) ? numEngToBan(emp.grade) : emp.grade;
    var total_days = (t == 2) ? numEngToBan(emp.total_days) : emp.total_days;
    var present_days = (t == 2) ? numEngToBan(emp.present_days) : emp.present_days;
    var absent_days = (t == 2) ? numEngToBan(emp.absent_days) : emp.absent_days;
    var ot_hour = (t == 2) ? numEngToBan(emp.ot_hour) : emp.ot_hour;
    var basic = (t == 2) ? numEngToBan(emp.basic.formatMoney(2, '.', ',')) : emp.basic.formatMoney(2, '.', ',');
    var house_rent = (t == 2) ? numEngToBan(emp.house_rent.formatMoney(2, '.', ',')) : emp.house_rent.formatMoney(2, '.', ',');
    var medical = (t == 2) ? numEngToBan(emp.medical.formatMoney(2, '.', ',')) : emp.medical.formatMoney(2, '.', ',');
    var conveyance = (t == 2) ? numEngToBan(emp.conveyance.formatMoney(2, '.', ',')) : emp.conveyance.formatMoney(2, '.', ',');
    var food = (t == 2) ? numEngToBan(emp.food.formatMoney(2, '.', ',')) : emp.food.formatMoney(2, '.', ',');
    var salary = (t == 2) ? numEngToBan(emp.salary.formatMoney(2, '.', ',')) : emp.salary.formatMoney(2, '.', ',');
    var absent_deduct = (t == 2) ? numEngToBan(emp.absent_deduct.formatMoney(2, '.', ',')) : emp.absent_deduct.formatMoney(2, '.', ',');
    var lunch_out_deduct = (t == 2) ? numEngToBan(emp.lunch_out_deduct.formatMoney(2, '.', ',')) : emp.lunch_out_deduct.formatMoney(2, '.', ',');
    var advance_deduct = (t == 2) ? numEngToBan(emp.advance_deduct.formatMoney(2, '.', ',')) : emp.advance_deduct.formatMoney(2, '.', ',');
    var stamp_deduct = (t == 2) ? numEngToBan(emp.stamp_deduct.formatMoney(2, '.', ',')) : emp.stamp_deduct.formatMoney(2, '.', ',');
    var others_deduct = (t == 2) ? numEngToBan(emp.others_deduct.formatMoney(2, '.', ',')) : emp.others_deduct.formatMoney(2, '.', ',');
    var medical_deduct = (t == 2) ? numEngToBan(emp.medical_deduct.formatMoney(2, '.', ',')) : emp.medical_deduct.formatMoney(2, '.', ',');
    var ait_deduct = (t == 2) ? numEngToBan(emp.ait_deduct.formatMoney(2, '.', ',')) : emp.ait_deduct.formatMoney(2, '.', ',');
    var total_deduct = (t == 2) ? numEngToBan(emp.total_deduct.formatMoney(2, '.', ',')) : emp.total_deduct.formatMoney(2, '.', ',');
    var attendanceBonus = (t == 2) ? numEngToBan(emp.attendanceBonus.formatMoney(2, '.', ',')) : emp.attendanceBonus.formatMoney(2, '.', ',');
    var ot_rate = (t == 2) ? numEngToBan(emp.ot_rate.formatMoney(2, '.', ',')) : emp.ot_rate.formatMoney(2, '.', ',');
    var ot_taka = (t == 2) ? numEngToBan(emp.ot_taka.formatMoney(2, '.', ',')) : emp.ot_taka.formatMoney(2, '.', ',');
    var net_payable = (t == 2) ? numEngToBan(emp.net_payable.formatMoney(2, '.', ',')) : emp.net_payable.formatMoney(2, '.', ',');
    var date_of_join = (t == 2) ? new Date(emp.date_of_join).formatBanglaDate() : new Date(emp.date_of_join).formatDate();
    var htmlData = '<tr>' +
        '<td height="60" align="center">' + r + '</td>' +
        '<td>' + fp_id + '</td>';
    //   '<td>'+emp.employeeName+'</td>';
    // htmlData+=(QUERY.employee_type==2)?
    //   '<td>'+emp.name+'<br /><br />'+emp.employeeBanglaName+'</td>':
    // '<td>'+emp.name+'</td>';
    htmlData += '<td>' + emp.employeeName + '<br /><br />' + emp.employeeBanglaName + '</td>';
    htmlData += '<td>' + designationName + '</td>' +
        '<td>' + date_of_join + '</td>' +
        '<td align="center">' + card_no + '</td>' +
        '<td align="center">' + grade + '</td>' +
        '<td align="right">' + total_days + '</td>' +
        '<td align="right">' + present_days + '</td>' +
        '<td align="right">' + absent_days + '</td>' +
        '<td align="right">' + basic + '</td>';
    htmlData += (emp.employee_type == 2) ?
        '<td align="right">' + house_rent + '</td>' +
        '<td align="right">' + medical + '</td>' +
        '<td align="right">' + conveyance + '</td>' +
        '<td align="right">' + food + '</td>' :
        '<td align="right">' + house_rent + '</td>' +
        '<td align="right">' + medical + '</td>' +
        '<td align="right">' + conveyance + '</td>';
    htmlData += '<td align="right">' + salary + '</td>';
    htmlData += (emp.employee_type == 2) ?
        '<td align="right">' + absent_deduct + '</td>' +
        '<td align="right">' + lunch_out_deduct + '</td>' +
        '<td align="right">' + advance_deduct + '</td>' +
        '<td align="right">' + stamp_deduct + '</td>' +
        '<td align="right">' + others_deduct + '</td>' :
        '<td align="right">' + absent_deduct + '</td>' +
        '<td align="right">' + advance_deduct + '</td>' +
        '<td align="right">' + medical_deduct + '</td>' +
        '<td align="right">' + stamp_deduct + '</td>' +
        '<td align="right">' + lunch_out_deduct + '</td>' +
        '<td align="right">' + others_deduct + '</td>' +
        '<td align="right">' + ait_deduct + '</td>';
    htmlData += '<td align="right">' + total_deduct + '</td>' +
        '<td align="right">' + attendanceBonus + '</td>';
    htmlData += (emp.employee_type == 2) ?
        '<td align="right">' + ot_hour + '</td>' +
        '<td align="right">' + ot_rate + '</td>' +
        '<td align="right">' + ot_taka + '</td>' :
        '';
    htmlData += '<td align="right">' + net_payable + '</td>' +
        '<td align="center">' + emp.pay_mode + '</td>' +
        '<td></td>';
    htmlData += '</tr>';
    return htmlData;
}

function salaryStatementSectionHeader(o,t)
{
  var SECTION = (t==2)?'সেকশন':'SECTION';
  var secName = (t==2)?o.nameBangla:o.name;
  var FP_ID = (t==2)?'আইডি':'FP ID';
  var EMPLOYEE_NAME = (t==2)?'নাম':'EMPLOYEE NAME';
  var DESIGNATION = (t==2)?'পদবী':'DESIGNATION';
  var JOIN_DATE = (t==2)?'যোগদানের<br />তাং':'.JOIN DATE.';
  var CARD = (t==2)?'কার্ড<br />নং':'CARD';
  var GR = (t==2)?'গ্রেড':'GR.';
  var TD = (t==2)?'মোট<br />দিবস':'T.D.';
  var PD = (t==2)?'উপস্থিত<br />দিবস':'P.D.';
  var AD = (t==2)?'অনুপস্থিত<br />দিবস':'A.D.';
  var BASIC = (t==2)?'মূল<br />মজুরী':'BASIC';
  var ALLOWANCES = (t==2)?'উপার্জন সমূহ':'ALLOWANCES';
  var GROSS_SALARY = (t==2)?'মোট<br />মজুরী':'GROSS<br />SALARY';
  var DEDUCTIONS = (t==2)?'কর্তন<br />সমূহ':'DEDUCTIONS';
  var TOTAL_DEDUCT = (t==2)?'মোট<br />কর্তন':'TOTAL<br />DEDUCT.';
  var ATT_BONUS = (t==2)?'হাজিরা<br />ভাতা':'ATT.<br />BONUS';
  var OVERTIME = (t==2)?'অতিরিক্ত কাজ':'OVERTIME';
  var NET_PAYABLE = (t==2)?'নীট প্রদেও<br />মজুরী':'NET<br />PAYABLE';
  var PAY_MODE = (t==2)?'মোড':'PAY.<br />MODE';
  var SIGNATURE = (t==2)?'স্ট্যাম্প ও সাক্ষর':'..SIGNATURE..';
  var House_Rent = (t==2)?'বাড়ি ভাড়া<br />ভাতা':'House Rent';
  var Medical = (t==2)?'চিকিৎসা<br />ভাতা':'Medical';
  var Medical_Deduct = (t==2)?'চিকিৎসা':'Medical_Deduct';
  var Conveyance = (t==2)?'যাতায়াত<br />ভাতা':'Conveyance';
  var Food = (t==2)?'খাদ্য<br />ভাতা':'Food';
  var Absent = (t==2)?'অনুপস্থিতির<br />জন্য':'Absent';
  var Lunch_Out = (t==2)?'লাঞ্চ<br />আউট':'Lunch<br />Out';
  var Advance = (t==2)?'অগ্রিম':'Advance';
  var Stamp = (t==2)?'স্ট্যাম্প':'Stamp';
  var Others = (t==2)?'অন্যান্য':'Others';
  var AIT = (t==2)?'এ.আই.টি':'AIT';
  var Hour = (t==2)?'ঘণ্টা':'Hour';
  var Rate = (t==2)?'হার':'Rate';
  var Taka = (t==2)?'টাকা':'Taka';
  var htmlData = '<div id="pageBody">'+
      '<b style="line-height:2"><big>'+SECTION+': '+
        secName+
      '</big></b>'+
      '<table style="width:100%;">'+
        '<tr>'+
          '<th rowspan="2">#</th>'+
          '<th rowspan="2">'+FP_ID+'</th>'+
          '<th rowspan="2">'+EMPLOYEE_NAME+'</th>'+
          '<th rowspan="2">'+DESIGNATION+'</th>'+
          '<th rowspan="2" style="white-space:nowrap;">'+JOIN_DATE+'</th>'+
          '<th rowspan="2"><small><small>'+CARD+'</small></small></th>'+
          '<th rowspan="2"><small><small>'+GR+'</small></small></th>'+
          '<th rowspan="2"><small>'+TD+'</small></th>'+
          '<th rowspan="2"><small>'+PD+'</small></th>'+
          '<th rowspan="2"><small>'+AD+'</small></th>'+
          '<th rowspan="2">'+BASIC+'</th>';
  htmlData+=(o.employee_type==2)?
    '<th colspan="4">'+ALLOWANCES+'</th>':
    '<th colspan="3">'+ALLOWANCES+'</th>';
  htmlData+='<th rowspan="2">'+GROSS_SALARY+'</th>';
  htmlData+=(o.employee_type==2)?
    '<th colspan="5">'+DEDUCTIONS+'</th>':
    '<th colspan="7">'+DEDUCTIONS+'</th>';
  htmlData+='<th rowspan="2">'+TOTAL_DEDUCT+'</th>'+
          '<th rowspan="2">'+ATT_BONUS+'</th>';
  htmlData+=(o.employee_type==2)?'<th colspan="3">'+OVERTIME+'</th>':'';
  htmlData+='<th rowspan="2">'+NET_PAYABLE+'</th>'+
    '<th rowspan="2">'+PAY_MODE+'</th>'+
    '<th rowspan="2"><big>'+SIGNATURE+'</big></th>'+
  '</tr>'+
  '<tr>';
  htmlData+=(o.employee_type==2)?
    '<th><small>'+House_Rent+'</small></th>'+
    '<th><small>'+Medical+'</small></th>'+
    '<th><small>'+Conveyance+'</small></th>'+
    '<th><small>'+Food+'</small></th>'+
    '<th><small>'+Absent+'</small></th>'+
    '<th><small>'+Lunch_Out+'</small></th>'+
    '<th><small>'+Advance+'</small></th>'+
    '<th><small>'+Stamp+'</small></th>'+
    '<th><small>'+Others+'</small></th>':
    '<th><small>'+House_Rent+'</small></th>'+
    '<th><small>'+Medical+'</small></th>'+
    '<th><small>'+Conveyance+'</small></th>'+
    '<th><small>'+Absent+'</small></th>'+
    '<th><small>'+Advance+'</small></th>'+
    '<th><small>'+Medical_Deduct+'</small></th>'+
    '<th><small>'+Stamp+'</small></th>'+
    '<th><small>'+Lunch_Out+'</small></th>'+
    '<th><small>'+Others+'</small></th>'+
    '<th><small>'+AIT+'</small></th>';
  htmlData+=(o.employee_type==2)?
    '<th><small>'+Hour+'</small></th><th><small>'+Rate+'</small></th><th><small>'+Taka+'</small></th>':
    '';
  htmlData+='</tr>';
  return htmlData;
}

function getMonthWeekDetails(QUERY, callback) {
    var r = [];
    var a = (QUERY.date) ? new Date(QUERY.date) : new Date();
    a.setDate(1);
    a.setDate(a.getDate() - (a.getDay() + 1));
    for (var i = 1; i <= 5; i++) {
        var o = {};
        o.id = i;
        o.name = 'WEEK ' + i;
        o.dates = [];
        o.days = [];
        for (var j = 0; j <= 6; j++) {
            o.dates.push(a.getFullYear() + '-' + (a.getMonth() + 1) + '-' + a.getDate());
            o.days.push(dayNames[a.getDay()]);
            a.setDate(a.getDate() + 1);
        }
        r.push(o);
    }
    // return r;
    callback(r);
}

function getMonthlyPayment(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    findData.where = {
        payment_type: QUERY.payment_type,
        payment_status: QUERY.status,
    };
    findData.attributes = [
            'id', 'payment_type', 'monthly_attendance', 'salary',
            'deduction', 'paid_amount', 'payment_status', 'user',
            'created_at', 'updated_at'
        ],
        findData.include = [{
            model: db.payment_type,
            attributes: [
                'id', 'name', 'percent', 'created_at', 'updated_at'
            ],
        }, {
            model: db.monthly_attendance,
            where: {
                year: QUERY.year,
                month: QUERY.month,
            },
            attributes: [
                'id', 'employee', 'year', 'month', 'present_days',
                'absent_days', 'overtime', 'excess_overtime', 'in_late',
                'out_late', 'bonus', 'created_at', 'updated_at'
            ],
            include: [{
                model: db.employee,
                where: {
                    section: QUERY.section,
                },
                attributes: [
                    'id', 'user', 'grade', 'designation', 'department',
                    'section', 'employee_type', 'date_of_join', 'work_time',
                    'payment_method', 'status', 'created_at', 'updated_at'
                ],
                include: [{
                    model: db.user,
                    attributes: [
                        'id', 'card_no', 'first_name', 'name_bangla',
                        'created_at', 'updated_at'
                    ]
                }, {
                    model: db.designation,
                    attributes: [
                        'id', 'name', 'attendance_bonus',
                        'name_bangla', 'created_at', 'updated_at'
                    ]
                }, {
                    model: db.section,
                    attributes: [
                        'id', 'name', 'name_bangla',
                        'created_at', 'updated_at'
                    ]
                }, {
                    model: db.employee_type,
                    attributes: [
                        'id', 'name', 'created_at', 'updated_at'
                    ]
                }]
            }]
        }, {
            model: db.deduction,
            attributes: [
                'id', 'employee', 'month', 'advance', 'medical',
                'stamp', 'ait', 'lunch_out', 'others', 'overtime',
                'excess_overtime', 'created_at', 'updated_at'
            ]
        }, {
            model: db.payment_status,
            attributes: [
                'id', 'name', 'created_at', 'updated_at'
            ],
        }, {
            model: db.user,
            attributes: [
                'id', 'first_name', 'name_bangla',
                'created_at', 'updated_at'
            ]
        }];
    db.monthly_payment.findAll(findData).complete(function(err, mtData) {
        async.each(mtData, function(mtp, cb_mtp) {
            var staff = (mtp.monthlyAttendanceTable.employeeTable.employee_type == 1) ? true : false;
            var salary = (mtp.salary > 0) ? true : false;
            var o = {};
            o.id = mtp.id;
            o.year = mtp.monthlyAttendanceTable.year;
            o.month = mtp.monthlyAttendanceTable.month;
            o.payment_type = mtp.payment_type;
            o.monthly_attendance = mtp.monthly_attendance;
            o.salary = mtp.salary;
            o.deduction = mtp.deduction;
            o.paid_amount = mtp.paid_amount;
            o.payment_status = mtp.payment_status;
            o.user = mtp.user;
            o.created_at = mtp.created_at;
            o.updated_at = mtp.updated_at;
            o.paymentTypeTable = mtp.paymentTypeTable;
            o.monthlyAttendanceTable = mtp.monthlyAttendanceTable;
            o.deductionTable = mtp.deductionTable;
            o.paymentStatus = mtp.paymentStatu;
            o.userTable = mtp.userTable;
            o.fp_id = mtp.monthlyAttendanceTable.employee;
            var card = mtp.monthlyAttendanceTable.employeeTable.userTable.card_no;
            o.card_no = (card && card != '') ? card : 0;
            o.grade = mtp.monthlyAttendanceTable.employeeTable.grade;
            o.employee = mtp.monthlyAttendanceTable.employee;
            o.employeeName = mtp.monthlyAttendanceTable.employeeTable.userTable.first_name.toUpperCase();
            var TMPuserTable = JSON.parse(JSON.stringify(mtp.monthlyAttendanceTable.employeeTable.userTable));
            o.employeeBanglaName = TMPuserTable.name_bangla;
            o.designation = mtp.monthlyAttendanceTable.employeeTable.designation;
            o.designationName = mtp.monthlyAttendanceTable.employeeTable.designationTable.name.toUpperCase();
            var TMPdesignationTable = JSON.parse(JSON.stringify(mtp.monthlyAttendanceTable.employeeTable.designationTable));
            o.designationBanglaName = TMPdesignationTable.name_bangla;
            o.section = mtp.monthlyAttendanceTable.employeeTable.section;
            o.sectionName = mtp.monthlyAttendanceTable.employeeTable.sectionTable.name.toUpperCase();
            var TMPsectionTable = JSON.parse(JSON.stringify(mtp.monthlyAttendanceTable.employeeTable.sectionTable));
            o.sectionBanglaName = TMPsectionTable.name_bangla;
            o.attendance_bonus = mtp.monthlyAttendanceTable.employeeTable.designationTable.attendance_bonus;
            o.employee_type = mtp.monthlyAttendanceTable.employeeTable.employee_type;
            o.employeeTypeName = mtp.monthlyAttendanceTable.employeeTable.employeeTypeTable.name.toUpperCase();
            o.date_of_join = (mtp.monthlyAttendanceTable.employeeTable.date_of_join) ? new Date(mtp.monthlyAttendanceTable.employeeTable.date_of_join) : new Date();
            o.dojM = o.date_of_join.getMonth() + 1;
            o.dojY = o.date_of_join.getFullYear();
            o.dojD = o.date_of_join.getDate();
            o.payment_method = mtp.monthlyAttendanceTable.employeeTable.payment_method;
            o.present_days = parseInt(mtp.monthlyAttendanceTable.present_days);
            o.absent_days = parseInt(mtp.monthlyAttendanceTable.absent_days);
            o.total_days = o.present_days + o.absent_days;
            o.basic = (staff) ? Math.round(mtp.salary / 100 * 60) : Math.round((salary) ? (mtp.salary - 1100) / 1.4 : 0);
            o.house_rent = (staff) ? Math.round(mtp.salary / 100 * 30) : Math.round((salary) ? o.basic * 0.4 : 0);
            o.medical = (staff) ? Math.round(mtp.salary / 100 * 5) : Math.round((salary) ? 250 : 0);
            o.conveyance = (staff) ? Math.round(mtp.salary / 100 * 5) : Math.round((salary) ? 200 : 0);
            o.food = (staff) ? 0 : Math.round((salary) ? 650 : 0);
            o.absent_deduct = (staff) ?
                Math.round(o.salary / o.total_days * o.absent_days) :
                (
                    (o.absent_days > 2) ?
                    Math.round(o.salary / o.total_days * o.absent_days) :
                    Math.round(o.basic / o.total_days * o.absent_days)
                );
            if (o.dojY == o.year && o.dojM == o.month && !staff) {
                var absentDaysBeforeJoin = parseInt(o.dojD) - 1;
                var absentDaysAfterJoin = (parseInt(o.absent_days) > absentDaysBeforeJoin) ?
                    parseInt(o.absent_days) - absentDaysBeforeJoin :
                    0;
                var absentDeductBeforeJoin = Math.round((o.salary / o.total_days) * absentDaysBeforeJoin);
                var absentDeductAfterJoin = (absentDaysAfterJoin > 2) ?
                    Math.round(o.salary / o.total_days * absentDaysAfterJoin) :
                    Math.round(o.basic / o.total_days * absentDaysAfterJoin);
                o.absent_deduct = absentDeductBeforeJoin + absentDeductAfterJoin;
            }
            o.advance_deduct = Math.max(0, mtp.deductionTable.advance);
            o.medical_deduct = Math.max(0, mtp.deductionTable.medical);
            o.stamp_deduct = Math.max(0, mtp.deductionTable.stamp);
            o.lunch_out_deduct = Math.max(0, mtp.deductionTable.lunch_out);
            o.others_deduct = Math.max(0, mtp.deductionTable.others);
            o.ait_deduct = Math.max(0, mtp.deductionTable.ait);
            o.total_deduct = Math.max(0, (o.absent_deduct + o.advance_deduct + o.medical_deduct + o.stamp_deduct + o.lunch_out_deduct + o.others_deduct + o.ait_deduct));
            o.overtime_deduct = Math.max(0, mtp.deductionTable.overtime);
            o.excess_overtime_deduct = Math.max(0, mtp.deductionTable.excess_overtime);
            o.overtime = Math.max(0, mtp.monthlyAttendanceTable.overtime);
            o.excess_overtime = Math.max(0, mtp.monthlyAttendanceTable.excess_overtime);
            o.attendanceBonus = (mtp.monthlyAttendanceTable.bonus) ? Math.max(0, o.attendance_bonus) : 0;
            o.ot_hour = Math.max(0, (o.overtime - o.overtime_deduct));
            o.ot_rate = (o.ot_hour > 0) ? Math.round(o.basic / 208 * 2) : 0;
            o.ot_taka = Math.round(o.ot_hour * o.ot_rate);
            o.ex_ot_hour = Math.max(0, (o.excess_overtime - o.excess_overtime_deduct));
            o.ex_ot_rate = (o.ex_ot_hour > 0) ? Math.round(o.basic / 208 * 2) : 0;
            o.ex_ot_taka = Math.round(o.ex_ot_hour * o.ex_ot_rate);
            o.pay_mode = (o.payment_method == 1) ? 'CASH' : 'BANK';
            o.net_payable = (!staff) ?
                Math.round(o.salary - o.total_deduct + o.attendanceBonus) :
                Math.round(o.ot_taka + o.salary - o.total_deduct + o.attendanceBonus);
            o.total_payable = Math.round(o.net_payable + o.ex_ot_taka);
            returnData.push(o);
            cb_mtp();
        }, function(err) {
            callback(returnData);
        });
    })
}



function getSalaryStatementHTMLData(db, QUERY, callback) {
    var pMD = new Date();
    pMD.setMonth(pMD.getMonth() - 1);
    var secSearch = {};
    if (QUERY.section) {
        secSearch.id = QUERY.section;
    }
    var htmlData = salaryStatementHeader();
    getSection(db, secSearch, function(secData) {
        secData.sort(function(a, b) {
            var o1 = a.employee_type;
            var o2 = b.employee_type;

            var p1 = a.name;
            var p2 = b.name;

            if (o1 < o2) return -1;
            if (o1 > o2) return 1;
            if (p1 < p2) return -1;
            if (p1 > p2) return 1;
            return 0;
        });
        async.each(secData, function(sec, cb_sec) {
            var MPSearch = {};
            MPSearch.payment_type = (QUERY.payment_type) ? QUERY.payment_type : 1;
            MPSearch.status = 1;
            MPSearch.year = (QUERY.year) ? QUERY.year : pMD.getFullYear();
            MPSearch.month = (QUERY.month) ? QUERY.month : pMD.getMonth() + 1;
            MPSearch.section = sec.id;
            getMonthlyPayment(db, MPSearch, function(mpData) {
                var r = 1;
                htmlData += salaryStatementSectionHeader(sec, QUERY.download_type);
                async.each(mpData, function(mp, cb_mp) {
                    mp.r = r;
                    htmlData += salaryStatementSectionRow(mp, QUERY.download_type);
                    r++;
                    cb_mp();
                }, function(err) {
                    htmlData += '</table></div>';
                    cb_sec();
                });
            })
        }, function(err) {
            htmlData += '</body></html>';
            callback(htmlData);
        });
    });
}

function DestroyMonthlyPayment(db, DATA, callback) {
    db.monthly_payment.destroy({
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

    app.get('/getMonthlyPayment', /*isAuthenticated,*/ function(req, res) {
        getMonthlyPayment(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getSalaryStatementHTMLData', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        // QUERY.name = req.params.NAME;
        getSalaryStatementHTMLData(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getMonthWeekDetails', /*isAuthenticated,*/ function(req, res) {
        getMonthWeekDetails(req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });


}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DownloadMonthlyPaymentReport', function(QUERY) {
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var m = 150;
        var h = 8.5 * m;
        var w = 14 * m;
        getSalaryStatementHTMLData(db, QUERY, function(htmlData) {
            var options = {
                format: 'Legal',
                header: {
                    height: "20mm",
                    contents: (QUERY.download_type == 2) ? salaryStatementBanglaHeader(d) : salaryStatementHeader(d)
                },
                footer: {
                    height: "20mm",
                    contents: footerSContents()
                },
                width: w + 'px',
                height: h + 'px'
            };
            pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                socket.emit("DownloadMonthlyPaymentReport", res);
            });
        });
    });

    socket.on('DestroyMonthlyPayment', function(data) {
        DestroyMonthlyPayment(db, data, function(data) {
            socket.emit("DestroyMonthlyPayment", data)
        });
    });

    socket.on('CreateMonthlyPayment', function(QUERY) {
        var cBack = true;
        getMonthlySummary(db, QUERY, function(mAttData) {
            async.each(mAttData, function(md, cb_md) {
                var o = {};
                o.payment_type = QUERY.payment_type;
                o.monthly_attendance = md.id;
                o.salary = 0;
                o.deduction = null;
                o.paid_amount = 0;
                o.payment_status = 1;
                o.user = QUERY.user.id;
                var month = md.year + '-' + md.month + '-1';
                var month2 = new Date(md.year + '-' + md.month + '-1');
                month2.setHours(10);

                var SEARCHDEDUCT = {}
                var findDeduct = {};
                findDeduct.where = [];
                SEARCHDEDUCT.employee = md.employee
                var SM = md.month;
                var SY = md.year;
                findDeduct.where.push(['MONTH(month)=? AND YEAR(month)=?', SM, SY]);
                findDeduct.where.push(SEARCHDEDUCT);
                db.deduction.find(findDeduct).complete(function(err, deductData) {
                    if (deductData) {
                        o.deduction = (deductData.id) ? deductData.id : null;
                        var stamp = (md.employeeTable.payment_method == 1) ? 10 : 0;
                        var medical = (md.employeeTable.employee_type == 1) ? 20 : 0;
                        db.deduction.update({
                            stamp: stamp,
                            medical: medical
                        }, {
                            id: o.deduction
                        }).complete(function(err, deductData3) {
                            var SearchSalary = {};
                            SearchSalary.employee = md.employee;
                            SearchSalary.date = month2;
                            getSalaryJson(db, SearchSalary, function(salData) {
                                o.salary = (salData.amount) ? salData.amount : 0;
                                db.monthly_payment.create(o).complete(function(err, mPData) {
                                    if (err)
                                        cBack = false;
                                    cb_md();
                                })
                            });
                        })
                    } else {
                        var deductCreate = {};
                        deductCreate.employee = md.employee;
                        deductCreate.month = month2;
                        deductCreate.stamp = (md.employeeTable.payment_method == 1) ? 10 : 0;
                        deductCreate.medical = (md.employeeTable.employee_type == 1) ? 20 : 0;
                        db.deduction.create(deductCreate).complete(function(err, deductData2) {
                            o.deduction = (deductData2.id) ? deductData2.id : null;
                            var SearchSalary = {};
                            SearchSalary.employee = md.employee;
                            SearchSalary.date = month2;
                            getSalaryJson(db, SearchSalary, function(salData) {
                                o.salary = (salData.amount) ? salData.amount : 0;
                                db.monthly_payment.create(o).complete(function(err, mPData) {
                                    if (err)
                                        cBack = false;
                                    cb_md();
                                })
                            });
                        })
                    }
                });
            }, function(err) {
                socket.emit("CreateMonthlyPayment", cBack);
            });
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;