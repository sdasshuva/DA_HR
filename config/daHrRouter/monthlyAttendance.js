module.exports = function() {};

function CreateMonthlyAttendance(db, DATA, callback) {
    var success = true;
    async.each(DATA, function(dt, cb_dt) {
        db.monthly_attendance.create(dt).complete(function(err, mt1) {
            if (err) {
                if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
                    db.monthly_attendance.update({
                        present_days: dt.present_days,
                        absent_days: dt.absent_days,
                        overtime: dt.overtime,
                        excess_overtime: dt.excess_overtime,
                        in_late: dt.in_late,
                        out_late: dt.out_late,
                        bonus: dt.bonus,
                    }, {
                        employee: dt.employee,
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

function routerInit(app, dbFull) {
    var db = dbFull.DA_HR
    app.post('/TestCreate', function(req, res) {
        var QUERY = req.body;
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
                    res.setHeader('Content-Type', 'application/json');
                    res.send(data);
                });
            });
        });
    });

}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;