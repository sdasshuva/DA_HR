function dailyReportTab() {
    if (Ext.getCmp('daily_report_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("daily_report_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Daily Report',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            closable: true,
            id: 'daily_report_tab',
            autoScroll: true,
            listeners: {
                afterrender: function(self, eOpts) {
                    var departmentData = departmentStore.getRange();
                    var department = [];
                    for (var i = 0; i < departmentData.length; i++) {
                        self.add(dailyReportGrid(departmentData[i].data));
                    };
                }
            },
            items: [],
            tbar: [
                Ext.create('Ext.form.field.Date', {
                    name: 'day_search',
                    id: 'daily_report_search',
                    filedAlign: 'top',
                    allowBlank: true,
                    editable: false,
                    emptyText: 'Select Date',
                    //format : "M-Y",
                    autoScroll: true,
                }), {
                    xtype: 'button',
                    icon: '/uploads/icons/search.png',
                    text: 'SEARCH',
                    border: 1,
                    style: {
                        borderColor: 'blue',
                        borderStyle: 'solid'
                    },
                    handler: function() {
                        var ms = Ext.getCmp('daily_report_search').value;
                        var departmentData = departmentStore.getRange();
                        if (ms) {
                            for (var i = 0; i < departmentData.length; i++) {
                                var store = Ext.getCmp('daily_report_grid_' + departmentData[i].id).getStore();
                                store.load({
                                    params: {
                                        date: ms,
                                    },
                                    callback: function(records, operation, success) {
                                        //this.up('form').getForm().findField("line").clearValue();
                                    },
                                    scope: this
                                });
                            };

                        }
                    }
                }
            ],
            bbar: [{
                xtype: 'button',
                text: 'Download',
                icon: '/uploads/icons/upload.png',
                iconCls: 'add',
                name: 'reload',
                tooltip: 'Reload',
                target: '_blank',
                hrefTarget: '_blank',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    var departmentData = departmentStore.getRange();
                    var ms = Ext.getCmp('daily_report_search').value;
                    var file_name = ms.getDate() + '_' + monthNames[ms.getMonth()] + '_' + ms.getUTCFullYear() + '_' + factoryShort + '_Daily_Report';
                    var htmlData =
                        '<!DOCTYPE html>' +
                        '<html>' +
                        '<head>' +
                        '<style>' +
                        'table, th, td {' +
                        'border: 1px solid black;' +
                        'border-collapse: collapse;' +
                        '}' +
                        'th, td {' +
                        'padding: 5px;' +
                        'line-height: 0.7;' +
                        'align: center;' +
                        '}' +
                        'h1, h2, h3, h4, h5, h6 {' +
                        'line-height: 0.5;' +
                        'text-align: center;' +
                        '}' +
                        '.mainBody {' +
                        'font-size: 9px;' +
                        'padding: 0px 70px 0px 70px;' +
                        '}' +
                        '.depTable {' +
                        'padding: 0px 0px 0px 0px;' +
                        '}' +
                        'hr {' +
                        'page-break-after: always;' +
                        '}' +
                        '</style>' +
                        '</head>' +
                        '<body>' +
                        '<div class="mainBody">';
                    var myHead =
                        '<br />' +
                        '<img src="' +
                        site_url +
                        'uploads/images/logo.png"' +
                        'style=" position:fixed; left:130px; margin-top:5px; width:95px;' +
                        'height:60px; border:none;"/>' +
                        '<h1>' + factory_name.toUpperCase() + '</h1>' +
                        '<h2>DAILY ATTENDANCE REPORT</h2>' +
                        '<h4>' +
                        ms.getDate() +
                        '<sup>' +
                        dayPower[ms.getDate()] +
                        '</sup> ' +
                        monthCapitalNames[ms.getMonth()] + ', ' +
                        ms.getUTCFullYear() +
                        '</h6>';
                    htmlData += myHead;

                    for (var i = 0; i < departmentData.length; i++) {
                        if (Ext.getCmp('daily_report_grid_' + departmentData[i].id)) {
                            var storeData = Ext.getCmp('daily_report_grid_' + departmentData[i].id).getStore().data.items;
                            var l = storeData.length;
                            htmlData += '<div class="depTable">';
                            /*if(i==4){
                              htmlData+=  '</div><hr><div>'+
                                            '<img src="'+
                                            site_url+
                                            'uploads/images/logo.png"'+
                                                  'style=" position:fixed; left:130px; margin-top:10px; width:110px;'+
                                                          'height:70px; border:none;"/>'+
                                            '<h1>'+factory_name+'</h1>'+
                                            '<h2>Daily Attendance Report</h2>'+
                                            '<h4>'+
                                              ms.getDate()+
                                              '<sup>'+
                                                dayPower[ms.getDate()]+
                                              '</sup> '+
                                              monthCapitalNames[ms.getMonth()]+', '+
                                              ms.getUTCFullYear()+
                                            '</h4>';
                            }*/
                            htmlData +=
                                '<table style="width:100%">' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"><b>DEPARTMENT NAME:</b> ' +
                                departmentData[i].data.name.toUpperCase() +
                                '</td>' +
                                '<td style="border: 0px solid white;"><small>PRESENT:</small></td>' +
                                '<td style="border: 0px solid white;">' +
                                addLeadingZero(2, storeData[storeData.length - 1].data.present) +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"></td>' +
                                '<td style="border: 0px solid white;"><small>ABSENT:</small></td>' +
                                '<td style="border: 0px solid white;">' +
                                addLeadingZero(2, storeData[storeData.length - 1].data.absent) +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"></td>' +
                                '<td style="border: 0px solid white;"><small>LATE:</small></td>' +
                                '<td style="border: 0px solid white;">' +
                                addLeadingZero(2, storeData[storeData.length - 1].data.late) +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td style="border: 0px solid white;"></td>' +
                                '<td style="border-left: 0px solid white;border-right: 0px solid white;">' +
                                '<small>TOTAL:</small>' +
                                '</td>' +
                                '<td style="border-left: 0px solid white;border-right: 0px solid white;">' +
                                addLeadingZero(2, storeData[storeData.length - 1].data.total) +
                                '</td>' +
                                '</tr>' +
                                '</table>' +
                                '<table style="width:100%">' +
                                '<tr>' +
                                '<th>FP ID</th>' +
                                '<th>CARD NO</th>' +
                                '<th>EMPLOYEE NAME</th>' +
                                '<th>EMPLOYEE TYPE</th>' +
                                '<th>SECTION</th>' +
                                '<th>IN TIME</th>' +
                                '<th>STATUS</th>' +
                                '</tr>';
                            for (var j = 0; j < storeData.length; j++) {
                                htmlData += '<tr>';
                                htmlData += '<td align="center">';
                                htmlData += addLeadingZero(9, parseInt(storeData[j].id));
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                if (storeData[j].data.card_no != '') {
                                    htmlData += storeData[j].data.card_no;
                                }
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                if (storeData[j].data.first_name != '') {
                                    htmlData += storeData[j].data.first_name.toUpperCase();
                                }
                                htmlData += ' ';
                                if (storeData[j].data.last_name != '') {
                                    htmlData += storeData[j].data.last_name.toUpperCase();
                                }
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                if (storeData[j].data.employee_type != '') {
                                    htmlData += storeData[j].data.employee_type.toUpperCase();
                                }
                                htmlData += '</td>';
                                htmlData += '<td align="left">';
                                if (storeData[j].data.section != '') {
                                    htmlData += storeData[j].data.section.toUpperCase();
                                }
                                htmlData += '</td>';
                                htmlData += '<td align="center">';
                                htmlData += storeData[j].data.in_time;
                                htmlData += '</td>';
                                htmlData += '<td align="center">';
                                htmlData += storeData[j].data.attendance;
                                htmlData += '</td>';
                                htmlData += '</tr>';
                            };
                            htmlData += '</table>';
                            htmlData += '<hr>';
                            htmlData += '</div>';
                        }
                    };
                    htmlData += '</div>';
                    htmlData += '</body></html>';
                    socket.emit('CreateDailyReportPDF', htmlData, file_name).on('CreateDailyReportPDF', function(message) {
                        if (message == "success") {
                            success = true;
                            Ext.MessageBox.alert({
                                title: 'Daily Attendance Download',
                                buttons: Ext.MessageBox.CANCEL,
                                msg: 'Please <a href="/uploads/pdf/' + file_name + '.pdf" download>click here</a> to confirm the file download',
                                animateTarget: 'mb4',
                                icon: Ext.MessageBox.QUESTION
                            });
                        }
                    });
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function dailyReportGrid(rec) {
    return Ext.create('Ext.grid.Panel', {
        id: 'daily_report_grid_' + rec.id,
        title: rec.name.toUpperCase(),
        //height: 300,
        //layout: 'fit',
        autoScroll: true,
        columnLines: true,
        //store: attendanceReportStore,
        store: {
            proxy: {
                type: 'ajax',
                url: '/daily_report/' + rec.id
            },
            autoLoad: true,
            autoSync: true,
            model: Ext.define('DAILY_REPORT_MODEL', {
                extend: 'Ext.data.Model',
                fields: [{
                    name: 'id',
                    type: 'int'
                }, {
                    name: 'first_name',
                    type: 'string',
                }, {
                    name: 'last_name',
                    type: 'string',
                }, {
                    name: 'department',
                    type: 'string',
                }, {
                    name: 'attendance',
                    type: 'string',
                }, {
                    name: 'in_time',
                    type: 'string',
                }, ]
            })
        },
        loadMask: true,
        viewConfig: {
            emptyText: 'No records',
            autoDestroy: false
        },
        listeners: {
            rowclick: function(grid, row, e) {
                var data = row.data;
            },
            afterrender: function(self, eOpts) {}
        },
        columns: [
            Ext.create('Ext.grid.RowNumberer', {
                header: '#',
                width: 30
            }), {
                header: 'FP ID',
                dataIndex: 'id',
                align: 'left',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return addLeadingZero(9, parseInt(value));
                },
                flex: 0.5
            }, {
                header: 'CARD NO',
                dataIndex: 'card_no',
                align: 'left',
                flex: 0.5
            }, {
                header: 'EMPLOYEE NAME',
                dataIndex: 'first_name',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    var last_name = record.get('last_name');
                    return value + ' ' + last_name;
                },
                align: 'left',
                flex: 1
            }, {
                header: 'EMPLOYEE TYPE',
                dataIndex: 'employee_type',
                align: 'left',
                flex: 0.5
            }, {
                header: 'SECTION',
                dataIndex: 'section',
                align: 'left',
                flex: 0.5
            }, {
                header: 'IN TIME',
                dataIndex: 'in_time',
                align: 'left',
                flex: 0.5
            }, {
                header: 'STATUS',
                dataIndex: 'attendance',
                align: 'left',
                flex: 0.5
            },
        ]
    });
}