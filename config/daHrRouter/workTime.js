module.exports = function() {};

function getWorkTime(db, QUERY, callback) {
    var SEARCH = {};
    if (QUERY.id)
        SEARCH.id = QUERY.id
    if (QUERY.name)
        SEARCH.name = QUERY.name
    db.work_time.findAll({
        attributes: [
            'id', 'name', 'in_time', 'out_time', 'in_hour',
            'in_minute', 'in_late_allowed_minute',
            'in_bonus_late_allowed_minute', 'out_hour', 'out_minute',
            'out_late_allowed_minute', 'out_bonus_late_allowed_minute',
            'created_at', 'updated_at'
        ],
        order: [
            ['id', 'ASC']
        ]
    }).complete(function(err, d) {
        callback(d);
    })
}

function work_time_list(db, callback) {
    var returnData = [];
    db.work_time.findAll({
        attributes: ['id', 'in_time', 'out_time'],
        order: [
            ['id', 'ASC']
        ],
    }).complete(function(err, wts) {
        async.each(wts, function(wt, cb_wt) {
            var o = {};
            o.id = wt.id;
            // o.name = wt.in_time+' AM - '+wt.out_time+' PM';
            o.name = wt.in_time + '-' + wt.out_time;
            returnData.push(o);
            cb_wt();
        }, function(err) {
            if (err) {
                throw err;
            }
            callback(returnData);
        });
    })
}

function DestroyWorkTime(db, DATA, callback) {
    db.work_time.destroy({
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

    app.get('/getWorkTime', /*isAuthenticated,*/ function(req, res) {
        getWorkTime(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/work_time', /*isAuthenticated,*/ function(req, res) {
        work_time_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DestroyWorkTime', function(data) {
        DestroyWorkTime(db, data, function(data) {
            socket.emit("DestroyWorkTime", data)
        });
    });

    socket.on('CreateWorkTime', function(data) {
        database.sequelize.query(
            "INSERT INTO work_time (in_time, out_time) " +
            "VALUES ('" + data.in_time + "', '" + data.out_time + "')"
        ).complete(function(err, data) {
            socket.emit("CreateWorkTime", "success")
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;