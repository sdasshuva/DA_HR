module.exports = function() {};

function overTimeStatementHeader(ms) {
    var t = new Date(ms);
    t.setDate(25);
    var f = new Date(ms);
    f.setDate(26);
    f.setMonth(t.getMonth() - 1);
    var sSH = '<div style="' +
        'color: #444;' +
        'font-size: 8px;' +
        'position: fixed;' +
        'top: 15;' +
        'right: 15;' +
        '">' +
        '<span>PRINT TIME: ' +
        new Date() +
        '</span>' +
        '</div>' +
        '<br />' +
        '<h1 style="line-height: 0.5;font-size: 80%;">' +
        factoryName +
        '</h1>' +
        '<h2 style="line-height: 0.5;font-size: 65%;">' +
        'OVERTIME STATEMENT' +
        '</h2>' +
        '<h3 style="line-height: 0.5;font-size: 55%;">' +
        'FOR THE PERIOD OF ' +
        f.formatDate2() + ' TO ' +
        t.formatDate2() +
        '</h3>';
    return sSH;
}

function overTimeSummaryStatementHeader(ms) {
    var t = new Date(ms);
    t.setDate(25);
    var f = new Date(ms);
    f.setDate(26);
    f.setMonth(t.getMonth() - 1);
    var sSH = '<div style="' +
        'color: #444;' +
        'font-size: 8px;' +
        'position: fixed;' +
        'top: 15;' +
        'right: 15;' +
        '">' +
        '<span>PRINT TIME: ' +
        new Date() +
        '</span>' +
        '</div>' +
        '<br />' +
        '<h1 style="line-height: 0.5;font-size: 80%;">' +
        factoryName +
        '</h1>' +
        '<h2 style="line-height: 0.5;font-size: 65%;">' +
        'OVERTIME SUMMARY STATEMENT' +
        '</h2>' +
        '<h3 style="line-height: 0.5;font-size: 55%;">' +
        'FOR THE PERIOD OF ' +
        f.formatDate2() + ' TO ' +
        t.formatDate2() +
        '</h3>';
    return sSH;
}

function routerInit(app, dbFull) {
    var db = dbFull.DA_HR


}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR

    socket.on('DownloadOverTimeSummary', function(QUERY) {
        var SumArray = [];
        var d = new Date(QUERY.date);
        //     var OvertimeArray = [1,2,3,4,5];
        var StatusArrayName = ['REGULAR', 'HOLD'];
        var htmlData =
            '<!DOCTYPE html>' +
            '<body>' +
            overtimeStatementReportHead() +
            '<div id="pageBody">' +
            '<table style="width:100%;">' +
            '<tr>' +
            '<th>#</th>' +
            '<th>SECTION</th>' +
            '<th>STATUS</th>' +
            '<th><small>7 PM - 8 PM</small></th>' +
            '<th><small>8 PM - 9 PM</small></th>' +
            '<th><small>7 PM - 9 PM</small></th>' +
            '<th><small>9 PM - 6 AM</small></th>' +
            '<th><small>7 PM - 6 AM</small></th>' +
            '</tr>';
        var SEARCH = {};
        SEARCH.employee_type = 2;
        var SearchOS = {};
        SearchOS.month = d.getMonth() + 1;
        SearchOS.year = d.getFullYear();
        var ot1Total = 0,
            ot2Total = 0,
            ot3Total = 0,
            ot4Total = 0,
            ot5Total = 0;
        db.overtime_summary.findAll({
            where: SearchOS,
            include: [{
                model: db.section,
                attributes: [
                    'id', 'name'
                ]
            }, ]
        }).then(function(OSData) {
            OSData.sort(function(a, b) {
                var p1 = a.section;
                var p2 = b.section;
                var s1 = a.status;
                var s2 = b.status;
                var o1 = a.overtime;
                var o2 = b.overtime;
                if (p1 < p2) return -1;
                if (p1 > p2) return 1;
                if (s1 < s2) return -1;
                if (s1 > s2) return 1;
                if (o1 < o2) return -1;
                if (o1 > o2) return 1;
                return 0;
            });
            var o = {};
            async.each(OSData, function(OS, cb_OS) {
                o[OS.sectionTable.name.toUpperCase()] = {};
                cb_OS();
            }, function(err) {
                async.each(OSData, function(OS2, cb_OS2) {
                    o[OS2.sectionTable.name.toUpperCase()][StatusArrayName[parseInt(OS2.status) - 1]] = {};
                    cb_OS2();
                }, function(err) {
                    async.each(OSData, function(OS3, cb_OS3) {
                        o[OS3.sectionTable.name.toUpperCase()][StatusArrayName[parseInt(OS3.status) - 1]][OS3.overtime] = OS3.amount;
                        cb_OS3();
                    }, function(err) {
                        var Od = JSON.parse(JSON.stringify(OSData));
                        var r = 1;
                        for (var key in o) {
                            if (o.hasOwnProperty(key)) {
                                htmlData +=
                                    '<tr>' +
                                    '<td rowspan=2>' + r + '</td>' +
                                    '<td rowspan=2>' + key + '</td>';
                                for (var key1 in o[key]) {
                                    if (o[key].hasOwnProperty(key1)) {
                                        if (key1 === 'HOLD') {
                                            htmlData += '</tr><tr>';
                                        }
                                        htmlData += '<td>' + key1 + '</td>';
                                        for (var key2 in o[key][key1]) {
                                            if (o[key][key1].hasOwnProperty(key2)) {
                                                switch (parseInt(key2)) {
                                                    case 1:
                                                        ot1Total += parseInt(o[key][key1][key2]);
                                                        break;
                                                    case 2:
                                                        ot2Total += parseInt(o[key][key1][key2]);
                                                        break;
                                                    case 3:
                                                        ot3Total += parseInt(o[key][key1][key2]);
                                                        break;
                                                    case 4:
                                                        ot4Total += parseInt(o[key][key1][key2]);
                                                        break;
                                                    case 5:
                                                        ot5Total += parseInt(o[key][key1][key2]);
                                                        break;
                                                }
                                                htmlData += '<td align="right">' + o[key][key1][key2].formatMoney(2, '.', ',') + '</td>';
                                            }
                                        }
                                    }
                                }
                                r++;
                            }
                        }
                        htmlData += '<tr>' +
                            '<td colspan="3"><b>TOTAL</b></td>' +
                            '<td align="right"><b>' + ot1Total.formatMoney(2, '.', ',') + '</b></td>' +
                            '<td align="right"><b>' + ot2Total.formatMoney(2, '.', ',') + '</b></td>' +
                            '<td align="right"><b>' + ot3Total.formatMoney(2, '.', ',') + '</b></td>' +
                            '<td align="right"><b>' + ot4Total.formatMoney(2, '.', ',') + '</b></td>' +
                            '<td align="right"><b>' + ot5Total.formatMoney(2, '.', ',') + '</b></td>' +
                            '</tr>' +
                            '</table></div></body></html>';
                        var options = {
                            format: 'A4',
                            orientation: "portrait",
                            header: {
                                height: "20mm",
                                contents: overTimeSummaryStatementHeader(d)
                            },
                            footer: {
                                height: "25mm",
                                contents: footerSContents()
                            },
                        };
                        pdf.create(htmlData, options).toFile('./uploads/pdf/' + QUERY.file_name + '.pdf', function(err, res) {
                            socket.emit("DownloadOverTimeSummary", 'success');
                        });
                    })
                })
            })
        });
    });

    socket.on('CreateOverTimeStatementReport', function(values) {
        var secQuery = {};
        secQuery.id = values.section;
        var returnData = [];
        list.search_section_list(db, secQuery, function(secList) {
            async.each(secList, function(sec, cb_sec) {
                var secOBJ = {};
                secOBJ.id = sec.id;
                secOBJ.name = sec.name;
                secOBJ.emp = [];
                var empQuery = {};
                empQuery.section = sec.id;
                list.search_employee_id_list(db, empQuery, function(empIDList) {
                    async.each(empIDList, function(empID, cb_empID) {
                        var empOBJ = {};
                        empOBJ.id = empID.id;
                        empOBJ.date = new Date(values.date);
                        empOBJ.card_no = '0000';
                        empOBJ.name = 'NOT FOUND';
                        empOBJ.date_of_join = '';
                        empOBJ.department = '';
                        empOBJ.designation = '';
                        empOBJ.overTime = 0;
                        empOBJ.excessOverTime = 0;
                        empOBJ.salary = 0;
                        empOBJ.basic = 0;
                        empOBJ.overtime_rate = 0;
                        empOBJ.account_no = "000-000-0000000";
                        empOBJ.grade = empID.grade;
                        empOBJ.payment_method = (empID.payment_method == 1) ? 'CASH' : 'BANK';;
                        list.search_employee_salary(db, empOBJ, function(empSal) {
                            empOBJ.salary = empSal.salary;
                            empOBJ.basic = (empSal.salary) ? (empSal.salary - 1100) / 1.4 : 0;
                            empOBJ.overtime_rate = empOBJ.basic / 208 * 2;
                            empOBJ.account_no = empSal.account_no;
                            list.employee_overtime_satement(db, empOBJ, function(empOverTime) {
                                empOBJ.name = empOverTime.name;
                                empOBJ.card_no = empOverTime.card_no;
                                empOBJ.date_of_join = empOverTime.date_of_join;
                                empOBJ.department = empOverTime.department.toUpperCase();
                                empOBJ.designation = empOverTime.designation.toUpperCase();
                                empOBJ.overTime = empOverTime.overTime;
                                empOBJ.excessOverTime = empOverTime.excessOverTime;
                                secOBJ.emp.push(empOBJ);
                                cb_empID();
                            })
                        });
                    }, function(err) {
                        secOBJ.emp.sort(function(a, b) {
                            return parseFloat(a.id) - parseFloat(b.id);
                        });
                        returnData.push(secOBJ);
                        cb_sec();
                    });
                });
            }, function(err) {
                var htmlData =
                    '<!DOCTYPE html>' +
                    '<body>' +
                    overtimeStatementReportHead();
                async.each(returnData, function(rDat, cb_rDat) {
                    htmlData += '<div id="pageBody">' +
                        '<b>SECTION: ' + rDat.name.toUpperCase() + '</b>' +
                        '<table style="width:100%">' +
                        '<tr>' +
                        '<th>#</th>' +
                        '<th>FP ID</th>' +
                        '<th>EMPLOYEE NAME</th>' +
                        '<th>DESIGNATION</th>' +
                        '<th><small>CARD</small></th>' +
                        '<th><small>GRADE</small></th>' +
                        '<th>BASIC<br />SALARY</th>' +
                        '<th><small>HOUR</small></th>' +
                        '<th>RATE</th>' +
                        '<th>NET<br />PAYABLE</th>' +
                        '<th>METHOD</th>' +
                        '<th>SIGNATURE</th>' +
                        '</tr>';
                    var i = 0;
                    var tBasic = 0;
                    var tExcessOverTime = 0;
                    var tNetPayable = 0;
                    async.each(rDat.emp, function(eDat, cb_eDat) {
                        var netPayable = Math.round(eDat.excessOverTime * eDat.overtime_rate);
                        if (netPayable > 0) {
                            i++;
                            tBasic += eDat.basic;
                            tExcessOverTime += eDat.excessOverTime;
                            tNetPayable += netPayable;
                            htmlData +=
                                '<tr>' +
                                '<td align="center" height="60">' + i + '</td>' +
                                '<td align="center">' + addLeadingZero(9, parseInt(eDat.id)) + '</td>' +
                                '<td align="left">' + eDat.name + '</td>' +
                                '<td align="left">' + eDat.designation + '</td>' +
                                '<td align="center">' + eDat.card_no + '</td>' +
                                '<td align="center">' + eDat.grade + '</td>' +
                                '<td align="right">' + eDat.basic.formatMoney(2, '.', ',') + '</td>' +
                                '<td align="center">' + eDat.excessOverTime + '</td>' +
                                '<td align="center">' + eDat.overtime_rate.formatMoney(2, '.', ',') + '</td>' +
                                '<td align="right">' + netPayable.formatMoney(2, '.', ',') + '</td>' +
                                '<td align="center">' + eDat.payment_method + '</td>' +
                                '<td align="center"></td>' +
                                '</tr>';
                        }
                        cb_eDat();
                    }, function(err) {
                        htmlData +=
                            '<tr>' +
                            '<td colspan="6"><b>TOTAL</b></td>' +
                            '<td align="right">' + tBasic.formatMoney(2, '.', ',') + '</td>' +
                            '<td align="center">' + tExcessOverTime + '</td>' +
                            '<td align="right" colspan="2">' + tNetPayable.formatMoney(2, '.', ',') + '</td>' +
                            '<td colspan="2"></td>' +
                            '</tr>';
                        cb_rDat();
                    });
                }, function(err) {
                    htmlData += '</body></html>';
                    var pt = new Date();
                    var options = {
                        format: 'A4',
                        orientation: "portrait",
                        //width: '7120px', 
                        //height: '4320px',
                        header: {
                            height: "20mm",
                            contents: overTimeStatementHeader(values.date)
                        },
                        footer: {
                            height: "25mm",
                            contents: footerSContents()
                        },
                    };
                    pdf.create(htmlData, options).toFile('./uploads/pdf/' + values.file_name + '.pdf', function(err, res) {
                        socket.emit("CreateOverTimeStatementReport", 'success');
                    });
                });
            })
        })
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;