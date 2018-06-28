module.exports = function() {};

var mthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

var mthCPNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
var mthBngNames = ["জান", "ফেব্রু", "মার্চ", "এপ্রি", "মে", "জুন", "জুল", "আগ", "সেপ্ট", "অক্ট", "নভে", "ডিসে"];
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

var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var dayCapitalNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
var dayShortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var dayShortCapsNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function shortNames(str) {
    var str_arr = str.split(" ");
    var returnString = '';
    for (var i = 0; i < str_arr.length; i++) {
        returnString += str_arr[i][0]
    };
    return returnString;
}


var softwarePath = require.main.filename;
var pArr = softwarePath.split("/");
var folderName = pArr[pArr.length - 2];
var factoryName = 'Not Found. Please Contact With Developer';
var factoryShort = 'NULL';

if (folderName == 'DA_HR') {
    factoryName = 'Denim Attires LTD';
    factoryShort = 'DAL';
} else if (folderName == 'FFL_FACTORY_HR') {
    factoryName = 'Fashion Flash LTD Factory';
    factoryShort = 'FFL';
} else if (folderName == 'FJL_HR') {
    factoryName = 'Fashion Jeans LTD';
    factoryShort = 'FJL';
} else if (folderName == 'JCL_WASH_HR') {
    factoryName = 'Jeans Concept LTD';
    factoryShort = 'JCL';
} else if (folderName == 'Right_Link') {
    factoryName = 'RIGHT LINK';
    factoryShort = 'RL';
}

var ramadan2017 = [
    '2017-5-28', '2017-5-29', '2017-5-30', '2017-5-31',
    '2017-6-1', '2017-6-2', '2017-6-3', '2017-6-4',
    '2017-6-5', '2017-6-6', '2017-6-7', '2017-6-8',
    '2017-6-9', '2017-6-10', '2017-6-11', '2017-6-12',
    '2017-6-13', '2017-6-14', '2017-6-15', '2017-6-16',
    '2017-6-17', '2017-6-18', '2017-6-19', '2017-6-20',
    '2017-6-21', '2017-6-22', '2017-6-23', '2017-6-24',
    '2017-6-25', '2017-6-26', '2017-6-27', '2017-6-28'
];

var ramadan1p2017 = (factoryShort == 'DAL') ? [
    '2017-5-28', '2017-5-29', '2017-5-30'
] : [
    '2017-5-28', '2017-5-29', '2017-5-30', '2017-5-31'
];

var ramadan2p2017 = (factoryShort == 'DAL') ? [
    '2017-5-31',
    '2017-6-1', '2017-6-2', '2017-6-3', '2017-6-4',
    '2017-6-5', '2017-6-6', '2017-6-7', '2017-6-8',
    '2017-6-9', '2017-6-10', '2017-6-11', '2017-6-12',
    '2017-6-13', '2017-6-14', '2017-6-15', '2017-6-16',
    '2017-6-17', '2017-6-18', '2017-6-19', '2017-6-20',
    '2017-6-21', '2017-6-22', '2017-6-23', '2017-6-24',
    '2017-6-25', '2017-6-26', '2017-6-27', '2017-6-28'
] : [
    '2017-6-1', '2017-6-2', '2017-6-3', '2017-6-4',
    '2017-6-5', '2017-6-6', '2017-6-7', '2017-6-8',
    '2017-6-9', '2017-6-10', '2017-6-11', '2017-6-12',
    '2017-6-13', '2017-6-14', '2017-6-15', '2017-6-16',
    '2017-6-17', '2017-6-18', '2017-6-19', '2017-6-20',
    '2017-6-21', '2017-6-22', '2017-6-23', '2017-6-24',
    '2017-6-25', '2017-6-26', '2017-6-27', '2017-6-28'
];

Date.prototype.monthDays = function() {
    var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
    return d.getDate();
}

Date.prototype.monthDayCount = function() {
    var d = new Date(Date.UTC(this.getUTCFullYear(), this.getUTCMonth() + 1, 0));
    return d.getUTCDate();
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

var fs = require('fs');
var async = require('async');
var cron = require('node-cron');

var tmpStoreData = {};
tmpStoreData.createDate = new Date();
tmpStoreData.searchDate = new Date();
tmpStoreData.htmlData = '<!DOCTYPE html><head></head><body></body>';

var finalEnlishToBanglaNumber = {
    '0': '০',
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯'
};

function timeArray(m, n, d) {
    var r = [];
    var hour = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
    var min = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];
    for (var i = m; i <= n; i++) {
        for (var j = 0; j < min.length; j += d) {
            var o = {};
            o.id = addLeadingZero(2, (hour[i])) + ':' + addLeadingZero(2, min[j]) + ':00';
            o.name = addLeadingZero(2, (hour[i])) + ':' + addLeadingZero(2, min[j]) + ':00';
            r.push(o);
        }
    }
    return r;
}

function time24Format(a) {
    var b = a.toUpperCase();
    if ((b.indexOf("AM") != -1) && (b.indexOf(':') != -1)) {
        var c = b.split(':'),
            h = parseInt(c[0]),
            m = parseInt(c[1])
        return h + ':' + m + ':' + '00';
    }
    if ((b.indexOf("PM") != -1) && (b.indexOf(':') != -1)) {
        var c = b.split(':'),
            h = parseInt(c[0]) + 12,
            m = parseInt(c[1])
        return h + ':' + m + ':' + '00';
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

function getBanglaDateTime(dateVal) {
    var now = new Date(dateVal);
    if (typeof dateVal == 'undefined') {
        now = new Date();
    }

    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();

    if (month.toString().length == 1) {
        var month = '0' + month;
    }
    if (day.toString().length == 1) {
        var day = '0' + day;
    }
    if (hour.toString().length == 1) {
        var hour = '0' + hour;
    }
    if (minute.toString().length == 1) {
        var minute = '0' + minute;
    }
    if (second.toString().length == 1) {
        var second = '0' + second;
    }

    var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
    return dateTime.getDigitBanglaFromEnglish();
}

String.prototype.getDigitBanglaFromEnglish = function() {
    var retStr = this.toString();
    for (var x in finalEnlishToBanglaNumber) {
        retStr = retStr.replace(new RegExp(x, 'g'), finalEnlishToBanglaNumber[x]);
    }
    return retStr;
};

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

Date.prototype.formatedDate = function() {
    var d = new Date(this);
    return d.getFullYear() + '-' + addLeadingZero(2, (d.getMonth() + 1)) + '-' + addLeadingZero(2, d.getDate());
};

Date.prototype.dateToBangla = function() {
    var d = new Date(this);
    return numEngToBan(addLeadingZero(2, d.getDate())) + '/' + numEngToBan(addLeadingZero(2, (d.getMonth() + 1))) + '/' + numEngToBan(d.getFullYear());
};

Date.prototype.formatDate = function() {
    var d = new Date(this);
    return addLeadingZero(2, d.getDate()) + '-' + mthCPNames[d.getMonth()] + '-' + d.getFullYear();
};

Date.prototype.formatDate2 = function() {
    var d = new Date(this);
    return addLeadingZero(2, d.getDate()) + '<sup>' + dayPower[d.getDate()] + '</sup> ' + mthCPNames[d.getMonth()] + ', ' + d.getFullYear();
};

Date.prototype.formatFullDate = function() {
    var d = new Date(this);
    return d.getDate() + '<sup>' + dayPower[d.getDate()] + '</sup> ' + monthNames[d.getMonth()] + ', ' + d.getFullYear();
};

function dateFormatDMY(a) {
    var d = new Date(a)
    return d.getDate() + '-' + mthCPNames[d.getMonth()] + '-' + d.getFullYear();
}

function dayArrayFunc(a) {
    switch (a) {
        case 28:
            return [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28
            ];
            break;
        case 29:
            return [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28, 29
            ];
            break;
        case 30:
            return [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28, 29, 30
            ];
            break;
        case 31:
            return [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
            ];
            break;
        default:
            return [];
    }
}

function rangeMArrayFunc(d) {
    var f = new Date(d);
    f.setUTCMonth(f.getUTCMonth() - 1);
    f.setUTCDate(26);
    var t = new Date(d);
    t.setUTCDate(25);
    var r = [];
    while (f <= t) {
        var Y = f.getUTCFullYear();
        var M = f.getUTCMonth() + 1;
        var D = f.getUTCDate();
        var YMD = Y + '-' + M + '-' + D;
        r.push(YMD);
        f.setUTCDate(f.getUTCDate() + 1);
    }
    return r;
}

function dateListFromMonth(a) {
    var tmpd3 = new Date(a);
    var tmpd1 = new Date(tmpd3.getFullYear(), tmpd3.getMonth(), 01);
    var tmpd2 = new Date(tmpd3.getFullYear(), tmpd3.getMonth(), 01);
    var r_array = [];
    var OK = true;
    while (OK) {
        r_array.push(tmpd1.getDate());
        tmpd1.setDate(tmpd1.getDate() + 1)
        if (tmpd1.getMonth() != tmpd2.getMonth()) {
            OK = false;
        }
    }
    return r_array;
}

var mthCPNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
var mthBngNames = ["জান", "ফেব্রু", "মার্চ", "এপ্রি", "মে", "জুন", "জুল", "আগ", "সেপ্ট", "অক্ট", "নভে", "ডিসে"];
var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

var monthCapitalNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

var monthCapitalBanglaNames = ["জানুয়ারী", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];

var dayPower = ["",
    "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th",
    "th", "th", "th", "th", "th", "th", "th", "th", "th", "th",
    "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "st"
];

var softwarePath = require.main.filename;
var pArr = softwarePath.split("/");
var folderName = pArr[pArr.length - 2];

var factoryName = 'FACTORY NOT DEFINED';
var factoryBanglaName = 'ফ্যাক্টরির নাম ভুল';
var factoryShort = 'NULL';

if (folderName == 'DA_HR') {
    factoryName = 'DENIM ATTIRES LIMITED';
    factoryBanglaName = 'ডেনিম এট্টেয়ার্স লিমিটেড';
    factoryShort = 'DAL';
} else if (folderName == 'FFL_FACTORY_HR') {
    factoryName = 'FASHION FLASH LIMITED';
    factoryBanglaName = 'ফ্যাশন ফ্ল্যাশ লিমিটেড';
    factoryShort = 'FFL';
} else if (folderName == 'FJL_HR') {
    factoryName = 'FASHION JEANS LIMITED';
    factoryBanglaName = 'ফ্যাশন জিন্নস লিমিটেড';
    factoryShort = 'FJL';
} else if (folderName == 'JCL_WASH_HR') {
    factoryName = 'JEANS CONCEPT LIMITED';
    factoryBanglaName = 'জিন্নস কনসেপ্ট লিমিটেড';
    factoryShort = 'JCLWASH';
} else if (folderName == 'Right_Link') {
    factoryName = 'RIGHT LINK';
    factoryBanglaName = 'রাইট লিংক';
    factoryShort = 'RL';
}

var ramadan2017 = [
    '2017-5-28', '2017-5-29', '2017-5-30', '2017-5-31',
    '2017-6-1', '2017-6-2', '2017-6-3', '2017-6-4',
    '2017-6-5', '2017-6-6', '2017-6-7', '2017-6-8',
    '2017-6-9', '2017-6-10', '2017-6-11', '2017-6-12',
    '2017-6-13', '2017-6-14', '2017-6-15', '2017-6-16',
    '2017-6-17', '2017-6-18', '2017-6-19', '2017-6-20',
    '2017-6-21', '2017-6-22', '2017-6-23', '2017-6-24',
    '2017-6-25', '2017-6-26', '2017-6-27', '2017-6-28'
];

var ramadan1p2017 = (factoryShort == 'DAL') ? [
    '2017-5-28', '2017-5-29', '2017-5-30'
] : [
    '2017-5-28', '2017-5-29', '2017-5-30', '2017-5-31'
];

var ramadan2p2017 = (factoryShort == 'DAL') ? [
    '2017-5-31',
    '2017-6-1', '2017-6-2', '2017-6-3', '2017-6-4',
    '2017-6-5', '2017-6-6', '2017-6-7', '2017-6-8',
    '2017-6-9', '2017-6-10', '2017-6-11', '2017-6-12',
    '2017-6-13', '2017-6-14', '2017-6-15', '2017-6-16',
    '2017-6-17', '2017-6-18', '2017-6-19', '2017-6-20',
    '2017-6-21', '2017-6-22', '2017-6-23', '2017-6-24',
    '2017-6-25', '2017-6-26', '2017-6-27', '2017-6-28'
] : [
    '2017-6-1', '2017-6-2', '2017-6-3', '2017-6-4',
    '2017-6-5', '2017-6-6', '2017-6-7', '2017-6-8',
    '2017-6-9', '2017-6-10', '2017-6-11', '2017-6-12',
    '2017-6-13', '2017-6-14', '2017-6-15', '2017-6-16',
    '2017-6-17', '2017-6-18', '2017-6-19', '2017-6-20',
    '2017-6-21', '2017-6-22', '2017-6-23', '2017-6-24',
    '2017-6-25', '2017-6-26', '2017-6-27', '2017-6-28'
];

function bonusStatementHeader(ms, t) {
    var d = new Date(ms)
    var sSH = '<br />' +
        '<h1 style="line-height: 0.5;font-size: 80%;">' +
        factoryName +
        '</h1>' +
        '<h2 style="line-height: 0.5;font-size: 65%;">' +
        'FESTIVAL BONUS STATEMENT' +
        '</h2>' +
        '<h3 style="line-height: 0.5;font-size: 55%;">' +
        'FOR THE FESTIVAL OF ' + t + ', ' +
        d.getUTCFullYear() +
        '</h3>';
    return sSH;
}

function headerContents() {
    var hC = '<div style="' +
        'color: #444;' +
        'font-size: 9px;' +
        'position: fixed;' +
        'top: 15;' +
        'right: 15;' +
        '">' +
        '<span>PRINT TIME: ' +
        new Date() +
        '</span>' +
        '</div>' +
        '<br />' +
        '<h3 style="' +
        'line-height: 0;' +
        '">' + factoryName + '</h3>';
    return hC;
}

function footerContents() {
    var fC = '<div style="' +
        'color: #444;' +
        'font-size: 9px;' +
        'position: fixed;' +
        'bottom: 15;' +
        'right: 15;' +
        '">' +
        '<span>PAGE {{page}}</span>' +
        ' OUT OF ' +
        '<span>{{pages}}</span>' +
        '</div>';
    return fC;
}

function footerTContents() {
    var fC = '<div style="' +
        'color: #444;' +
        'font-size: 7px;' +
        'position: fixed;' +
        'bottom: 15;' +
        'right: 15;' +
        '">' +
        '<span>PAGE {{page}}</span>' +
        ' OF ' +
        '<span>{{pages}}</span>' +
        '</div>';
    fC += '<br />';
    fC += '<table style="width:100%;border: 0px solid white;';
    fC += 'font-size: 10px;';
    fC += '">';
    fC += '<tr style="border: 0px solid white;">';
    fC += '<td style="border: 0px solid white;" align="center">Prepared By</td>';
    fC += '<td style="border: 0px solid white;" align="center">Checked BY</td>';
    fC += '<td style="border: 0px solid white;" align="center">Approved By</td>';
    fC += '</tr>';
    fC += '</table>';
    return fC;
}

function bonusStatementReportHead() {
    var sSRH = '<head>' +
        '<style>' +
        'table, th, td {' +
        'border: 1px solid black;' +
        'border-collapse: collapse;' +
        '}' +
        'th, td {' +
        'padding: 5px;' +
        'line-height: 1;' +
        'align: center;' +
        '}' +
        'h1, h2, h3, h4, h5, h6 {' +
        'line-height: 0;' +
        'text-align: center;' +
        '}' +
        '#pageBody {' +
        'font-size: 9px;' +
        'padding: 0px 0px;' +
        'page-break-after: always;' +
        '}' +
        '#pageBody:last-child {' +
        'page-break-after: avoid;' +
        '}' +
        '</style>' +
        '</head>';
    return sSRH;
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

function secDiff(a, b) {
    a = new Date(a);
    b = new Date(b);
    var c = Math.abs(b - a) / 1000; //// IN SECONDS
    return c;
}

function minDiff(a, b) {
    var c = Math.floor(secDiff(a, b) / 60); //// IN MINUTES
    return c;
}

function checkTmpStoreData(a) {
    var c = secDiff(a, tmpStoreData.createDate);
    if (c > 20)
        return true;
    return false;
}

function monthRangeArray(m, y, f, t) {
    var r = [];
    f = parseInt(f);
    t = parseInt(t);
    var a = new Date(Date.UTC(y, m));
    var sm = (f > t) ? m - 1 : m;
    var x = Date.UTC(y, sm, f);
    var y = Date.UTC(y, m, t);
    var s = new Date(x);
    var e = new Date(y);
    while (s <= e) {
        var Y = s.getFullYear();
        var M = s.getMonth() + 1;
        var D = s.getDate();
        var YMD = Y + '-' + M + '-' + D;
        r.push(YMD);
        s.setDate(s.getDate() + 1);
    }
    return r;
}

function overTime2017Count(tH, tM, oH, oM, mH) {
    tH = parseInt(tH);
    tM = parseInt(tM);
    oH = parseInt(oH);
    oM = parseInt(oM);
    mH = parseInt(mH);
    var rH = 0;
    var rM = 0;
    var tT = (tH * 60) + tM;
    var oT = (oH * 60) + oM;
    if (oH >= tH) {
        rH = (oT - tT) / 60;
        rH = rH.toFixed(2);
        rH = rH.toString();
        var f = rH.split(".");
        var fM = (parseInt(f[1]) * 60) / 100;
        var fH = (fM > mH) ? parseInt(f[0]) + 1 : parseInt(f[0]);
        return fH;
    } else {
        return 0;
    }
}

function getMonthlyAttendance(db, QUERY, callback) {
    var returnData = [];
    getAllEmployeeID(db, QUERY, function(eIdData) {
        async.each(eIdData, function(eId, cb_eId) {
            var o = {};
            o.employee = eId.id;
            // o.data = [];
            var d = (QUERY.date) ? new Date(QUERY.date) : new Date();
            d.setDate(1);
            var dayArray = dayArrayFunc(d.monthDays());
            async.each(dayArray, function(day, cb_day) {
                d.setDate(day);
                var Y = d.getFullYear();
                var M = d.getMonth() + 1;
                var D = d.getDate();
                var YMD = Y + '-' + M + '-' + D;
                var AttSearch = {};
                AttSearch.date = YMD;
                AttSearch.employee = eId.id;
                o[YMD] = {};
                getEmployeeDayPunchDetails(db, AttSearch, function(eDPD) {
                    // o.data.push(eDPD);
                    o[YMD] = eDPD[YMD];
                    cb_day();
                });
            }, function(err) {
                returnData.push(o);
                cb_eId();
            });
        }, function(err) {
            callback(returnData);
        });
    });
}

function getTest(db, callback) {
    getDepartment(db, function(d) {
        callback(d);
    })
}

function getFinanceNavigation(db) {
    getDepartment(db, function(d) {
        return (d);
    })
}

var mthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

var softwarePath = require.main.filename;
var pArr = softwarePath.split("/");
var folderName = pArr[pArr.length-2];

Date.prototype.monthDays= function(){
    var d= new Date(this.getFullYear(), this.getMonth()+1, 0);
    return d.getDate();
}

function weekendCount(d){
    var fdate = new Date(d.getFullYear(), d.getMonth(), 01, 00, 00, 00, 00);
    var count = 0;
    while(d.getMonth()==fdate.getMonth()){
        if(fdate.getDay()==5){
            count++;
        }
        fdate.setDate(fdate.getDate()+1)
    }
    return count;
}

function addLeadingZero(length, str) {
  var returnString = str.toString();
  var l = length-returnString.length;
  var zero = '';
  while(l>0){
    zero+='0';
    l--
  }
  return zero+returnString;
}

function sortDates(a, b)
{
    return a.getTime() - b.getTime();
}

function weekendList(d){
    var fdate = new Date(d.getFullYear(), d.getMonth(), 01, 00, 00, 00, 00);
    var returnArray = [];
    while(d.getMonth()==fdate.getMonth()){
        if(fdate.getDay()==5){
            returnArray.push(fdate.getDate());
        }
        fdate.setDate(fdate.getDate()+1)
    }
    return returnArray;
}

function shortNames(str){
    var str_arr = str.split(" ");
    var returnString = '';
    for (var i = 0; i < str_arr.length; i++) {
        returnString+=str_arr[i][0]
    };
    return returnString;
}

function dateListFromMonth(a){
    var tmpd3 = new Date(a);
    var tmpd1 = new Date(tmpd3.getFullYear(), tmpd3.getMonth(), 01);
    var tmpd2 = new Date(tmpd3.getFullYear(), tmpd3.getMonth(), 01);
    var r_array = [];
    var OK = true;
    while(OK){
        r_array.push(tmpd1.getDate());
        tmpd1.setDate(tmpd1.getDate() + 1)
        if(tmpd1.getMonth()!=tmpd2.getMonth()){
            OK = false;
        }
    }
    return r_array;
}

function search_employee_list(db, QUERY, callback)
{
  var returnData = [], search_emp = {};
  search_emp.status = 1;
  if(QUERY.status)
    search_emp.status = QUERY.status;
  if(QUERY.id)
    search_emp.id = QUERY.id;
  if(QUERY.department)
    search_emp.department = QUERY.department;
  if(QUERY.designation)
    search_emp.designation = QUERY.designation;
  if(QUERY.section)
    search_emp.section = QUERY.section;
  if(QUERY.working_place)
    search_emp.working_place = QUERY.working_place;
  if(QUERY.employee_type)
    search_emp.employee_type = QUERY.employee_type;
  var START = (QUERY.start) ? parseInt(QUERY.start) : 0;
  var LIMIT = (QUERY.limit) ? parseInt(QUERY.limit) : 30;
  var SORT = (QUERY.sort) ? QUERY.sort : 'id';
  var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';

  db.employee.findAll({
    where: search_emp,
    //attributes: ['id', 'date_of_birth', 'date_of_join', [sequelize.literal('('+ts+')'), 'totalAmount']],
    attributes: [
        'id', 'grade', 'status', 'date_of_birth', 'date_of_join',
        'date_of_release', 'card_issue', 'card_expire', 'address',
        'address_bangla', 'national_id', 'gender', 'religion',
        'marital_status', 'contact_no', 'blood_group', 'remarks'
    ],
    include: [
      {
        model: db.user,
        attributes: [
          'id', 'card_no', 'finger_print_id',
          'first_name', 'last_name', 'name_bangla', 'email', 'access_level'
        ]
      },
      { model: db.designation, attributes: ['name'] },
      { model: db.department, attributes: ['name'] },
      { model: db.section, attributes: ['name'] },
      { model: db.working_place, attributes: ['name'] },
      { model: db.employee_type, attributes: ['name'] },
      { model: db.status, attributes: ['name'] },
      { model: db.religion, attributes: ['name'] },
      { model: db.blood_group, attributes: ['name'] },
      { model: db.work_time, attributes: ['in_time', 'out_time'] },
    ],
    order: [
      [SORT, DIR]
    ],
    offset: START,
    limit: LIMIT,
  }).complete(function(err, employee_data) {
    db.employee.count({
      where: search_emp
    }).complete(function(err, data) {
      var pp = {"count":data,"data": employee_data}
      callback(pp);
    })
   /* async.each(employee_data, function (employee, cb_employee_data) {
      var emp = {};
      emp.id = employee.id;
      returnData.push(emp)
      cb_employee_data();
    }, function (err) {
      if (err) { throw err; }
      callback(returnData);
    });*/
  })
}

function compliance_search_employee_list(db, QUERY, callback)
{
  var returnData = [],
    search_emp = {};
// if(QUERY.status)
  var secTmpArr = (folderName=='DA_HR')? 
    [11, 31] : 
    (folderName=='FFL_FACTORY_HR')? 
      [27, 28] :
      (folderName=='FJL_HR')? 
        [25, 26] :
        [];

  search_emp.section = {};
  search_emp.section.not = secTmpArr;
  // search_emp.section. = { notIn: secTmpArr };

  if(QUERY.status)
    search_emp.status = QUERY.status;
  if(QUERY.id)
    search_emp.id = QUERY.id;
  // if(QUERY.department)
  //   search_emp.department = QUERY.department;
  if(QUERY.designation)
    search_emp.designation = QUERY.designation;
  // if(QUERY.section)
  //   search_emp.section = QUERY.section;
  if(QUERY.working_place)
    search_emp.working_place = QUERY.working_place;
  if(QUERY.employee_type)
    search_emp.employee_type = QUERY.employee_type;
  var START = (QUERY.start) ? parseInt(QUERY.start) : 0;
  var LIMIT = (QUERY.limit) ? parseInt(QUERY.limit) : 30;
  var SORT = (QUERY.sort) ? QUERY.sort : 'id';
  var DIR = (QUERY.dir) ? QUERY.dir : 'ASC';

  db.employee.findAndCountAll({
    where: search_emp,
    //attributes: ['id', 'date_of_birth', 'date_of_join', [sequelize.literal('('+ts+')'), 'totalAmount']],
    attributes: ['id', 'grade', 'status', 'date_of_birth', 'date_of_join'],
    include: [
      {
        model: db.user,
        attributes: [
          'id', 'card_no', 'finger_print_id',
          'first_name', 'last_name', 'name_bangla', 'email', 'access_level'
        ]
      },
      { model: db.designation, attributes: ['name'] },
      { model: db.department, attributes: ['name'] },
      { model: db.section, attributes: ['name'] },
      { model: db.working_place, attributes: ['name'] },
      { model: db.employee_type, attributes: ['name'] },
      { model: db.status, attributes: ['name'] },
      { model: db.work_time, attributes: ['in_time', 'out_time'] },
    ],
    order: [
      [SORT, DIR]
    ],
    offset: START,
    limit: LIMIT,
  }).complete(function(err, empData) {
    callback(empData);
  })
}

var smtpConfig = {
    host: 'mail.fashionflashltd.com',
    port: 25,
    secure: false, // use SSL
    auth: {
        user: 'no_reply',
        pass: '#Ffl*No64#'
    },
    // tls:  {
    //    rejectUnauthorized: false
    // }
};

// var transporter = nodemailer.createTransport(smtpConfig);



function specialWorkTime(d){
    var tmp = new Date(d);
    var d1 = {};
    d1.from = new Date("2016-06-07 00:00:00");
    d1.to = new Date("2016-07-07 23:59:59");
    d1.in_h = 8;
    d1.in_m = 30;
    if(checkDateContained(d1.from, d1.to, d))
        return d1;
    return 'd1';
}

function dateFormat(d){
    var tmp = new Date(d);
    return tmp.getUTCDate()+'/'+(tmp.getUTCMonth()+1)+'/'+tmp.getUTCFullYear();
}

function workTime(d){
    var tmp = new Date(d);
    var d1 = {};
    d1.in_h = 9;
    d1.in_m = 30;
    return d1;
}

function checkDateContained(f, t, c){
    var from = new Date(f);
    var to = new Date(t);
    var check = new Date(c);
    if((check.getTime() <= to.getTime() && check.getTime() >= from.getTime()))
        return 1;
    else
        return 0;
}




/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////Socket Init And route init //////////////////////////
///////////////////////////////////////////////////////////////////////////////////////



function routerInit(app, dbFull) {
    var db = dbFull.DA_HR


}

function socketInit(dbFull, socket) {
    var db = dbFull.DA_HR


}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;