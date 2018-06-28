module.exports = function() {};

function getPaymentStatus(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    // findData.where = {
    //   name: QUERY.name
    // };
    if (QUERY.name) {
        SEARCH.name = QUERY.name;
        findData.where = SEARCH;
    }
    findData.attributes = [
        'id', 'name'
    ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'id';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.order = [
        [SORT, DIR]
    ];
    db.payment_status.findAll(findData).complete(function(err, rData) {
        callback(rData);
    })
}

function getPaymentMethod(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    // findData.where = {
    //   name: QUERY.name
    // };
    if (QUERY.name) {
        SEARCH.name = QUERY.name;
        findData.where = SEARCH;
    }
    findData.attributes = [
        'id', 'name'
    ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'id';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.order = [
        [SORT, DIR]
    ];
    db.payment_method.findAll(findData).complete(function(err, rData) {
        callback(rData);
    })
}

function DestroyPaymentStatus(db, DATA, callback) {
    db.payment_status.destroy({
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

function CreatePaymentStatus(db, DATA, callback) {
    db.payment_status.create({
        name: DATA.name,
    }).complete(function(err, rdata) {
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

    app.get('/getPaymentStatus', /*isAuthenticated,*/ function(req, res) {
        getPaymentStatus(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getPaymentMethod', /*isAuthenticated,*/ function(req, res) {
        getPaymentMethod(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DestroyPaymentStatus', function(data) {
        DestroyPaymentStatus(db, data, function(data) {
            socket.emit("DestroyPaymentStatus", data)
        });
    });

    socket.on('CreatePaymentStatus', function(data) {
        CreatePaymentStatus(db, data, function(data) {
            socket.emit("CreatePaymentStatus", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;