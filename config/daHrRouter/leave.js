module.exports = function() {};

function leave_list(db, callback) {
    db.leave.findAll().complete(function(err, data) {
        callback(data);
    })
}

function leave_user_list(db, EID, LTID, callback) {
    var d = new Date();
    var f = d.getUTCFullYear() + '-' + 01 + '-' + 01;
    var t = d.getUTCFullYear() + '-' + 12 + '-' + 31;
    db.leave.findAll({
        include: [{
            model: db.leave_type,
            attributes: ['name']
        }, ],
        where: {
            employee: EID,
            leave_type: LTID,
            date: {
                between: [f, t]
            },
        }
    }).complete(function(err, data) {
        callback(data);
    })
}


function getLeave(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    findData.where = [];
    if (QUERY.employee)
        SEARCH.employee = QUERY.employee;
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
        'id', 'employee', 'leave_type', 'date', 'status'
    ];
    findData.include = [{
        model: db.leave_type,
        attributes: [
            'id', 'name', 'amount'
        ]
    }, ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'date';
    var DIR = (QUERY.dir) ? QUERY.dir : 'DESC';
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.leave.findAll(findData).complete(function(err, lvData) {
        async.each(lvData, function(lv, cb_lv) {
            var d = (lv.date) ? new Date(lv.date) : new Date();
            var Y = d.getFullYear();
            var M = d.getMonth() + 1;
            var D = d.getDate();
            var YMD = Y + '-' + M + '-' + D;
            var o = {};
            o.id = lv.id;
            o.employee = lv.employee;
            o.date = lv.date;
            o.leave_type = lv.leaveTypeTable.name.toUpperCase();
            o.leave = shortNames(lv.leaveTypeTable.name);
            o.d = YMD;
            returnData.push(o)
            cb_lv();
        }, function(err) {
            callback(returnData);
        });
    })
}


function getLeaveList(db, QUERY, callback) {
    var SEARCH = {};
    var findData = {};
    findData.where = [];
    if (QUERY.employee)
        SEARCH.employee = QUERY.employee
    if (QUERY.date) {
        var date = new Date(QUERY.date);
        var SM = date.getMonth() + 1;
        var SY = date.getFullYear();
        findData.where.push(['MONTH(date)=? AND YEAR(date)=?', SM, SY]);
    }
    findData.where.push(SEARCH);
    findData.attributes = [
        'id', 'employee', 'leave_type', 'date', 'status'
    ];
    findData.include = [{
        model: db.employee,
        attributes: [
            'id', 'user', 'grade', 'designation', 'department', 'section',
            'employee_type', 'date_of_join', 'work_time', 'status'
        ],
        include: [{
            model: db.user,
            attributes: [
                'id', 'card_no', 'finger_print_id', 'first_name', 'name_bangla'
            ]
        }, {
            model: db.designation,
            attributes: [
                'id', 'name', 'attendance_bonus'
            ]
        }, {
            model: db.section,
            attributes: [
                'id', 'name'
            ]
        }, ]
    }, {
        model: db.leave_type,
        attributes: [
            'id', 'name', 'amount'
        ]
    }, ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'date';
    var DIR = (QUERY.dir) ? QUERY.dir : 'DESC';
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.leave.findAndCountAll(findData).complete(function(err, lvData) {
        callback(lvData);
    })
}

function CreateEmployeeLeave(db, DATA, callback) {
    var from_date = new Date(DATA.from_date);
    var to_date = new Date(DATA.to_date);
    var bulkArray = [];
    while (from_date <= to_date) {
        var jsData = {};
        jsData.employee = DATA.employee;
        jsData.leave_type = DATA.leave_type;
        jsData.date = new Date(from_date);
        bulkArray.push(jsData)
        from_date.setDate(from_date.getDate() + 1);
    }
    db.leave.bulkCreate(bulkArray).complete(function(err, employee) {
        if (err) {
            callback("error");
            //throw err;
        } else {
            callback("success")
        }
    });
}


function DestroyLeaveDate(db, DATA, callback) {
    db.leave.destroy({
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

    app.get('/leave', /*isAuthenticated,*/ function(req, res) {
        leave_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/leave/:EID/:LTID', /*isAuthenticated,*/ function(req, res) {
        var EID = req.params.EID;
        var LTID = req.params.LTID;
        leave_user_list(db, EID, LTID, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getLeave', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.employee = 4017;
        QUERY.date = new Date('2016-12-01');
        getLeave(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getLeaveList', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        // QUERY.employee = 4017;
        // QUERY.date = new Date('2016-12-01');
        getLeaveList(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });


}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('CreateEmployeeLeave', function(data) {
        CreateEmployeeLeave(db, data, function(data) {
            socket.emit("CreateEmployeeLeave", data)
        });
    });

    socket.on('DestroyLeaveDate', function(data) {
        DestroyLeaveDate(db, data, function(data) {
            socket.emit("DestroyLeaveDate", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;