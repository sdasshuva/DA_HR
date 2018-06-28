module.exports = function() {};

function getSubHead(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    if (QUERY.accounts_head) {
        SEARCH.accounts_head = QUERY.accounts_head;
    }
    if (QUERY.name) {
        SEARCH.name = QUERY.name;
    }
    if (QUERY.name || QUERY.accounts_head) {
        findData.where = SEARCH;
    }
    findData.attributes = [
        'id', 'accounts_head', 'name', 'state', 'created_at', 'updated_at'
    ];
    findData.include = [{
        model: db.accounts_head,
        attributes: [
            'id', 'accounts_type', 'name', 'state', 'created_at', 'updated_at'
        ],
        include: [{
            model: db.accounts_type,
            attributes: [
                'id', 'name', 'state', 'created_at', 'updated_at'
            ],
        }]
    }];
    var SORT = (QUERY.sort) ? QUERY.sort : 'id';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.order = [
        [SORT, DIR]
    ];
    db.sub_head.findAll(findData).complete(function(err, rData) {
        callback(rData);
    })
}

function DestroySubHead(db, DATA, callback) {
    db.sub_head.destroy({
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

function CreateSubHead(db, DATA, callback) {
    db.sub_head.create({
        accounts_head: DATA.accounts_head,
        name: DATA.name,
        state: DATA.state,
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

    app.get('/getSubHead', /*isAuthenticated,*/ function(req, res) {
        getSubHead(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DestroySubHead', function(data) {
        DestroySubHead(db, data, function(data) {
            socket.emit("DestroySubHead", data)
        });
    });

    socket.on('CreateSubHead', function(data) {
        CreateSubHead(db, data, function(data) {
            socket.emit("CreateSubHead", data)
        });
    });

}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;