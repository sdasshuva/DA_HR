var navigation_panel = {
    region: 'west',
    title: 'Navigation',
    id: 'navigation_panel',
    icon: '/uploads/icons/navigation.png',
    width: 200,
    split: true,
    collapsible: true,
    collapsed: false,
    floatable: false,
    layout: 'accordion',
    layoutConfig: {
        titleCollapse: false,
        animate: true,
        activeOnTop: true
    },
    // ================================================================================
    // ==========================Account Navigation================================
    // ================================================================================
    items: [Ext.create('Ext.tree.Panel', {
            region: 'north',
            title: 'Accounts Section',
            icon: '/uploads/icons/accounts.png',
            collapsible: true,
            collapsed: false,
            autoScroll: true,
            rootVisible: false,
            border: false,
            listeners: {
                itemclick: function(s, r) {
                    navigation_event(r.data.text);
                },
            },
            root: {
                text: 'Root',
                expanded: true,
                children: [{
                    text: 'Employee',
                    expanded: true,
                    children: [{
                        text: 'Search Employees',
                        leaf: true
                    }, ]
                }, {
                    text: 'Salary',
                    expanded: true,
                    children: [{
                        text: 'Comparative Salary',
                        leaf: true
                    }, {
                        text: 'Salary Statement',
                        leaf: true
                    }, {
                        text: 'Bank Statement',
                        leaf: true
                    }, {
                        text: 'Overtime Statement',
                        leaf: true
                    }, {
                        text: 'Salary List',
                        leaf: true
                    }]
                }, {
                    text: 'Salary B',
                    expanded: true,
                    children: [{
                        text: 'Comparative Salary B',
                        leaf: true
                    }, {
                        text: 'Salary Statement B',
                        leaf: true
                    }, {
                        text: 'Disappointed Salary Statement',
                        leaf: true
                    }, {
                        text: 'Bank Statement B',
                        leaf: true
                    }, {
                        text: 'Overtime Statement B',
                        leaf: true
                    }, {
                        text: 'Salary List B',
                        leaf: true
                    }, ]
                }, {
                    text: 'Others',
                    expanded: true,
                    children: [{
                        text: 'Bonus Top Sheet',
                        leaf: true
                    }, {
                        text: 'Bonus Statement',
                        leaf: true
                    }, {
                        text: 'Bonus Bank Statement',
                        leaf: true
                    }, {
                        text: 'Compliance Bonus Statement',
                        leaf: true
                    }, {
                        text: 'Night Tiffin Report',
                        leaf: true
                    }, {
                        text: 'Overtime Report',
                        leaf: true
                    }, {
                        text: 'Overtime Summary',
                        leaf: true
                    }]
                }, {
                    text: 'Payment',
                    expanded: true,
                    children: [{
                        text: 'Section Summary',
                        leaf: true
                    }, {
                        text: 'Monthly Payment',
                        leaf: true
                    }, {
                        text: 'Payment Summary',
                        leaf: true
                    }, ]
                }, {
                    text: 'Finance',
                    expanded: true,
                    children: [{
                        text: 'Accounts List',
                        expanded: true,
                        children: [{
                            text: 'Types Of Accounts',
                            leaf: true
                        }, {
                            text: 'Accounts Head',
                            leaf: true
                        }, {
                            text: 'Sub Head',
                            leaf: true
                        }, {
                            text: 'Voucher Type',
                            leaf: true
                        }, {
                            text: 'Voucher',
                            leaf: true
                        }, ]
                    }, {
                        text: 'Reports',
                        expanded: true,
                        children: [{
                            text: 'Test Report',
                            leaf: true
                        }, ]
                    }, ]
                }]
            }
        }),
    // ================================================================================
    //     ==========================HR Navigation================================
    // ================================================================================
        Ext.create('Ext.tree.Panel', {
            region: 'north',
            title: 'Human Resourse',
            icon: '/uploads/icons/form.png',
            collapsible: true,
            collapsed: false,
            autoScroll: true,
            rootVisible: false,
            border: false,
            listeners: {
                itemclick: function(s, r) {
                    navigation_event(r.data.text);
                },
            },
            root: {
                text: 'Root',
                expanded: true,
                children: [{
                    text: 'Upload File',
                    expanded: false,
                    children: [{
                        text: 'Machine CSV File',
                        leaf: true
                    }, {
                        text: 'Machine Dat File',
                        leaf: true
                    }, ]
                }, {
                    text: 'Input List',
                    expanded: false,
                    children: [{
                            text: 'Address List',
                            leaf: true
                        }, {
                            text: 'Address Type List',
                            leaf: true
                        }, {
                            text: 'Blood Group List',
                            leaf: true
                        }, {
                            text: 'District List',
                            leaf: true
                        }, {
                            text: 'Department List',
                            leaf: true
                        }, {
                            text: 'Designation List',
                            leaf: true
                        }, {
                            text: 'Duty Shift List',
                            leaf: true
                        }, {
                            text: 'Employee Type',
                            leaf: true
                        }, {
                            text: 'Education List',
                            leaf: true
                        }, {
                            text: 'Experience List',
                            leaf: true
                        }, {
                            text: 'Holiday List',
                            leaf: true
                        }, {
                            text: 'Adjustment List',
                            leaf: true
                        }, {
                            text: 'Leave Type List',
                            leaf: true
                        }, {
                            text: 'Post Office List',
                            leaf: true
                        }, {
                            text: 'Police Station List',
                            leaf: true
                        }, {
                            text: 'Referer List',
                            leaf: true
                        }, {
                            text: 'Religion List',
                            leaf: true
                        }, {
                            text: 'Village List',
                            leaf: true
                        }, {
                            text: 'Work Place List',
                            leaf: true
                        }, {
                            text: 'Section List',
                            leaf: true
                        }, {
                            text: 'Payment Type',
                            leaf: true
                        }, {
                            text: 'Payment Status',
                            leaf: true
                        },
                        // {
                        //     text: 'Status List',
                        //     leaf: true
                        // },
                    ]
                }, {
                    text: 'Employee',
                    expanded: true,
                    children: [{
                        text: 'Search Employees',
                        leaf: true
                    }, {
                        text: 'Punch Problem',
                        leaf: true
                    }, {
                        text: 'Leave List',
                        leaf: true
                    }, {
                        text: 'Work Time List',
                        leaf: true
                    }, ]
                }, {
                    text: 'Attendance',
                    expanded: true,
                    children: [{
                        text: 'Monthly Summary',
                        leaf: true
                    }, {
                        text: 'Daily Summary',
                        leaf: true
                    }, ]
                }, {
                    text: 'Report',
                    expanded: true
                }, {
                    text: 'Daily Attendance',
                    leaf: true
                }, {
                    text: 'Department Attendance',
                    leaf: true
                }, {
                    text: 'User Attendance',
                    leaf: true
                }, {
                    text: 'Daily Report',
                    leaf: true
                }, {
                    text: 'Report Download',
                    leaf: true
                }, {
                    text: 'Hourly Punch Report',
                    leaf: true
                }, {
                    text: 'Night Tiffin Report',
                    leaf: true
                }, {
                    text: 'Leave Report',
                    leaf: true
                }, {
                    text: 'Monthly Report',
                    leaf: true
                }]
            }
        })

    ]

};

var tab_panel = Ext.create('Ext.tab.Panel', {
    region: 'center',
    layout: 'border',
    bodyStyle: {
        color: '#000000',
        //backgroundImage: 'url(/uploads/soltech_needle_fullscreen.png)',
        //backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
    },
    id: 'tab_panel',
    items: []
});

function navigation_event(cmd) {
    switch (cmd) {
        /***    Dashboard Start      ***/
        case "Dashboard":
            //dashboardTab();
            break;
            /***    Dashboard End        ***/
            /***    ITEM LIST Start      ***/
        case "Address List":
            addressListTab();
            break;
        case "Address Type List":
            addressTypeTab();
            break;
        case "Village List":
            villageTab();
            break;
        case "Post Office List":
            postOfficeTab();
            break;
        case "Police Station List":
            policeStationTab();
            break;
        case "District List":
            districtTab();
            break;
        case "Department List":
            departmentTab();
            break;
        case "Designation List":
            designationTab();
            break;
        case "Blood Group List":
            bloodGroupTab();
            break;
        case "Duty Shift List":
            dutyShiftTab();
            break;
        case "Employee Type":
            employeeTypeTab();
            break;
        case "Education List":
            educationTab();
            break;
        case "Experience List":
            experienceTab();
            break;
        case "Holiday List":
            holidayTab();
            break;
        case "Adjustment List":
            adjustmentTab();
            break;
        case "Referer List":
            refererTab();
            break;
        case "Religion List":
            religionTab();
            break;
        case "Section List":
            sectionTab();
            break;
        case "Payment Type":
            paymentTypeTab();
            break;
        case "Payment Status":
            paymentStatusTab();
            break;
        case "Work Place List":
            workingPlaceTab();
            break;
        case "Work Time List":
            workTimeTab();
            break;
        case "Leave Type List":
            leaveTypeTab();
            break;
        case "Status List":
            statusTab();
            break;
            /***    ITEM LIST End        ***/
            /***    HR Start      ***/
        case "Employee List":
            employeeListTab();
            break;
        case "Search Employees":
            searchEmployeesTab();
            break;
        case "Punch Problem":
            punchProblemTab();
            break;
        case "Leave List":
            leaveReportTab();
            break;
        case "User List":
            userTab();
            break;
            /***    HR End        ***/
            /***    Input Form Window Start      ***/
        case "Machine CSV File":
            csvAttendanceFormWindow();
            break;
        case "Machine Dat File":
            userListFileFormWindow();
            break;
        case "Archive Txt File":
            archiveTxtFileFormWindow();
            break;
            /***    Input Form Window End        ***/
            /***    Salary Start      ***/
        case "Old Top Sheet":
            comparativeSalaryStatementWindow();
            break;
        case "Comparative Salary":
            var compSalaryLastUpdateStore = Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: '/salaryLastUpdate'
                },
                autoLoad: true,
                autoSync: true,
                model: Ext.define('TEST_MODEL', {
                    extend: 'Ext.data.Model',
                    fields: [{
                        name: 'id',
                        type: 'int'
                    }]
                })
            });
            compSalaryLastUpdateStore.load({
                callback: function(records, operation, success) {
                    comparativeSalaryTab(records[0].data);
                },
                scope: this
            });
            break;
        case "Comparative Salary B":
            var compSalaryLastUpdateStoreB = Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: '/salaryLastUpdateB'
                },
                autoLoad: true,
                autoSync: true,
                model: Ext.define('TEST_MODEL', {
                    extend: 'Ext.data.Model',
                    fields: [{
                        name: 'id',
                        type: 'int'
                    }]
                })
            });
            compSalaryLastUpdateStoreB.load({
                callback: function(records, operation, success) {
                    comparativeSalaryTabB(records[0].data);
                },
                scope: this
            });
            break;
        case "Salary Statement B":
            salaryStatementWindowB();
            //salaryStatementTab();
            break;
        case "Disappointed Salary Statement":
            disappointedSalaryStatementWindow();
            //salaryStatementTab();
            break;
        case "Bonus Statement":
            bonusStatementWindow();
            //salaryStatementTab();
            break;
        case "Compliance Bonus Statement":
            complianceBonusStatementWindow();
            //salaryStatementTab();
            break;
        case "Bonus Bank Statement":
            bonusBankStatementWindow();
            //salaryStatementTab();
            break;
        case "Overtime Report":
            overtimeReportWindow();
            break;
        case "Overtime Summary":
            overtimeSummaryWindow();
            break;
        case "Bonus Top Sheet":
            bonusTopSheetWindow();
            //salaryStatementTab();
            break;
        case "Bank Statement":
            bankStatementTab();
            break;
        case "Bank Statement B":
            bankStatementTabB();
            break;
        case "Salary Bank Statement":
            salaryBankStatementWindow();
            //salaryBankStatementTab();
            break;
        case "Salary List B":
            salaryTab();
            break;
        case "Overtime Statement":
            overtimeStatementWindow();
            break;
        case "Overtime Statement B":
            overtimeStatementWindowB();
            break;
            /***    Salary End        ***/
            /***    Attendance Start      ***/
        case "Monthly Summary":
            monthlySummaryTab();
            break;
        case "Section Summary":
            sectionSummaryTab();
            break;
            /***    Attendance End        ***/
            /***    Payment Start      ***/
        case "Monthly Payment":
            monthlyPaymentTab();
            break;
            /***    Payment End        ***/
            /***    Finance Start      ***/
        case "Types Of Accounts":
            accountsTypeTab();
            break;
        case "Accounts Head":
            accountsHeadTab();
            break;
        case "Sub Head":
            subHeadTab();
            break;
        case "Voucher Type":
            voucherTypeTab();
            break;
        case "Voucher":
            voucherTab();
            break;
            /***    Finance End        ***/
            /***    Report Start      ***/
        case "Daily Attendance":
            dailyAttendanceWindow();
            break;
        case "Department Attendance":
            departmentAttendanceTab();
            break;
        case "Hourly Punch Report":
            hourlyPunchReportTab();
            break;
        case "Night Tiffin Report":
            // nightTiffinReportTab();
            nightTiffinReportWindow();
            break;
        case "User Attendance":
            userAttendanceTab();
            break;
        case "Daily Report":
            dailyReportTab();
            break;
        case "Monthly Report":
            monthlyReportWindow();
            break;
        case "Report Download":
            reportDownloadWindow();
            break;
        case "Leave Report":
            leaveReportTab();
            break;
            /***    Report End        ***/
            /***    Personal Start      ***/
        case "Change Password":
            changePasswordWindow();
            break;
        case "User Profile":
            userProfileTab();
            break;
            /***    Personal End        ***/
            /***    Attendance Start      ***/
        case "Daily Summary":
            dailySummaryTab();
            break;
        case "Monthly Attendance":
            monthlyAttendanceTab();
            break;
        case "Leave Details":
            leaveDetailsTab();
            break;
            /***    Attendance End        ***/
            /***    Accounts Start      ***/
        case "Line Production":
            lineProductionTab();
            break;
            /***    Accounts End        ***/
            /***    Accounts Start      ***/
        case "Employee Details":
            //employeeListTab();
            employeeDetailsListTab();
            break;
            /***    Salary Start      ***/
        case "Salary Statement":
            salaryStatementWindow();
            //salaryStatementTab();
            break;
        case "Salary Bank Statement":
            salaryBankStatementWindow();
            //salaryBankStatementTab();
            break;
        case "Salary List":
            salaryTab();
            break;
            /***    Salary End        ***/
            /***    File Start      ***/
        case "Import File":
            importFileTab();
            break;
        case "Export File":
            exportFileTab();
            break;
        case "Input List":
            inputListTab();
            break;
            /***    File End        ***/
            /***    Accounts End        ***/
    }
}

var header_panel = Ext.create('Ext.panel.Panel', {
    region: 'north',
    layout: {
        type: 'hbox'
    },
    bbar: [
        changingImage, {
            xtype: 'tbtext',
            text: "<h2>" + site_title + "</h2>"
        },
        '->', {
            icon: '/uploads/icons/user.png',
            border: 0,
            iconCls: 'add',
        }, {
            xtype: 'tbtext',
            text: user.email
        }, {
            text: '<b style="color: red">Sign Out</b>',
            icon: '/uploads/icons/log_out.png',
            iconCls: 'add',
            name: 'sign_out',
            tooltip: 'Sign Out',
            border: 2,
            style: {
                borderColor: 'red',
                borderStyle: 'solid'
            },
            handler: function() {
                window.location.href = site_url + 'signout';
            }
        },
    ],
    autoHeight: true,
    border: false
});

var footer_panel = Ext.create('Ext.toolbar.Toolbar', {
    region: 'south',
    border: false,
    items: [{
            xtype: 'tbtext',
            text: '<b><i>Developed By M.A.K. Ripon (Email: ripon@fashionflashltd.com, Contact: +880 173 0056 531 )</i></b>'
        },
        '->', {
            xtype: 'tbtext',
            text: '<b><i>©2016 ' + factory_name + ' All rights reserved</i></b>'
        },
    ],
});


Ext.tip.QuickTipManager.init();

String.prototype.toCapitalize = function() {
    return this.toLowerCase().replace(/(?:^|\s)\S/g, function(a) {
        return a.toUpperCase();
    });
};

Date.prototype.formatedDate = function() {
    var d = new Date(this)
    return d.getFullYear() + '-' + addLeadingZero(2, (d.getMonth() + 1)) + '-' + addLeadingZero(2, d.getDate());
};

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

var UNMARRIED = 0;
var MARRIED = 1;
var conf_curr_pass = 0;
var conf_new_pass = 0;
var conf_renew_pass = 0;

var acLvl = parseInt(user.access_level);
var site_url = window.location.href;
var site_port = window.location.port;

var factory_name = 'Not Found. Please Contact With Developer';
var site_title = 'Not Found. Please Contact With Developer';
var factoryShort = 'NULL';

if (site_port == '8000' || site_port == '8081') {
    factory_name = 'Denim Attires LTD.';
    site_title = factory_name + ' HR & Attendance System';
    factoryShort = 'DAL';
} else if (site_port == '8000' || site_port == '8082') {
    factory_name = 'Fashion Flash LTD.';
    site_title = factory_name + ' HR & Attendance System';
    factoryShort = 'FFL';
} else if (site_port == '8000' || site_port == '8083') {
    factory_name = 'Fashion Jeans LTD.';
    site_title = factory_name + ' HR & Attendance System';
    factoryShort = 'FJL';
} else if (site_port == '8000' || site_port == '8084') {
    factory_name = 'Jeans Concept LTD.';
    site_title = factory_name + ' HR & Attendance System';
    factoryShort = 'JCL';
} else if (site_port == '8000' || site_port == '8010') {
    factory_name = 'Right Link';
    site_title = factory_name + ' HR & Attendance System';
    factoryShort = 'RL';
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = new Date(startDate);
    while (currentDate <= new Date(stopDate)) {
        dateArray.push(currentDate);
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

function getDateArray(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = new Date(startDate);
    while (currentDate <= new Date(stopDate)) {
        dateArray.push(currentDate.formatedDate());
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

function time24Format(a) {
    var b = a.toUpperCase();
    if ((b.indexOf("AM") != -1) && (b.indexOf(':') != -1)) {
        var c = b.split(':'),
            m = parseInt(c[0]),
            n = parseInt(c[1])
        return m + ':' + n + ':' + '00';
    }
    if ((b.indexOf("PM") != -1) && (b.indexOf(':') != -1)) {
        var c = b.split(':'),
            m = parseInt(c[0]) + 12,
            n = parseInt(c[1])
        return m + ':' + n + ':' + '00';
    }
    return null
}

function time12Format(a) {
    var b = a.toUpperCase();
    if ((b.indexOf(':') != -1)) {
        var c = b.split(':'),
            h = parseInt(c[0]),
            m = parseInt(c[1])
        return addLeadingZero(2, ((h > 11) ? (h - 12) : h)) + ':' + addLeadingZero(2, m) + ':' + ((h > 11) ? 'PM' : 'AM');
    }
    return null
}

var mthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var mthCPNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
var monthCapitalNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

var dayPower = ["",
    "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th",
    "th", "th", "th", "th", "th", "th", "th", "th", "th", "th",
    "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "st"
];
var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

Date.prototype.formatDate = function() {
    var d = new Date(this)
    return addLeadingZero(2, d.getDate()) + '-' + mthCPNames[d.getMonth()] + '-' + d.getFullYear();
};

Date.prototype.DateFormat1 = function() {
    var d = new Date(this)
    return addLeadingZero(2, d.getDate()) + ' ' + mthCPNames[d.getMonth()] + ' ' + d.getFullYear();
};

function cellEditPlugin() {
    return new Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 2
    });
}

function fileDownload(location, name) {
    fileLocation = location + name + '.pdf';
    window.open(fileLocation);
}

function userAccess(a) {
    switch (a) {
        case 0:
            return false;
            break;
        default:
            return true;
            break;
    }
}

Number.prototype.formatMoney = function(c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function getDaysBetweenDates(d0, d1) {

    var msPerDay = 8.64e7;

    // Copy dates so don't mess them up
    var x0 = new Date(d0);
    var x1 = new Date(d1);

    // Set to noon - avoid DST errors
    x0.setHours(12, 0, 0);
    x1.setHours(12, 0, 0);

    // Round to remove daylight saving errors
    return Math.round((x1 - x0) / msPerDay);
}

function addLeadingZero(length, str) {
    var returnString = str.toString();
    var l = length - returnString.length;
    var zero = '';
    while (l > 0) {
        zero += '0';
        l--
    }
    return zero + returnString;
}

function popFromArray(myArray, value) {
    var index = myArray.indexOf(value);
    if (index > -1) {
        myArray.splice(index, 1);
    }
}

function findWeekendsCount(inDate, duration, weekDay) {
    var tmpDate = new Date(inDate);
    var weekDayCount = 0;
    var i;
    for (i = 0; i < parseInt(duration); i++) {
        tmpDate.setDate(tmpDate.getDate() + 1);
        if (tmpDate.getDay() == parseInt(weekDay)) {
            weekDayCount++;
        }
    }
    if (weekDayCount > 0) {
        var j;
        for (j = 0; j < weekDayCount; j++) {
            tmpDate.setDate(tmpDate.getDate() + 1);
            if (tmpDate.getDay() == parseInt(weekDay)) {
                weekDayCount++;
            }
        }
    }
    return weekDayCount + 4;
}

function findOutputDate(inDate, duration, weekDay) {
    var input = new Date(inDate);
    var tmpDate = new Date(inDate);
    var weekDayCount = 0;
    var i;
    for (i = 0; i < parseInt(duration); i++) {
        tmpDate.setDate(tmpDate.getDate() + 1);
        if (tmpDate.getDay() == parseInt(weekDay)) {
            weekDayCount++;
        }
    }
    if (weekDayCount > 0) {
        var j;
        for (j = 0; j < weekDayCount; j++) {
            tmpDate.setDate(tmpDate.getDate() + 1);
            if (tmpDate.getDay() == parseInt(weekDay)) {
                weekDayCount++;
            }
        }
    }
    var durations = input.getDate() + parseInt(duration) + weekDayCount + 4;
    input.setDate(durations);
    var outDate = input.getDate();
    var outMonth = input.getMonth() + 1;
    var outYear = input.getFullYear();
    return outMonth + "/" + outDate + "/" + outYear;
}

var changingImage = Ext.create('Ext.Img', {
    src: '/uploads/images/logo.png',
    height: 40,
    width: 50,
    margins: '8 10 0 0'
});

function passChangeImage(a, b) {
    return Ext.create('Ext.Img', {
        src: '/uploads/icons/' + b + '.png',
        id: a,
        height: 10,
        width: 15,
        border: false,
        margins: 4
    });
}

function infoImage(a) {
    return Ext.create('Ext.Img', {
        src: '/uploads/icons/warning.png',
        id: a,
        height: 10,
        width: 15,
        border: false,
        margins: 4
    });
}

function successImage(a) {
    return Ext.create('Ext.Img', {
        src: '/uploads/icons/tick_green.png',
        id: a,
        height: 10,
        width: 15,
        border: false,
        margins: 4
    });
}

function failImage(a) {
    return Ext.create('Ext.Img', {
        src: '/uploads/icons/erase.png',
        id: a,
        height: 10,
        width: 15,
        border: false,
        margins: 4
    });
}

function leaveAmount(a, d) {
    var amount = parseInt(a);
    var doj = new Date(d);
    var date = new Date();
    doj = date;
    var last_date = new Date(doj.getUTCFullYear() + '-' + 12 + '-' + 31);
    if (doj.getUTCFullYear() == date.getUTCFullYear()) {
        var days = doj.getFullYear() % 4 == 0 ? 366 : 365;
        var rest_days = Math.round((last_date - doj) / (1000 * 60 * 60 * 24)) + 1;
        return Math.round((amount * rest_days) / days);
    } else {
        return amount;
    }
}

var RequiredMF = '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>';

// socket.on('Chat',function(a){
//   socket.emit('Chat', user);
// });

// window.setTimeout(5)


var sBrowser, sUsrAg = navigator.userAgent;

if (sUsrAg.indexOf("Chrome") > -1) {
    sBrowser = "Google Chrome";
} else if (sUsrAg.indexOf("Safari") > -1) {
    sBrowser = "Apple Safari";
} else if (sUsrAg.indexOf("Opera") > -1) {
    sBrowser = "Opera";
} else if (sUsrAg.indexOf("Firefox") > -1) {
    sBrowser = "Mozilla Firefox";
} else if (sUsrAg.indexOf("MSIE") > -1) {
    sBrowser = "Microsoft Internet Explorer";
}

function jscd() {
    var unknown = '-';

    // screen
    var screenSize = '';
    if (screen.width) {
        width = (screen.width) ? screen.width : '';
        height = (screen.height) ? screen.height : '';
        screenSize += '' + width + " x " + height;
    }

    // browser
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browser = navigator.appName;
    var version = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // Opera
    if ((verOffset = nAgt.indexOf('Opera')) != -1) {
        browser = 'Opera';
        version = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf('Version')) != -1) {
            version = nAgt.substring(verOffset + 8);
        }
    }
    // Opera Next
    if ((verOffset = nAgt.indexOf('OPR')) != -1) {
        browser = 'Opera';
        version = nAgt.substring(verOffset + 4);
    }
    // Edge
    else if ((verOffset = nAgt.indexOf('Edge')) != -1) {
        browser = 'Microsoft Edge';
        version = nAgt.substring(verOffset + 5);
    }
    // MSIE
    else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
        browser = 'Microsoft Internet Explorer';
        version = nAgt.substring(verOffset + 5);
    }
    // Chrome
    else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
        browser = 'Chrome';
        version = nAgt.substring(verOffset + 7);
    }
    // Safari
    else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
        browser = 'Safari';
        version = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf('Version')) != -1) {
            version = nAgt.substring(verOffset + 8);
        }
    }
    // Firefox
    else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
        browser = 'Firefox';
        version = nAgt.substring(verOffset + 8);
    }
    // MSIE 11+
    else if (nAgt.indexOf('Trident/') != -1) {
        browser = 'Microsoft Internet Explorer';
        version = nAgt.substring(nAgt.indexOf('rv:') + 3);
    }
    // Other browsers
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
        browser = nAgt.substring(nameOffset, verOffset);
        version = nAgt.substring(verOffset + 1);
        if (browser.toLowerCase() == browser.toUpperCase()) {
            browser = navigator.appName;
        }
    }
    // trim the version string
    if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

    majorVersion = parseInt('' + version, 10);
    if (isNaN(majorVersion)) {
        version = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }

    // mobile version
    var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

    // cookie
    var cookieEnabled = (navigator.cookieEnabled) ? true : false;

    if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
        document.cookie = 'testcookie';
        cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
    }

    // system
    var os = unknown;
    var clientStrings = [{
        s: 'Windows 10',
        r: /(Windows 10.0|Windows NT 10.0)/
    }, {
        s: 'Windows 8.1',
        r: /(Windows 8.1|Windows NT 6.3)/
    }, {
        s: 'Windows 8',
        r: /(Windows 8|Windows NT 6.2)/
    }, {
        s: 'Windows 7',
        r: /(Windows 7|Windows NT 6.1)/
    }, {
        s: 'Windows Vista',
        r: /Windows NT 6.0/
    }, {
        s: 'Windows Server 2003',
        r: /Windows NT 5.2/
    }, {
        s: 'Windows XP',
        r: /(Windows NT 5.1|Windows XP)/
    }, {
        s: 'Windows 2000',
        r: /(Windows NT 5.0|Windows 2000)/
    }, {
        s: 'Windows ME',
        r: /(Win 9x 4.90|Windows ME)/
    }, {
        s: 'Windows 98',
        r: /(Windows 98|Win98)/
    }, {
        s: 'Windows 95',
        r: /(Windows 95|Win95|Windows_95)/
    }, {
        s: 'Windows NT 4.0',
        r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
    }, {
        s: 'Windows CE',
        r: /Windows CE/
    }, {
        s: 'Windows 3.11',
        r: /Win16/
    }, {
        s: 'Android',
        r: /Android/
    }, {
        s: 'Open BSD',
        r: /OpenBSD/
    }, {
        s: 'Sun OS',
        r: /SunOS/
    }, {
        s: 'Ubuntu',
        r: /(Ubuntu|X11)/
    }, {
        s: 'Linux',
        r: /(Linux|X11)/
    }, {
        s: 'iOS',
        r: /(iPhone|iPad|iPod)/
    }, {
        s: 'Mac OS X',
        r: /Mac OS X/
    }, {
        s: 'Mac OS',
        r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
    }, {
        s: 'QNX',
        r: /QNX/
    }, {
        s: 'UNIX',
        r: /UNIX/
    }, {
        s: 'BeOS',
        r: /BeOS/
    }, {
        s: 'OS/2',
        r: /OS\/2/
    }, {
        s: 'Search Bot',
        r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
    }];
    for (var id in clientStrings) {
        var cs = clientStrings[id];
        if (cs.r.test(nAgt)) {
            os = cs.s;
            break;
        }
    }

    var osVersion = unknown;

    if (/Windows/.test(os)) {
        osVersion = /Windows (.*)/.exec(os)[1];
        os = 'Windows';
    }

    switch (os) {
        case 'Mac OS X':
            osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
            break;

        case 'Android':
            osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
            break;

        case 'iOS':
            osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
            osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
            break;
    }

    // flash (you'll need to include swfobject)
    /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
    var flashVersion = 'no check';
    if (typeof swfobject != 'undefined') {
        var fv = swfobject.getFlashPlayerVersion();
        if (fv.major > 0) {
            flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
        } else {
            flashVersion = unknown;
        }
    }

    return {
        screen: screenSize,
        browser: browser,
        browserVersion: version,
        browserMajorVersion: majorVersion,
        mobile: mobile,
        os: os,
        osVersion: osVersion,
        cookies: cookieEnabled,
        flashVersion: flashVersion
    };
};

var uOS = jscd().os + ' ' + jscd().osVersion;
// console.log(
//     'OS: ' + jscd().os +' '+ jscd().osVersion + '\n' +
//     'Browser: ' + jscd().browser +' '+ jscd().browserMajorVersion +
//       ' (' + jscd().browserVersion + ')\n' + 
//     'Mobile: ' + jscd().mobile + '\n' +
//     'Flash: ' + jscd().flashVersion + '\n' +
//     'Cookies: ' + jscd().cookies + '\n' +
//     'Screen Size: ' + jscd().screen + '\n\n' +
//     'Full User Agent: ' + navigator.userAgent
// );

// console.log(navigator.userAgent);
// console.log(sBrowser);
// console.log(window.navigator.platform);

// function showLoc() {
//   var oLocation = location, aLog = ["Property (Typeof): Value", "location (" + (typeof oLocation) + "): " + oLocation ];
//   for (var sProp in oLocation){
//     aLog.push(sProp + " (" + (typeof oLocation[sProp]) + "): " +  (oLocation[sProp] || "n/a"));
//   }
//   console.log(aLog.join("\n"));
// }
// showLoc();

// console.log('%cYOUR IP %c****' + user.ip + '****', 'font-size: 150%;font-weight: bold;color:green', 'font-size: 180%;font-weight: bold;color:red');
// console.log('%cYOUR BROWSER %c****' + sBrowser + '****', 'font-size: 150%;font-weight: bold;color:green', 'font-size: 180%;font-weight: bold;color:red');
// console.log('%cYOUR OS %c****' + uOS + '****', 'font-size: 150%;font-weight: bold;color:green', 'font-size: 180%;font-weight: bold;color:red');
// console.log('%c Developed By M.A.K. Ripon (Email: ripon@fashionflashltd.com, Contact: +880 173 0056 531 ) ', 'background: #dfd; color: #050');
// console.log('%cALERT!', 'font-size: 400%;font-weight: bold;color:red')
// console.log('%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a feature or "hack" someone`s account, it is a scam and will give them access to your account.', 'font-size: 200%;color:blue')

function convertAmountToWords(amount) {
    var words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    amount = amount.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    if (n_length <= 9) {
        var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
        var received_n_array = new Array();
        for (var i = 0; i < n_length; i++) {
            received_n_array[i] = number.substr(i, 1);
        }
        for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
            n_array[i] = received_n_array[j];
        }
        for (var i = 0, j = 1; i < 9; i++, j++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                if (n_array[i] == 1) {
                    n_array[j] = 10 + parseInt(n_array[j]);
                    n_array[i] = 0;
                }
            }
        }
        value = "";
        for (var i = 0; i < 9; i++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                value = n_array[i] * 10;
            } else {
                value = n_array[i];
            }
            if (value != 0) {
                words_string += words[value] + " ";
            }
            if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Crores ";
            }
            if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Lakhs ";
            }
            if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Thousand ";
            }
            if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                words_string += "Hundred and ";
            } else if (i == 6 && value != 0) {
                words_string += "Hundred ";
            }
        }
        words_string = words_string.split("  ").join(" ");
    } else {
        'Amount Is Over 100 Crores'
    }
    return words_string;
}

function isDoubleByte(str) {
    for (var i = 0, n = str.length; i < n; i++) {
        if (str.charCodeAt(i) > 255) {
            return true;
        }
    }
    return false;
}

var empIDStackForPrint = [];