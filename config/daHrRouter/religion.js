module.exports = function() {};

function religion_list(db, callback) {
    db.religion.findAll().complete(function(err, data) {
        callback(data);
    })
}

function getReligion(db, QUERY, callback) {
    var SEARCH = {};
    if (QUERY.id)
        SEARCH.id = QUERY.id
    if (QUERY.name)
        SEARCH.name = QUERY.name
    db.religion.findAll({
        where: SEARCH,
        attributes: ['id', 'name'],
        order: [
            ['id', 'ASC']
        ]
    }).complete(function(err, d) {
        callback(d);
    })
}

function DestroyReligion(db, DATA, callback) {
    db.religion.destroy({
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

function CreateReligion(db, DATA, callback) {
    db.religion.create({
        name: DATA.name,
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

    app.get('/religion', /*isAuthenticated,*/ function(req, res) {
        religion_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getReligion', /*isAuthenticated,*/ function(req, res) {
        getReligion(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DestroyReligion', function(data) {
        DestroyReligion(db, data, function(data) {
            socket.emit("DestroyReligion", data)
        });
    });

    socket.on('CreateReligion', function(data) {
        CreateReligion(db, data, function(data) {
            socket.emit("CreateReligion", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;