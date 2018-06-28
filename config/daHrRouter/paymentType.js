module.exports = function() {};

function getPaymentType(db, QUERY, callback) {
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
        'id', 'name', 'percent'
    ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'id';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.order = [
        [SORT, DIR]
    ];
    db.payment_type.findAll(findData).complete(function(err, rData) {
        callback(rData);
    })
}

function DestroyPaymentType(db, DATA, callback) {
    db.payment_type.destroy({
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

function CreatePaymentType(db, DATA, callback) {
    db.payment_type.create({
        name: DATA.name,
        percent: DATA.percent,
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

    app.get('/getPaymentType', /*isAuthenticated,*/ function(req, res) {
        getPaymentType(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DestroyPaymentType', function(data) {
        DestroyPaymentType(db, data, function(data) {
            socket.emit("DestroyPaymentType", data)
        });
    });

    socket.on('CreatePaymentType', function(data) {
        CreatePaymentType(db, data, function(data) {
            socket.emit("CreatePaymentType", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;