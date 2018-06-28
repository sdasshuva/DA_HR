module.exports = function() {};

function getPromotion(db, QUERY, callback)
{
  var returnData = [];
  var SEARCH = {};
  var findData = {};
  if(QUERY.employee){
    SEARCH.employee = QUERY.employee;
    findData.where = SEARCH;
  }
  findData.attributes = [
    'id', 'employee', 'old_designation',
    'new_designation', 'month'
  ];
  findData.include = [
    {
      model: db.designation,
      attributes: [
        'id', 'name'
      ]
    },
  ];
  var SORT = (QUERY.sort) ? QUERY.sort : 'month';
  var DIR = (QUERY.dir) ? QUERY.dir : 'DESC';
  findData.order = [
    [SORT, DIR]
  ];
  if(QUERY.start)
    findData.offset = QUERY.start;
  if(QUERY.limit)
    findData.limit = QUERY.limit;
  db.promotion.findAll(findData).complete(function(err, promotionData) {
    async.each(promotionData, function (promt, cb_promt) {
      var e = {};
      e.id = promt.id;
      e.employee = promt.employee;
      e.old_designation = promt.old_designation;
      e.new_designation = promt.new_designation;
      e.month = promt.month;
      e.oldDesignation = {};
      e.newDesignation = {};
      var oldDesSearch = {};
      var newDesSearch = {};
      oldDesSearch.id = promt.old_designation;
      newDesSearch.id = promt.new_designation;
      getDesignation(db, oldDesSearch, function(oldDesData){
        async.each(oldDesData, function (oldDes, cb_oldDes) {
          e.oldDesignation.id = oldDes.id;
          e.oldDesignation.name = oldDes.name.toUpperCase();
          cb_oldDes();
        }, function (err) {
          getDesignation(db, newDesSearch, function(newDesData){
            async.each(newDesData, function (newDes, cb_newDes) {
              e.newDesignation.id = newDes.id;
              e.newDesignation.name = newDes.name.toUpperCase();
              cb_newDes();
            }, function (err) {
              returnData.push(e)
              cb_promt();
            });
          });
        });
      });
    }, function (err) {
      if (err) { throw err; }
      callback(returnData);
    });
  })
}

function DestroyPromotion(db, DATA, callback)
{
  db.promotion.destroy({ id: [DATA] }).complete(function (err, data) {
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

function CreatePromotion(db, DATA, callback)
{
  db.promotion.create({
    employee: DATA.employee,
    old_designation: DATA.old_designation,
    new_designation: DATA.new_designation,
    month: DATA.month
  }).complete(function (err, employee) {
    if (err) {
      callback("error");
      //throw err;
    }else{
      db.employee.update(
            { designation: DATA.new_designation },
            {
                id: DATA.employee
            }
        ).complete(function (err, break_down) {
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
  })
}

function routerInit(app, dbFull) {
    var db = dbFull.DA_HR

    app.get('/promotion/:EID', /*isAuthenticated,*/ function(req, res) {
        var SEARCH = {};
        SEARCH.employee = req.params.EID;
        getPromotion(db, SEARCH, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DestroyPromotion', function(data) {
        DestroyPromotion(db, data, function(data) {
            socket.emit("DestroyPromotion", data)
        });
    });

    socket.on('CreatePromotion', function(data) {
        CreatePromotion(db, data, function(data) {
            socket.emit("CreatePromotion", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;