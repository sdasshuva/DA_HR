module.exports = function() {};

function getAccountsType(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    if (QUERY.name) {
        SEARCH.name = QUERY.name;
        findData.where = SEARCH;
    }
    findData.attributes = [
        'id', 'name', 'state', 'created_at', 'updated_at'
    ];
    var SORT = (QUERY.sort) ? QUERY.sort : 'id';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.order = [
        [SORT, DIR]
    ];
    db.accounts_type.findAll(findData).complete(function(err, rData) {
        callback(rData);
    })
}

function DestroyAccountsType(db, DATA, callback) {
    db.accounts_type.destroy({
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

function CreateAccountsType(db, DATA, callback) {
    db.accounts_type.create({
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

/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////Socket Init And route init //////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function routerInit(app, dbFull) {
    var db = dbFull.DA_HR

    app.get('/getAccountsType', /*isAuthenticated,*/ function(req, res) {
        getAccountsType(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DestroyAccountsType', function(data) {
        DestroyAccountsType(db, data, function(data) {
            socket.emit("DestroyAccountsType", data)
        });
    });

    socket.on('CreateAccountsType', function(data) {
        CreateAccountsType(db, data, function(data) {
            socket.emit("CreateAccountsType", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;