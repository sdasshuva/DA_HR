module.exports = function() {};

function designation_list(db, callback) {
    db.designation.findAll().complete(function(err, data) {
        data.sort(function(a, b) {
            if (a.name < b.name)
                return -1;
            if (a.name > b.name)
                return 1;
            return 0;
        });
        callback(data);
    })
}

function getDesignation(db, QUERY, callback) {
    var SEARCH = {};
    var findData = {};
    if (QUERY.id)
        SEARCH.id = QUERY.id
    if (QUERY.name)
        SEARCH.name = QUERY.name
    findData.where = SEARCH;
    findData.attributes = [
        'id', 'name', 'attendance_bonus'
    ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'name';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.designation.findAll(findData).complete(function(err, d) {
        callback(d);
    })
}

function DestroyDesignation(db, DATA, callback) {
    db.designation.destroy({
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

function CreateDesignation(db, DATA, callback) {
    db.designation.create({
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

    app.get('/designation', /*isAuthenticated,*/ function(req, res) {
        designation_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getDesignation', /*isAuthenticated,*/ function(req, res) {
        getDesignation(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DestroyDesignation', function(data) {
        DestroyDesignation(db, data, function(data) {
            socket.emit("DestroyDesignation", data)
        });
    });

    socket.on('CreateDesignation', function(data) {
        CreateDesignation(db, data, function(data) {
            socket.emit("CreateDesignation", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;