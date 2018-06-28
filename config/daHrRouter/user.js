module.exports = function() {};

function user_list(db, callback) {
    db.user.findAll({
        where: {
            id: {
                gt: 0
            }
        }
    }).complete(function(err, data) {
        callback(data);
    })
}


function card_no_list(db, callback) {
    db.user.findAll({
        where: {
            card_no: {
                ne: 0,
            }
        },
        attributes: [
            'id', 'card_no'
        ],
        order: [
            ['card_no', 'ASC']
        ]
    }).complete(function(err, cardList) {
        callback(cardList);
    });
}

function getUser(db, QUERY, callback) {
    var SEARCH = {};
    if (QUERY.id)
        SEARCH.id = QUERY.id
    if (QUERY.card_no)
        SEARCH.card_no = QUERY.card_no
    if (QUERY.finger_print_id)
        SEARCH.finger_print_id = QUERY.finger_print_id
    if (QUERY.first_name)
        SEARCH.first_name = QUERY.first_name
    if (QUERY.last_name)
        SEARCH.last_name = QUERY.last_name
    if (QUERY.name_bangla)
        SEARCH.name_bangla = QUERY.name_bangla
    if (QUERY.email)
        SEARCH.email = QUERY.email
    if (QUERY.access_level)
        SEARCH.access_level = QUERY.access_level
    db.user.findAll({
        attributes: [
            'id', 'card_no', 'finger_print_id', 'first_name',
            'last_name', 'name_bangla', 'email', 'access_level',
        ],
        order: [
            ['id', 'ASC']
        ]
    }).complete(function(err, d) {
        callback(d);
    })
}

function DestroyUser(db, DATA, callback) {
    db.user.destroy({
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

function UpdateUserAccessLevel(db, DATA, callback) {
    db.user.update({
        access_level: DATA.access_level
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
            // if(err2.code == "ER_ROW_IS_REFERENCED_" ||err2.errno==1451){
            //    // callback("referenced");
            // }else{
            //    // callback("error");
            // }
        } else {
            callback("success")
        }
    })
}

function UpdateUserFirstName(db, DATA, callback) {
    db.user.update({
        first_name: DATA.first_name
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    });
}

function UpdateUserLastName(db, DATA, callback) {
    db.user.update({
        last_name: DATA.last_name
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
        if (err) {
            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                callback("referenced");
            } else {
                callback("error");
            }
        } else {
            callback("success")
        }
    });
}

function UpdateUserEmail(db, DATA, callback) {
    db.user.update({
        email: DATA.email
    }, {
        id: DATA.id
    }).complete(function(err, break_down) {
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

function ChangeUserPassword(db, DATA, callback) {
    db.user.update({
        password: DATA.password
    }, {
        email: DATA.email
    }).complete(function(err, user) {
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

function AssignUserPassword(db, DATA, callback) {
    db.user.update({
        password: DATA.password
    }, {
        id: DATA.id
    }).complete(function(err, user) {
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

function UpdateEmployeeFirstName(db, DATA, callback) {
    db.user.update({
        first_name: DATA.first_name
    }, {
        id: DATA.id
    }).complete(function(err, user) {
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

function UpdateEmployeeLastName(db, DATA, callback) {
    db.user.update({
        last_name: DATA.last_name
    }, {
        id: DATA.id
    }).complete(function(err, user) {
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

function UpdateEmployeeCardNo(db, DATA, callback) {
    db.user.update({
        card_no: DATA.card_no
    }, {
        id: DATA.id
    }).complete(function(err, user) {
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

function CreateUser(db, DATA, database, callback) {
    var userData = {};
    userData.id = DATA.finger_print_id;
    userData.first_name = (DATA.first_name) ? DATA.first_name : null;
    userData.last_name = (DATA.last_name) ? DATA.last_name : null;
    userData.name_bangla = (DATA.name_bangla) ? DATA.name_bangla : null;
    userData.card_no = (DATA.card_no) ? DATA.card_no : null;
    userData.finger_print_id = DATA.finger_print_id;
    userData.email = DATA.email;
    userData.password = DATA.password;

    db.user.create(userData).complete(function(err, user) {
        if (err) {
            callback("error");
        } else {
            var emp = {};
            emp.id = DATA.finger_print_id;
            emp.user = user.id;
            emp.grade = (DATA.grade) ? DATA.grade : null;
            emp.department = (DATA.department != '') ? DATA.department : null;
            emp.designation = (DATA.designation != '') ? DATA.designation : null;
            emp.work_time = (DATA.work_time != '') ? DATA.work_time : null;
            emp.employee_type = (DATA.employee_type != '') ? DATA.employee_type : null;
            emp.section = (DATA.section != '') ? DATA.section : null;
            // emp.working_place = (DATA.working_place != '') ? DATA.working_place:null;
            emp.date_of_join = (DATA.date_of_join != '') ? new Date(DATA.date_of_join) : null;
            emp.date_of_join = (emp.date_of_join) ? emp.date_of_join.setHours(10) : null;
            emp.date_of_birth = (DATA.date_of_birth != '') ? new Date(DATA.date_of_birth) : null;
            emp.date_of_birth = (emp.date_of_birth) ? emp.date_of_birth.setHours(10) : null;

            db.employee.create(emp).complete(function(err, employee) {
                if (err) {
                    callback("error");
                } else {
                    database.sequelize.query('UPDATE `user` SET `name_bangla` = "' + DATA.name_bangla + '" WHERE `user`.`id` = "' + DATA.finger_print_id + '"').complete(function(err, user) {
                        if (err) {
                            if (err[0].code == "ER_ROW_IS_REFERENCED_") {
                                callback("referenced");
                            } else {
                                callback("error");
                            }
                        } else {
                            callback("success")
                        }
                    });
                }
            })
        }
    })
}

function name_list(db, callback) {
    var returnData = [];
    db.user.findAll({
        attributes: ['id', 'finger_print_id', 'first_name'],
        where: {
            id: {
                gt: 0
            }
        }
    }).complete(function(err, data) {
        data.sort(function(a, b) {
            if (a.first_name < b.first_name)
                return -1;
            if (a.first_name > b.first_name)
                return 1;
            return 0;
        });
        callback(data);
    })
}

function routerInit(app, dbFull) {
    var db = dbFull.DA_HR

    app.get('/user', /*isAuthenticated,*/ function(req, res) {
        user_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/name_list', /*isAuthenticated,*/ function(req, res) {
        list.name_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/card_no', /*isAuthenticated,*/ function(req, res) {
        list.card_no_list(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getUser', /*isAuthenticated,*/ function(req, res) {
        getUser(db, req.query, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('CreateUserMonthlyReportPDF', function(data, file_name) {
        var options = {
            format: 'Letter'
        };
        pdf.create(data, options).toFile('./uploads/pdf/' + file_name + '.pdf', function(err, res) {
            socket.emit("CreateUserMonthlyReportPDF", 'success');
        });
        //socket.emit("PDFDepartment",'success')
    });

    socket.on('DestroyUser', function(data) {
        DestroyUser(db, data, function(data) {
            socket.emit("DestroyUser", data)
        });
    });

    socket.on('UpdateUserAccessLevel', function(data) {
        UpdateUserAccessLevel(db, data, function(data) {
            socket.emit("UpdateUserAccessLevel", data)
        });
    });

    socket.on('UpdateUserFirstName', function(data) {
        UpdateUserFirstName(db, data, function(data) {
            socket.emit("UpdateUserFirstName", data)
        });
    });

    socket.on('UpdateUserLastName', function(data) {
        UpdateUserLastName(db, data, function(data) {
            socket.emit("UpdateUserLastName", data)
        });
    });

    socket.on('UpdateUserEmail', function(data) {
        UpdateUserEmail(db, data, function(data) {
            socket.emit("UpdateUserEmail", data)
        });
    });

    socket.on('CheckPasswordMatch', function(data) {
        db.user.findAll({
            where: {
                email: data.email
            },
            limit: 1
        }).complete(function(err, user) {
            if (err) {
                socket.emit("CheckPasswordMatch", 'error');
            }
            if (!user[0]) {
                socket.emit("CheckPasswordMatch", 'error');
            }
            // User exists but wrong password, log the error 
            if (!isValidPassword(user[0], data.password)) {
                socket.emit("CheckPasswordMatch", 'error');
            } else {
                socket.emit("CheckPasswordMatch", 'success');
            }
        })
    });

    socket.on('ChangeUserPassword', function(data) {
        var values = {};
        values.email = data.email;
        values.password = createHash(data.password);
        ChangeUserPassword(db, values, function(data) {
            socket.emit("ChangeUserPassword", data);
        });
    });

    socket.on('AssignUserPassword', function(data) {
        var values = {};
        values.id = data.id;
        values.password = createHash(data.password);
        AssignUserPassword(db, values, function(data) {
            socket.emit("AssignUserPassword", data);
        });
    });

    socket.on('CreateUser', function(data) {
        data.password = createHash(12345678);
        if (!data.email)
            data.email = '';
        CreateUser(db, data, database, function(data) {
            socket.emit("CreateUser", data)
        });
    });
    socket.on('UpdateEmployeeCardNo', function(data) {
        UpdateEmployeeCardNo(db, data, function(data) {
            socket.emit("UpdateEmployeeCardNo", data)
        });
    });

    socket.on('UpdateEmployeeLastName', function(data) {
        UpdateEmployeeLastName(db, data, function(data) {
            socket.emit("UpdateEmployeeLastName", data)
        });
    });

    socket.on('UpdateEmployeeFirstName', function(data) {
        UpdateEmployeeFirstName(db, data, function(data) {
            socket.emit("UpdateEmployeeFirstName", data)
        });
    });

}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;