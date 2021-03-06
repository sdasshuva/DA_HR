module.exports = function() {};

function blood_group_list(db, callback) {
    db.blood_group.findAll().complete(function(err, data) {
        callback(data);
    })
}

function getBloodGroup(db, QUERY, callback) {
    var SEARCH = {};
    if (QUERY.id)
        SEARCH.id = QUERY.id
    if (QUERY.name)
        SEARCH.name = QUERY.name
    db.blood_group.findAll({
        where: SEARCH,
        attributes: ['id', 'name'],
        order: [
            ['name', 'ASC']
        ]
    }).complete(function(err, d) {
        callback(d);
    })
}

function DestroyBloodGroup(db, DATA, callback) {
    db.blood_group.destroy({
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

function CreateBloodGroup(db, DATA, callback) {
    db.blood_group.create({
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

/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////Socket Init And route init //////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function routerInit(app, dbFull) {
    var db = dbFull.DA_HR

    app.get('/getBloodGroup', /*isAuthenticated,*/ function(req, res) {
        getBloodGroup(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/blood_group', /*isAuthenticated,*/ function(req, res) {
        blood_group_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DestroyBloodGroup', function(data) {
        DestroyBloodGroup(db, data, function(data) {
            socket.emit("DestroyBloodGroup", data)
        });
    });

    socket.on('CreateBloodGroup', function(data) {
        CreateBloodGroup(db, data, function(data) {
            socket.emit("CreateBloodGroup", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;