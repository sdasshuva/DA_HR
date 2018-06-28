module.exports = function() {};

function comparativeStatementHeader(ms) {
    var d = new Date(ms)
    var sSH = '<div style="' +
        'color: #444;' +
        'font-size: 8px;' +
        'position: fixed;' +
        'top: 5;' +
        'right: 15;' +
        '">' +
        '<span>PRINT TIME: ' +
        new Date() +
        '</span>' +
        '</div>';
    return sSH;
}

function getBonusDetails(db, QUERY, callback) {
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    var returnData = [];
    var SEARCH = {};
    var secSearch = {};
    if (QUERY.section && QUERY.section != '') {
        SEARCH.section = QUERY.section;
    }
    if (QUERY.section) {
        secSearch.id = QUERY.section;
    }
    SEARCH.date = d;
    SEARCH.status = 1;
    var o = {};
    getSection(db, secSearch, function(secData) {
        secData.sort(function(a, b) {
            var o1 = a.name;
            var o2 = b.name;
            if (o1 < o2) return -1;
            if (o1 > o2) return 1;
            return 0;
        });
        async.each(secData, function(sec, cb_sec) {
            o[sec.name] = {};
            o[sec.name].staff = false;
            o[sec.name].name = sec.name;
            o[sec.name].empCount = 0;
            o[sec.name].salary = 0;
            o[sec.name].regular = {};
            o[sec.name].regular.empCount = 0;
            o[sec.name].regular.salary = 0;
            o[sec.name].regular.bank = {};
            o[sec.name].regular.bank.empCount = 0;
            o[sec.name].regular.bank.salary = 0;
            o[sec.name].regular.bank.ot = 0;
            o[sec.name].regular.cash = {};
            o[sec.name].regular.cash.empCount = 0;
            o[sec.name].regular.cash.salary = 0;
            cb_sec();
        }, function(err) {
            getEmployeeDetails(db, SEARCH, function(empData) {
                async.each(empData, function(emp, cb_emp) {
                    var empDOJ = new Date(emp.date_of_join);
                    var tmpSD = new Date(QUERY.date);
                    tmpSD.setDate(1);
                    tmpSD.setMonth(tmpSD.getMonth() + 1);
                    tmpSD.setFullYear(tmpSD.getFullYear() - 1);
                    o[emp.sectionName].staff = (emp.employeeTypeName == "STAFF") ? true : false;
                    var stamp = (emp.payment_method == 1 && parseInt(emp.salary) > 0) ? 10 : (emp.employeeTypeName != "STAFF" && parseInt(emp.salary) > 0) ? 10 : 0;
                    var payAmount = (QUERY.bonus_type == 'BASIC') ? Math.round(emp.basic) - stamp : Math.round(emp.salary / 2) - stamp;
                    if (empDOJ <= tmpSD && emp.salary > 0) {
                        o[emp.sectionName].empCount++;
                        o[emp.sectionName].salary += payAmount;
                        o[emp.sectionName].regular.empCount++;
                        o[emp.sectionName].regular.salary += payAmount;
                        if (emp.payment_method == 2) {
                            o[emp.sectionName].regular.bank.empCount++;
                            o[emp.sectionName].regular.bank.salary += payAmount;
                        } else {
                            o[emp.sectionName].regular.cash.empCount++;
                            o[emp.sectionName].regular.cash.salary += payAmount;
                        }
                    }
                    cb_emp();
                }, function(err) {
                    callback(o);
                })
            });
        });
    });
}

function getComparativeSalaryList(db, QUERY, callback) {
    var SEARCH = {};
    var findData = {};
    var returnData = [];
    findData.where = [];
    if (QUERY.section) {
        SEARCH.section = QUERY.section;
    }
    if (QUERY.status) {
        SEARCH.status = QUERY.status;
    }
    if (QUERY.employee_type) {
        SEARCH.employee_type = QUERY.employee_type;
    }
    if (QUERY.payment_method)
        SEARCH.payment_method = QUERY.payment_method
    if (QUERY.date) {
        var date = new Date(QUERY.date);
        var SM = date.getMonth() + 1;
        var SY = date.getFullYear();
        findData.where.push(['MONTH(date)=? AND YEAR(date)=?', SM, SY]);
    }
    findData.where.push(SEARCH);
    var SORT = (QUERY.sort) ? QUERY.sort : 'section';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    // findData.attributes = [
    //   'id', 'name', 'department'
    // ];
    findData.include = [{
        model: db.section,
        attributes: [
            'id', 'name'
        ]
    }, {
        model: db.status,
        attributes: [
            'id', 'name'
        ]
    }, {
        model: db.employee_type,
        attributes: [
            'id', 'name'
        ]
    }, {
        model: db.payment_method,
        attributes: [
            'id', 'name'
        ]
    }, ];
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.comparative_salary.findAll(findData).complete(function(err, compData) {
        compData.sort(function(a, b) {
            if (a.status < b.status)
                return -1;
            if (a.status > b.status)
                return 1;
            return 0;
        });
        callback(compData);
    });
}

function getComparativeSalary(db, QUERY, callback) {
    var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
    var returnData = [];
    var SEARCH = {};
    var secSearch = {};
    if (QUERY.section) {
        SEARCH.section = QUERY.section;
    }
    if (QUERY.section) {
        secSearch.id = QUERY.section;
    }
    SEARCH.date = d;
    SEARCH.status = [1, 2];
    var o = {};
    getSection(db, secSearch, function(secData) {
        async.each(secData, function(sec, cb_sec) {
            o[sec.name] = {};
            o[sec.name].staff = false;
            o[sec.name].name = sec.name;
            o[sec.name].empCount = 0;
            o[sec.name].salary = 0;
            o[sec.name].ot = 0;
            o[sec.name].regular = {};
            o[sec.name].regular.empCount = 0;
            o[sec.name].regular.salary = 0;
            o[sec.name].regular.ot = 0;
            o[sec.name].regular.bank = {};
            o[sec.name].regular.bank.empCount = 0;
            o[sec.name].regular.bank.salary = 0;
            o[sec.name].regular.bank.ot = 0;
            o[sec.name].regular.cash = {};
            o[sec.name].regular.cash.empCount = 0;
            o[sec.name].regular.cash.salary = 0;
            o[sec.name].regular.cash.ot = 0;
            o[sec.name].hold = {};
            o[sec.name].hold.empCount = 0;
            o[sec.name].hold.salary = 0;
            o[sec.name].hold.ot = 0;
            o[sec.name].hold.bank = {};
            o[sec.name].hold.bank.empCount = 0;
            o[sec.name].hold.bank.salary = 0;
            o[sec.name].hold.bank.ot = 0;
            o[sec.name].hold.cash = {};
            o[sec.name].hold.cash.empCount = 0;
            o[sec.name].hold.cash.salary = 0;
            o[sec.name].hold.cash.ot = 0;
            cb_sec();
        }, function(err) {
            getEmployeeMonthSummary(db, SEARCH, function(empData) {
                async.each(empData, function(emp, cb_emp) {
                    o[emp.section].staff = (emp.employee_type == "STAFF") ? true : false;
                    if (emp.status == "REGULAR" && emp.salary > 0) {
                        o[emp.section].empCount++;
                        o[emp.section].salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                        o[emp.section].ot += (emp.excessOverTimeAmount <= 0) ? 0 : emp.excessOverTimeAmount;
                        o[emp.section].regular.empCount++;
                        o[emp.section].regular.salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                        o[emp.section].regular.ot += (emp.excessOverTimeAmount <= 0) ? 0 : emp.excessOverTimeAmount;
                        if (emp.payment_method == 2) {
                            o[emp.section].regular.bank.empCount++;
                            o[emp.section].regular.bank.salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                            o[emp.section].regular.bank.ot += (emp.excessOverTimeAmount <= 0) ? 0 : emp.excessOverTimeAmount;
                        } else {
                            o[emp.section].regular.cash.empCount++;
                            o[emp.section].regular.cash.salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                            o[emp.section].regular.cash.ot += (emp.excessOverTimeAmount <= 0) ? 0 : emp.excessOverTimeAmount;
                        }
                    } else if (emp.status == "HOLD" && emp.salary > 0) {
                        o[emp.section].empCount++;
                        o[emp.section].salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                        o[emp.section].ot += (emp.excessOverTimeAmount <= 0) ? 0 : emp.excessOverTimeAmount;
                        o[emp.section].hold.empCount++;
                        o[emp.section].hold.salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                        o[emp.section].hold.ot += (emp.excessOverTimeAmount <= 0) ? 0 : emp.excessOverTimeAmount;
                        if (emp.payment_method == 2) {
                            o[emp.section].hold.bank.empCount++;
                            o[emp.section].hold.bank.salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                            o[emp.section].hold.bank.ot += (emp.excessOverTimeAmount <= 0) ? 0 : emp.excessOverTimeAmount;
                        } else {
                            o[emp.section].hold.cash.empCount++;
                            o[emp.section].hold.cash.salary += (emp.netPayable <= 0) ? 0 : emp.netPayable;
                            o[emp.section].hold.cash.ot += (emp.excessOverTimeAmount <= 0) ? 0 : emp.excessOverTimeAmount;
                        }
                        // o[emp.section].hold.cash.empCount++;
                        // o[emp.section].hold.cash.salary+=(emp.netPayable<=0)?0:emp.netPayable;
                        // o[emp.section].hold.cash.ot+=(emp.excessOverTimeAmount<=0)?0:emp.excessOverTimeAmount;
                    }
                    cb_emp();
                }, function(err) {
                    callback(o);
                })
            });
        });
    });
}


function getComparativeSalaryGridList(db, QUERY, callback) {
    var SEARCH = {};
    var findData = {};
    var returnData = [];
    var date = new Date();
    date.getMonth(date.getMonth() - 1);
    date = (QUERY.date) ? new Date(QUERY.date) : new Date(date);
    SEARCH.employee_type = QUERY.employee_type;
    findData.where = SEARCH;
    findData.attributes = [
        'id', 'name', 'employee_type'
    ];
    findData.include = [{
        model: db.employee_type,
        attributes: [
            'id', 'name'
        ]
    }];
    db.section.findAll(findData).complete(function(err, secData) {
        async.each(secData, function(sec, cb_sec) {
            var RC = {};
            RC.date = date;
            RC.section = sec.id;
            RC.status = 1;
            RC.payment_method = 1;
            RC.employee_type = sec.employee_type;
            RC.employee_count = 0;
            RC.salary_amount = 0;
            RC.ot_amount = 0;
            RC.created_at = null;
            RC.updated_at = null;
            RC.sectionTable = sec;
            RC.statusTable = {
                "id": 1,
                "name": "REGULAR"
            };
            RC.employeeTypeTable = sec.employeeTypeTable;
            RC.paymentMethodTable = {
                "id": 1,
                "name": "CASH"
            };
            var RB = {};
            RB.date = (QUERY.date) ? QUERY.date : new Date();
            RB.section = sec.id;
            RB.status = 1;
            RB.payment_method = 2;
            RB.employee_type = sec.employee_type;
            RB.employee_count = 0;
            RB.salary_amount = 0;
            RB.ot_amount = 0;
            RB.created_at = null;
            RB.updated_at = null;
            RB.sectionTable = sec;
            RB.statusTable = {
                "id": 1,
                "name": "REGULAR"
            };
            RB.employeeTypeTable = sec.employeeTypeTable;
            RB.paymentMethodTable = {
                "id": 2,
                "name": "BANK"
            };
            var HC = {};
            HC.date = date;
            HC.section = sec.id;
            HC.status = 2;
            HC.payment_method = 1;
            HC.employee_type = sec.employee_type;
            HC.employee_count = 0;
            HC.salary_amount = 0;
            HC.ot_amount = 0;
            HC.created_at = null;
            HC.updated_at = null;
            HC.sectionTable = sec;
            HC.statusTable = {
                "id": 2,
                "name": "HOLD"
            };
            HC.employeeTypeTable = sec.employeeTypeTable;
            HC.paymentMethodTable = {
                "id": 1,
                "name": "CASH"
            };
            var HB = {};
            HB.date = date;
            HB.section = sec.id;
            HB.status = 2;
            HB.payment_method = 2;
            HB.employee_type = sec.employee_type;
            HB.employee_count = 0;
            HB.salary_amount = 0;
            HB.ot_amount = 0;
            HB.created_at = null;
            HB.updated_at = null;
            HB.sectionTable = sec;
            HB.statusTable = {
                "id": 2,
                "name": "HOLD"
            };
            HB.employeeTypeTable = sec.employeeTypeTable;
            HB.paymentMethodTable = {
                "id": 2,
                "name": "BANK"
            };

            var SEARCH2 = {};
            var findData2 = {};
            findData2.where = [];
            SEARCH2.section = sec.id;
            SEARCH2.employee_type = QUERY.employee_type;
            var SM = date.getMonth() + 1;
            var SY = date.getFullYear();
            findData2.where.push(['MONTH(date)=? AND YEAR(date)=?', SM, SY]);
            findData2.where.push(SEARCH2);
            findData2.include = [{
                model: db.section,
                attributes: [
                    'id', 'name'
                ]
            }, {
                model: db.status,
                attributes: [
                    'id', 'name'
                ]
            }, {
                model: db.employee_type,
                attributes: [
                    'id', 'name'
                ]
            }, {
                model: db.payment_method,
                attributes: [
                    'id', 'name'
                ]
            }, ];
            db.comparative_salary.findAll(findData2).complete(function(err, compData) {
                async.each(compData, function(comp, cb_comp) {
                    if (comp.status == 1 && comp.payment_method == 1) {
                        RC.id = comp.id;
                        RC.date = comp.date;
                        RC.employee_count = comp.employee_count;
                        RC.salary_amount = comp.salary_amount;
                        RC.ot_amount = comp.ot_amount;
                        RC.created_at = comp.created_at;
                        RC.updated_at = comp.updated_at;
                    }
                    if (comp.status == 1 && comp.payment_method == 2) {
                        RB.id = comp.id;
                        RB.date = comp.date;
                        RB.employee_count = comp.employee_count;
                        RB.salary_amount = comp.salary_amount;
                        RB.ot_amount = comp.ot_amount;
                        RB.created_at = comp.created_at;
                        RB.updated_at = comp.updated_at;
                    }
                    if (comp.status == 2 && comp.payment_method == 1) {
                        HC.id = comp.id;
                        HC.date = comp.date;
                        HC.employee_count = comp.employee_count;
                        HC.salary_amount = comp.salary_amount;
                        HC.ot_amount = comp.ot_amount;
                        HC.created_at = comp.created_at;
                        HC.updated_at = comp.updated_at;
                    }
                    if (comp.status == 2 && comp.payment_method == 2) {
                        HB.id = comp.id;
                        HB.date = comp.date;
                        HB.employee_count = comp.employee_count;
                        HB.salary_amount = comp.salary_amount;
                        HB.ot_amount = comp.ot_amount;
                        HB.created_at = comp.created_at;
                        HB.updated_at = comp.updated_at;
                    }
                    cb_comp();
                }, function(err) {
                    returnData.push(RB);
                    returnData.push(RC);
                    returnData.push(HB);
                    returnData.push(HC);
                    cb_sec();
                })
            });
        }, function(err) {
            callback(returnData);
        })
    });
}

function getComparativeSalaryGridListB(db, QUERY, callback) {
    var SEARCH = {};
    var findData = {};
    var returnData = [];
    var date = new Date();
    date.getMonth(date.getMonth() - 1);
    date = (QUERY.date) ? new Date(QUERY.date) : new Date(date);
    SEARCH.employee_type = QUERY.employee_type;
    findData.where = SEARCH;
    findData.attributes = [
        'id', 'name', 'employee_type'
    ];
    findData.include = [{
        model: db.employee_type,
        attributes: [
            'id', 'name'
        ]
    }];
    db.section.findAll(findData).complete(function(err, secData) {
        async.each(secData, function(sec, cb_sec) {
            var RC = {};
            RC.date = date;
            RC.section = sec.id;
            RC.status = 1;
            RC.payment_method = 1;
            RC.employee_type = sec.employee_type;
            RC.employee_count = 0;
            RC.salary_amount = 0;
            RC.ot_amount = 0;
            RC.created_at = null;
            RC.updated_at = null;
            RC.sectionTable = sec;
            RC.statusTable = {
                "id": 1,
                "name": "REGULAR"
            };
            RC.employeeTypeTable = sec.employeeTypeTable;
            RC.paymentMethodTable = {
                "id": 1,
                "name": "CASH"
            };
            var RB = {};
            RB.date = (QUERY.date) ? QUERY.date : new Date();
            RB.section = sec.id;
            RB.status = 1;
            RB.payment_method = 2;
            RB.employee_type = sec.employee_type;
            RB.employee_count = 0;
            RB.salary_amount = 0;
            RB.ot_amount = 0;
            RB.created_at = null;
            RB.updated_at = null;
            RB.sectionTable = sec;
            RB.statusTable = {
                "id": 1,
                "name": "REGULAR"
            };
            RB.employeeTypeTable = sec.employeeTypeTable;
            RB.paymentMethodTable = {
                "id": 2,
                "name": "BANK"
            };
            var HC = {};
            HC.date = date;
            HC.section = sec.id;
            HC.status = 2;
            HC.payment_method = 1;
            HC.employee_type = sec.employee_type;
            HC.employee_count = 0;
            HC.salary_amount = 0;
            HC.ot_amount = 0;
            HC.created_at = null;
            HC.updated_at = null;
            HC.sectionTable = sec;
            HC.statusTable = {
                "id": 2,
                "name": "HOLD"
            };
            HC.employeeTypeTable = sec.employeeTypeTable;
            HC.paymentMethodTable = {
                "id": 1,
                "name": "CASH"
            };
            var HB = {};
            HB.date = date;
            HB.section = sec.id;
            HB.status = 2;
            HB.payment_method = 2;
            HB.employee_type = sec.employee_type;
            HB.employee_count = 0;
            HB.salary_amount = 0;
            HB.ot_amount = 0;
            HB.created_at = null;
            HB.updated_at = null;
            HB.sectionTable = sec;
            HB.statusTable = {
                "id": 2,
                "name": "HOLD"
            };
            HB.employeeTypeTable = sec.employeeTypeTable;
            HB.paymentMethodTable = {
                "id": 2,
                "name": "BANK"
            };

            var SEARCH2 = {};
            var findData2 = {};
            findData2.where = [];
            SEARCH2.section = sec.id;
            SEARCH2.employee_type = QUERY.employee_type;
            var SM = date.getMonth() + 1;
            var SY = date.getFullYear();
            findData2.where.push(['MONTH(date)=? AND YEAR(date)=?', SM, SY]);
            findData2.where.push(SEARCH2);
            findData2.include = [{
                model: db.section,
                attributes: [
                    'id', 'name'
                ]
            }, {
                model: db.status,
                attributes: [
                    'id', 'name'
                ]
            }, {
                model: db.employee_type,
                attributes: [
                    'id', 'name'
                ]
            }, {
                model: db.payment_method,
                attributes: [
                    'id', 'name'
                ]
            }, ];
            db.comparative_salary_b.findAll(findData2).complete(function(err, compData) {
                async.each(compData, function(comp, cb_comp) {
                    if (comp.status == 1 && comp.payment_method == 1) {
                        RC.id = comp.id;
                        RC.date = comp.date;
                        RC.employee_count = comp.employee_count;
                        RC.salary_amount = comp.salary_amount;
                        RC.ot_amount = comp.ot_amount;
                        RC.created_at = comp.created_at;
                        RC.updated_at = comp.updated_at;
                    }
                    if (comp.status == 1 && comp.payment_method == 2) {
                        RB.id = comp.id;
                        RB.date = comp.date;
                        RB.employee_count = comp.employee_count;
                        RB.salary_amount = comp.salary_amount;
                        RB.ot_amount = comp.ot_amount;
                        RB.created_at = comp.created_at;
                        RB.updated_at = comp.updated_at;
                    }
                    if (comp.status == 2 && comp.payment_method == 1) {
                        HC.id = comp.id;
                        HC.date = comp.date;
                        HC.employee_count = comp.employee_count;
                        HC.salary_amount = comp.salary_amount;
                        HC.ot_amount = comp.ot_amount;
                        HC.created_at = comp.created_at;
                        HC.updated_at = comp.updated_at;
                    }
                    if (comp.status == 2 && comp.payment_method == 2) {
                        HB.id = comp.id;
                        HB.date = comp.date;
                        HB.employee_count = comp.employee_count;
                        HB.salary_amount = comp.salary_amount;
                        HB.ot_amount = comp.ot_amount;
                        HB.created_at = comp.created_at;
                        HB.updated_at = comp.updated_at;
                    }
                    cb_comp();
                }, function(err) {
                    returnData.push(RB);
                    returnData.push(RC);
                    returnData.push(HB);
                    returnData.push(HC);
                    cb_sec();
                })
            });
        }, function(err) {
            callback(returnData);
        })
    });
}

function getComparativeSalaryListB(db, QUERY, callback) {
    var SEARCH = {};
    var findData = {};
    var returnData = [];
    findData.where = [];
    if (QUERY.section) {
        SEARCH.section = QUERY.section;
    }
    if (QUERY.status) {
        SEARCH.status = QUERY.status;
    }
    if (QUERY.employee_type) {
        SEARCH.employee_type = QUERY.employee_type;
    }
    if (QUERY.payment_method)
        SEARCH.payment_method = QUERY.payment_method
    if (QUERY.date) {
        var date = new Date(QUERY.date);
        var SM = date.getMonth() + 1;
        var SY = date.getFullYear();
        findData.where.push(['MONTH(date)=? AND YEAR(date)=?', SM, SY]);
    }
    findData.where.push(SEARCH);
    var SORT = (QUERY.sort) ? QUERY.sort : 'section';
    var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';
    // findData.attributes = [
    //   'id', 'name', 'department'
    // ];
    findData.include = [{
        model: db.section,
        attributes: [
            'id', 'name'
        ]
    }, {
        model: db.status,
        attributes: [
            'id', 'name'
        ]
    }, {
        model: db.employee_type,
        attributes: [
            'id', 'name'
        ]
    }, {
        model: db.payment_method,
        attributes: [
            'id', 'name'
        ]
    }, ];
    findData.order = [
        [SORT, DIR]
    ];
    if (QUERY.start)
        findData.offset = QUERY.start;
    if (QUERY.limit)
        findData.limit = QUERY.limit;
    db.comparative_salary_b.findAll(findData).complete(function(err, compData) {
        compData.sort(function(a, b) {
            if (a.status < b.status)
                return -1;
            if (a.status > b.status)
                return 1;
            return 0;
        });
        callback(compData);
    });
}

function comparativeStatementReportHead() {
    var sSRH = '<head>' +
        '<style>' +
        'table, th, td {' +
        'border: 1px solid black;' +
        'border-collapse: collapse;' +
        '}' +
        'th, td {' +
        'padding: 2px 5px 2px 5px;' +
        'line-height: 1;' +
        'align: center;' +
        '}' +
        'h1, h2, h3, h4, h5, h6 {' +
        'line-height: 0;' +
        'text-align: center;' +
        '}' +
        '#pageBody {' +
        'font-size: 8.5px;' +
        'padding: 0px 20px 0px 20px;' +
        'page-break-after: always;' +
        '}' +
        '#pageBody:last-child {' +
        'page-break-after: avoid;' +
        '}' +
        '</style>' +
        '</head>';
    return sSRH;
}


/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////Socket Init And route init //////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function routerInit(app, dbFull) {
    var db = dbFull.DA_HR

    app.get('/getComparativeSalary', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.date = new Date('2017-01-01');
        // QUERY.section = 1;
        getComparativeSalary(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getComparativeSalaryList', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY.date = (req.query.date) ? new Date(req.query.date) : new Date();
        QUERY.date.setDate(10);
        getComparativeSalaryList(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getComparativeSalaryList/:TYPE/:TID', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        // QUERY.date = (req.query.date)? new Date(req.query.date): new Date();
        QUERY.date = new Date('2017-7-10');
        QUERY.date.setDate(10);
        if (req.params.TYPE == 'TYPE')
            QUERY.employee_type = req.params.TID;
        getComparativeSalaryList(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });



    app.get('/getComparativeSalaryGridList/:TID', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY = req.query;
        QUERY.employee_type = req.params.TID;
        getComparativeSalaryGridList(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });

    app.get('/getComparativeSalaryGridListB/:TID', /*isAuthenticated,*/ function(req, res) {
        var QUERY = {};
        QUERY = req.query;
        QUERY.employee_type = req.params.TID;
        getComparativeSalaryGridListB(db, QUERY, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        });
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('ComparativeSalarySummaryHTML', function(QUERY) {
        var QUERY2 = {};
        QUERY2.date = (QUERY.date) ? new Date(QUERY.date) : new Date();
        QUERY2.date.setDate(10);
        getComparativeSalaryList(db, QUERY2, function(compData) {
            var staffRegularBank = 0,
                staffRegularCash = 0,
                workerRegularBank = 0,
                workerRegularCash = 0,
                workerRegularOTBank = 0,
                workerRegularOTCash = 0,
                regularBank = 0,
                regularCash = 0,
                staffHoldBank = 0,
                staffHoldCash = 0,
                workerHoldBank = 0,
                workerHoldCash = 0,
                workerHoldOTBank = 0,
                workerHoldOTCash = 0,
                holdCash = 0,
                cashTotal = 0;
            async.each(compData, function(comp, cb_comp) {
                var cD = JSON.stringify(comp, null, 4);
                cD = JSON.parse(cD);
                var SA = parseFloat(cD.salary_amount);
                var OA = parseFloat(cD.ot_amount);
                var TA = SA + OA;
                staffRegularBank += (cD.employee_type == 1 && cD.status == 1 && cD.payment_method == 2) ? SA : 0;
                staffRegularCash += (cD.employee_type == 1 && cD.status == 1 && cD.payment_method == 1) ? SA : 0;
                staffHoldBank += (cD.employee_type == 1 && cD.status == 2 && cD.payment_method == 2) ? SA : 0;
                staffHoldCash += (cD.employee_type == 1 && cD.status == 2 && cD.payment_method == 1) ? SA : 0;
                workerRegularBank += (cD.employee_type == 2 && cD.status == 1 && cD.payment_method == 2) ? SA : 0;
                workerRegularCash += (cD.employee_type == 2 && cD.status == 1 && cD.payment_method == 1) ? SA : 0;
                workerRegularOTBank += (cD.employee_type == 2 && cD.status == 1 && cD.payment_method == 2) ? OA : 0;
                workerRegularOTCash += (cD.employee_type == 2 && cD.status == 1 && cD.payment_method == 1) ? OA : 0;
                // workerHoldBank+=(cD.employee_type==2&&cD.status==2&&cD.payment_method==2)? TA:0;
                // workerHoldCash+=(cD.employee_type==2&&cD.status==2&&cD.payment_method==1)? TA:0;
                workerHoldBank += (cD.employee_type == 2 && cD.status == 2 && cD.payment_method == 2) ? SA : 0;
                workerHoldCash += (cD.employee_type == 2 && cD.status == 2 && cD.payment_method == 1) ? SA : 0;
                workerHoldOTBank += (cD.employee_type == 2 && cD.status == 2 && cD.payment_method == 2) ? OA : 0;
                workerHoldOTCash += (cD.employee_type == 2 && cD.status == 2 && cD.payment_method == 1) ? OA : 0;
                cb_comp();
            }, function(err) {
                var staffRegularTotal = staffRegularBank + staffRegularCash,
                    workerRegularTotal = workerRegularBank + workerRegularCash,
                    workerRegularOTTotal = workerRegularOTBank + workerRegularOTCash,
                    regularBank = staffRegularBank + workerRegularBank + workerRegularOTBank,
                    regularCash = staffRegularCash + workerRegularCash + workerRegularOTCash,
                    regularTotal = regularBank + regularCash,
                    staffHoldTotal = staffHoldBank + staffHoldCash,
                    workerHoldTotal = workerHoldBank + workerHoldCash,
                    workerHoldOTTotal = workerHoldOTBank + workerHoldOTCash,
                    holdBank = staffHoldBank + workerHoldBank + workerHoldOTBank,
                    holdCash = staffHoldCash + workerHoldCash + workerHoldOTCash,
                    holdTotal = holdBank + holdCash,
                    bankTotal = regularBank + holdBank,
                    cashTotal = regularCash + holdCash,
                    grossTotal = bankTotal + cashTotal;
                var htmlData =
                    '<div id="outer" style="width:100%;margin: 10px;">' +
                    '<div style="display: table;margin: 0 auto;">' +
                    '<table style="width:100%;border: 0px solid white;">' +
                    '<tr style="border: 0px solid white;">' +
                    '<th style="background-color:#DDD;border: 1px solid black;" width="230" align="left">PARTICULARS</th>' +
                    '<th style="background-color:#DDD;border: 1px solid black;" width="150" align="right">BANK</th>' +
                    '<th style="background-color:#DDD;border: 1px solid black;" width="180" align="right">CASH</th>' +
                    '<th style="background-color:#DDD;border: 1px solid black;" width="150" align="right">TOTAL</th>' +
                    '</tr>' +
                    '<tr style="border: 0px solid white;">' +
                    '<td style="border-bottom: 0px solid white;" align="left">STAFF REGULAR: </td>' +
                    '<td style="border-bottom: 0px solid white;" align="right">' +
                    staffRegularBank.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-bottom: 0px solid white;" align="right">' +
                    staffRegularCash.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-bottom: 0px solid white;" align="right">' +
                    staffRegularTotal.formatMoney(2, '.', ',') +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td style="border-top: 0px solid white;" align="left">WORKER REGULAR: </td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerRegularBank.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerRegularCash.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerRegularTotal.formatMoney(2, '.', ',') +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td style="border-top: 0px solid white;" align="left">WORKER REGULAR EX OT: </td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerRegularOTBank.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerRegularOTCash.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerRegularOTTotal.formatMoney(2, '.', ',') +
                    '</td>' +
                    '</tr>' +
                    '<tr style="background-color:#DDD;">' +
                    '<td align="left"><b>TOTAL </b></td>' +
                    '<td align="right"><b>' +
                    regularBank.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '<td align="right"><b>' +
                    regularCash.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '<td align="right"><b>' +
                    regularTotal.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '</tr>' +
                    '<tr style="border: 0px solid white;">' +
                    '<td style="border-bottom: 0px solid white;" align="left">STAFF HOLD: </td>' +
                    '<td style="border-bottom: 0px solid white;" align="right">' +
                    staffHoldBank.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-bottom: 0px solid white;" align="right">' +
                    staffHoldCash.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-bottom: 0px solid white;" align="right">' +
                    staffHoldTotal.formatMoney(2, '.', ',') +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td style="border-top: 0px solid white;" align="left">WORKER HOLD: </td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerHoldBank.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerHoldCash.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerHoldTotal.formatMoney(2, '.', ',') +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td style="border-top: 0px solid white;" align="left">WORKER HOLD EX OT: </td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerHoldOTBank.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerHoldOTCash.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerHoldOTTotal.formatMoney(2, '.', ',') +
                    '</td>' +
                    '</tr>' +
                    '<tr style="background-color:#DDD;">' +
                    '<td align="left"><b>TOTAL </b></td>' +
                    '<td align="right"><b>' +
                    holdBank.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '<td align="right"><b>' +
                    holdCash.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '<td align="right"><b>' +
                    holdTotal.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '</tr>' +
                    '<tr style="background-color:#DDD;">' +
                    '<td><b>GRAND TOTAL </b></td>' +
                    '<td align="right"><b>' +
                    bankTotal.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '<td align="right"><b>' +
                    cashTotal.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '<td align="right"><b>' +
                    grossTotal.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '</tr>' +
                    '</table>' +
                    '</div>' +
                    '</div>';
                socket.emit("ComparativeSalarySummaryHTML", htmlData);
            });
        });
    });

    socket.on('ComparativeSalarySummaryHTMLB', function(QUERY) {
        var QUERY2 = {};
        QUERY2.date = (QUERY.date) ? new Date(QUERY.date) : new Date();
        QUERY2.date.setDate(10);
        getComparativeSalaryListB(db, QUERY2, function(compData) {
            var staffRegularBank = 0,
                staffRegularCash = 0,
                workerRegularBank = 0,
                workerRegularCash = 0,
                workerRegularOTBank = 0,
                workerRegularOTCash = 0,
                regularBank = 0,
                regularCash = 0,
                staffHoldBank = 0,
                staffHoldCash = 0,
                workerHoldBank = 0,
                workerHoldCash = 0,
                workerHoldOTBank = 0,
                workerHoldOTCash = 0,
                holdCash = 0,
                cashTotal = 0;
            async.each(compData, function(comp, cb_comp) {
                var cD = JSON.stringify(comp, null, 4);
                cD = JSON.parse(cD);
                var SA = parseFloat(cD.salary_amount);
                var OA = parseFloat(cD.ot_amount);
                var TA = SA + OA;
                staffRegularBank += (cD.employee_type == 1 && cD.status == 1 && cD.payment_method == 2) ? SA : 0;
                staffRegularCash += (cD.employee_type == 1 && cD.status == 1 && cD.payment_method == 1) ? SA : 0;
                staffHoldBank += (cD.employee_type == 1 && cD.status == 2 && cD.payment_method == 2) ? SA : 0;
                staffHoldCash += (cD.employee_type == 1 && cD.status == 2 && cD.payment_method == 1) ? SA : 0;
                workerRegularBank += (cD.employee_type == 2 && cD.status == 1 && cD.payment_method == 2) ? SA : 0;
                workerRegularCash += (cD.employee_type == 2 && cD.status == 1 && cD.payment_method == 1) ? SA : 0;
                workerRegularOTBank += (cD.employee_type == 2 && cD.status == 1 && cD.payment_method == 2) ? OA : 0;
                workerRegularOTCash += (cD.employee_type == 2 && cD.status == 1 && cD.payment_method == 1) ? OA : 0;
                // workerHoldBank+=(cD.employee_type==2&&cD.status==2&&cD.payment_method==2)? TA:0;
                // workerHoldCash+=(cD.employee_type==2&&cD.status==2&&cD.payment_method==1)? TA:0;
                workerHoldBank += (cD.employee_type == 2 && cD.status == 2 && cD.payment_method == 2) ? SA : 0;
                workerHoldCash += (cD.employee_type == 2 && cD.status == 2 && cD.payment_method == 1) ? SA : 0;
                workerHoldOTBank += (cD.employee_type == 2 && cD.status == 2 && cD.payment_method == 2) ? OA : 0;
                workerHoldOTCash += (cD.employee_type == 2 && cD.status == 2 && cD.payment_method == 1) ? OA : 0;
                cb_comp();
            }, function(err) {
                var staffRegularTotal = staffRegularBank + staffRegularCash,
                    workerRegularTotal = workerRegularBank + workerRegularCash,
                    workerRegularOTTotal = workerRegularOTBank + workerRegularOTCash,
                    regularBank = staffRegularBank + workerRegularBank + workerRegularOTBank,
                    regularCash = staffRegularCash + workerRegularCash + workerRegularOTCash,
                    regularTotal = regularBank + regularCash,
                    staffHoldTotal = staffHoldBank + staffHoldCash,
                    workerHoldTotal = workerHoldBank + workerHoldCash,
                    workerHoldOTTotal = workerHoldOTBank + workerHoldOTCash,
                    holdBank = staffHoldBank + workerHoldBank + workerHoldOTBank,
                    holdCash = staffHoldCash + workerHoldCash + workerHoldOTCash,
                    holdTotal = holdBank + holdCash,
                    bankTotal = regularBank + holdBank,
                    cashTotal = regularCash + holdCash,
                    grossTotal = bankTotal + cashTotal;
                var htmlData =
                    '<div id="outer" style="width:100%;margin: 10px;">' +
                    '<div style="display: table;margin: 0 auto;">' +
                    '<table style="width:100%;border: 0px solid white;">' +
                    '<tr style="border: 0px solid white;">' +
                    '<th style="background-color:#DDD;border: 1px solid black;" width="230" align="left">PARTICULARS</th>' +
                    '<th style="background-color:#DDD;border: 1px solid black;" width="150" align="right">BANK</th>' +
                    '<th style="background-color:#DDD;border: 1px solid black;" width="180" align="right">CASH</th>' +
                    '<th style="background-color:#DDD;border: 1px solid black;" width="150" align="right">TOTAL</th>' +
                    '</tr>' +
                    '<tr style="border: 0px solid white;">' +
                    '<td style="border-bottom: 0px solid white;" align="left">STAFF REGULAR: </td>' +
                    '<td style="border-bottom: 0px solid white;" align="right">' +
                    staffRegularBank.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-bottom: 0px solid white;" align="right">' +
                    staffRegularCash.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-bottom: 0px solid white;" align="right">' +
                    staffRegularTotal.formatMoney(2, '.', ',') +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td style="border-top: 0px solid white;" align="left">WORKER REGULAR: </td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerRegularBank.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerRegularCash.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerRegularTotal.formatMoney(2, '.', ',') +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td style="border-top: 0px solid white;" align="left">WORKER REGULAR EX OT: </td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerRegularOTBank.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerRegularOTCash.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerRegularOTTotal.formatMoney(2, '.', ',') +
                    '</td>' +
                    '</tr>' +
                    '<tr style="background-color:#DDD;">' +
                    '<td align="left"><b>TOTAL </b></td>' +
                    '<td align="right"><b>' +
                    regularBank.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '<td align="right"><b>' +
                    regularCash.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '<td align="right"><b>' +
                    regularTotal.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '</tr>' +
                    '<tr style="border: 0px solid white;">' +
                    '<td style="border-bottom: 0px solid white;" align="left">STAFF HOLD: </td>' +
                    '<td style="border-bottom: 0px solid white;" align="right">' +
                    staffHoldBank.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-bottom: 0px solid white;" align="right">' +
                    staffHoldCash.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-bottom: 0px solid white;" align="right">' +
                    staffHoldTotal.formatMoney(2, '.', ',') +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td style="border-top: 0px solid white;" align="left">WORKER HOLD: </td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerHoldBank.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerHoldCash.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerHoldTotal.formatMoney(2, '.', ',') +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td style="border-top: 0px solid white;" align="left">WORKER HOLD EX OT: </td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerHoldOTBank.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerHoldOTCash.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerHoldOTTotal.formatMoney(2, '.', ',') +
                    '</td>' +
                    '</tr>' +
                    '<tr style="background-color:#DDD;">' +
                    '<td align="left"><b>TOTAL </b></td>' +
                    '<td align="right"><b>' +
                    holdBank.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '<td align="right"><b>' +
                    holdCash.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '<td align="right"><b>' +
                    holdTotal.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '</tr>' +
                    '<tr style="background-color:#DDD;">' +
                    '<td><b>GRAND TOTAL </b></td>' +
                    '<td align="right"><b>' +
                    bankTotal.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '<td align="right"><b>' +
                    cashTotal.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '<td align="right"><b>' +
                    grossTotal.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '</tr>' +
                    '</table>' +
                    '</div>' +
                    '</div>';
                socket.emit("ComparativeSalarySummaryHTMLB", htmlData);
            });
        });
    });





    socket.on('CreateComparativeSalaryReport', function(QUERY) {
        var returnData = [];
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var t = new Date(d);
        t.setDate(25);
        var f = new Date(d);
        f.setDate(26);
        f.setMonth(t.getMonth() - 1);
        var staff = 1,
            worker = 1,
            staffJD = {},
            workerJD = {},
            staffRegularBank = 0,

            staffRegularSecurityBank = 0, ////For FFL Factory Only

            staffRegularCash = 0,

            staffRegularSecurityCash = 0, ////For FFL Factory Only

            workerRegularBank = 0,
            workerRegularCash = 0,
            workerRegularOTBank = 0,
            workerRegularOTCash = 0,
            regularBank = 0,
            regularCash = 0,
            staffHoldBank = 0,
            staffHoldCash = 0,
            workerHoldBank = 0,
            workerHoldCash = 0,
            workerHoldOTBank = 0,
            workerHoldOTCash = 0,
            holdCash = 0,
            cashTotal = 0;
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            comparativeStatementReportHead() +
            '<h1 style="line-height: 0.8;font-size: 80%;">' +
            factoryName +
            '</h1>' +
            '<h2 style="line-height: 0.5;font-size: 65%;">' +
            'COMPARATIVE SALARY STATEMENT' +
            '</h2>' +
            '<h3 style="line-height: 0.5;font-size: 55%;">' +
            'FOR THE PERIOD OF ' +
            f.formatDate2() + ' TO ' +
            t.formatDate2() +
            '</h3>' +
            '<div id="pageBody">';
        var staffHtml = '<table style="width:100%;">' +
            '<tr style="background-color:#DDD;">' +
            '<td align="left" colspan="10"><big><b>STAFF</b></big></td>' +
            '</tr>' +
            '<tr>' +
            '<th width="10">#</th>' +
            '<th colspan="3">SECTION</th>' +
            '<th width="30"><small>EMP</small></th>' +
            '<th width="70">SALARY</th>' +
            '<th width="70">EX. OT</th>' +
            '<th width="150" colspan="3">TOTAL</th>' +
            '</tr>';
        var workerHtml = '<table style="width:100%;">' +
            '<tr style="background-color:#DDD;">' +
            '<td align="left" colspan="10"><big><b>WORKER</b></big></td>' +
            '</tr>' +
            '<tr>' +
            '<th width="10">#</th>' +
            '<th colspan="3">SECTION</th>' +
            '<th width="30"><small>EMP</small></th>' +
            '<th width="70">SALARY</th>' +
            '<th width="70">EX. OT</th>' +
            '<th width="150" colspan="3">TOTAL</th>' +
            '</tr>';
        getSection(db, QUERY, function(secData) {
            async.each(secData, function(sec, cb_sec) {
                var o = {};
                // o.section = 5;
                o.section = sec.id;
                o.secName = sec.name;
                o.updated = false;
                o.date = (QUERY.date) ? new Date(QUERY.date) : new Date();
                o.date.setDate(10);
                getComparativeSalaryList(db, o, function(compData) {
                    async.each(compData, function(comp, cb_comp) {
                        if (QUERY.download) {
                            var SA = parseFloat(comp.salary_amount);
                            var OA = parseFloat(comp.ot_amount);
                            var TA = SA + OA;
                            var JsOb = JSON.parse(JSON.stringify(comp));
                            var compSecName = JsOb.sectionTable.name.toUpperCase();

                            if (folderName == 'FFL_FACTORY_HR' || folderName == 'FJL_HR') {
                                if (compSecName == 'SECURITY') {
                                    staffRegularSecurityBank += (comp.employee_type == 1 && comp.status == 1 && comp.payment_method == 2) ? SA : 0;
                                    staffRegularSecurityCash += (comp.employee_type == 1 && comp.status == 1 && comp.payment_method == 1) ? SA : 0;
                                } else {
                                    staffRegularBank += (comp.employee_type == 1 && comp.status == 1 && comp.payment_method == 2) ? SA : 0;
                                    staffRegularCash += (comp.employee_type == 1 && comp.status == 1 && comp.payment_method == 1) ? SA : 0;
                                }
                            } else {
                                staffRegularBank += (comp.employee_type == 1 && comp.status == 1 && comp.payment_method == 2) ? SA : 0;
                                staffRegularCash += (comp.employee_type == 1 && comp.status == 1 && comp.payment_method == 1) ? SA : 0;
                            }
                            // staffRegularBank+=(comp.employee_type==1&&comp.status==1&&comp.payment_method==2)? SA:0;
                            // staffRegularCash+=(comp.employee_type==1&&comp.status==1&&comp.payment_method==1)? SA:0;
                            staffHoldBank += (comp.employee_type == 1 && comp.status == 2 && comp.payment_method == 2) ? SA : 0;
                            staffHoldCash += (comp.employee_type == 1 && comp.status == 2 && comp.payment_method == 1) ? SA : 0;
                            workerRegularBank += (comp.employee_type == 2 && comp.status == 1 && comp.payment_method == 2) ? SA : 0;
                            workerRegularCash += (comp.employee_type == 2 && comp.status == 1 && comp.payment_method == 1) ? SA : 0;
                            workerRegularOTBank += (comp.employee_type == 2 && comp.status == 1 && comp.payment_method == 2) ? OA : 0;
                            workerRegularOTCash += (comp.employee_type == 2 && comp.status == 1 && comp.payment_method == 1) ? OA : 0;
                            // workerHoldBank+=(comp.employee_type==2&&comp.status==2&&comp.payment_method==2)? TA:0;
                            // workerHoldCash+=(comp.employee_type==2&&comp.status==2&&comp.payment_method==1)? TA:0;
                            workerHoldBank += (comp.employee_type == 2 && comp.status == 2 && comp.payment_method == 2) ? SA : 0;
                            workerHoldCash += (comp.employee_type == 2 && comp.status == 2 && comp.payment_method == 1) ? SA : 0;
                            workerHoldOTBank += (comp.employee_type == 2 && comp.status == 2 && comp.payment_method == 2) ? OA : 0;
                            workerHoldOTCash += (comp.employee_type == 2 && comp.status == 2 && comp.payment_method == 1) ? OA : 0;

                            // returnData.push(comp);
                            if (comp.employee_type == 1) {
                                if (!staffJD[comp.sectionTable.name]) {
                                    staffJD[comp.sectionTable.name] = {};
                                    staffJD[comp.sectionTable.name].name = comp.sectionTable.name;
                                    staffJD[comp.sectionTable.name][comp.statu.name] = {};
                                    staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name] = {};
                                    staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                    staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                    staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                    staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                } else {
                                    if (!staffJD[comp.sectionTable.name][comp.statu.name]) {
                                        staffJD[comp.sectionTable.name][comp.statu.name] = {};
                                        staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name] = {};
                                        staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                        staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                        staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                        staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                    } else {
                                        if (!staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name]) {
                                            staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name] = {};
                                            staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                            staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                            staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                            staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                        } else {
                                            staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                            staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                            staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                            staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                        }
                                    }
                                }
                            } else {
                                if (!workerJD[comp.sectionTable.name]) {
                                    workerJD[comp.sectionTable.name] = {};
                                    workerJD[comp.sectionTable.name].name = comp.sectionTable.name;
                                    workerJD[comp.sectionTable.name][comp.statu.name] = {};
                                    workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name] = {};
                                    workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                    workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                    workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                    workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                } else {
                                    if (!workerJD[comp.sectionTable.name][comp.statu.name]) {
                                        workerJD[comp.sectionTable.name][comp.statu.name] = {};
                                        workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name] = {};
                                        workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                        workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                        workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                        workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                    } else {
                                        if (!workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name]) {
                                            workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name] = {};
                                            workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                            workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                            workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                            workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                        } else {
                                            workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                            workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                            workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                            workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                        }
                                    }
                                }
                            }
                        }
                        o.updated = true;
                        cb_comp();
                    }, function(err) {
                        if (o.updated) {
                            if (QUERY.update) {
                                getComparativeSalarySearch(db, o, function(compSal) {
                                    var bulkValues = [];
                                    var rc = {};
                                    rc.date = o.date;
                                    rc.section = o.section;
                                    rc.status = 1;
                                    rc.payment_method = 1;
                                    rc.employee_type = (compSal[o.secName].staff) ? 1 : 2;
                                    rc.employee_count = compSal[o.secName].regular.cash.empCount;
                                    rc.salary_amount = compSal[o.secName].regular.cash.salary;
                                    rc.ot_amount = compSal[o.secName].regular.cash.ot;
                                    bulkValues.push(rc);
                                    var rb = {};
                                    rb.date = o.date;
                                    rb.section = o.section;
                                    rb.status = 1;
                                    rb.payment_method = 2;
                                    rb.employee_type = (compSal[o.secName].staff) ? 1 : 2;
                                    rb.employee_count = compSal[o.secName].regular.bank.empCount;
                                    rb.salary_amount = compSal[o.secName].regular.bank.salary;
                                    rb.ot_amount = compSal[o.secName].regular.bank.ot;
                                    bulkValues.push(rb);
                                    var hb = {};
                                    hb.date = o.date;
                                    hb.section = o.section;
                                    hb.status = 2;
                                    hb.payment_method = 2;
                                    hb.employee_type = (compSal[o.secName].staff) ? 1 : 2;
                                    hb.employee_count = compSal[o.secName].hold.bank.empCount;
                                    hb.salary_amount = compSal[o.secName].hold.bank.salary;
                                    hb.ot_amount = compSal[o.secName].hold.bank.ot;
                                    bulkValues.push(hb);
                                    var hc = {};
                                    hc.date = o.date;
                                    hc.section = o.section;
                                    hc.status = 2;
                                    hc.payment_method = 1;
                                    hc.employee_type = (compSal[o.secName].staff) ? 1 : 2;
                                    hc.employee_count = compSal[o.secName].hold.cash.empCount;
                                    hc.salary_amount = compSal[o.secName].hold.cash.salary;
                                    hc.ot_amount = compSal[o.secName].hold.cash.ot;
                                    bulkValues.push(hc);
                                    if (compSal[o.secName].empCount > 0) {
                                        async.each(bulkValues, function(bV, cb_bV) {
                                            db.comparative_salary.create(bV).complete(function(err, cS) {
                                                if (err) {
                                                    var tmpD1 = new Date(QUERY.date);
                                                    database.sequelize.query(
                                                        'UPDATE `comparative_salary` ' +
                                                        'SET `employee_count` = ' + bV.employee_count + ', ' +
                                                        '`salary_amount` = ' + bV.salary_amount + ', ' +
                                                        '`ot_amount` = ' + bV.ot_amount + ' ' +
                                                        'WHERE MONTH(`date`) = "' + (tmpD1.getMonth() + 1) + '" ' +
                                                        'AND YEAR(`date`) = "' + tmpD1.getFullYear() + '" ' +
                                                        'AND `section` = ' + bV.section + ' ' +
                                                        'AND `status` = ' + bV.status + ' ' +
                                                        'AND `payment_method` = ' + bV.payment_method + ';'
                                                    ).complete(function(err, qD31) {
                                                        cb_bV();
                                                    });
                                                } else {
                                                    cb_bV();
                                                }
                                            });
                                        }, function(err) {
                                            cb_sec();
                                        });
                                    } else {
                                        cb_sec();
                                    }
                                });
                            } else {
                                cb_sec();
                            }
                        } else {
                            getComparativeSalarySearch(db, o, function(compSal) {
                                var bulkValues = [];
                                var rc = {};
                                rc.date = o.date;
                                rc.section = o.section;
                                rc.status = 1;
                                rc.payment_method = 1;
                                rc.employee_type = (compSal[o.secName].staff) ? 1 : 2;
                                rc.employee_count = compSal[o.secName].regular.cash.empCount;
                                rc.salary_amount = compSal[o.secName].regular.cash.salary;
                                rc.ot_amount = compSal[o.secName].regular.cash.ot;
                                bulkValues.push(rc);
                                var rb = {};
                                rb.date = o.date;
                                rb.section = o.section;
                                rb.status = 1;
                                rb.payment_method = 2;
                                rb.employee_type = (compSal[o.secName].staff) ? 1 : 2;
                                rb.employee_count = compSal[o.secName].regular.bank.empCount;
                                rb.salary_amount = compSal[o.secName].regular.bank.salary;
                                rb.ot_amount = compSal[o.secName].regular.bank.ot;
                                bulkValues.push(rb);
                                var hb = {};
                                hb.date = o.date;
                                hb.section = o.section;
                                hb.status = 2;
                                hb.payment_method = 2;
                                hb.employee_type = (compSal[o.secName].staff) ? 1 : 2;
                                hb.employee_count = compSal[o.secName].hold.bank.empCount;
                                hb.salary_amount = compSal[o.secName].hold.bank.salary;
                                hb.ot_amount = compSal[o.secName].hold.bank.ot;
                                bulkValues.push(hb);
                                var hc = {};
                                hc.date = o.date;
                                hc.section = o.section;
                                hc.status = 2;
                                hc.payment_method = 1;
                                hc.employee_type = (compSal[o.secName].staff) ? 1 : 2;
                                hc.employee_count = compSal[o.secName].hold.cash.empCount;
                                hc.salary_amount = compSal[o.secName].hold.cash.salary;
                                hc.ot_amount = compSal[o.secName].hold.cash.ot;
                                bulkValues.push(hc);
                                if (compSal[o.secName].empCount > 0) {
                                    db.comparative_salary.bulkCreate(bulkValues).complete(function(err, compSalaryCreateData) {
                                        cb_sec();
                                    });
                                } else {
                                    cb_sec();
                                }
                            });
                        }
                    });
                });
            }, function(err) {
                if (QUERY.download) {
                    var staffEmpCount = 0,
                        staffSalaryTotal = 0,
                        workerEmpCount = 0,
                        workerSalary = 0,
                        workerOTTotal = 0,
                        workerSalaryTotal = 0,
                        empCount = 0,
                        salaryTotal = 0,
                        otTotal = 0,
                        grossTotal = 0;
                    for (var key in staffJD) {
                        var regularTotal = parseFloat(staffJD[key].Regular.BANK.salary_amount + staffJD[key].Regular.CASH.salary_amount);
                        var holdTotal = parseFloat(staffJD[key].Hold.BANK.salary_amount + staffJD[key].Hold.CASH.salary_amount);
                        var holdEMP = parseInt(staffJD[key].Hold.BANK.employee_count + staffJD[key].Hold.CASH.employee_count);
                        var holdSalary = parseFloat(staffJD[key].Hold.BANK.salary_amount + staffJD[key].Hold.CASH.salary_amount);
                        var totalAmount = regularTotal + holdSalary;
                        staffEmpCount += parseInt(staffJD[key].Regular.BANK.employee_count + staffJD[key].Regular.CASH.employee_count + holdEMP);
                        staffSalaryTotal += parseFloat(regularTotal + holdSalary);
                        salaryTotal += parseFloat(regularTotal + holdSalary);
                        empCount += parseInt(staffJD[key].Regular.BANK.employee_count + staffJD[key].Regular.CASH.employee_count + holdEMP);
                        grossTotal += parseFloat(regularTotal + holdSalary);
                        staffHtml +=
                            '<tr>' +
                            '<td align="center" rowspan="4">' + staff + '</td>' +
                            '<td align="left" rowspan="4">' + staffJD[key].name.toUpperCase() + '</td>' +
                            '<td align="left" rowspan="2">REGULAR</td>' +
                            '<td align="left">BANK</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Regular.BANK.employee_count > 0) ?
                                staffJD[key].Regular.BANK.employee_count : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Regular.BANK.salary_amount > 0) ?
                                staffJD[key].Regular.BANK.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">-</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Regular.BANK.salary_amount > 0) ?
                                staffJD[key].Regular.BANK.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right" rowspan="2">' +
                            ((regularTotal > 0) ?
                                regularTotal.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right" rowspan="4">' +
                            ((totalAmount > 0) ?
                                totalAmount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td align="left">CASH</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Regular.CASH.employee_count > 0) ?
                                staffJD[key].Regular.CASH.employee_count : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Regular.CASH.salary_amount > 0) ?
                                staffJD[key].Regular.CASH.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">-</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Regular.CASH.salary_amount > 0) ?
                                staffJD[key].Regular.CASH.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '</tr>' +
                            '<tr style="background-color:#EEE;">' +
                            '<td align="left" rowspan="2">HOLD</td>' +
                            '<td align="left">BANK</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Hold.BANK.employee_count > 0) ?
                                staffJD[key].Hold.BANK.employee_count : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Hold.BANK.salary_amount > 0) ?
                                staffJD[key].Hold.BANK.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">-</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Hold.BANK.salary_amount > 0) ?
                                staffJD[key].Hold.BANK.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right" rowspan="2">' +
                            ((holdTotal > 0) ?
                                holdTotal.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '</tr>' +
                            '<tr style="background-color:#EEE;">' +
                            '<td align="left">CASH</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Hold.CASH.employee_count > 0) ?
                                staffJD[key].Hold.CASH.employee_count : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Hold.CASH.salary_amount > 0) ?
                                staffJD[key].Hold.CASH.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">-</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Hold.CASH.salary_amount > 0) ?
                                staffJD[key].Hold.CASH.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '</tr>';
                        // '<tr style="background-color:#EEE;">'+
                        //   '<td align="left">HOLD</td>'+
                        //   '<td align="left">CASH</td>'+
                        //   '<td align="right">'+
                        //     ((holdEMP>0)?holdEMP:'-')+
                        //   '</td>'+
                        //   '<td align="right">'+
                        //     ((holdSalary>0)?holdSalary.formatMoney(2, '.', ','):'-')+
                        //   '</td>'+
                        //   '<td align="right">-</td>'+
                        //   '<td align="right">'+
                        //     ((holdSalary>0)?holdSalary.formatMoney(2, '.', ','):'-')+
                        //   '</td>'+
                        //   '<td align="right">'+
                        //     ((holdSalary>0)?holdSalary.formatMoney(2, '.', ','):'-')+
                        //   '</td>'+
                        // '</tr>';
                        staff++;
                    }
                    for (var key in workerJD) {
                        var regularBankTotal = parseFloat(workerJD[key].Regular.BANK.salary_amount + workerJD[key].Regular.BANK.ot_amount);
                        var regularCashTotal = parseFloat(workerJD[key].Regular.CASH.salary_amount + workerJD[key].Regular.CASH.ot_amount);
                        var regularTotal = parseFloat(regularBankTotal + regularCashTotal);
                        var holdBankTotal = parseFloat(workerJD[key].Hold.BANK.salary_amount + workerJD[key].Hold.BANK.ot_amount);
                        var holdCashTotal = parseFloat(workerJD[key].Hold.CASH.salary_amount + workerJD[key].Hold.CASH.ot_amount);
                        var holdTotal = parseFloat(holdBankTotal + holdCashTotal);
                        // var holdEMP = parseInt(workerJD[key].Hold.BANK.employee_count+workerJD[key].Hold.CASH.employee_count);
                        // var holdSalary = parseFloat(workerJD[key].Hold.BANK.salary_amount+workerJD[key].Hold.CASH.salary_amount);
                        // var holdOT = parseFloat(workerJD[key].Hold.BANK.ot_amount+workerJD[key].Hold.CASH.ot_amount);
                        // var holdTotal = parseFloat(holdSalary+holdOT);
                        var totalAmount = regularTotal + holdTotal;
                        workerEmpCount += parseInt(workerJD[key].Regular.BANK.employee_count + workerJD[key].Regular.CASH.employee_count + holdEMP);
                        workerSalary += parseInt(workerJD[key].Regular.BANK.salary_amount + workerJD[key].Regular.CASH.salary_amount + workerJD[key].Hold.BANK.salary_amount + workerJD[key].Hold.CASH.salary_amount);
                        workerOTTotal += parseInt(workerJD[key].Regular.BANK.ot_amount + workerJD[key].Regular.CASH.ot_amount + workerJD[key].Hold.BANK.ot_amount + workerJD[key].Hold.CASH.ot_amount);
                        // workerOTTotal+=parseInt(workerJD[key].Regular.BANK.ot_amount+workerJD[key].Regular.CASH.ot_amount+holdOT);
                        // workerSalaryTotal+=parseInt(workerJD[key].Regular.BANK.salary_amount+workerJD[key].Regular.CASH.salary_amount+holdSalary+workerJD[key].Regular.BANK.ot_amount+workerJD[key].Regular.CASH.ot_amount+holdOT);
                        workerSalaryTotal += parseInt(workerJD[key].Regular.BANK.salary_amount + workerJD[key].Regular.CASH.salary_amount + holdSalary + workerJD[key].Regular.BANK.ot_amount + workerJD[key].Regular.CASH.ot_amount + workerJD[key].Hold.BANK.salary_amount + workerJD[key].Hold.CASH.salary_amount + workerJD[key].Hold.BANK.ot_amount + workerJD[key].Hold.CASH.ot_amount);
                        salaryTotal += parseInt(workerJD[key].Regular.BANK.salary_amount + workerJD[key].Regular.CASH.salary_amount + workerJD[key].Hold.BANK.salary_amount + workerJD[key].Hold.CASH.salary_amount);
                        otTotal += parseInt(workerJD[key].Regular.BANK.ot_amount + workerJD[key].Regular.CASH.ot_amount + workerJD[key].Hold.BANK.ot_amount + workerJD[key].Hold.CASH.ot_amount);
                        grossTotal += parseInt(workerJD[key].Regular.BANK.salary_amount + workerJD[key].Regular.CASH.salary_amount + workerJD[key].Hold.BANK.salary_amount + workerJD[key].Hold.CASH.salary_amount + workerJD[key].Regular.BANK.ot_amount + workerJD[key].Regular.CASH.ot_amount + workerJD[key].Hold.BANK.ot_amount + workerJD[key].Hold.CASH.ot_amount);
                        empCount += parseInt(workerJD[key].Regular.BANK.employee_count + workerJD[key].Regular.CASH.employee_count + workerJD[key].Hold.BANK.employee_count + workerJD[key].Hold.CASH.employee_count);
                        workerHtml +=
                            '<tr>' +
                            '<td align="center" rowspan="4">' + worker + '</td>' +
                            '<td align="left" rowspan="4">' + workerJD[key].name.toUpperCase() + '</td>' +
                            '<td align="left" rowspan="2">REGULAR</td>' +
                            '<td align="left">BANK</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Regular.BANK.employee_count > 0) ?
                                workerJD[key].Regular.BANK.employee_count : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Regular.BANK.salary_amount > 0) ?
                                workerJD[key].Regular.BANK.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Regular.BANK.ot_amount > 0) ?
                                workerJD[key].Regular.BANK.ot_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((regularBankTotal > 0) ? regularBankTotal.formatMoney(2, '.', ',') : '-') +
                            '</td>' +
                            '<td align="right" rowspan="2">' +
                            ((regularTotal > 0) ?
                                regularTotal.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right" rowspan="4">' +
                            ((totalAmount > 0) ?
                                totalAmount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td align="left">CASH</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Regular.CASH.employee_count > 0) ?
                                workerJD[key].Regular.CASH.employee_count : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Regular.CASH.salary_amount > 0) ?
                                workerJD[key].Regular.CASH.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Regular.CASH.ot_amount > 0) ?
                                workerJD[key].Regular.CASH.ot_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((regularCashTotal > 0) ? regularCashTotal.formatMoney(2, '.', ',') : '-') +
                            '</td>' +
                            '</tr>' +
                            '<tr style="background-color:#EEE;">' +
                            '<td align="left" rowspan="2">HOLD</td>' +
                            '<td align="left">BANK</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Hold.BANK.employee_count > 0) ?
                                workerJD[key].Hold.BANK.employee_count : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Hold.BANK.salary_amount > 0) ?
                                workerJD[key].Hold.BANK.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Hold.BANK.ot_amount > 0) ?
                                workerJD[key].Hold.BANK.ot_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((holdBankTotal > 0) ? holdBankTotal.formatMoney(2, '.', ',') : '-') +
                            '</td>' +
                            '<td align="right" rowspan="2">' +
                            ((holdTotal > 0) ?
                                holdTotal.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '</tr>' +
                            '<tr style="background-color:#EEE;">' +
                            '<td align="left">CASH</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Hold.CASH.employee_count > 0) ?
                                workerJD[key].Hold.CASH.employee_count : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Hold.CASH.salary_amount > 0) ?
                                workerJD[key].Hold.CASH.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Hold.CASH.ot_amount > 0) ?
                                workerJD[key].Hold.CASH.ot_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((holdCashTotal > 0) ? holdCashTotal.formatMoney(2, '.', ',') : '-') +
                            '</td>' +
                            '</tr>';
                        // '<tr style="background-color:#EEE;">'+
                        //   '<td align="left">HOLD</td>'+
                        //   '<td align="left">CASH</td>'+
                        //   '<td align="right">'+
                        //     ((holdEMP>0)?holdEMP:'-')+
                        //   '</td>'+
                        //   '<td align="right">'+
                        //     ((holdSalary>0)?holdSalary.formatMoney(2, '.', ','):'-')+
                        //   '</td>'+
                        //   '<td align="right">'+
                        //     ((holdOT>0)?holdOT.formatMoney(2, '.', ','):'-')+
                        //   '</td>'+
                        //   '<td align="right">'+
                        //     ((holdTotal>0)?holdTotal.formatMoney(2, '.', ','):'-')+
                        //   '</td>'+
                        //   '<td align="right">'+
                        //     ((holdTotal>0)?holdTotal.formatMoney(2, '.', ','):'-')+
                        //   '</td>'+
                        // '</tr>';
                        worker++;
                    }
                    staffHtml += '<tr style="background-color:#DDD;">' +
                        '<td align="left" style="border-right: 0px solid white;"></td>' +
                        '<td align="left" style="border-left: 0px solid white;" colspan="3"><b>SUB TOTAL</b></td>' +
                        '<td align="right"><b>' + staffEmpCount + '</b></td>' +
                        '<td align="right"><b>' + staffSalaryTotal.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>-</b></td>' +
                        '<td align="right" colspan="3"><b>' + staffSalaryTotal.formatMoney(2, '.', ',') + '</b></td>' +
                        '</tr></table></div><div id="pageBody">';
                    workerHtml += '<tr style="background-color:#DDD;">' +
                        '<td align="left" style="border-right: 0px solid white;"></td>' +
                        '<td align="left" style="border-left: 0px solid white;" colspan="3"><b>SUB TOTAL</b></td>' +
                        '<td align="right"><b>' + workerEmpCount + '</b></td>' +
                        '<td align="right"><b>' + workerSalary.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + workerOTTotal.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right" colspan="3"><b>' + workerSalaryTotal.formatMoney(2, '.', ',') + '</b></td>' +
                        '</tr>';
                    htmlData += staffHtml + workerHtml +
                        '<tr style="background-color:#DDD;">' +
                        '<td align="left" style="border-right: 0px solid white;"></td>' +
                        '<td align="left" style="border-left: 0px solid white;" colspan="3"><b>GRAND TOTAL</b></td>' +
                        '<td align="right"><b>' + empCount + '</b></td>' +
                        '<td align="right"><b>' + salaryTotal.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + otTotal.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right" colspan="3"><b>' + grossTotal.formatMoney(2, '.', ',') + '</b></td>' +
                        '</tr>' +
                        '</table><br /><hr /><br /><br />';

                    var staffRegularTotal = staffRegularBank + staffRegularCash,

                        staffRegularSecurityTotal = staffRegularSecurityBank + staffRegularSecurityCash, /// For FFL Factory Only

                        workerRegularTotal = workerRegularBank + workerRegularCash,
                        workerRegularOTTotal = workerRegularOTBank + workerRegularOTCash,
                        // regularBank = staffRegularBank+workerRegularBank+workerRegularOTBank,
                        regularBank = (folderName == 'FFL_FACTORY_HR' || folderName == 'FJL_HR') ? (staffRegularBank + staffRegularSecurityBank + workerRegularBank + workerRegularOTBank) : (staffRegularBank + workerRegularBank + workerRegularOTBank),
                        // regularCash = staffRegularCash+workerRegularCash+workerRegularOTCash,
                        regularCash = (folderName == 'FFL_FACTORY_HR' || folderName == 'FJL_HR') ? (staffRegularCash + staffRegularSecurityCash + workerRegularCash + workerRegularOTCash) : (staffRegularCash + workerRegularCash + workerRegularOTCash),
                        regularTotal = regularBank + regularCash,
                        staffHoldTotal = staffHoldBank + staffHoldCash,
                        workerHoldTotal = workerHoldBank + workerHoldCash,
                        workerHoldOTTotal = workerHoldOTBank + workerHoldOTCash,
                        holdBank = staffHoldBank + workerHoldBank + workerHoldOTBank,
                        holdCash = staffHoldCash + workerHoldCash + workerHoldOTCash,
                        holdTotal = holdBank + holdCash,
                        bankTotal = regularBank + holdBank,
                        cashTotal = regularCash + holdCash,
                        grossTotal = bankTotal + cashTotal;
                    htmlData +=
                        '<div id="outer" style="width:70%;page-break-before: always;>' +
                        '<div style="display: table;">' +
                        '<table style="width:100%;border: 0px solid white;">' +
                        '<tr style="border: 0px solid white;">' +
                        '<th style="background-color:#DDD;border: 1px solid black;" width="230" align="left">PARTICULARS</th>' +
                        '<th style="background-color:#DDD;border: 1px solid black;" width="140" align="right">BANK</th>' +
                        '<th style="background-color:#DDD;border: 1px solid black;" width="140" align="right">CASH</th>' +
                        '<th style="background-color:#DDD;border: 1px solid black;" width="140" align="right">TOTAL</th>' +
                        '</tr>' +
                        '<tr style="border: 0px solid white;">' +
                        '<td style="border-bottom: 0px solid white;" align="left">STAFF REGULAR: </td>' +
                        '<td style="border-bottom: 0px solid white;" align="right">' +
                        staffRegularBank.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-bottom: 0px solid white;" align="right">' +
                        staffRegularCash.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-bottom: 0px solid white;" align="right">' +
                        staffRegularTotal.formatMoney(2, '.', ',') +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="left">WORKER REGULAR: </td>' +
                        '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' +
                        workerRegularBank.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' +
                        workerRegularCash.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' +
                        workerRegularTotal.formatMoney(2, '.', ',') +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="border-top: 0px solid white;" align="left">WORKER REGULAR EX. OT: </td>' +
                        '<td style="border-top: 0px solid white;" align="right">' +
                        workerRegularOTBank.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-top: 0px solid white;" align="right">' +
                        workerRegularOTCash.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-top: 0px solid white;" align="right">' +
                        workerRegularOTTotal.formatMoney(2, '.', ',') +
                        '</td>' +
                        '</tr>' +
                        '<tr style="border: 0px solid white;">' +
                        '<td style="border-bottom: 0px solid white;" align="left">SECURITY REGULAR: </td>' +
                        '<td style="border-bottom: 0px solid white;" align="right">' +
                        staffRegularSecurityBank.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-bottom: 0px solid white;" align="right">' +
                        staffRegularSecurityCash.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-bottom: 0px solid white;" align="right">' +
                        staffRegularSecurityTotal.formatMoney(2, '.', ',') +
                        '</td>' +
                        '</tr>' +
                        '<tr style="background-color:#DDD;">' +
                        '<td align="left"><b>TOTAL </b></td>' +
                        '<td align="right"><b>' +
                        regularBank.formatMoney(2, '.', ',') +
                        '</b></td>' +
                        '<td align="right"><b>' +
                        regularCash.formatMoney(2, '.', ',') +
                        '</b></td>' +
                        '<td align="right"><b>' +
                        regularTotal.formatMoney(2, '.', ',') +
                        '</b></td>' +
                        '</tr>' +
                        '<tr style="border: 0px solid white;">' +
                        '<td style="border-bottom: 0px solid white;" align="left">STAFF HOLD: </td>' +
                        '<td style="border-bottom: 0px solid white;" align="right">' +
                        staffHoldBank.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-bottom: 0px solid white;" align="right">' +
                        staffHoldCash.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-bottom: 0px solid white;" align="right">' +
                        staffHoldTotal.formatMoney(2, '.', ',') +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="left">WORKER HOLD: </td>' +
                        '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' +
                        workerHoldBank.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' +
                        workerHoldCash.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' +
                        workerHoldTotal.formatMoney(2, '.', ',') +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="border-top: 0px solid white;" align="left">WORKER HOLD EX OT: </td>' +
                        '<td style="border-top: 0px solid white;" align="right">' +
                        workerHoldOTBank.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-top: 0px solid white;" align="right">' +
                        workerHoldOTCash.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-top: 0px solid white;" align="right">' +
                        workerHoldOTTotal.formatMoney(2, '.', ',') +
                        '</td>' +
                        '</tr>' +
                        '<tr style="background-color:#DDD;">' +
                        '<td align="left"><b>TOTAL </b></td>' +
                        '<td align="right"><b>' +
                        holdBank.formatMoney(2, '.', ',') +
                        '</b></td>' +
                        '<td align="right"><b>' +
                        holdCash.formatMoney(2, '.', ',') +
                        '</b></td>' +
                        '<td align="right"><b>' +
                        holdTotal.formatMoney(2, '.', ',') +
                        '</b></td>' +
                        '</tr>' +
                        '<tr style="background-color:#DDD;">' +
                        '<td><b>GRAND TOTAL </b></td>' +
                        '<td align="right"><b>' +
                        bankTotal.formatMoney(2, '.', ',') +
                        '</b></td>' +
                        '<td align="right"><b>' +
                        cashTotal.formatMoney(2, '.', ',') +
                        '</b></td>' +
                        '<td align="right"><b>' +
                        grossTotal.formatMoney(2, '.', ',') +
                        '</b></td>' +
                        '</tr>' +
                        '</table>' +
                        '</div>' +
                        '</div>' +
                        '</div></body></html>';
                    var options = {
                        format: 'A4',
                        orientation: "portrait",
                        header: {
                            height: "5mm",
                            contents: comparativeStatementHeader(d)
                        },
                        footer: {
                            height: "20mm",
                            contents: footerSContents()
                        },
                    };
                    pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                        socket.emit("CreateComparativeSalaryReport", 'downloaded');
                    });
                } else {
                    socket.emit("CreateComparativeSalaryReport", 'success');
                }
            });
        });
    });

    socket.on('CreateComparativeSalaryReportB', function(QUERY) {
        var returnData = [];
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var t = new Date(d);
        t.setDate(25);
        var f = new Date(d);
        f.setDate(26);
        f.setMonth(t.getMonth() - 1);
        var staff = 1,
            worker = 1,
            staffJD = {},
            workerJD = {},
            staffRegularBank = 0,

            staffRegularSecurityBank = 0, ////For FFL Factory Only

            staffRegularCash = 0,

            staffRegularSecurityCash = 0, ////For FFL Factory Only

            workerRegularBank = 0,
            workerRegularCash = 0,
            workerRegularOTBank = 0,
            workerRegularOTCash = 0,
            regularBank = 0,
            regularCash = 0,
            staffHoldBank = 0,
            staffHoldCash = 0,
            workerHoldBank = 0,
            workerHoldCash = 0,
            workerHoldOTBank = 0,
            workerHoldOTCash = 0,
            holdCash = 0,
            cashTotal = 0;
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            comparativeStatementReportHead() +
            '<h1 style="line-height: 0.8;font-size: 80%;">' +
            factoryName +
            '</h1>' +
            '<h2 style="line-height: 0.5;font-size: 65%;">' +
            'COMPARATIVE SALARY STATEMENT' +
            '</h2>' +
            '<h3 style="line-height: 0.5;font-size: 55%;">' +
            'FOR THE PERIOD OF ' +
            f.formatDate2() + ' TO ' +
            t.formatDate2() +
            '</h3>' +
            '<div id="pageBody">';
        var staffHtml = '<table style="width:100%;">' +
            '<tr style="background-color:#DDD;">' +
            '<td align="left" colspan="10"><big><b>STAFF</b></big></td>' +
            '</tr>' +
            '<tr>' +
            '<th width="10">#</th>' +
            '<th colspan="3">SECTION</th>' +
            '<th width="30"><small>EMP</small></th>' +
            '<th width="70">SALARY</th>' +
            '<th width="70">EX. OT</th>' +
            '<th width="150" colspan="3">TOTAL</th>' +
            '</tr>';
        var workerHtml = '<table style="width:100%;">' +
            '<tr style="background-color:#DDD;">' +
            '<td align="left" colspan="10"><big><b>WORKER</b></big></td>' +
            '</tr>' +
            '<tr>' +
            '<th width="10">#</th>' +
            '<th colspan="3">SECTION</th>' +
            '<th width="30"><small>EMP</small></th>' +
            '<th width="70">SALARY</th>' +
            '<th width="70">EX. OT</th>' +
            '<th width="150" colspan="3">TOTAL</th>' +
            '</tr>';
        getSection(db, QUERY, function(secData) {
            async.each(secData, function(sec, cb_sec) {
                var o = {};
                o.section = sec.id;
                o.secName = sec.name;
                o.updated = false;
                o.date = (QUERY.date) ? new Date(QUERY.date) : new Date();
                o.date.setDate(10);
                getComparativeSalaryListB(db, o, function(compData) {
                    async.each(compData, function(comp, cb_comp) {
                        if (QUERY.download) {
                            var SA = parseFloat(comp.salary_amount);
                            var OA = parseFloat(comp.ot_amount);
                            var TA = SA + OA;
                            var JsOb = JSON.parse(JSON.stringify(comp));
                            var compSecName = JsOb.sectionTable.name.toUpperCase();
                            if (folderName == 'FFL_FACTORY_HR' || folderName == 'FJL_HR') {
                                if (compSecName == 'SECURITY') {
                                    staffRegularSecurityBank += (comp.employee_type == 1 && comp.status == 1 && comp.payment_method == 2) ? SA : 0;
                                    staffRegularSecurityCash += (comp.employee_type == 1 && comp.status == 1 && comp.payment_method == 1) ? SA : 0;
                                } else {
                                    staffRegularBank += (comp.employee_type == 1 && comp.status == 1 && comp.payment_method == 2) ? SA : 0;
                                    staffRegularCash += (comp.employee_type == 1 && comp.status == 1 && comp.payment_method == 1) ? SA : 0;
                                }
                            } else {
                                staffRegularBank += (comp.employee_type == 1 && comp.status == 1 && comp.payment_method == 2) ? SA : 0;
                                staffRegularCash += (comp.employee_type == 1 && comp.status == 1 && comp.payment_method == 1) ? SA : 0;
                            }
                            staffHoldBank += (comp.employee_type == 1 && comp.status == 2 && comp.payment_method == 2) ? SA : 0;
                            staffHoldCash += (comp.employee_type == 1 && comp.status == 2 && comp.payment_method == 1) ? SA : 0;
                            workerRegularBank += (comp.employee_type == 2 && comp.status == 1 && comp.payment_method == 2) ? SA : 0;
                            workerRegularCash += (comp.employee_type == 2 && comp.status == 1 && comp.payment_method == 1) ? SA : 0;
                            workerRegularOTBank += (comp.employee_type == 2 && comp.status == 1 && comp.payment_method == 2) ? OA : 0;
                            workerRegularOTCash += (comp.employee_type == 2 && comp.status == 1 && comp.payment_method == 1) ? OA : 0;
                            workerHoldBank += (comp.employee_type == 2 && comp.status == 2 && comp.payment_method == 2) ? SA : 0;
                            workerHoldCash += (comp.employee_type == 2 && comp.status == 2 && comp.payment_method == 1) ? SA : 0;
                            workerHoldOTBank += (comp.employee_type == 2 && comp.status == 2 && comp.payment_method == 2) ? OA : 0;
                            workerHoldOTCash += (comp.employee_type == 2 && comp.status == 2 && comp.payment_method == 1) ? OA : 0;
                            if (comp.employee_type == 1) {
                                if (!staffJD[comp.sectionTable.name]) {
                                    staffJD[comp.sectionTable.name] = {};
                                    staffJD[comp.sectionTable.name].name = comp.sectionTable.name;
                                    staffJD[comp.sectionTable.name][comp.statu.name] = {};
                                    staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name] = {};
                                    staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                    staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                    staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                    staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                } else {
                                    if (!staffJD[comp.sectionTable.name][comp.statu.name]) {
                                        staffJD[comp.sectionTable.name][comp.statu.name] = {};
                                        staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name] = {};
                                        staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                        staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                        staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                        staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                    } else {
                                        if (!staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name]) {
                                            staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name] = {};
                                            staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                            staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                            staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                            staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                        } else {
                                            staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                            staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                            staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                            staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                        }
                                    }
                                }
                            } else {
                                if (!workerJD[comp.sectionTable.name]) {
                                    workerJD[comp.sectionTable.name] = {};
                                    workerJD[comp.sectionTable.name].name = comp.sectionTable.name;
                                    workerJD[comp.sectionTable.name][comp.statu.name] = {};
                                    workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name] = {};
                                    workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                    workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                    workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                    workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                } else {
                                    if (!workerJD[comp.sectionTable.name][comp.statu.name]) {
                                        workerJD[comp.sectionTable.name][comp.statu.name] = {};
                                        workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name] = {};
                                        workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                        workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                        workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                        workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                    } else {
                                        if (!workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name]) {
                                            workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name] = {};
                                            workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                            workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                            workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                            workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                        } else {
                                            workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                            workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                            workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                            workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                        }
                                    }
                                }
                            }
                        }
                        o.updated = true;
                        cb_comp();
                    }, function(err) {
                        if (o.updated) {
                            if (QUERY.update) {
                                getComparativeSalarySearchB(db, o, function(compSal) {
                                    var bulkValues = [];
                                    var rc = {};
                                    rc.date = o.date;
                                    rc.section = o.section;
                                    rc.status = 1;
                                    rc.payment_method = 1;
                                    rc.employee_type = (compSal[o.secName].staff) ? 1 : 2;
                                    rc.employee_count = compSal[o.secName].regular.cash.empCount;
                                    rc.salary_amount = compSal[o.secName].regular.cash.salary;
                                    rc.ot_amount = compSal[o.secName].regular.cash.ot;
                                    bulkValues.push(rc);
                                    var rb = {};
                                    rb.date = o.date;
                                    rb.section = o.section;
                                    rb.status = 1;
                                    rb.payment_method = 2;
                                    rb.employee_type = (compSal[o.secName].staff) ? 1 : 2;
                                    rb.employee_count = compSal[o.secName].regular.bank.empCount;
                                    rb.salary_amount = compSal[o.secName].regular.bank.salary;
                                    rb.ot_amount = compSal[o.secName].regular.bank.ot;
                                    bulkValues.push(rb);
                                    var hb = {};
                                    hb.date = o.date;
                                    hb.section = o.section;
                                    hb.status = 2;
                                    hb.payment_method = 2;
                                    hb.employee_type = (compSal[o.secName].staff) ? 1 : 2;
                                    hb.employee_count = compSal[o.secName].hold.bank.empCount;
                                    hb.salary_amount = compSal[o.secName].hold.bank.salary;
                                    hb.ot_amount = compSal[o.secName].hold.bank.ot;
                                    bulkValues.push(hb);
                                    var hc = {};
                                    hc.date = o.date;
                                    hc.section = o.section;
                                    hc.status = 2;
                                    hc.payment_method = 1;
                                    hc.employee_type = (compSal[o.secName].staff) ? 1 : 2;
                                    hc.employee_count = compSal[o.secName].hold.cash.empCount;
                                    hc.salary_amount = compSal[o.secName].hold.cash.salary;
                                    hc.ot_amount = compSal[o.secName].hold.cash.ot;
                                    bulkValues.push(hc);
                                    if (compSal[o.secName].empCount > 0) {
                                        async.each(bulkValues, function(bV, cb_bV) {
                                            db.comparative_salary_b.create(bV).complete(function(err, cS) {
                                                if (err) {
                                                    var tmpD1 = new Date(QUERY.date);
                                                    database.sequelize.query(
                                                        'UPDATE `comparative_salary_b` ' +
                                                        'SET `employee_count` = ' + bV.employee_count + ', ' +
                                                        '`salary_amount` = ' + bV.salary_amount + ', ' +
                                                        '`ot_amount` = ' + bV.ot_amount + ' ' +
                                                        'WHERE MONTH(`date`) = "' + (tmpD1.getMonth() + 1) + '" ' +
                                                        'AND YEAR(`date`) = "' + tmpD1.getFullYear() + '" ' +
                                                        'AND `section` = ' + bV.section + ' ' +
                                                        'AND `status` = ' + bV.status + ' ' +
                                                        'AND `payment_method` = ' + bV.payment_method + ';'
                                                    ).complete(function(err, qD31) {
                                                        cb_bV();
                                                    });
                                                } else {
                                                    cb_bV();
                                                }
                                            });
                                        }, function(err) {
                                            cb_sec();
                                        });
                                    } else {
                                        cb_sec();
                                    }
                                });
                            } else {
                                cb_sec();
                            }
                        } else {
                            getComparativeSalarySearchB(db, o, function(compSal) {
                                var bulkValues = [];
                                var rc = {};
                                rc.date = o.date;
                                rc.section = o.section;
                                rc.status = 1;
                                rc.payment_method = 1;
                                rc.employee_type = (compSal[o.secName].staff) ? 1 : 2;
                                rc.employee_count = compSal[o.secName].regular.cash.empCount;
                                rc.salary_amount = compSal[o.secName].regular.cash.salary;
                                rc.ot_amount = compSal[o.secName].regular.cash.ot;
                                bulkValues.push(rc);
                                var rb = {};
                                rb.date = o.date;
                                rb.section = o.section;
                                rb.status = 1;
                                rb.payment_method = 2;
                                rb.employee_type = (compSal[o.secName].staff) ? 1 : 2;
                                rb.employee_count = compSal[o.secName].regular.bank.empCount;
                                rb.salary_amount = compSal[o.secName].regular.bank.salary;
                                rb.ot_amount = compSal[o.secName].regular.bank.ot;
                                bulkValues.push(rb);
                                var hb = {};
                                hb.date = o.date;
                                hb.section = o.section;
                                hb.status = 2;
                                hb.payment_method = 2;
                                hb.employee_type = (compSal[o.secName].staff) ? 1 : 2;
                                hb.employee_count = compSal[o.secName].hold.bank.empCount;
                                hb.salary_amount = compSal[o.secName].hold.bank.salary;
                                hb.ot_amount = compSal[o.secName].hold.bank.ot;
                                bulkValues.push(hb);
                                var hc = {};
                                hc.date = o.date;
                                hc.section = o.section;
                                hc.status = 2;
                                hc.payment_method = 1;
                                hc.employee_type = (compSal[o.secName].staff) ? 1 : 2;
                                hc.employee_count = compSal[o.secName].hold.cash.empCount;
                                hc.salary_amount = compSal[o.secName].hold.cash.salary;
                                hc.ot_amount = compSal[o.secName].hold.cash.ot;
                                bulkValues.push(hc);
                                if (compSal[o.secName].empCount > 0) {
                                    db.comparative_salary_b.bulkCreate(bulkValues).complete(function(err, compSalaryCreateData) {
                                        cb_sec();
                                    });
                                } else {
                                    cb_sec();
                                }
                            });
                        }
                    });
                });
            }, function(err) {
                if (QUERY.download) {
                    var staffEmpCount = 0,
                        staffSalaryTotal = 0,
                        workerEmpCount = 0,
                        workerSalary = 0,
                        workerOTTotal = 0,
                        workerSalaryTotal = 0,
                        empCount = 0,
                        salaryTotal = 0,
                        otTotal = 0,
                        grossTotal = 0;
                    for (var key in staffJD) {
                        var regularTotal = parseFloat(staffJD[key].Regular.BANK.salary_amount + staffJD[key].Regular.CASH.salary_amount);
                        var holdTotal = parseFloat(staffJD[key].Hold.BANK.salary_amount + staffJD[key].Hold.CASH.salary_amount);
                        var holdEMP = parseInt(staffJD[key].Hold.BANK.employee_count + staffJD[key].Hold.CASH.employee_count);
                        var holdSalary = parseFloat(staffJD[key].Hold.BANK.salary_amount + staffJD[key].Hold.CASH.salary_amount);
                        var totalAmount = regularTotal + holdSalary;
                        staffEmpCount += parseInt(staffJD[key].Regular.BANK.employee_count + staffJD[key].Regular.CASH.employee_count + holdEMP);
                        staffSalaryTotal += parseFloat(regularTotal + holdSalary);
                        salaryTotal += parseFloat(regularTotal + holdSalary);
                        empCount += parseInt(staffJD[key].Regular.BANK.employee_count + staffJD[key].Regular.CASH.employee_count + holdEMP);
                        grossTotal += parseFloat(regularTotal + holdSalary);
                        staffHtml +=
                            '<tr>' +
                            '<td align="center" rowspan="4">' + staff + '</td>' +
                            '<td align="left" rowspan="4">' + staffJD[key].name.toUpperCase() + '</td>' +
                            '<td align="left" rowspan="2">REGULAR</td>' +
                            '<td align="left">BANK</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Regular.BANK.employee_count > 0) ?
                                staffJD[key].Regular.BANK.employee_count : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Regular.BANK.salary_amount > 0) ?
                                staffJD[key].Regular.BANK.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">-</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Regular.BANK.salary_amount > 0) ?
                                staffJD[key].Regular.BANK.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right" rowspan="2">' +
                            ((regularTotal > 0) ?
                                regularTotal.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right" rowspan="4">' +
                            ((totalAmount > 0) ?
                                totalAmount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td align="left">CASH</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Regular.CASH.employee_count > 0) ?
                                staffJD[key].Regular.CASH.employee_count : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Regular.CASH.salary_amount > 0) ?
                                staffJD[key].Regular.CASH.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">-</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Regular.CASH.salary_amount > 0) ?
                                staffJD[key].Regular.CASH.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '</tr>' +
                            '<tr style="background-color:#EEE;">' +
                            '<td align="left" rowspan="2">HOLD</td>' +
                            '<td align="left">BANK</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Hold.BANK.employee_count > 0) ?
                                staffJD[key].Hold.BANK.employee_count : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Hold.BANK.salary_amount > 0) ?
                                staffJD[key].Hold.BANK.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">-</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Hold.BANK.salary_amount > 0) ?
                                staffJD[key].Hold.BANK.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right" rowspan="2">' +
                            ((holdTotal > 0) ?
                                holdTotal.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '</tr>' +
                            '<tr style="background-color:#EEE;">' +
                            '<td align="left">CASH</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Hold.CASH.employee_count > 0) ?
                                staffJD[key].Hold.CASH.employee_count : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Hold.CASH.salary_amount > 0) ?
                                staffJD[key].Hold.CASH.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">-</td>' +
                            '<td align="right">' +
                            ((staffJD[key].Hold.CASH.salary_amount > 0) ?
                                staffJD[key].Hold.CASH.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '</tr>';
                        staff++;
                    }
                    for (var key in workerJD) {
                        var regularBankTotal = parseFloat(workerJD[key].Regular.BANK.salary_amount + workerJD[key].Regular.BANK.ot_amount);
                        var regularCashTotal = parseFloat(workerJD[key].Regular.CASH.salary_amount + workerJD[key].Regular.CASH.ot_amount);
                        var regularTotal = parseFloat(regularBankTotal + regularCashTotal);
                        var holdBankTotal = parseFloat(workerJD[key].Hold.BANK.salary_amount + workerJD[key].Hold.BANK.ot_amount);
                        var holdCashTotal = parseFloat(workerJD[key].Hold.CASH.salary_amount + workerJD[key].Hold.CASH.ot_amount);
                        var holdTotal = parseFloat(holdBankTotal + holdCashTotal);
                        var totalAmount = regularTotal + holdTotal;
                        workerEmpCount += parseInt(workerJD[key].Regular.BANK.employee_count + workerJD[key].Regular.CASH.employee_count + holdEMP);
                        workerSalary += parseInt(workerJD[key].Regular.BANK.salary_amount + workerJD[key].Regular.CASH.salary_amount + workerJD[key].Hold.BANK.salary_amount + workerJD[key].Hold.CASH.salary_amount);
                        workerOTTotal += parseInt(workerJD[key].Regular.BANK.ot_amount + workerJD[key].Regular.CASH.ot_amount + workerJD[key].Hold.BANK.ot_amount + workerJD[key].Hold.CASH.ot_amount);
                        workerSalaryTotal += parseInt(workerJD[key].Regular.BANK.salary_amount + workerJD[key].Regular.CASH.salary_amount + holdSalary + workerJD[key].Regular.BANK.ot_amount + workerJD[key].Regular.CASH.ot_amount + workerJD[key].Hold.BANK.salary_amount + workerJD[key].Hold.CASH.salary_amount + workerJD[key].Hold.BANK.ot_amount + workerJD[key].Hold.CASH.ot_amount);
                        salaryTotal += parseInt(workerJD[key].Regular.BANK.salary_amount + workerJD[key].Regular.CASH.salary_amount + workerJD[key].Hold.BANK.salary_amount + workerJD[key].Hold.CASH.salary_amount);
                        otTotal += parseInt(workerJD[key].Regular.BANK.ot_amount + workerJD[key].Regular.CASH.ot_amount + workerJD[key].Hold.BANK.ot_amount + workerJD[key].Hold.CASH.ot_amount);
                        grossTotal += parseInt(workerJD[key].Regular.BANK.salary_amount + workerJD[key].Regular.CASH.salary_amount + workerJD[key].Hold.BANK.salary_amount + workerJD[key].Hold.CASH.salary_amount + workerJD[key].Regular.BANK.ot_amount + workerJD[key].Regular.CASH.ot_amount + workerJD[key].Hold.BANK.ot_amount + workerJD[key].Hold.CASH.ot_amount);
                        empCount += parseInt(workerJD[key].Regular.BANK.employee_count + workerJD[key].Regular.CASH.employee_count + workerJD[key].Hold.BANK.employee_count + workerJD[key].Hold.CASH.employee_count);
                        workerHtml +=
                            '<tr>' +
                            '<td align="center" rowspan="4">' + worker + '</td>' +
                            '<td align="left" rowspan="4">' + workerJD[key].name.toUpperCase() + '</td>' +
                            '<td align="left" rowspan="2">REGULAR</td>' +
                            '<td align="left">BANK</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Regular.BANK.employee_count > 0) ?
                                workerJD[key].Regular.BANK.employee_count : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Regular.BANK.salary_amount > 0) ?
                                workerJD[key].Regular.BANK.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Regular.BANK.ot_amount > 0) ?
                                workerJD[key].Regular.BANK.ot_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((regularBankTotal > 0) ? regularBankTotal.formatMoney(2, '.', ',') : '-') +
                            '</td>' +
                            '<td align="right" rowspan="2">' +
                            ((regularTotal > 0) ?
                                regularTotal.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right" rowspan="4">' +
                            ((totalAmount > 0) ?
                                totalAmount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td align="left">CASH</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Regular.CASH.employee_count > 0) ?
                                workerJD[key].Regular.CASH.employee_count : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Regular.CASH.salary_amount > 0) ?
                                workerJD[key].Regular.CASH.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Regular.CASH.ot_amount > 0) ?
                                workerJD[key].Regular.CASH.ot_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((regularCashTotal > 0) ? regularCashTotal.formatMoney(2, '.', ',') : '-') +
                            '</td>' +
                            '</tr>' +
                            '<tr style="background-color:#EEE;">' +
                            '<td align="left" rowspan="2">HOLD</td>' +
                            '<td align="left">BANK</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Hold.BANK.employee_count > 0) ?
                                workerJD[key].Hold.BANK.employee_count : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Hold.BANK.salary_amount > 0) ?
                                workerJD[key].Hold.BANK.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Hold.BANK.ot_amount > 0) ?
                                workerJD[key].Hold.BANK.ot_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((holdBankTotal > 0) ? holdBankTotal.formatMoney(2, '.', ',') : '-') +
                            '</td>' +
                            '<td align="right" rowspan="2">' +
                            ((holdTotal > 0) ?
                                holdTotal.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '</tr>' +
                            '<tr style="background-color:#EEE;">' +
                            '<td align="left">CASH</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Hold.CASH.employee_count > 0) ?
                                workerJD[key].Hold.CASH.employee_count : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Hold.CASH.salary_amount > 0) ?
                                workerJD[key].Hold.CASH.salary_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((workerJD[key].Hold.CASH.ot_amount > 0) ?
                                workerJD[key].Hold.CASH.ot_amount.formatMoney(2, '.', ',') : '-'
                            ) +
                            '</td>' +
                            '<td align="right">' +
                            ((holdCashTotal > 0) ? holdCashTotal.formatMoney(2, '.', ',') : '-') +
                            '</td>' +
                            '</tr>';
                        worker++;
                    }
                    staffHtml += '<tr style="background-color:#DDD;">' +
                        '<td align="left" style="border-right: 0px solid white;"></td>' +
                        '<td align="left" style="border-left: 0px solid white;" colspan="3"><b>SUB TOTAL</b></td>' +
                        '<td align="right"><b>' + staffEmpCount + '</b></td>' +
                        '<td align="right"><b>' + staffSalaryTotal.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>-</b></td>' +
                        '<td align="right" colspan="3"><b>' + staffSalaryTotal.formatMoney(2, '.', ',') + '</b></td>' +
                        '</tr></table></div><div id="pageBody">';
                    workerHtml += '<tr style="background-color:#DDD;">' +
                        '<td align="left" style="border-right: 0px solid white;"></td>' +
                        '<td align="left" style="border-left: 0px solid white;" colspan="3"><b>SUB TOTAL</b></td>' +
                        '<td align="right"><b>' + workerEmpCount + '</b></td>' +
                        '<td align="right"><b>' + workerSalary.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + workerOTTotal.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right" colspan="3"><b>' + workerSalaryTotal.formatMoney(2, '.', ',') + '</b></td>' +
                        '</tr>';
                    htmlData += staffHtml + workerHtml +
                        '<tr style="background-color:#DDD;">' +
                        '<td align="left" style="border-right: 0px solid white;"></td>' +
                        '<td align="left" style="border-left: 0px solid white;" colspan="3"><b>GRAND TOTAL</b></td>' +
                        '<td align="right"><b>' + empCount + '</b></td>' +
                        '<td align="right"><b>' + salaryTotal.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right"><b>' + otTotal.formatMoney(2, '.', ',') + '</b></td>' +
                        '<td align="right" colspan="3"><b>' + grossTotal.formatMoney(2, '.', ',') + '</b></td>' +
                        '</tr>' +
                        '</table><br /><hr /><br /><br />';

                    var staffRegularTotal = staffRegularBank + staffRegularCash,

                        staffRegularSecurityTotal = staffRegularSecurityBank + staffRegularSecurityCash, /// For FFL Factory Only

                        workerRegularTotal = workerRegularBank + workerRegularCash,
                        workerRegularOTTotal = workerRegularOTBank + workerRegularOTCash,
                        regularBank = (folderName == 'FFL_FACTORY_HR' || folderName == 'FJL_HR') ? (staffRegularBank + staffRegularSecurityBank + workerRegularBank + workerRegularOTBank) : (staffRegularBank + workerRegularBank + workerRegularOTBank),
                        regularCash = (folderName == 'FFL_FACTORY_HR' || folderName == 'FJL_HR') ? (staffRegularCash + staffRegularSecurityCash + workerRegularCash + workerRegularOTCash) : (staffRegularCash + workerRegularCash + workerRegularOTCash),
                        regularTotal = regularBank + regularCash,
                        staffHoldTotal = staffHoldBank + staffHoldCash,
                        workerHoldTotal = workerHoldBank + workerHoldCash,
                        workerHoldOTTotal = workerHoldOTBank + workerHoldOTCash,
                        holdBank = staffHoldBank + workerHoldBank + workerHoldOTBank,
                        holdCash = staffHoldCash + workerHoldCash + workerHoldOTCash,
                        holdTotal = holdBank + holdCash,
                        bankTotal = regularBank + holdBank,
                        cashTotal = regularCash + holdCash,
                        grossTotal = bankTotal + cashTotal;
                    htmlData +=
                        '<div id="outer" style="width:70%;page-break-before: always;>' +
                        '<div style="display: table;">' +
                        '<table style="width:100%;border: 0px solid white;">' +
                        '<tr style="border: 0px solid white;">' +
                        '<th style="background-color:#DDD;border: 1px solid black;" width="230" align="left">PARTICULARS</th>' +
                        '<th style="background-color:#DDD;border: 1px solid black;" width="140" align="right">BANK</th>' +
                        '<th style="background-color:#DDD;border: 1px solid black;" width="140" align="right">CASH</th>' +
                        '<th style="background-color:#DDD;border: 1px solid black;" width="140" align="right">TOTAL</th>' +
                        '</tr>' +
                        '<tr style="border: 0px solid white;">' +
                        '<td style="border-bottom: 0px solid white;" align="left">STAFF REGULAR: </td>' +
                        '<td style="border-bottom: 0px solid white;" align="right">' +
                        staffRegularBank.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-bottom: 0px solid white;" align="right">' +
                        staffRegularCash.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-bottom: 0px solid white;" align="right">' +
                        staffRegularTotal.formatMoney(2, '.', ',') +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="left">WORKER REGULAR: </td>' +
                        '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' +
                        workerRegularBank.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' +
                        workerRegularCash.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' +
                        workerRegularTotal.formatMoney(2, '.', ',') +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="border-top: 0px solid white;" align="left">WORKER REGULAR EX. OT: </td>' +
                        '<td style="border-top: 0px solid white;" align="right">' +
                        workerRegularOTBank.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-top: 0px solid white;" align="right">' +
                        workerRegularOTCash.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-top: 0px solid white;" align="right">' +
                        workerRegularOTTotal.formatMoney(2, '.', ',') +
                        '</td>' +
                        '</tr>' +
                        '<tr style="border: 0px solid white;">' +
                        '<td style="border-bottom: 0px solid white;" align="left">SECURITY REGULAR: </td>' +
                        '<td style="border-bottom: 0px solid white;" align="right">' +
                        staffRegularSecurityBank.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-bottom: 0px solid white;" align="right">' +
                        staffRegularSecurityCash.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-bottom: 0px solid white;" align="right">' +
                        staffRegularSecurityTotal.formatMoney(2, '.', ',') +
                        '</td>' +
                        '</tr>' +
                        '<tr style="background-color:#DDD;">' +
                        '<td align="left"><b>TOTAL </b></td>' +
                        '<td align="right"><b>' +
                        regularBank.formatMoney(2, '.', ',') +
                        '</b></td>' +
                        '<td align="right"><b>' +
                        regularCash.formatMoney(2, '.', ',') +
                        '</b></td>' +
                        '<td align="right"><b>' +
                        regularTotal.formatMoney(2, '.', ',') +
                        '</b></td>' +
                        '</tr>' +
                        '<tr style="border: 0px solid white;">' +
                        '<td style="border-bottom: 0px solid white;" align="left">STAFF HOLD: </td>' +
                        '<td style="border-bottom: 0px solid white;" align="right">' +
                        staffHoldBank.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-bottom: 0px solid white;" align="right">' +
                        staffHoldCash.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-bottom: 0px solid white;" align="right">' +
                        staffHoldTotal.formatMoney(2, '.', ',') +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="left">WORKER HOLD: </td>' +
                        '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' +
                        workerHoldBank.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' +
                        workerHoldCash.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' +
                        workerHoldTotal.formatMoney(2, '.', ',') +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="border-top: 0px solid white;" align="left">WORKER HOLD EX OT: </td>' +
                        '<td style="border-top: 0px solid white;" align="right">' +
                        workerHoldOTBank.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-top: 0px solid white;" align="right">' +
                        workerHoldOTCash.formatMoney(2, '.', ',') +
                        '</td>' +
                        '<td style="border-top: 0px solid white;" align="right">' +
                        workerHoldOTTotal.formatMoney(2, '.', ',') +
                        '</td>' +
                        '</tr>' +
                        '<tr style="background-color:#DDD;">' +
                        '<td align="left"><b>TOTAL </b></td>' +
                        '<td align="right"><b>' +
                        holdBank.formatMoney(2, '.', ',') +
                        '</b></td>' +
                        '<td align="right"><b>' +
                        holdCash.formatMoney(2, '.', ',') +
                        '</b></td>' +
                        '<td align="right"><b>' +
                        holdTotal.formatMoney(2, '.', ',') +
                        '</b></td>' +
                        '</tr>' +
                        '<tr style="background-color:#DDD;">' +
                        '<td><b>GRAND TOTAL </b></td>' +
                        '<td align="right"><b>' +
                        bankTotal.formatMoney(2, '.', ',') +
                        '</b></td>' +
                        '<td align="right"><b>' +
                        cashTotal.formatMoney(2, '.', ',') +
                        '</b></td>' +
                        '<td align="right"><b>' +
                        grossTotal.formatMoney(2, '.', ',') +
                        '</b></td>' +
                        '</tr>' +
                        '</table>' +
                        '</div>' +
                        '</div>' +
                        '</div></body></html>';
                    var options = {
                        format: 'A4',
                        orientation: "portrait",
                        header: {
                            height: "5mm",
                            contents: comparativeStatementHeader(d)
                        },
                        footer: {
                            height: "20mm",
                            contents: footerSContents()
                        },
                    };
                    pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                        socket.emit("CreateComparativeSalaryReportB", 'downloaded');
                    });
                } else {
                    socket.emit("CreateComparativeSalaryReportB", 'success');
                }
            });
        });
    });

    socket.on('DownloadComparativeSalaryReport', function(QUERY) {
        var returnData = [];
        var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
        var t = new Date(d);
        t.setDate(25);
        var f = new Date(d);
        f.setDate(26);
        f.setMonth(t.getMonth() - 1);
        var staff = 1,
            worker = 1,
            staffJD = {},
            workerJD = {},
            staffRegularBank = 0,
            staffRegularCash = 0,
            workerRegularBank = 0,
            workerRegularCash = 0,
            workerRegularOTBank = 0,
            workerRegularOTCash = 0,
            regularBank = 0,
            regularCash = 0,
            staffHoldBank = 0,
            staffHoldCash = 0,
            workerHoldBank = 0,
            workerHoldCash = 0,
            workerHoldOTBank = 0,
            workerHoldOTCash = 0,
            holdCash = 0,
            cashTotal = 0;
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            comparativeStatementReportHead() +
            '<h1 style="line-height: 0.8;font-size: 80%;">' +
            factoryName +
            '</h1>' +
            '<h2 style="line-height: 0.5;font-size: 65%;">' +
            'COMPARATIVE SALARY STATEMENT' +
            '</h2>' +
            '<h3 style="line-height: 0.5;font-size: 55%;">' +
            'FOR THE PERIOD OF ' +
            f.formatDate2() + ' TO ' +
            t.formatDate2() +
            '</h3>' +
            '<div id="pageBody">';
        var staffHtml = '<table style="width:100%;">' +
            '<tr style="background-color:#DDD;">' +
            '<td align="left" colspan="10"><big><b>STAFF</b></big></td>' +
            '</tr>' +
            '<tr>' +
            '<th width="10">#</th>' +
            '<th colspan="3">SECTION</th>' +
            '<th width="30"><small>EMP</small></th>' +
            '<th width="70">SALARY</th>' +
            '<th width="70">EX. OT</th>' +
            '<th width="150" colspan="3">TOTAL</th>' +
            '</tr>';
        var workerHtml = '<table style="width:100%;">' +
            '<tr style="background-color:#DDD;">' +
            '<td align="left" colspan="10"><big><b>WORKER</b></big></td>' +
            '</tr>' +
            '<tr>' +
            '<th width="10">#</th>' +
            '<th colspan="3">SECTION</th>' +
            '<th width="30"><small>EMP</small></th>' +
            '<th width="70">SALARY</th>' +
            '<th width="70">EX. OT</th>' +
            '<th width="150" colspan="3">TOTAL</th>' +
            '</tr>';
        getSection(db, QUERY, function(secData) {
            async.each(secData, function(sec, cb_sec) {
                var o = {};
                // o.section = 5;
                o.section = sec.id;
                o.secName = sec.name;
                o.updated = false;
                o.date = (QUERY.date) ? new Date(QUERY.date) : new Date();
                o.date.setDate(10);
                getComparativeSalaryList(db, o, function(compData) {
                    async.each(compData, function(comp, cb_comp) {
                        var SA = parseFloat(comp.salary_amount);
                        var OA = parseFloat(comp.ot_amount);
                        var TA = SA + OA;
                        staffRegularBank += (comp.employee_type == 1 && comp.status == 1 && comp.payment_method == 2) ? SA : 0;
                        staffRegularCash += (comp.employee_type == 1 && comp.status == 1 && comp.payment_method == 1) ? SA : 0;
                        staffHoldBank += (comp.employee_type == 1 && comp.status == 2 && comp.payment_method == 2) ? SA : 0;
                        staffHoldCash += (comp.employee_type == 1 && comp.status == 2 && comp.payment_method == 1) ? SA : 0;
                        workerRegularBank += (comp.employee_type == 2 && comp.status == 1 && comp.payment_method == 2) ? SA : 0;
                        workerRegularCash += (comp.employee_type == 2 && comp.status == 1 && comp.payment_method == 1) ? SA : 0;
                        workerRegularOTBank += (comp.employee_type == 2 && comp.status == 1 && comp.payment_method == 2) ? OA : 0;
                        workerRegularOTCash += (comp.employee_type == 2 && comp.status == 1 && comp.payment_method == 1) ? OA : 0;
                        // workerHoldBank+=(comp.employee_type==2&&comp.status==2&&comp.payment_method==2)? TA:0;
                        // workerHoldCash+=(comp.employee_type==2&&comp.status==2&&comp.payment_method==1)? TA:0;
                        workerHoldBank += (comp.employee_type == 2 && comp.status == 2 && comp.payment_method == 2) ? SA : 0;
                        workerHoldCash += (comp.employee_type == 2 && comp.status == 2 && comp.payment_method == 1) ? SA : 0;
                        workerHoldOTBank += (comp.employee_type == 2 && comp.status == 2 && comp.payment_method == 2) ? OA : 0;
                        workerHoldOTCash += (comp.employee_type == 2 && comp.status == 2 && comp.payment_method == 1) ? OA : 0;

                        // returnData.push(comp);
                        if (comp.employee_type == 1) {
                            if (!staffJD[comp.sectionTable.name]) {
                                staffJD[comp.sectionTable.name] = {};
                                staffJD[comp.sectionTable.name].name = comp.sectionTable.name;
                                staffJD[comp.sectionTable.name][comp.statu.name] = {};
                                staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name] = {};
                                staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                            } else {
                                if (!staffJD[comp.sectionTable.name][comp.statu.name]) {
                                    staffJD[comp.sectionTable.name][comp.statu.name] = {};
                                    staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name] = {};
                                    staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                    staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                    staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                    staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                } else {
                                    if (!staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name]) {
                                        staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name] = {};
                                        staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                        staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                        staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                        staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                    } else {
                                        staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                        staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                        staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                        staffJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                    }
                                }
                            }
                        } else {
                            if (!workerJD[comp.sectionTable.name]) {
                                workerJD[comp.sectionTable.name] = {};
                                workerJD[comp.sectionTable.name].name = comp.sectionTable.name;
                                workerJD[comp.sectionTable.name][comp.statu.name] = {};
                                workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name] = {};
                                workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                            } else {
                                if (!workerJD[comp.sectionTable.name][comp.statu.name]) {
                                    workerJD[comp.sectionTable.name][comp.statu.name] = {};
                                    workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name] = {};
                                    workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                    workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                    workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                    workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                } else {
                                    if (!workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name]) {
                                        workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name] = {};
                                        workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                        workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                        workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                        workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                    } else {
                                        workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                        workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].employee_count = comp.employee_count;
                                        workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].salary_amount = comp.salary_amount;
                                        workerJD[comp.sectionTable.name][comp.statu.name][comp.paymentMethodTable.name].ot_amount = comp.ot_amount;
                                    }
                                }
                            }
                        }
                        cb_comp();
                    }, function(err) {
                        cb_sec();
                    });
                });
            }, function(err) {
                var staffEmpCount = 0,
                    staffSalaryTotal = 0,
                    workerEmpCount = 0,
                    workerSalary = 0,
                    workerOTTotal = 0,
                    workerSalaryTotal = 0,
                    empCount = 0,
                    salaryTotal = 0,
                    otTotal = 0,
                    grossTotal = 0;
                for (var key in staffJD) {
                    var regularTotal = parseFloat(staffJD[key].Regular.BANK.salary_amount + staffJD[key].Regular.CASH.salary_amount);
                    var holdTotal = parseFloat(staffJD[key].Hold.BANK.salary_amount + staffJD[key].Hold.CASH.salary_amount);
                    var holdEMP = parseInt(staffJD[key].Hold.BANK.employee_count + staffJD[key].Hold.CASH.employee_count);
                    var holdSalary = parseFloat(staffJD[key].Hold.BANK.salary_amount + staffJD[key].Hold.CASH.salary_amount);
                    var totalAmount = regularTotal + holdSalary;
                    staffEmpCount += parseInt(staffJD[key].Regular.BANK.employee_count + staffJD[key].Regular.CASH.employee_count + holdEMP);
                    staffSalaryTotal += parseFloat(regularTotal + holdSalary);
                    salaryTotal += parseFloat(regularTotal + holdSalary);
                    empCount += parseInt(staffJD[key].Regular.BANK.employee_count + staffJD[key].Regular.CASH.employee_count + holdEMP);
                    grossTotal += parseFloat(regularTotal + holdSalary);
                    staffHtml +=
                        '<tr>' +
                        '<td align="center" rowspan="4">' + staff + '</td>' +
                        '<td align="left" rowspan="4">' + staffJD[key].name.toUpperCase() + '</td>' +
                        '<td align="left" rowspan="2">REGULAR</td>' +
                        '<td align="left">BANK</td>' +
                        '<td align="right">' +
                        ((staffJD[key].Regular.BANK.employee_count > 0) ?
                            staffJD[key].Regular.BANK.employee_count : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((staffJD[key].Regular.BANK.salary_amount > 0) ?
                            staffJD[key].Regular.BANK.salary_amount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">-</td>' +
                        '<td align="right">' +
                        ((staffJD[key].Regular.BANK.salary_amount > 0) ?
                            staffJD[key].Regular.BANK.salary_amount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right" rowspan="2">' +
                        ((regularTotal > 0) ?
                            regularTotal.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right" rowspan="4">' +
                        ((totalAmount > 0) ?
                            totalAmount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td align="left">CASH</td>' +
                        '<td align="right">' +
                        ((staffJD[key].Regular.CASH.employee_count > 0) ?
                            staffJD[key].Regular.CASH.employee_count : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((staffJD[key].Regular.CASH.salary_amount > 0) ?
                            staffJD[key].Regular.CASH.salary_amount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">-</td>' +
                        '<td align="right">' +
                        ((staffJD[key].Regular.CASH.salary_amount > 0) ?
                            staffJD[key].Regular.CASH.salary_amount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '</tr>' +
                        '<tr style="background-color:#EEE;">' +
                        '<td align="left" rowspan="2">HOLD</td>' +
                        '<td align="left">BANK</td>' +
                        '<td align="right">' +
                        ((staffJD[key].Hold.BANK.employee_count > 0) ?
                            staffJD[key].Hold.BANK.employee_count : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((staffJD[key].Hold.BANK.salary_amount > 0) ?
                            staffJD[key].Hold.BANK.salary_amount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">-</td>' +
                        '<td align="right">' +
                        ((staffJD[key].Hold.BANK.salary_amount > 0) ?
                            staffJD[key].Hold.BANK.salary_amount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right" rowspan="2">' +
                        ((holdTotal > 0) ?
                            holdTotal.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '</tr>' +
                        '<tr style="background-color:#EEE;">' +
                        '<td align="left">CASH</td>' +
                        '<td align="right">' +
                        ((staffJD[key].Hold.CASH.employee_count > 0) ?
                            staffJD[key].Hold.CASH.employee_count : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((staffJD[key].Hold.CASH.salary_amount > 0) ?
                            staffJD[key].Hold.CASH.salary_amount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">-</td>' +
                        '<td align="right">' +
                        ((staffJD[key].Hold.CASH.salary_amount > 0) ?
                            staffJD[key].Hold.CASH.salary_amount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '</tr>';
                    staff++;
                }
                for (var key in workerJD) {
                    var regularBankTotal = parseFloat(workerJD[key].Regular.BANK.salary_amount + workerJD[key].Regular.BANK.ot_amount);
                    var regularCashTotal = parseFloat(workerJD[key].Regular.CASH.salary_amount + workerJD[key].Regular.CASH.ot_amount);
                    var regularTotal = parseFloat(regularBankTotal + regularCashTotal);
                    var holdBankTotal = parseFloat(workerJD[key].Hold.BANK.salary_amount + workerJD[key].Hold.BANK.ot_amount);
                    var holdCashTotal = parseFloat(workerJD[key].Hold.CASH.salary_amount + workerJD[key].Hold.CASH.ot_amount);
                    var holdTotal = parseFloat(holdBankTotal + holdCashTotal);
                    var totalAmount = regularTotal + holdTotal;
                    workerEmpCount += parseInt(workerJD[key].Regular.BANK.employee_count + workerJD[key].Regular.CASH.employee_count + holdEMP);
                    workerSalary += parseInt(workerJD[key].Regular.BANK.salary_amount + workerJD[key].Regular.CASH.salary_amount + workerJD[key].Hold.BANK.salary_amount + workerJD[key].Hold.CASH.salary_amount);
                    workerOTTotal += parseInt(workerJD[key].Regular.BANK.ot_amount + workerJD[key].Regular.CASH.ot_amount + workerJD[key].Hold.BANK.ot_amount + workerJD[key].Hold.CASH.ot_amount);
                    workerSalaryTotal += parseInt(workerJD[key].Regular.BANK.salary_amount + workerJD[key].Regular.CASH.salary_amount + holdSalary + workerJD[key].Regular.BANK.ot_amount + workerJD[key].Regular.CASH.ot_amount + workerJD[key].Hold.BANK.salary_amount + workerJD[key].Hold.CASH.salary_amount + workerJD[key].Hold.BANK.ot_amount + workerJD[key].Hold.CASH.ot_amount);
                    salaryTotal += parseInt(workerJD[key].Regular.BANK.salary_amount + workerJD[key].Regular.CASH.salary_amount + workerJD[key].Hold.BANK.salary_amount + workerJD[key].Hold.CASH.salary_amount);
                    otTotal += parseInt(workerJD[key].Regular.BANK.ot_amount + workerJD[key].Regular.CASH.ot_amount + workerJD[key].Hold.BANK.ot_amount + workerJD[key].Hold.CASH.ot_amount);
                    grossTotal += parseInt(workerJD[key].Regular.BANK.salary_amount + workerJD[key].Regular.CASH.salary_amount + workerJD[key].Hold.BANK.salary_amount + workerJD[key].Hold.CASH.salary_amount + workerJD[key].Regular.BANK.ot_amount + workerJD[key].Regular.CASH.ot_amount + workerJD[key].Hold.BANK.ot_amount + workerJD[key].Hold.CASH.ot_amount);
                    empCount += parseInt(workerJD[key].Regular.BANK.employee_count + workerJD[key].Regular.CASH.employee_count + workerJD[key].Hold.BANK.employee_count + workerJD[key].Hold.CASH.employee_count);
                    workerHtml +=
                        '<tr>' +
                        '<td align="center" rowspan="4">' + worker + '</td>' +
                        '<td align="left" rowspan="4">' + workerJD[key].name.toUpperCase() + '</td>' +
                        '<td align="left" rowspan="2">REGULAR</td>' +
                        '<td align="left">BANK</td>' +
                        '<td align="right">' +
                        ((workerJD[key].Regular.BANK.employee_count > 0) ?
                            workerJD[key].Regular.BANK.employee_count : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((workerJD[key].Regular.BANK.salary_amount > 0) ?
                            workerJD[key].Regular.BANK.salary_amount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((workerJD[key].Regular.BANK.ot_amount > 0) ?
                            workerJD[key].Regular.BANK.ot_amount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((regularBankTotal > 0) ? regularBankTotal.formatMoney(2, '.', ',') : '-') +
                        '</td>' +
                        '<td align="right" rowspan="2">' +
                        ((regularTotal > 0) ?
                            regularTotal.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right" rowspan="4">' +
                        ((totalAmount > 0) ?
                            totalAmount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td align="left">CASH</td>' +
                        '<td align="right">' +
                        ((workerJD[key].Regular.CASH.employee_count > 0) ?
                            workerJD[key].Regular.CASH.employee_count : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((workerJD[key].Regular.CASH.salary_amount > 0) ?
                            workerJD[key].Regular.CASH.salary_amount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((workerJD[key].Regular.CASH.ot_amount > 0) ?
                            workerJD[key].Regular.CASH.ot_amount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((regularCashTotal > 0) ? regularCashTotal.formatMoney(2, '.', ',') : '-') +
                        '</td>' +
                        '</tr>' +
                        '<tr style="background-color:#EEE;">' +
                        '<td align="left" rowspan="2">HOLD</td>' +
                        '<td align="left">BANK</td>' +
                        '<td align="right">' +
                        ((workerJD[key].Hold.BANK.employee_count > 0) ?
                            workerJD[key].Hold.BANK.employee_count : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((workerJD[key].Hold.BANK.salary_amount > 0) ?
                            workerJD[key].Hold.BANK.salary_amount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((workerJD[key].Hold.BANK.ot_amount > 0) ?
                            workerJD[key].Hold.BANK.ot_amount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((holdBankTotal > 0) ? holdBankTotal.formatMoney(2, '.', ',') : '-') +
                        '</td>' +
                        '<td align="right" rowspan="2">' +
                        ((holdTotal > 0) ?
                            holdTotal.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '</tr>' +
                        '<tr style="background-color:#EEE;">' +
                        '<td align="left">CASH</td>' +
                        '<td align="right">' +
                        ((workerJD[key].Hold.CASH.employee_count > 0) ?
                            workerJD[key].Hold.CASH.employee_count : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((workerJD[key].Hold.CASH.salary_amount > 0) ?
                            workerJD[key].Hold.CASH.salary_amount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((workerJD[key].Hold.CASH.ot_amount > 0) ?
                            workerJD[key].Hold.CASH.ot_amount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((holdCashTotal > 0) ? holdCashTotal.formatMoney(2, '.', ',') : '-') +
                        '</td>' +
                        '</tr>';
                    worker++;
                }
                staffHtml += '<tr style="background-color:#DDD;">' +
                    '<td align="left" style="border-right: 0px solid white;"></td>' +
                    '<td align="left" style="border-left: 0px solid white;" colspan="3"><b>SUB TOTAL</b></td>' +
                    '<td align="right"><b>' + staffEmpCount + '</b></td>' +
                    '<td align="right"><b>' + staffSalaryTotal.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"><b>-</b></td>' +
                    '<td align="right" colspan="3"><b>' + staffSalaryTotal.formatMoney(2, '.', ',') + '</b></td>' +
                    '</tr></table></div><div id="pageBody">';
                workerHtml += '<tr style="background-color:#DDD;">' +
                    '<td align="left" style="border-right: 0px solid white;"></td>' +
                    '<td align="left" style="border-left: 0px solid white;" colspan="3"><b>SUB TOTAL</b></td>' +
                    '<td align="right"><b>' + workerEmpCount + '</b></td>' +
                    '<td align="right"><b>' + workerSalary.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"><b>' + workerOTTotal.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right" colspan="3"><b>' + workerSalaryTotal.formatMoney(2, '.', ',') + '</b></td>' +
                    '</tr>';
                htmlData += staffHtml + workerHtml +
                    '<tr style="background-color:#DDD;">' +
                    '<td align="left" style="border-right: 0px solid white;"></td>' +
                    '<td align="left" style="border-left: 0px solid white;" colspan="3"><b>GRAND TOTAL</b></td>' +
                    '<td align="right"><b>' + empCount + '</b></td>' +
                    '<td align="right"><b>' + salaryTotal.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right"><b>' + otTotal.formatMoney(2, '.', ',') + '</b></td>' +
                    '<td align="right" colspan="3"><b>' + grossTotal.formatMoney(2, '.', ',') + '</b></td>' +
                    '</tr>' +
                    '</table><br /><hr /><br /><br />';
                var staffRegularTotal = staffRegularBank + staffRegularCash,
                    workerRegularTotal = workerRegularBank + workerRegularCash,
                    workerRegularOTTotal = workerRegularOTBank + workerRegularOTCash,
                    regularBank = staffRegularBank + workerRegularBank + workerRegularOTBank,
                    regularCash = staffRegularCash + workerRegularCash + workerRegularOTCash,
                    regularTotal = regularBank + regularCash,
                    staffHoldTotal = staffHoldBank + staffHoldCash,
                    workerHoldTotal = workerHoldBank + workerHoldCash,
                    workerHoldOTTotal = workerHoldOTBank + workerHoldOTCash,
                    holdBank = staffHoldBank + workerHoldBank + workerHoldOTBank,
                    holdCash = staffHoldCash + workerHoldCash + workerHoldOTCash,
                    holdTotal = holdBank + holdCash,
                    bankTotal = regularBank + holdBank,
                    cashTotal = regularCash + holdCash,
                    grossTotal = bankTotal + cashTotal;
                htmlData +=
                    '<div id="outer" style="width:70%;page-break-before: always;>' +
                    '<div style="display: table;">' +
                    '<table style="width:100%;border: 0px solid white;">' +
                    '<tr style="border: 0px solid white;">' +
                    '<th style="background-color:#DDD;border: 1px solid black;" width="230" align="left">PARTICULARS</th>' +
                    '<th style="background-color:#DDD;border: 1px solid black;" width="140" align="right">BANK</th>' +
                    '<th style="background-color:#DDD;border: 1px solid black;" width="140" align="right">CASH</th>' +
                    '<th style="background-color:#DDD;border: 1px solid black;" width="140" align="right">TOTAL</th>' +
                    '</tr>' +
                    '<tr style="border: 0px solid white;">' +
                    '<td style="border-bottom: 0px solid white;" align="left">STAFF REGULAR: </td>' +
                    '<td style="border-bottom: 0px solid white;" align="right">' +
                    staffRegularBank.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-bottom: 0px solid white;" align="right">' +
                    staffRegularCash.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-bottom: 0px solid white;" align="right">' +
                    staffRegularTotal.formatMoney(2, '.', ',') +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="left">WORKER REGULAR: </td>' +
                    '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' +
                    workerRegularBank.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' +
                    workerRegularCash.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' +
                    workerRegularTotal.formatMoney(2, '.', ',') +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td style="border-top: 0px solid white;" align="left">WORKER REGULAR EX. OT: </td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerRegularOTBank.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerRegularOTCash.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerRegularOTTotal.formatMoney(2, '.', ',') +
                    '</td>' +
                    '</tr>' +
                    '<tr style="background-color:#DDD;">' +
                    '<td align="left"><b>TOTAL </b></td>' +
                    '<td align="right"><b>' +
                    regularBank.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '<td align="right"><b>' +
                    regularCash.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '<td align="right"><b>' +
                    regularTotal.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '</tr>' +
                    '<tr style="border: 0px solid white;">' +
                    '<td style="border-bottom: 0px solid white;" align="left">STAFF HOLD: </td>' +
                    '<td style="border-bottom: 0px solid white;" align="right">' +
                    staffHoldBank.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-bottom: 0px solid white;" align="right">' +
                    staffHoldCash.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-bottom: 0px solid white;" align="right">' +
                    staffHoldTotal.formatMoney(2, '.', ',') +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="left">WORKER HOLD: </td>' +
                    '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' +
                    workerHoldBank.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' +
                    workerHoldCash.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' +
                    workerHoldTotal.formatMoney(2, '.', ',') +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td style="border-top: 0px solid white;" align="left">WORKER HOLD EX OT: </td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerHoldOTBank.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerHoldOTCash.formatMoney(2, '.', ',') +
                    '</td>' +
                    '<td style="border-top: 0px solid white;" align="right">' +
                    workerHoldOTTotal.formatMoney(2, '.', ',') +
                    '</td>' +
                    '</tr>' +
                    '<tr style="background-color:#DDD;">' +
                    '<td align="left"><b>TOTAL </b></td>' +
                    '<td align="right"><b>' +
                    holdBank.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '<td align="right"><b>' +
                    holdCash.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '<td align="right"><b>' +
                    holdTotal.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '</tr>' +
                    '<tr style="background-color:#DDD;">' +
                    '<td><b>GRAND TOTAL </b></td>' +
                    '<td align="right"><b>' +
                    bankTotal.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '<td align="right"><b>' +
                    cashTotal.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '<td align="right"><b>' +
                    grossTotal.formatMoney(2, '.', ',') +
                    '</b></td>' +
                    '</tr>' +
                    '</table>' +
                    '</div>' +
                    '</div>' +
                    '</div></body></html>';
                var options = {
                    format: 'A4',
                    orientation: "portrait",
                    header: {
                        height: "5mm",
                        contents: comparativeStatementHeader(d)
                    },
                    footer: {
                        height: "20mm",
                        contents: footerSContents()
                    },
                };
                pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                    socket.emit("DownloadComparativeSalaryReport", 'downloaded');
                });
            });
        });
    });

    socket.on('DownloadComparativeSalaryStatementReport', function(QUERY) {
        var d = new Date(QUERY.date);
        var t = new Date(d);
        t.setDate(25);
        var f = new Date(d);
        f.setDate(26);
        f.setMonth(t.getMonth() - 1);
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            comparativeStatementReportHead() +
            '<br />' +
            '<h1 style="line-height: 0.5;font-size: 80%;">' +
            factoryName +
            '</h1>' +
            '<h2 style="line-height: 0.5;font-size: 65%;">' +
            'COMPARATIVE SALARY STATEMENT' +
            '</h2>' +
            '<h3 style="line-height: 0.5;font-size: 55%;">' +
            'FOR THE PERIOD OF ' +
            f.formatDate2() + ' TO ' +
            t.formatDate2() +
            '</h3>' +
            '<div id="pageBody">';
        var staffHtml = '<table style="width:100%;">' +
            '<tr style="background-color:#DDD;">' +
            '<td align="left" colspan="10"><big><b>STAFF</b></big></td>' +
            '</tr>' +
            '<tr>' +
            '<th width="10">#</th>' +
            '<th colspan="3">SECTION</th>' +
            '<th width="30"><small>EMP</small></th>' +
            '<th width="70">SALARY</th>' +
            '<th width="70">OVERTIME</th>' +
            '<th width="150" colspan="3">TOTAL</th>' +
            '</tr>';
        var workerHtml = '<table style="width:100%;">' +
            '<tr style="background-color:#DDD;">' +
            '<td align="left" colspan="10"><big><b>WORKER</b></big></td>' +
            '</tr>' +
            '<tr>' +
            '<th width="10">#</th>' +
            '<th colspan="3">SECTION</th>' +
            '<th width="30"><small>EMP</small></th>' +
            '<th width="70">SALARY</th>' +
            '<th width="70">OVERTIME</th>' +
            '<th width="150" colspan="3">TOTAL</th>' +
            '</tr>';
        getComparativeSalary(db, QUERY, function(compSalData) {
            var staff = 1;
            var worker = 1;
            var otTotal = 0;
            var empCount = 0;
            var staffEmpCount = 0;
            var workerEmpCount = 0;
            var staffAmountTotal = 0;
            var workerAmountTotal = 0;
            var staffSalaryTotal = 0;
            var workerSalaryTotal = 0;
            var amountTotal = 0;
            var grossTotal = 0;
            var staffRegularBank = 0;
            var staffRegularCash = 0;
            var staffRegularTotal = 0;
            var staffHoldBank = 0;
            var staffHoldCash = 0;
            var staffHoldTotal = 0;
            var staffBankTotal = 0;
            var staffCashTotal = 0;
            var workerRegularBank = 0;
            var workerRegularCash = 0;
            var workerRegularTotal = 0;
            var workerRegularOTBank = 0;
            var workerRegularOTCash = 0;
            var workerRegularOTTotal = 0;
            var workerHoldBank = 0;
            var workerHoldCash = 0;
            var workerHoldTotal = 0;
            var workerHoldOTBank = 0;
            var workerHoldOTCash = 0;
            var workerHoldOTTotal = 0;
            var workerBankTotal = 0;
            var workerCashTotal = 0;
            var regularBank = 0;
            var regularCash = 0;
            var regularTotal = 0;
            var holdBank = 0;
            var holdCash = 0;
            var holdTotal = 0;
            for (var key in compSalData) {
                var totalAmount = (compSalData[key].staff) ?
                    compSalData[key].salary :
                    compSalData[key].ot + compSalData[key].salary;
                var regularTotalAmount = (compSalData[key].staff) ?
                    compSalData[key].regular.salary :
                    compSalData[key].regular.ot + compSalData[key].regular.salary;
                var holdTotalAmount = (compSalData[key].staff) ?
                    compSalData[key].hold.salary :
                    compSalData[key].hold.ot + compSalData[key].hold.salary;
                grossTotal += totalAmount;
                amountTotal += compSalData[key].salary;
                otTotal += (compSalData[key].staff) ? 0 : compSalData[key].ot;
                empCount += compSalData[key].empCount;
                if (compSalData[key].staff && compSalData[key].salary > 0) {
                    staffEmpCount += compSalData[key].empCount;
                    staffAmountTotal += compSalData[key].salary;
                    staffSalaryTotal += totalAmount;
                    var regularBankAmount = compSalData[key].regular.bank.salary;
                    var regularCashAmount = compSalData[key].regular.cash.salary;
                    var holdBankAmount = compSalData[key].hold.bank.salary;
                    var holdCashAmount = compSalData[key].hold.cash.salary;
                    staffRegularBank += regularBankAmount;
                    staffRegularCash += regularCashAmount;
                    staffRegularTotal += compSalData[key].regular.salary;
                    regularBank += regularBankAmount;
                    regularCash += regularCashAmount;
                    regularTotal += regularBankAmount + regularCashAmount;
                    staffHoldBank += holdBankAmount;
                    staffHoldCash += holdCashAmount;
                    staffHoldTotal += compSalData[key].hold.salary;
                    holdBank += holdBankAmount;
                    holdCash += holdCashAmount;
                    holdTotal += holdBankAmount + holdCashAmount;
                    staffHtml += '<tr>' +
                        '<td align="center" rowspan="4">' + staff + '</td>' +
                        '<td align="left" rowspan="4">' + compSalData[key].name + '</td>' +
                        '<td align="left" rowspan="2">REGULAR</td>' +
                        '<td align="left">BANK</td>' +
                        '<td align="right">' +
                        ((compSalData[key].regular.bank.empCount > 0) ?
                            compSalData[key].regular.bank.empCount : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((compSalData[key].regular.bank.salary > 0) ?
                            compSalData[key].regular.bank.salary.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">-</td>' +
                        '<td align="right">' +
                        ((regularBankAmount > 0) ?
                            regularBankAmount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right" rowspan="2">' +
                        ((regularTotalAmount > 0) ?
                            regularTotalAmount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right" rowspan="4">' +
                        ((totalAmount > 0) ?
                            totalAmount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '</tr>';
                    staffHtml += '<tr>' +
                        '<td align="left">CASH</td>' +
                        '<td align="right">' +
                        ((compSalData[key].regular.cash.empCount > 0) ?
                            compSalData[key].regular.cash.empCount : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((compSalData[key].regular.cash.salary > 0) ?
                            compSalData[key].regular.cash.salary.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">-</td>' +
                        '<td align="right">' +
                        ((regularCashAmount > 0) ?
                            regularCashAmount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '</tr>';
                    staffHtml += '<tr style="background-color:#EEE;">' +
                        '<td align="left" rowspan="2">HOLD</td>' +
                        '<td align="left">BANK</td>' +
                        '<td align="right">' +
                        ((compSalData[key].hold.bank.empCount > 0) ?
                            compSalData[key].hold.bank.empCount : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((compSalData[key].hold.bank.salary > 0) ?
                            compSalData[key].hold.bank.salary.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">-</td>' +
                        '<td align="right">' +
                        ((holdBankAmount > 0) ?
                            holdBankAmount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right" rowspan="2">' +
                        ((holdTotalAmount > 0) ?
                            holdTotalAmount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '</tr>';
                    staffHtml += '<tr>' +
                        '<td align="left">CASH</td>' +
                        '<td align="right">' +
                        ((compSalData[key].hold.cash.empCount > 0) ?
                            compSalData[key].hold.cash.empCount : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((compSalData[key].hold.cash.salary > 0) ?
                            compSalData[key].hold.cash.salary.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">-</td>' +
                        '<td align="right">' +
                        ((holdCashAmount > 0) ?
                            holdCashAmount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '</tr>';
                    staff++;
                } else if (!compSalData[key].staff && compSalData[key].salary > 0) {
                    workerEmpCount += compSalData[key].empCount;
                    workerAmountTotal += compSalData[key].salary;
                    workerSalaryTotal += totalAmount;
                    var regularBankAmount = compSalData[key].regular.bank.salary;
                    var regularCashAmount = compSalData[key].regular.cash.salary;
                    var regularBankOTAmount = compSalData[key].regular.bank.ot;
                    var regularCashOTAmount = compSalData[key].regular.cash.ot;
                    var holdBankAmount = compSalData[key].hold.bank.salary;
                    var holdCashAmount = compSalData[key].hold.cash.salary;
                    var holdBankOTAmount = compSalData[key].hold.bank.ot;
                    var holdCashOTAmount = compSalData[key].hold.cash.ot;
                    workerRegularBank += regularBankAmount;
                    workerRegularCash += regularCashAmount;
                    workerRegularTotal += compSalData[key].regular.salary;
                    workerRegularOTBank += regularBankOTAmount;
                    workerRegularOTCash += regularCashOTAmount;
                    workerRegularOTTotal += compSalData[key].regular.ot;
                    regularBank += regularBankAmount + regularBankOTAmount;
                    regularCash += regularCashAmount + regularCashOTAmount;
                    regularTotal = regularBank + regularCash;
                    workerHoldBank += holdBankAmount;
                    workerHoldCash += holdCashAmount;
                    workerHoldTotal += compSalData[key].hold.salary;
                    workerHoldOTBank += holdBankOTAmount;
                    workerHoldOTCash += holdCashOTAmount;
                    workerHoldOTTotal += compSalData[key].hold.ot;
                    holdBank += holdBankAmount + holdBankOTAmount;
                    holdCash += holdCashAmount + holdCashOTAmount;
                    holdTotal = holdBank + holdCash;
                    workerHtml += '<tr>' +
                        '<td align="center" rowspan="4">' + worker + '</td>' +
                        '<td align="left" rowspan="4">' + compSalData[key].name + '</td>' +
                        '<td align="left" rowspan="2">REGULAR</td>' +
                        '<td align="left">BANK</td>' +
                        '<td align="right">' +
                        ((compSalData[key].regular.bank.empCount > 0) ?
                            compSalData[key].regular.bank.empCount : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((compSalData[key].regular.bank.salary > 0) ?
                            compSalData[key].regular.bank.salary.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((compSalData[key].regular.bank.ot > 0) ?
                            compSalData[key].regular.bank.ot.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((regularBankAmount > 0) ?
                            regularBankAmount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right" rowspan="2">' +
                        ((regularTotalAmount > 0) ?
                            regularTotalAmount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right" rowspan="4">' +
                        ((totalAmount > 0) ?
                            totalAmount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '</tr>';
                    workerHtml += '<tr>' +
                        '<td align="left">CASH</td>' +
                        '<td align="right">' +
                        ((compSalData[key].regular.cash.empCount > 0) ?
                            compSalData[key].regular.cash.empCount : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((compSalData[key].regular.cash.salary > 0) ?
                            compSalData[key].regular.cash.salary.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((compSalData[key].regular.cash.ot > 0) ?
                            compSalData[key].regular.cash.ot.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((regularCashAmount > 0) ?
                            regularCashAmount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '</tr>';
                    workerHtml += '<tr style="background-color:#EEE;">' +
                        '<td align="left" rowspan="2">HOLD</td>' +
                        '<td align="left">BANK</td>' +
                        '<td align="right">' +
                        ((compSalData[key].hold.bank.empCount > 0) ?
                            compSalData[key].hold.bank.empCount : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((compSalData[key].hold.bank.salary > 0) ?
                            compSalData[key].hold.bank.salary.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((compSalData[key].hold.bank.ot > 0) ?
                            compSalData[key].hold.bank.ot.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((holdBankAmount > 0) ?
                            holdBankAmount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right" rowspan="2">' +
                        ((holdTotalAmount > 0) ?
                            holdTotalAmount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '</tr>';
                    workerHtml += '<tr>' +
                        '<td align="left">CASH</td>' +
                        '<td align="right">' +
                        ((compSalData[key].hold.cash.empCount > 0) ?
                            compSalData[key].hold.cash.empCount : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((compSalData[key].hold.cash.salary > 0) ?
                            compSalData[key].hold.cash.salary.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((compSalData[key].hold.cash.ot > 0) ?
                            compSalData[key].hold.cash.ot.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((holdCashAmount > 0) ?
                            holdCashAmount.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '</tr>';
                    worker++;
                }
            }
            staffHtml += '<tr style="background-color:#DDD;">' +
                '<td align="left" style="border-right: 0px solid white;"></td>' +
                '<td align="left" style="border-left: 0px solid white;" colspan="3"><b>SUB TOTAL</b></td>' +
                '<td align="right"><b>' +
                ((staffEmpCount > 0) ?
                    staffEmpCount : '-'
                ) +
                '</b></td>' +
                '<td align="right"><b>' +
                ((staffAmountTotal > 0) ?
                    staffAmountTotal.formatMoney(2, '.', ',') : '-'
                ) +
                '</b></td>' +
                '<td align="right"><b>-</b></td>' +
                '<td align="right" colspan="3"><b>' +
                ((staffSalaryTotal > 0) ?
                    staffSalaryTotal.formatMoney(2, '.', ',') : '-'
                ) +
                '</b></td>' +
                '</tr>' +
                '</table><div style="page-break-before: always"></div>';
            cashTotal = regularCash + holdCash;
            workerHtml += '<tr style="background-color:#DDD;">' +
                '<td align="left" style="border-right: 0px solid white;"></td>' +
                '<td align="left" style="border-left: 0px solid white;" colspan="3"><b>SUB TOTAL</b></td>' +
                '<td align="right"><b>' + workerEmpCount + '</b></td>' +
                '<td align="right"><b>' + workerAmountTotal.formatMoney(2, '.', ',') + '</b></td>' +
                '<td align="right"><b>' + otTotal.formatMoney(2, '.', ',') + '</b></td>' +
                '<td align="right" colspan="3"><b>' + workerSalaryTotal.formatMoney(2, '.', ',') + '</b></td>' +
                '</tr>';
            htmlData += staffHtml + workerHtml +
                '<tr style="background-color:#DDD;">' +
                '<td align="left" style="border-right: 0px solid white;"></td>' +
                '<td align="left" style="border-left: 0px solid white;" colspan="3"><b>GRAND TOTAL</b></td>' +
                '<td align="right"><b>' + empCount + '</b></td>' +
                '<td align="right"><b>' + amountTotal.formatMoney(2, '.', ',') + '</b></td>' +
                '<td align="right"><b>' + otTotal.formatMoney(2, '.', ',') + '</b></td>' +
                '<td align="right" colspan="3"><b>' + grossTotal.formatMoney(2, '.', ',') + '</b></td>' +
                '</tr>' +
                '</table><hr />' +
                '<table style="width:100%;border: 0px solid white;">' +
                '<tr style="border: 0px solid white;">' +
                '<th style="border: 0px solid white;">.</th>' +
                '<th style="background-color:#DDD;border: 1px solid black;" width="100" align="left">PARTICULARS</th>' +
                '<th style="background-color:#DDD;border: 1px solid black;" width="50" align="right">BANK</th>' +
                '<th style="background-color:#DDD;border: 1px solid black;" width="50" align="right">CASH</th>' +
                '<th style="background-color:#DDD;border: 1px solid black;" width="100" align="right">TOTAL</th>' +
                '</tr>' +
                '<tr style="border: 0px solid white;">' +
                '<td style="border: 0px solid white;"> </td>' +
                '<td style="border-bottom: 0px solid white;" align="left">STAFF REGULAR: </td>' +
                '<td style="border-bottom: 0px solid white;" align="right">' + staffRegularBank.formatMoney(2, '.', ',') + '</td>' +
                '<td style="border-bottom: 0px solid white;" align="right">' + staffRegularCash.formatMoney(2, '.', ',') + '</td>' +
                '<td style="border-bottom: 0px solid white;" align="right">' + staffRegularTotal.formatMoney(2, '.', ',') + '</td>' +
                '</tr>' +
                '<tr style="border: 0px solid white;">' +
                '<td style="border: 0px solid white;"> </td>' +
                '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="left">WORKER REGULAR: </td>' +
                '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' + workerRegularBank.formatMoney(2, '.', ',') + '</td>' +
                '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' + workerRegularCash.formatMoney(2, '.', ',') + '</td>' +
                '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' + workerRegularTotal.formatMoney(2, '.', ',') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="border: 0px solid white;"> </td>' +
                '<td style="border-top: 0px solid white;" align="left">WORKER REGULAR OT: </td>' +
                '<td style="border-top: 0px solid white;" align="right">' + workerRegularOTBank.formatMoney(2, '.', ',') + '</td>' +
                '<td style="border-top: 0px solid white;" align="right">' + workerRegularOTCash.formatMoney(2, '.', ',') + '</td>' +
                '<td style="border-top: 0px solid white;" align="right">' + workerRegularOTTotal.formatMoney(2, '.', ',') + '</td>' +
                '</tr>' +
                '<tr style="background-color:#DDD;">' +
                '<td style="background-color:#FFF;border: 0px solid white;"> </td>' +
                '<td align="left"><b>TOTAL </b></td>' +
                '<td align="right"><b>' + regularBank.formatMoney(2, '.', ',') + '</b></td>' +
                '<td align="right"><b>' + regularCash.formatMoney(2, '.', ',') + '</b></td>' +
                '<td align="right"><b>' + regularTotal.formatMoney(2, '.', ',') + '</b></td>' +
                '</tr>' +
                '<tr>' +
                '<td style="border: 0px solid white;"> </td>' +
                '<td style="border-bottom: 0px solid white;" align="left">STAFF HOLD: </td>' +
                // '<td style="border-bottom: 0px solid white;" align="right">-</td>'+
                '<td style="border-bottom: 0px solid white;" align="right">' + staffHoldBank.formatMoney(2, '.', ',') + '</td>' +
                '<td style="border-bottom: 0px solid white;" align="right">' + staffHoldCash.formatMoney(2, '.', ',') + '</td>' +
                '<td style="border-bottom: 0px solid white;" align="right">' + staffHoldTotal.formatMoney(2, '.', ',') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="border: 0px solid white;"> </td>' +
                '<td style="border-top: 0px solid white;" align="left">WORKER HOLD: </td>' +
                // '<td style="border-top: 0px solid white;" align="right">-</td>'+
                '<td style="border-top: 0px solid white;" align="right">' + workerHoldBank.formatMoney(2, '.', ',') + '</td>' +
                '<td style="border-top: 0px solid white;" align="right">' + workerHoldCash.formatMoney(2, '.', ',') + '</td>' +
                '<td style="border-top: 0px solid white;" align="right">' + workerHoldTotal.formatMoney(2, '.', ',') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="border: 0px solid white;"> </td>' +
                '<td style="border-top: 0px solid white;" align="left">WORKER HOLD OT: </td>' +
                '<td style="border-top: 0px solid white;" align="right">' + workerHoldOTBank.formatMoney(2, '.', ',') + '</td>' +
                '<td style="border-top: 0px solid white;" align="right">' + workerHoldOTCash.formatMoney(2, '.', ',') + '</td>' +
                '<td style="border-top: 0px solid white;" align="right">' + workerHoldOTTotal.formatMoney(2, '.', ',') + '</td>' +
                '</tr>' +
                '<tr style="background-color:#DDD;">' +
                '<td style="background-color:#FFF;border: 0px solid white;"> </td>' +
                '<td align="left"><b>TOTAL </b></td>' +
                // '<td align="right"><b>-</b></td>'+
                '<td align="right"><b>' + holdBank.formatMoney(2, '.', ',') + '</b></td>' +
                '<td align="right"><b>' + holdCash.formatMoney(2, '.', ',') + '</b></td>' +
                '<td align="right"><b>' + holdTotal.formatMoney(2, '.', ',') + '</b></td>' +
                '</tr>' +
                '<tr style="background-color:#DDD;">' +
                '<td style="background-color:#FFF;border: 0px solid white;"> </td>' +
                '<td><b>GRAND TOTAL </b></td>' +
                '<td align="right"><b>' + regularBank.formatMoney(2, '.', ',') + '</b></td>' +
                '<td align="right"><b>' + cashTotal.formatMoney(2, '.', ',') + '</b></td>' +
                '<td align="right"><b>' + grossTotal.formatMoney(2, '.', ',') + '</b></td>' +
                '</tr>' +
                '</table>' +
                '</div></body></html>';
            var options = {
                format: 'A4',
                orientation: "portrait",
                header: {
                    height: "5mm",
                    contents: comparativeStatementHeader(d)
                },
                footer: {
                    height: "20mm",
                    contents: footerSContents()
                },
            };
            pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                socket.emit("DownloadComparativeSalaryStatementReport", 'success');
            });
        });
    });

    socket.on('DownloadBonusTopSheet', function(QUERY) {
        var d = new Date(QUERY.date);
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            comparativeStatementReportHead() +
            '<h1 style="line-height: 0.8;font-size: 80%;">' +
            factoryName +
            '</h1>' +
            '<h2 style="line-height: 0.5;font-size: 65%;">' +
            'FESTIVAL BONUS TOP SHEET' +
            '</h2>' +
            '<h3 style="line-height: 0.5;font-size: 55%;">' +
            'FOR THE FESTIVAL OF ' +
            QUERY.festive_type + ', ' +
            d.getUTCFullYear() +
            '</h3>' +
            '<div id="pageBody">';
        var staffHtml = '<table style="width:100%;">' +
            '<tr style="background-color:#DDD;">' +
            '<td align="left" colspan="6"><big><b>STAFF</b></big></td>' +
            '</tr>' +
            '<tr>' +
            '<th width="10">#</th>' +
            '<th>SECTION</th>' +
            '<th width="30"><small>EMP</small></th>' +
            '<th>BANK</th>' +
            '<th>CASH</th>' +
            '<th width="120">SALARY</th>' +
            '</tr>';
        var workerHtml = '<tr style="background-color:#DDD;">' +
            '<td align="left" colspan="6"><big><b>WORKER</b></big></td>' +
            '</tr>' +
            '<tr>' +
            '<th width="10">#</th>' +
            '<th>SECTION</th>' +
            '<th width="30"><small>EMP</small></th>' +
            '<th>BANK</th>' +
            '<th>CASH</th>' +
            '<th width="120">SALARY</th>' +
            '</tr>';
        getBonusDetails(db, QUERY, function(compSalData) {
            var staff = 1;
            var worker = 1;
            var empCount = 0;
            var staffEmpCount = 0;
            var workerEmpCount = 0;
            var staffAmountTotal = 0;
            var workerAmountTotal = 0;
            var staffSalaryTotal = 0;
            var workerSalaryTotal = 0;
            var amountTotal = 0;
            var grossTotal = 0;
            var staffRegularBank = 0;
            var staffRegularCash = 0;
            var staffRegularTotal = 0;
            var staffBankTotal = 0;
            var staffCashTotal = 0;
            var workerRegularBank = 0;
            var workerRegularCash = 0;
            var workerRegularTotal = 0;
            var workerBankTotal = 0;
            var workerCashTotal = 0;
            var regularBank = 0;
            var regularCash = 0;
            var regularTotal = 0;
            for (var key in compSalData) {
                var totalAmount = compSalData[key].salary;
                var regularTotalAmount = compSalData[key].regular.salary;
                grossTotal += totalAmount;
                amountTotal += compSalData[key].salary;
                empCount += compSalData[key].empCount;
                if (compSalData[key].staff && compSalData[key].salary > 0) {
                    staffEmpCount += compSalData[key].empCount;
                    staffAmountTotal += compSalData[key].salary;
                    staffSalaryTotal += totalAmount;
                    var regularBankAmount = compSalData[key].regular.bank.salary;
                    var regularCashAmount = compSalData[key].regular.cash.salary;
                    staffRegularBank += regularBankAmount;
                    staffRegularCash += regularCashAmount;
                    staffRegularTotal += compSalData[key].regular.salary;
                    regularBank += regularBankAmount;
                    regularCash += regularCashAmount;
                    regularTotal += regularBankAmount + regularCashAmount;
                    staffHtml += '<tr>' +
                        '<td align="center">' + staff + '</td>' +
                        '<td align="left">' + compSalData[key].name + '</td>' +
                        '<td align="right">' +
                        ((compSalData[key].regular.empCount > 0) ?
                            compSalData[key].regular.empCount : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((compSalData[key].regular.bank.salary > 0) ?
                            compSalData[key].regular.bank.salary.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((compSalData[key].regular.cash.salary > 0) ?
                            compSalData[key].regular.cash.salary.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((compSalData[key].regular.salary > 0) ?
                            compSalData[key].regular.salary.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '</tr>';
                    staff++;
                } else if (!compSalData[key].staff && compSalData[key].salary > 0) {
                    workerEmpCount += compSalData[key].empCount;
                    workerAmountTotal += compSalData[key].salary;
                    workerSalaryTotal += totalAmount;
                    var regularBankAmount = compSalData[key].regular.bank.salary;
                    var regularCashAmount = compSalData[key].regular.cash.salary;
                    workerRegularBank += regularBankAmount;
                    workerRegularCash += regularCashAmount;
                    workerRegularTotal += compSalData[key].regular.salary;
                    regularBank += regularBankAmount;
                    regularCash += regularCashAmount;
                    regularTotal = regularBank + regularCash;
                    workerHtml += '<tr>' +
                        '<td align="center">' + worker + '</td>' +
                        '<td align="left">' + compSalData[key].name + '</td>' +
                        '<td align="right">' +
                        ((compSalData[key].regular.empCount > 0) ?
                            compSalData[key].regular.empCount : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((compSalData[key].regular.bank.salary > 0) ?
                            compSalData[key].regular.bank.salary.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((compSalData[key].regular.cash.salary > 0) ?
                            compSalData[key].regular.cash.salary.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '<td align="right">' +
                        ((compSalData[key].regular.salary > 0) ?
                            compSalData[key].regular.salary.formatMoney(2, '.', ',') : '-'
                        ) +
                        '</td>' +
                        '</tr>';
                    worker++;
                }
            }
            staffHtml += '<tr style="background-color:#DDD;">' +
                '<td align="left" style="border-right: 0px solid white;"></td>' +
                '<td align="left" style="border-left: 0px solid white;"><b>SUB TOTAL</b></td>' +
                '<td align="right"><b>' +
                ((staffEmpCount > 0) ?
                    staffEmpCount : '-'
                ) +
                '</b></td>' +
                '<td align="right"><b>' +
                ((staffRegularBank > 0) ?
                    staffRegularBank.formatMoney(2, '.', ',') : '-'
                ) +
                '</b></td>' +
                '<td align="right"><b>' +
                ((staffRegularCash > 0) ?
                    staffRegularCash.formatMoney(2, '.', ',') : '-'
                ) +
                '</b></td>' +
                '<td align="right"><b>' +
                ((staffAmountTotal > 0) ?
                    staffAmountTotal.formatMoney(2, '.', ',') : '-'
                ) +
                '</b></td>' +
                '</tr>';
            cashTotal = regularCash;
            workerHtml += '<tr style="background-color:#DDD;">' +
                '<td align="left" style="border-right: 0px solid white;"></td>' +
                '<td align="left" style="border-left: 0px solid white;"><b>SUB TOTAL</b></td>' +
                '<td align="right"><b>' + workerEmpCount + '</b></td>' +
                '<td align="right"><b>' + workerRegularBank.formatMoney(2, '.', ',') + '</b></td>' +
                '<td align="right"><b>' + workerRegularCash.formatMoney(2, '.', ',') + '</b></td>' +
                '<td align="right"><b>' + workerAmountTotal.formatMoney(2, '.', ',') + '</b></td>' +
                '</tr>';
            htmlData += staffHtml + workerHtml +
                '<tr style="background-color:#DDD;">' +
                '<td align="left" style="border-right: 0px solid white;"></td>' +
                '<td align="left" style="border-left: 0px solid white;"><b>GRAND TOTAL</b></td>' +
                '<td align="right"><b>' + empCount + '</b></td>' +
                '<td align="right"><b>' + regularBank.formatMoney(2, '.', ',') + '</b></td>' +
                '<td align="right"><b>' + regularCash.formatMoney(2, '.', ',') + '</b></td>' +
                '<td align="right"><b>' + amountTotal.formatMoney(2, '.', ',') + '</b></td>' +
                '</tr>' +
                '</table><hr />' +
                '<table style="width:100%;border: 0px solid white;">' +
                '<tr style="border: 0px solid white;">' +
                '<th style="border: 0px solid white;">.</th>' +
                '<th style="background-color:#DDD;border: 1px solid black;" width="100" align="left">PARTICULARS</th>' +
                '<th style="background-color:#DDD;border: 1px solid black;" width="50" align="right">BANK</th>' +
                '<th style="background-color:#DDD;border: 1px solid black;" width="50" align="right">CASH</th>' +
                '<th style="background-color:#DDD;border: 1px solid black;" width="100" align="right">TOTAL</th>' +
                '</tr>' +
                '<tr style="border: 0px solid white;">' +
                '<td style="border: 0px solid white;"> </td>' +
                '<td style="border-bottom: 0px solid white;" align="left">STAFF: </td>' +
                '<td style="border-bottom: 0px solid white;" align="right">' + staffRegularBank.formatMoney(2, '.', ',') + '</td>' +
                '<td style="border-bottom: 0px solid white;" align="right">' + staffRegularCash.formatMoney(2, '.', ',') + '</td>' +
                '<td style="border-bottom: 0px solid white;" align="right">' + staffRegularTotal.formatMoney(2, '.', ',') + '</td>' +
                '</tr>' +
                '<tr style="border: 0px solid white;">' +
                '<td style="border: 0px solid white;"> </td>' +
                '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="left">WORKER: </td>' +
                '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' + workerRegularBank.formatMoney(2, '.', ',') + '</td>' +
                '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' + workerRegularCash.formatMoney(2, '.', ',') + '</td>' +
                '<td style="border-top: 0px solid white;border-bottom: 0px solid white;" align="right">' + workerRegularTotal.formatMoney(2, '.', ',') + '</td>' +
                '</tr>' +
                '<tr style="background-color:#DDD;">' +
                '<td style="background-color:#FFF;border: 0px solid white;"> </td>' +
                '<td align="left"><b>TOTAL </b></td>' +
                '<td align="right"><b>' + regularBank.formatMoney(2, '.', ',') + '</b></td>' +
                '<td align="right"><b>' + regularCash.formatMoney(2, '.', ',') + '</b></td>' +
                '<td align="right"><b>' + regularTotal.formatMoney(2, '.', ',') + '</b></td>' +
                '</tr>' +
                '</table>' +
                '</div></body></html>';
            var options = {
                format: 'A4',
                orientation: "portrait",
                header: {
                    height: "5mm",
                    contents: comparativeStatementHeader(d)
                },
                footer: {
                    height: "20mm",
                    contents: footerSContents()
                },
            };
            pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                socket.emit("DownloadBonusTopSheet", 'success');
            });
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;