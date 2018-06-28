module.exports = function() {};

function deduction_details(db, EID, callback) {
    db.deduction.findAll({
        where: {
            employee: EID
        },
        attributes: [
            'id', 'employee', 'month', 'advance', 'medical', 'stamp', 'ait', 'lunch_out', 'others', 'overtime', 'excess_overtime'
        ],
        include: [{
            model: db.employee,
            attributes: ['user'],
            include: [{
                model: db.user,
                attributes: ['first_name']
            }],
        }],
        order: [
            ['month', 'ASC']
        ]
    }).complete(function(err, deductList) {
        callback(deductList);
    })
}

function UpdateDeductionExcessOvertime(db,DATA, callback)
{
    db.deduction.update(
        { excess_overtime: DATA.excess_overtime },
        {
            id: DATA.id
        }
    ).complete(function (err, break_down) {
        if (err) {
            if(err[0].code == "ER_ROW_IS_REFERENCED_" ){
                callback("referenced");
            }else{
                callback("error");
            }
        }else{
            callback("success")
        }
    })
}

function getDeduction(db, QUERY, callback) {
    var SEARCH = {};
    var findData = {};
    findData.where = [];
    if (QUERY.employee)
        SEARCH.employee = QUERY.employee
    if (QUERY.month) {
        var date = new Date(QUERY.month);
        var SM = date.getMonth() + 1;
        var SY = date.getFullYear();
        findData.where.push(['MONTH(month)=? AND YEAR(month)=?', SM, SY]);
    }
    findData.where.push(SEARCH);
    findData.attributes = [
        'id', 'employee', 'month', 'advance',
        'medical', 'stamp', 'ait', 'lunch_out', 'others',
        'overtime', 'excess_overtime'
    ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'month';
    var DIR = (QUERY.dir) ? QUERY.dir : 'DESC';
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.deduction.findAll(findData).complete(function(err, d) {
        callback(d);
    })
}

function getDeductionJson(db, QUERY, callback) {
    var SEARCH = {};
    var findData = {};
    findData.where = [];
    if (QUERY.employee)
        SEARCH.employee = QUERY.employee
    if (QUERY.date) {
        var date = new Date(QUERY.date);
        var SM = date.getMonth() + 1;
        var SY = date.getFullYear();
        findData.where.push(['MONTH(month)=? AND YEAR(month)=?', SM, SY]);
    }
    findData.where.push(SEARCH);
    findData.attributes = [
        'id', 'employee', 'month', 'advance',
        'medical', 'stamp', 'ait', 'lunch_out', 'others',
        'overtime', 'excess_overtime'
    ];
    var o = {};
    o.advanceDeduct = 0;
    o.medicalDeduct = 0;
    o.stampDeduct = 0;
    o.aitDeduct = 0;
    o.lunchOutDeduct = 0;
    o.othersDeduct = 0;
    o.overtimeDeduct = 0;
    o.excessOvertimeDeduct = 0;
    db.deduction.findAll(findData).complete(function(err, deductData) {
        async.each(deductData, function(deduct, cb_deduct) {
            o.employee = deduct.employee;
            o.advanceDeduct = deduct.advance;
            o.medicalDeduct = deduct.medical;
            o.stampDeduct = deduct.stamp;
            o.aitDeduct = deduct.ait;
            o.lunchOutDeduct = deduct.lunch_out;
            o.othersDeduct = deduct.others;
            o.overtimeDeduct = deduct.overtime;
            o.excessOvertimeDeduct = deduct.excess_overtime;
            cb_deduct();
        }, function(err) {
            callback(o);
        })
    })
}

function UpdateDeductionAdvance(db, DATA, callback) {
    db.deduction.update({
        advance: DATA.advance
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
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

function UpdateDeductionMedical(db, DATA, callback) {
    db.deduction.update({
        medical: DATA.medical
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
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

function UpdateDeductionStamp(db, DATA, callback) {
    db.deduction.update({
        stamp: DATA.stamp
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
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

function UpdateDeductionAit(db, DATA, callback) {
    db.deduction.update({
        ait: DATA.ait
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
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

function UpdateDeductionLunchOut(db, DATA, callback) {
    db.deduction.update({
        lunch_out: DATA.lunch_out
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
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

function UpdateDeductionOthers(db, DATA, callback) {
    db.deduction.update({
        others: DATA.others
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
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

function UpdateDeductionOvertime(db, DATA, callback) {
    db.deduction.update({
        overtime: DATA.overtime
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
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

/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////Socket Init And route init //////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function routerInit(app, dbFull) {
    var db = dbFull.DA_HR

    app.get('/deduction_details/:EID', /*isAuthenticated,*/ function(req, res) {
        var EID = req.params.EID;
        deduction_details(db, EID, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getDeduction', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.employee = 11;
        QUERY.month = new Date();
        getDeduction(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getDeductionJson', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.employee = 1078;
        QUERY.month = new Date();
        getDeductionJson(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('UpdateDeductionAdvance', function(data) {
        UpdateDeductionAdvance(db, data, function(data) {
            socket.emit("UpdateDeductionAdvance", data)
        });
    });

    socket.on('UpdateDeductionMedical', function(data) {
        UpdateDeductionMedical(db, data, function(data) {
            socket.emit("UpdateDeductionMedical", data)
        });
    });

    socket.on('UpdateDeductionStamp', function(data) {
        UpdateDeductionStamp(db, data, function(data) {
            socket.emit("UpdateDeductionStamp", data)
        });
    });

    socket.on('UpdateDeductionAit', function(data) {
        UpdateDeductionAit(db, data, function(data) {
            socket.emit("UpdateDeductionAit", data)
        });
    });

    socket.on('UpdateDeductionLunchOut', function(data) {
        UpdateDeductionLunchOut(db, data, function(data) {
            socket.emit("UpdateDeductionLunchOut", data)
        });
    });

    socket.on('UpdateDeductionOthers', function(data) {
        UpdateDeductionOthers(db, data, function(data) {
            socket.emit("UpdateDeductionOthers", data)
        });
    });

    socket.on('UpdateDeductionOvertime', function(data) {
        UpdateDeductionOvertime(db, data, function(data) {
            socket.emit("UpdateDeductionOvertime", data)
        });
    });

    socket.on('UpdateDeductionExcessOvertime', function(data) {
        UpdateDeductionExcessOvertime(db, data, function(data) {
            socket.emit("UpdateDeductionExcessOvertime", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;