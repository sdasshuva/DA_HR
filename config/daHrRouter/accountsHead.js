module.exports = function() {};

function getAccountsHead(db, QUERY, callback) {
    var returnData = [];
    var SEARCH = {};
    var findData = {};
    if (QUERY.accounts_type) {
        SEARCH.accounts_type = QUERY.accounts_type;
    }
    if (QUERY.name) {
        SEARCH.name = QUERY.name;
    }
    if (QUERY.name || QUERY.accounts_type) {
        findData.where = SEARCH;
    }
    findData.attributes = [
        'id', 'accounts_type', 'name', 'state', 'created_at', 'updated_at'
    ];
    findData.include = [{
        model: db.accounts_type,
        attributes: [
            'id', 'name', 'state', 'created_at', 'updated_at'
        ],
    }];
    var SORT = (QUERY.sort) ? QUERY.sort : 'id';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    findData.order = [
        [SORT, DIR]
    ];
    db.accounts_head.findAll(findData).complete(function(err, rData) {
        callback(rData);
    })
}

function DestroyAccountsHead(db, DATA, callback) {
    db.accounts_head.destroy({
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

function CreateAccountsHead(db, DATA, callback) {
    db.accounts_head.create({
        accounts_type: DATA.accounts_type,
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

function getFinanceNavigationTree(db, QUERY, callback)
{
  var returnData = [];
  var SEARCH = {};
  var findData = {};
  if(QUERY.parent){
    SEARCH.parent = QUERY.parent;
    findData.where = SEARCH;
  }
  callback(returnData);
  // db.voucher_type.findAll(findData).complete(function(err, vTData) {
  //   async.each(vTData, function (vt, cb_vt) {
  //     var o = {};
  //     o.text = vt.name.toUpperCase();
  //     if(!vt.parent){
  //       o.expanded = true;
  //       var SO = {};
  //       SO.parent = vt.id;
  //       // getC.getFinanceNavigationTree(db, SO, function(cildE){
  //       //   o.children = cildE;
  //       // });
  //     }else{
  //       o.leaf = true;
  //     }
  //     returnData.push(o);
  //     cb_vt();
  //   }, function (err) {
  //     callback(returnData);
  //   });
  // })
}

/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////Socket Init And route init //////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function routerInit(app, dbFull) {
    var db = dbFull.DA_HR

    app.get('/getAccountsHead', /*isAuthenticated,*/ function(req, res) {
        getAccountsHead(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getFinanceNavigationTree', /*isAuthenticated,*/ function(req, res) {
        getFinanceNavigationTree(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DestroyAccountsHead', function(data) {
        DestroyAccountsHead(db, data, function(data) {
            socket.emit("DestroyAccountsHead", data)
        });
    });

    socket.on('CreateAccountsHead', function(data) {
        CreateAccountsHead(db, data, function(data) {
            socket.emit("CreateAccountsHead", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;