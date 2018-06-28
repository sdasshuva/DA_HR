module.exports = function() {};

function department_attendance_list(db, DATA, callback)
{
    var d = new Date();
    var department = [];
    if(DATA.form_date){
        d = new Date(DATA.form_date)
    }
    var f = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
    var t = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+(d.getDate()+1);
    if(DATA.department){
        department.push(DATA.department)
        db.attendance.findAll({
            where: {
                punch_time: {
                    between: [f, t]
                },
            },
            group: [
                'employee'
            ],
            include: [
                {
                    model: db.employee,
                    attributes: ['id', 'user', 'department'],
                    include: [
                        { 
                            model: db.user, 
                            attributes: [
                                'id', 'first_name', 'last_name'
                            ] 
                        },
                        { 
                            model: db.department, 
                            attributes: [
                                'id', 'name'
                            ] 
                        }
                    ],
                    where: {
                        department: department
                    },

                }
            ],
            order: [
                ['employee', 'ASC']
            ],
        }).complete(function(err, data) {
            callback(data);
        })
    }else{
        callback([]);
    }
}

function attendance_report(db, DEPARTMENT_ID, DATA, callback)
{
    var d = new Date();
    var search_month = new Date(d.getFullYear(),d.getMonth(),01);
    var search_year = new Date(d.getFullYear(),00,01);
    var next_year  = new Date(d.getFullYear()+1,00,01);
    var holiday = 0;
    var holiday_array = [];
    var adjustment = [];
    if(DATA.month){
        d = new Date(DATA.month);
        holiday = DATA.holiday;
        search_month = new Date(d.getFullYear(),d.getMonth(),01);
        search_year = new Date(d.getFullYear(),00,01);
        next_year  = new Date(d.getFullYear()+1,00,01);
        holiday_array = DATA.holiday_array
        for (var i = 0; i < DATA.adjustment.length; i++) {
            if(parseInt(DATA.adjustment[i])==0||parseInt(DATA.adjustment[i])==32){
            }else{
                adjustment.push(DATA.adjustment[i])
            }
        };
    }
    var dateList = dateListFromMonth(d);
    //var weekend = weekendCount(d);
    var total_days = dateList.length;
    var f = new Date(d);
    d.setMonth(d.getMonth()+1);
    var t = new Date(d);
    var returnData=[];
    db.employee.findAll({
        where: {
            department: DEPARTMENT_ID,
            status: 1
        },
        include: [
            {
                model: db.user,
                attributes: [
                    'id', 'first_name', 'last_name', 'card_no'
                ],
            },
            {
                model: db.department, 
                attributes: [
                    'id', 'name'
                ]
            }
        ],
        order: [
            ['id', 'ASC']
        ],
    }).complete(function(err, employee_data) {
        async.each(employee_data, function (employee, cb_employee_data) {
            var emp = {};
            emp.employee = employee;
            emp.attendance = {};
            emp.days = {};
            emp.punch_hour = {};
            emp.punch_min = {};
            emp.punch_sec = {};
            emp.id = employee.id;
            emp.card_no = employee.userTable.card_no;
            emp.first_name = employee.userTable.first_name;
            emp.last_name = employee.userTable.last_name;
            emp.department = employee.departmentTable.name;
            emp.leave_details = '';
            emp.leave = 0;
            emp.late_leave = 0;
            emp.absent_late_leave = 0;
            var cl = 0;
            var sl = 0;
            var nextdays = 0;
            var absent = 0;
            var present = 0;
            var weekend = 0;
            var late = 0;
            var holidays = 0;
            for (var i = 0; i < dateList.length; i++) {
                emp.attendance[dateList[i]] = 'A';
                emp.punch_hour[dateList[i]] = 24;
                emp.punch_min[dateList[i]] = 60;
                emp.punch_sec[dateList[i]] = 60;
            };
            db.leave.findAll({
                where: { 
                    employee: employee.id,
                    date: {
                        gte: search_year,
                        lt: next_year,
                    }
                },
                include: [
                    {
                        model: db.leave_type,
                        attributes: ['id', 'name']
                    },
                ]
            }).complete(function(err, leaves) {
                if(leaves.length){
                    for (var i = 0; i < leaves.length; i++) {
                        var leave_date = new Date(leaves[i].date);
                        var ldgy = leave_date.getFullYear();
                        var ldgm = leave_date.getMonth();
                        var smgy = search_month.getFullYear();
                        var smgm = search_month.getMonth();
                        if(ldgy==smgy&&ldgm==smgm){
                            if(leaves[i].leave_type==4){
                                emp.late_leave++;
                            }else{
                                emp.leave++;
                            }
                        }
                        if(leaves[i].leave_type==1){
                            sl++;
                        }else if(leaves[i].leave_type==2){
                            cl++;
                        }
                    };
                }
                emp.leave_details = leaves;
                emp.sick_leave = sl;
                emp.casual_leave = cl;
                db.attendance.findAll({
                    where: {
                        punch_time: {
                            between: [f, t]
                        },
                        employee: employee.id
                    },
                    order: [
                        ['id', 'ASC']
                    ],
                }).complete(function(err, attendance_data) {
                    for (var i = 0; i < attendance_data.length; i++) {
                        emp.attendance[attendance_data[i].punch_time.getUTCDate()] = 'P'
                        if(attendance_data[i].punch_time.getUTCHours()<emp.punch_hour[attendance_data[i].punch_time.getUTCDate()]){
                            emp.punch_hour[attendance_data[i].punch_time.getUTCDate()] = attendance_data[i].punch_time.getUTCHours();
                            if(attendance_data[i].punch_time.getUTCMinutes()<emp.punch_min[attendance_data[i].punch_time.getUTCDate()]){
                                emp.punch_min[attendance_data[i].punch_time.getUTCDate()] = attendance_data[i].punch_time.getUTCMinutes();
                                emp.punch_sec[attendance_data[i].punch_time.getUTCDate()] = attendance_data[i].punch_time.getUTCSeconds();
                            }
                        }
                    };
                    for (var i = 0; i < dateList.length; i++) {
                        var tmp_day = new Date(search_month.getFullYear(),search_month.getMonth(),dateList[i]);
                        for (var j = 0; j < holiday_array.length; j++) {
                            if(dateList[i]==holiday_array[j]){
                                emp.attendance[dateList[i]] = 'H'
                            }
                        };
                        if(tmp_day.getDay()==5){
                            if(adjustment.indexOf(dateList[i].toString())==-1){
                                emp.attendance[dateList[i]] = 'W'
                            }
                        }
                        /*if(adjustment.length>0){
                            for (var j = 0; j < adjustment.length; j++) {
                                if(dateList[i]!=adjustment[j]&&tmp_day.getDay()==5){
                                    emp.attendance[dateList[i]] = 'W'
                                }
                            };
                        }*/
                        if(emp.attendance[dateList[i]]=='W'||emp.attendance[dateList[i]]=='H'){
                            if(emp.attendance[dateList[i-1]]=='A'&&emp.attendance[dateList[i+1]]=='A'){
                                emp.attendance[dateList[i]] = 'A';
                            }
                        }
                        if(emp.attendance[dateList[i]]=='P'){
                             if(emp.punch_hour[dateList[i]]<=8){
                                if(emp.punch_hour[dateList[i]]==8){
                                    if(emp.punch_min[dateList[i]]>=15){
                                        emp.attendance[dateList[i]] = 'L'
                                    }
                                }
                            }else{
                                emp.attendance[dateList[i]] = 'L'
                            }
                        }
                        if(emp.attendance[dateList[i]]=='L'){
                            emp.days['day_'+dateList[i]] =  addLeadingZero(2, emp.punch_hour[dateList[i]].toString())+':'+
                                                            addLeadingZero(2, emp.punch_min[dateList[i]].toString())+':'+
                                                            addLeadingZero(2, emp.punch_sec[dateList[i]].toString());
                        }else{
                            emp.days['day_'+dateList[i]] = emp.attendance[dateList[i]];
                        }
                        if(emp.attendance[dateList[i]]=='P')
                            present++;
                        if(emp.attendance[dateList[i]]=='L')
                            late++;
                        if(emp.attendance[dateList[i]]=='A')
                            absent++;
                        if(emp.attendance[dateList[i]]=='W')
                            weekend++;
                        if(emp.attendance[dateList[i]]=='H')
                            holidays++;
                    };
                    for (var i = 0; i < dateList.length; i++) {
                        if(leaves.length){
                            for (var j = 0; j < leaves.length; j++) {
                                var leave_date = new Date(leaves[j].date);
                                var ldgy = leave_date.getFullYear();
                                var ldgm = leave_date.getMonth();
                                var ldgd = leave_date.getDate();
                                var smgy = search_month.getFullYear();
                                var smgm = search_month.getMonth();
                                if(ldgy==smgy&&ldgm==smgm){
                                    if(parseInt(dateList[i])==ldgd){
                                        var ldtn = shortNames(leaves[j].leaveTypeTable.name);
                                        if(emp.attendance[dateList[i]]=='A'&&ldtn=='LL'){
                                            emp.absent_late_leave++;
                                        }
                                        emp.attendance[dateList[i]] = ldtn;
                                        emp.days['day_'+dateList[i]] = emp.attendance[dateList[i]];
                                    }
                                }
                            };
                        }
                    };
                    emp.weekend = weekend;
                    //emp.weekends = weekends;
                    emp.absent = absent;
                    emp.present = present;
                    emp.late = late;
                    emp.holidays = holidays;
                    emp.day_length = dateList.length;
                    //var ex_la = parseInt(late/3);
                    //emp.absent+=ex_la;
                    emp.total = emp.present+emp.late+emp.absent;
                    returnData.push(emp);
                    cb_employee_data();
                })
            })
        }, function (err) {
            if (err) { throw err; }
            callback(returnData);
        });
    })
}

function department_list(db,callback)
{
  db.department.findAll().complete(function(err, data){
    data.sort(function(a, b) {
      a.name = a.name.toUpperCase();
      b.name = b.name.toUpperCase();
      if (a.name < b.name)
        return -1;
      if (a.name > b.name)
        return 1;
      return 0;
    });
    callback(data);
  });
}


function DestroyDepartment(db, DATA, callback)
{
	db.department.destroy({ id: [DATA] }).complete(function (err, data) {
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

function getDepartment(db, QUERY, callback)
{
  var SEARCH = {};
  var findData = {};
  if(QUERY.id)
    SEARCH.id = QUERY.id
  if(QUERY.name)
    SEARCH.name = QUERY.name
  findData.where = SEARCH;
  findData.attributes = [
    'id', 'name'
  ];
  var SORT = (QUERY.sort) ? QUERY.sort : 'name';
  var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
  findData.order = [
    [SORT, DIR]
  ];
  if(QUERY.start)
    findData.offset = QUERY.start;
  if(QUERY.limit)
    findData.limit = QUERY.limit;
  db.department.findAll(findData).complete(function(err, d) {
    callback(d);
  })
}

function CreateDepartment(db,DATA, callback)
{
	db.department.create({
		name: DATA.name,
	}).complete(function (err, employee) {
		if (err) {
			callback("error");
			//throw err;
		}else{
			callback("success")
		}
	})
}

/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////Socket Init And route init //////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function routerInit(app, dbFull) {
    var db = dbFull.DA_HR

    app.get('/department_attendance', /*isAuthenticated,*/ function(req, res){
        department_attendance_list(db, req.query, function(d){
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/attendance_report/:DEPARTMENT_ID', /*isAuthenticated,*/ function(req, res){
        var DEPARTMENT_ID = req.params.DEPARTMENT_ID;
        attendance_report(db, DEPARTMENT_ID, req.query, function(d){
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/daily_report/:DEPARTMENT_ID', /*isAuthenticated,*/ function(req, res) {
        var DEPARTMENT_ID = req.params.DEPARTMENT_ID;
        daily_report(db, DEPARTMENT_ID, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/department', /*isAuthenticated,*/ function(req, res){
        department_list(db,function(d){
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getDepartment', /*isAuthenticated,*/ function(req, res){
        getDepartment(db, req.query, function(d){
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DestroyDepartment',function(data){
            DestroyDepartment(db,data,function(data){
                socket.emit("DestroyDepartment",data)
            });
        });

    socket.on('CreateDepartment',function(data){
            CreateDepartment(db,data,function(data){
                socket.emit("CreateDepartment",data)
            });
        });

    socket.on('CreateDailyReportPDF', function(data, file_name) {
            d = new Date();
            var options = {
                format: 'Letter',
                header: {
                    height: "15mm",
                    contents: '<div style="color: #444;font-size: 9px;text-align: right; margin: 15px"><span><br />PRINT TIME: ' + d + '</span></div>'
                },
                footer: {
                    height: "15mm",
                    contents: '<div style="color: #444;font-size: 9px;text-align: right; margin: 15px"><span>PAGE {{page}}</span> OUT OF <span>{{pages}}</span></div>'
                },
            };
            pdf.create(data, options).toFile('./uploads/pdf/' + file_name + '.pdf', function(err, res) {
                socket.emit("CreateDailyReportPDF", 'success');
            });
        });

}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;