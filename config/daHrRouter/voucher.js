module.exports = function() {};



function getVoucher(db, QUERY, callback)
{
  var returnData = [];
  var SEARCH = {};
  var findData = {};
  // if(QUERY.name){
  //   SEARCH.name = QUERY.name;
  //   findData.where = SEARCH;
  // }
  findData.attributes = [
    'id', 'state', 'created_at', 'updated_at'
  ];
  var SORT = (QUERY.sort) ? QUERY.sort : 'id';
  var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
  findData.order = [
    [SORT, DIR]
  ];
  db.voucher.findAll(findData).complete(function(err, rData) {
    callback(rData);
  })
}


function DestroyVoucher(db, DATA, callback)
{
  db.voucher.destroy({ id: [DATA] }).complete(function (err, data) {
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

function CreateVoucher(db,DATA, callback)
{
  var o = {};
  db.voucher.create({
    date: DATA.date,
    manual_voucher_no: (DATA.manual_voucher_no)?DATA.manual_voucher_no:null,
    ref_no: (DATA.ref_no)?DATA.ref_no:null,
    pay_to: (DATA.pay_to)?DATA.pay_to:null,
    pay_by: (DATA.pay_by)?DATA.pay_by:null,
    accounts_type: DATA.accounts_type,
    accounts_head: DATA.accounts_head,
    sub_head: DATA.sub_head,
    voucher_type: DATA.voucher_type,
    amount: DATA.amount,
    payment_method: DATA.payment_method,
    check_no: (DATA.check_no)?DATA.check_no:null,
    comments: (DATA.comments)?DATA.comments:null,
    user: DATA.user,
    state: (DATA.state)?DATA.state:1
  }).complete(function (err, rdata) {
    if (err) {
      callback("error");
    }else{
      DATA.VoucherItems.sort(function(a, b) {
        a.voucher = rdata.id;
        b.voucher = rdata.id;
        return 0;
      });
          db.voucher_item.bulkCreate(DATA.VoucherItems).complete(function (err, wash) {
        if (err) {
          callback("error");
        }else{
          callback("success");
        }
      });
    }
  })
}



function routerInit(app, dbFull) {
    var db = dbFull.DA_HR

    app.get('/getVoucher', /*isAuthenticated,*/ function(req, res) {
        getVoucher(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DestroyVoucher', function(data) {
            DestroyVoucher(db, data, function(data) {
                socket.emit("DestroyVoucher", data)
            });
        });

    socket.on('CreateVoucher', function(data) {
        CreateVoucher(db, data, function(data) {
            emit("CreateVoucher", data)
        });
    });

}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;