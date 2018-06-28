module.exports = function() {};

function getVoucherType(db, QUERY, callback)
{
  var returnData = [];
  var SEARCH = {};
  var findData = {};
  if(QUERY.name){
    SEARCH.name = QUERY.name;
    findData.where = SEARCH;
  }
  findData.attributes = [
    'id', 'parent', 'name', 'state', 'created_at', 'updated_at'
  ];
  findData.include = [
    {
      model: db.voucher_type,
      // as: 'parent',
      attributes: [
        'id', 'name', 'state', 'created_at', 'updated_at'
      ],
    }
  ];
  var SORT = (QUERY.sort) ? QUERY.sort : 'id';
  var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
  findData.order = [
    [SORT, DIR]
  ];
  db.voucher_type.findAll(findData).complete(function(err, rData) {
    callback(rData);
  })
}



function DestroyVoucherType(db, DATA, callback)
{
  db.voucher_type.destroy({ id: [DATA] }).complete(function (err, data) {
    if (err) {
      if(err[0].code == "ER_ROW_IS_REFERENCED_" ){
        callback("referenced");
      }else{
        callback("error");
      }
    }else{
      callback("success")
    }
  })
}

function CreateVoucherType(db,DATA, callback)
{
  db.voucher_type.create({
    name: DATA.name,
    parent: DATA.parent,
    state: DATA.state,
  }).complete(function (err, rdata) {
    if (err) {
      callback("error");
      //throw err;
    }else{
      callback("success")
    }
  })
}

function routerInit(app, dbFull) {
    var db = dbFull.DA_HR

    app.get('/getVoucherType', /*isAuthenticated,*/ function(req, res) {
        getVoucherType(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DestroyVoucherType', function(data) {
            DestroyVoucherType(db, data, function(data) {
                socket.emit("DestroyVoucherType", data)
            });
        });

    socket.on('CreateVoucherType', function(data) {
        CreateVoucherType(db, data, function(data) {
            socket.emit("CreateVoucherType", data)
        });
    });

}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;