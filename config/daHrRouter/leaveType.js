module.exports = function() {};

function leave_type_list(db,callback)
{
    db.leave_type.findAll().complete(function(err, data) {
        callback(data);
    })
}

function leave_report(db, EID, DATA, callback)
{
  var d = (DATA.year)? new Date(DATA.year):new Date();
  var returnData = [];
  db.leave_type.findAll({
    attributes: [
      'id', 'name', 'amount'
    ],
    order: [
      ['id', 'ASC']
    ]
  }).complete(function(err, leave_types) {
    async.each(leave_types, function (leave_type, cb_leave_type) {
      var lt = {};
      lt.id = leave_type.id;
      lt.leave = leave_type.name.toUpperCase();
      lt.allocation = leave_type.amount;
      db.leave.findAll({
        where: [
          {
            employee: EID,
            leave_type: lt.id
          },
          ['YEAR(date)=?', d.getFullYear()],
        ],
        attributes: [
            'id', 'date'
        ],
      }).complete(function(err, leaves) {
        lt.leaves = leaves;
        returnData.push(lt)
        cb_leave_type();
      })
    }, function (err) {
      if (err) { throw err; }
      returnData.sort(function(a, b) {
        if (a.id < b.id)
          return -1;
        if (a.id > b.id)
          return 1;
        return 0;
      });
      callback(returnData);
    });
  })
}

function DestroyLeaveType(db, DATA, callback)
{
    db.leave_type.destroy({ id: [DATA] }).complete(function (err, data) {
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

function CreateLeaveType(db,DATA, callback)
{
    db.leave_type.create({
        name: DATA.name,
        amount: DATA.amount
    }).complete(function (err, employee) {
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

    app.get('/leave_type', /*isAuthenticated,*/ function(req, res) {
        leave_type_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/leave_report/:EID', /*isAuthenticated,*/ function(req, res) {
        var EID = req.params.EID;
        leave_report(db, EID, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DestroyLeaveType', function(data) {
        DestroyLeaveType(db, data, function(data) {
            socket.emit("DestroyLeaveType", data)
        });
    });

    socket.on('CreateLeaveType', function(data) {
        CreateLeaveType(db, data, function(data) {
            socket.emit("CreateLeaveType", data)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;