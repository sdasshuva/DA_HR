module.exports = function() {};

function holiday_list(db, callback) {
    db.holiday.findAll().complete(function(err, data) {
        callback(data);
    })
}

function emp_month_attendance(db, SD, EID, callback) {
    var d = (SD) ? new Date(SD) : new Date();
    d.setDate(1);
    var e = (EID) ? EID.id : 1;
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
    empJson.email = '';
    empJson.fp_id = '';
    empJson.access_level = '';
    empJson.date_of_join = '';
    empJson.department = '';
    empJson.designation = '';
    empJson.absent = 0;
    empJson.present = 0;
    empJson.late = 0;
    empJson.holiday = 0;
    empJson.weekend = 0;
    empJson.inLate = 0;
    empJson.outLate = 0;
    empJson.overTime = 0;
    empJson.attendance = [];
    empJson.dateJson = {};

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
                        empJson.dateJson[tmpdLDT1] = {};
                        empJson.dateJson[tmpdLDT1].punches = [];
                        empJson.dateJson[tmpdLDT1].attendance = (tmpdLDT2.getDay() == 5) ?
                            'W' :
                            ((holiday.indexOf(dLDT) != -1) ?
                                'H' :
                                'A'
                            );
                        if (adjustment.indexOf(dLDT) != -1) {
                            empJson.dateJson[tmpdLDT1].attendance = 'A';
                        }
                        empJson.dateJson[tmpdLDT1].in = {};
                        empJson.dateJson[tmpdLDT1].in.A = 'A';
                        empJson.dateJson[tmpdLDT1].in.T = [];
                        empJson.dateJson[tmpdLDT1].in.H = 24;
                        empJson.dateJson[tmpdLDT1].in.M = 59;
                        empJson.dateJson[tmpdLDT1].in.S = 59;
                        empJson.dateJson[tmpdLDT1].out = {};
                        empJson.dateJson[tmpdLDT1].out.A = 'A';
                        empJson.dateJson[tmpdLDT1].out.T = [];
                        empJson.dateJson[tmpdLDT1].out.H = 24;
                        empJson.dateJson[tmpdLDT1].out.M = 59;
                        empJson.dateJson[tmpdLDT1].out.S = 59;

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
                                empJson.email = (att.employeeTable) ?
                                    ((att.employeeTable.userTable) ?
                                        ((att.employeeTable.userTable.email) ?
                                            att.employeeTable.userTable.email :
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
                                empJson.access_level = (att.employeeTable) ?
                                    ((att.employeeTable.userTable) ?
                                        ((att.employeeTable.userTable.access_level) ?
                                            att.employeeTable.userTable.access_level :
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
                                if (empJson.dateJson[pDT]) {
                                    var tmpD1 = new Date(pDT);
                                    if (empJson.dateJson[pDT].attendance == 'W' || empJson.dateJson[pDT].attendance == 'H') {} else {
                                        empJson.dateJson[pDT].punches.push(pUT);
                                        if (pUTH < 17) {
                                            empJson.dateJson[pDT].in.T.push(pUT);
                                            if (pUTH <= empJson.dateJson[pDT].in.H) {
                                                empJson.dateJson[pDT].in.A = 'L';
                                                if (pUTH == empJson.dateJson[pDT].in.H && pUTM < empJson.dateJson[pDT].in.M) {
                                                    empJson.dateJson[pDT].in.H = pUTH;
                                                    empJson.dateJson[pDT].in.M = pUTM;
                                                    empJson.dateJson[pDT].in.S = pUTS;
                                                } else {
                                                    empJson.dateJson[pDT].in.H = pUTH;
                                                    empJson.dateJson[pDT].in.M = pUTM;
                                                    empJson.dateJson[pDT].in.S = pUTS;
                                                }
                                            }
                                        } else {
                                            empJson.dateJson[pDT].out.T.push(pUT);
                                            if (pUTH <= empJson.dateJson[pDT].out.H) {
                                                empJson.dateJson[pDT].out.A = 'P';
                                                if (pUTH == empJson.dateJson[pDT].out.H && pUTM < empJson.dateJson[pDT].out.M) {
                                                    empJson.dateJson[pDT].out.H = pUTH;
                                                    empJson.dateJson[pDT].out.M = pUTM;
                                                    empJson.dateJson[pDT].out.S = pUTS;
                                                } else {
                                                    empJson.dateJson[pDT].out.H = pUTH;
                                                    empJson.dateJson[pDT].out.M = pUTM;
                                                    empJson.dateJson[pDT].out.S = pUTS;
                                                }
                                            }
                                        }
                                        if (empJson.dateJson[pDT].in.H <= 8) {
                                            if (empJson.dateJson[pDT].in.H == 8) {
                                                if (empJson.dateJson[pDT].in.M < 15) {
                                                    empJson.dateJson[pDT].in.A = 'P';
                                                }
                                            } else {
                                                empJson.dateJson[pDT].in.A = 'P';
                                            }
                                        }
                                        if (empJson.dateJson[pDT].in.A == 'P' && empJson.dateJson[pDT].out.A == 'P') {
                                            empJson.dateJson[pDT].attendance = 'P'
                                        }
                                        if (empJson.dateJson[pDT].in.A == 'L') {
                                            empJson.dateJson[pDT].attendance = 'L'
                                        }
                                        if (empJson.dateJson[pDT].out.A == 'A' && (empJson.dateJson[pDT].in.A == 'P' || empJson.dateJson[pDT].in.A == 'L')) {
                                            empJson.dateJson[pDT].attendance = 'L'
                                        }
                                    }
                                }
                                cb_att();
                            }, function(err) {
                                for (key in empJson.dateJson) {
                                    var inH = (empJson.dateJson[key].in.H < 24) ? addLeadingZero(2, empJson.dateJson[key].in.H) : '00';
                                    var inM = (empJson.dateJson[key].in.H < 24) ? addLeadingZero(2, empJson.dateJson[key].in.M) : '00';
                                    var inS = (empJson.dateJson[key].in.H < 24) ? addLeadingZero(2, empJson.dateJson[key].in.S) : '00';
                                    var outH = (empJson.dateJson[key].out.H < 24) ? addLeadingZero(2, (empJson.dateJson[key].out.H - 12)) : '00';
                                    var outM = (empJson.dateJson[key].out.H < 24) ? addLeadingZero(2, empJson.dateJson[key].out.M) : '00';
                                    var outS = (empJson.dateJson[key].out.H < 24) ? addLeadingZero(2, empJson.dateJson[key].out.S) : '00';
                                    var t1 = {};
                                    t1.date = key;
                                    t1.status = empJson.dateJson[key].attendance;
                                    t1.inStatus = empJson.dateJson[key].in.A;
                                    t1.outStatus = empJson.dateJson[key].out.A;
                                    t1.in_time = inH + ':' + inM + ':' + inS;
                                    t1.in_time += (parseInt(inH) < 12) ? ' AM' : 'PM';
                                    t1.out_time = outH + ':' + outM + ':' + outS + ' PM';
                                    t1.overTime = (parseInt(outH) > 5) ? parseInt(outH) - 5 : 0;
                                    empJson.overTime += t1.overTime;
                                    switch (t1.status) {
                                        case 'A':
                                            empJson.absent++;
                                            t1.in_time = 'ABSENT';
                                            t1.out_time = 'ABSENT';
                                            break;
                                        case 'H':
                                            empJson.holiday++;
                                            t1.in_time = 'HOLIDAY';
                                            t1.out_time = 'HOLIDAY';
                                            break;
                                        case 'W':
                                            empJson.weekend++;
                                            t1.in_time = 'WEEKEND';
                                            t1.out_time = 'WEEKEND';
                                            break;
                                        case 'P':
                                            empJson.present++;
                                            break;
                                        case 'L':
                                            empJson.late++;
                                            if (t1.inStatus == 'L') {
                                                empJson.inLate++;
                                            }
                                            if (t1.outStatus == 'L' || t1.outStatus == 'A') {
                                                empJson.outLate++;
                                            }
                                            break;
                                    }
                                    empJson.attendance.push(t1);
                                }
                                callback([empJson]);
                            });
                        });
                    })

                });
            });
            //////////// Adjustment End /////////
        });
    });
    /////////// Holiday End //////////
}

function getHoliday(db, QUERY, callback) {
    var returnData = [];
    var findData = {};
    var SEARCH = {};
    if (QUERY.date) {
        var f = new Date(QUERY.date);
        f.setDate(20);
        f.setMonth(f.getMonth() - 1);
        var t = new Date(QUERY.date);
        t.setDate(10);
        t.setMonth(t.getMonth() + 1);
        SEARCH.date = {};
        SEARCH.date.between = [f, t];
    }
    findData.where = SEARCH;
    findData.attributes = [
        'id', 'reason', 'date'
    ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'date';
    var DIR = (QUERY.dir) ? QUERY.dir : 'DESC';
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.holiday.findAll(findData).complete(function(err, holiData) {
        async.each(holiData, function(holi, cb_holi) {
            var d = (holi.date) ? new Date(holi.date) : new Date();
            var Y = d.getFullYear();
            var M = d.getMonth() + 1;
            var D = d.getDate();
            var YMD = Y + '-' + M + '-' + D;
            var o = {};
            o.id = holi.id;
            o.reason = holi.reason;
            o.date = holi.date;
            o.d = YMD;
            returnData.push(o)
            cb_holi();
        }, function(err) {
            callback(returnData);
        });
    })
}


function DestroyHoliday(db, DATA, callback) {
    db.holiday.destroy({
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

function CreateHoliday(db, DATA, callback) {
    db.holiday.create({
        reason: DATA.reason,
        type: DATA.type,
        date: DATA.date,
    }).complete(function(err, employee) {
        if (err) {
            callback("error");
            //throw err;
        } else {
            callback("success")
        }
    })
}

function routerInit(app, dbFull) {
    var db = dbFull.DA_HR

    app.get('/emp_month_attendance', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.id = 3002;
        emp_month_attendance(db, '10-1-2016', QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/holiday', /*isAuthenticated,*/ function(req, res) {
        holiday_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getHoliday', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.date = new Date('2016-12-01');
        getHoliday(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DestroyHoliday', function(data) {
        DestroyHoliday(db, data, function(data) {
            socket.emit("DestroyHoliday", data)
        });
    });

    socket.on('CreateHoliday', function(data) {
        CreateHoliday(db, data, function(data) {
            socket.emit("CreateHoliday", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;