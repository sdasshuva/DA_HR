module.exports = function() {};

function CreateStatus(db, DATA, callback) {
    db.status.create({
        name: DATA.name,
    }).complete(function(err, data) {
        if (err) {
            callback("error");
            //throw err;
        } else {
            callback("success")
        }
    })
}

function status_list(db, callback) {
    db.status.findAll().complete(function(err, data) {
        callback(data);
    })
}

function getStatusRegularAndHold(db, callback) {
    db.status.findAll({
        where: {
            id: [1, 2]
        },
        attributes: ['id', 'name'],
        order: [
            ['id', 'ASC']
        ]
    }).complete(function(err, d) {
        callback(d);
    })
}

function DestroyStatus(db, DATA, callback) {
    db.status.destroy({
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

function getStatus(db, QUERY, callback) {
    var SEARCH = {};
    if (QUERY.id)
        SEARCH.id = QUERY.id
    if (QUERY.name)
        SEARCH.name = QUERY.name
    db.status.findAll({
        where: SEARCH,
        attributes: ['id', 'name'],
        order: [
            ['id', 'ASC']
        ]
    }).complete(function(err, d) {
        callback(d);
    })
}


function routerInit(app, dbFull) {
    var db = dbFull.DA_HR

    app.get('/status', /*isAuthenticated,*/ function(req, res) {
        status_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/statusRegularAndHold', /*isAuthenticated,*/ function(req, res) {
        getStatusRegularAndHold(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });



    app.get('/getStatus', /*isAuthenticated,*/ function(req, res) {
        getStatus(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('CreateStatus', function(data) {
        CreateStatus(db, data, function(data) {
            socket.emit("CreateStatus", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;