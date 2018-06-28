function dailySummaryTab() {
    if (Ext.getCmp('daily_summary_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("daily_summary_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Daily Summary',
            layout: 'fit',
            closable: true,
            id: 'daily_summary_tab',
            autoScroll: false,
            items: [Ext.create('Ext.grid.Panel', {
                id: 'hourly_punch_report_grid',
                autoScroll: true,
                columnLines: true,
                store: {
                    proxy: {
                        type: 'ajax',
                        url: '/getDailyAttendanceSummary'
                    },
                    autoLoad: true,
                    autoSync: true,
                    model: Ext.define('HOURLY_PUNCH_MODEL', {
                        extend: 'Ext.data.Model',
                        fields: [{
                            name: 'id',
                            type: 'int'
                        }, {
                            name: 'section',
                            type: 'string'
                        }]
                    }),
                    remoteSort: false,
                    sorters: [{
                        property: 'section',
                        direction: 'ASC'
                    }],
                    listeners: {
                        beforeload: function() {
                            Ext.getCmp('hourly_punch_report_grid').setLoading(true);
                        },
                        load: {
                            fn: function() {
                                Ext.getCmp('hourly_punch_report_grid').setLoading(false);
                            }
                        }
                    }
                },
                loadMask: true,
                viewConfig: {
                    emptyText: 'No records',
                    loadMask: true,
                    autoDestroy: false
                },
                features: [{
                    ftype: 'summary',
                    dock: 'bottom'
                }],
                listeners: {
                    rowclick: function(grid, row, e) {
                        var data = row.data;
                        data.date = Ext.getCmp('hourlyPunchTitle').text;
                        sectionHourlyPunchDetailsWindow(data);
                    }
                },
                columns: [Ext.create('Ext.grid.RowNumberer'), {
                    header: 'SECTION NAME',
                    dataIndex: 'section',
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        return value;
                    },
                    align: 'left',
                    flex: 2,
                    summaryType: 'count',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b><big>TOTAL:</big></b> ';
                    }
                }, {
                    header: '<small><small>EMP COUNT</small></small>',
                    dataIndex: 'emp_count',
                    align: 'left',
                    sortable: false,
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b><big>' + value + '</big></b> ';
                    },
                    flex: 0.5
                }, {
                    header: '<small><small>PRESENT</small></small>',
                    dataIndex: 'present',
                    align: 'left',
                    sortable: false,
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b><big>' + value + '</big></b> ';
                    },
                    flex: 0.5
                }, {
                    header: '<small><small>ABSENT</small></small>',
                    dataIndex: 'absent',
                    // renderer: Ext.util.Format.dateRenderer('d-M-Y'),
                    align: 'left',
                    sortable: false,
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b><big>' + value + '</big></b> ';
                    },
                    flex: 0.5
                }, {
                    header: '<small><small>LATE</small></small>',
                    dataIndex: 'late',
                    align: 'left',
                    sortable: false,
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b><big>' + value + '</big></b> ';
                    },
                    flex: 0.5
                }, {
                    header: '<small><small>IN LATE</small></small>',
                    dataIndex: 'in_late',
                    align: 'left',
                    sortable: false,
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b><big>' + value + '</big></b> ';
                    },
                    flex: 0.5
                }, {
                    header: '<small><small>OUT LATE</small></small>',
                    dataIndex: 'out_late',
                    align: 'left',
                    sortable: false,
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b><big>' + value + '</big></b> ';
                    },
                    flex: 0.5
                }]
            })]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function sectionHourlyPunchDetailsWindow(rowData) {
    return Ext.create('Ext.window.Window', {
        title: rowData.section.toUpperCase() + ' HOURLY PUNCH DETAULS',
        modal: true,
        layout: 'fit',
        width: '80%',
        height: '60%',
        resizable: false,
        items: [
            sectionHourlyPunchDetailsGrid(rowData)
        ]
    }).show();
}

function sectionHourlyPunchDetailsGrid(rowData) {
    var pData = {};
    pData.section = rowData.id;
    pData.sectionName = rowData.section;
    pData.date = rowData.date;
    pData.hour = 0;
    pData.status = [1, 2];
    return Ext.create('Ext.grid.Panel', {
        id: 'sectionHourlyPunchDetailsGrid',
        loadMask: true,
        autoScroll: true,
        columnLines: true,
        store: {
            proxy: {
                type: 'ajax',
                url: '/sectionHourlyPunchDetailsGrid/' + rowData.id + '/' + rowData.date
            },
            autoLoad: true,
            autoSync: true,
            model: Ext.define('SECTION_HOURLY_PUNCH_MODEL', {
                extend: 'Ext.data.Model',
                fields: [{
                    name: 'id',
                    type: 'int'
                }, {
                    name: 'name',
                    type: 'string'
                }, {
                    name: 'officeIn',
                    type: 'string',
                    mapping: 'officeIn.time'
                }, {
                    name: 'officeOut',
                    type: 'string',
                    mapping: 'officeOut.time'
                }, ]
            }),
            remoteSort: false,
            sorters: [{
                property: 'id',
                direction: 'ASC'
            }],
            listeners: {
                beforeload: function() {
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(true);
                },
                load: {
                    fn: function() {
                        Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(false);
                    }
                }
            }
        },
        viewConfig: {
            emptyText: 'No records',
            loadMask: true,
            autoDestroy: false,
            getRowClass: function(record) {
                if (record.get('present')) {
                    // return 'gray-row';
                }
                if (record.get('absent')) {
                    return 'red-row';
                }
                if (record.get('late')) {
                    return 'yellow-row';
                }
            }
        },
        features: [{
            ftype: 'summary',
            dock: 'bottom'
        }],
        tbar: [
            '->',
            '->',
            '->',
            '->',
            '->',
            '->',
            '->',
            '->',
            '->',
            '->',
            '->',
            '->', {
                text: '1 H',
                border: 0.01,
                style: {
                    borderColor: 'black',
                    borderStyle: 'solid'
                },
                handler: function() {
                    pData.hour = 1;
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(true);
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').getStore().load({
                        params: {
                            hour: 1,
                        },
                        callback: function(records, operation, success) {
                            Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(false);
                        },
                        scope: this
                    });
                }
            }, {
                text: '2 H',
                border: 0.01,
                style: {
                    borderColor: 'black',
                    borderStyle: 'solid'
                },
                handler: function() {
                    pData.hour = 2;
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(true);
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').getStore().load({
                        params: {
                            hour: 2,
                        },
                        callback: function(records, operation, success) {
                            Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(false);
                        },
                        scope: this
                    });
                }
            }, {
                text: '3 H',
                border: 0.01,
                style: {
                    borderColor: 'black',
                    borderStyle: 'solid'
                },
                handler: function() {
                    pData.hour = 3;
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(true);
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').getStore().load({
                        params: {
                            hour: 3,
                        },
                        callback: function(records, operation, success) {
                            Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(false);
                        },
                        scope: this
                    });
                }
            }, {
                text: '4 H',
                border: 0.01,
                style: {
                    borderColor: 'black',
                    borderStyle: 'solid'
                },
                handler: function() {
                    pData.hour = 4;
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(true);
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').getStore().load({
                        params: {
                            hour: 4,
                        },
                        callback: function(records, operation, success) {
                            Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(false);
                        },
                        scope: this
                    });
                }
            }, {
                text: '5 H',
                border: 0.01,
                style: {
                    borderColor: 'black',
                    borderStyle: 'solid'
                },
                handler: function() {
                    pData.hour = 5;
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(true);
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').getStore().load({
                        params: {
                            hour: 5,
                        },
                        callback: function(records, operation, success) {
                            Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(false);
                        },
                        scope: this
                    });
                }
            }, {
                text: '6 H',
                border: 0.01,
                style: {
                    borderColor: 'black',
                    borderStyle: 'solid'
                },
                handler: function() {
                    pData.hour = 6;
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(true);
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').getStore().load({
                        params: {
                            hour: 6,
                        },
                        callback: function(records, operation, success) {
                            Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(false);
                        },
                        scope: this
                    });
                }
            }, {
                text: '7 H',
                border: 0.01,
                style: {
                    borderColor: 'black',
                    borderStyle: 'solid'
                },
                handler: function() {
                    pData.hour = 7;
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(true);
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').getStore().load({
                        params: {
                            hour: 7,
                        },
                        callback: function(records, operation, success) {
                            Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(false);
                        },
                        scope: this
                    });
                }
            }, {
                text: '8 H',
                border: 0.01,
                style: {
                    borderColor: 'black',
                    borderStyle: 'solid'
                },
                handler: function() {
                    pData.hour = 8;
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(true);
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').getStore().load({
                        params: {
                            hour: 8,
                        },
                        callback: function(records, operation, success) {
                            Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(false);
                        },
                        scope: this
                    });
                }
            }, {
                text: '9 H',
                border: 0.01,
                style: {
                    borderColor: 'black',
                    borderStyle: 'solid'
                },
                handler: function() {
                    pData.hour = 9;
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(true);
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').getStore().load({
                        params: {
                            hour: 9,
                        },
                        callback: function(records, operation, success) {
                            Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(false);
                        },
                        scope: this
                    });
                }
            }, {
                text: '10 H',
                border: 0.01,
                style: {
                    borderColor: 'black',
                    borderStyle: 'solid'
                },
                handler: function() {
                    pData.hour = 10;
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(true);
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').getStore().load({
                        params: {
                            hour: 10,
                        },
                        callback: function(records, operation, success) {
                            Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(false);
                        },
                        scope: this
                    });
                }
            }, {
                text: '11 H',
                border: 0.01,
                style: {
                    borderColor: 'black',
                    borderStyle: 'solid'
                },
                handler: function() {
                    pData.hour = 11;
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(true);
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').getStore().load({
                        params: {
                            hour: 11,
                        },
                        callback: function(records, operation, success) {
                            Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(false);
                        },
                        scope: this
                    });
                }
            }, {
                text: '12 H',
                border: 0.01,
                style: {
                    borderColor: 'black',
                    borderStyle: 'solid'
                },
                handler: function() {
                    pData.hour = 12;
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(true);
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').getStore().load({
                        params: {
                            hour: 12,
                        },
                        callback: function(records, operation, success) {
                            Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(false);
                        },
                        scope: this
                    });
                }
            }, {
                text: '13 H',
                border: 0.01,
                style: {
                    borderColor: 'black',
                    borderStyle: 'solid'
                },
                handler: function() {
                    pData.hour = 13;
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(true);
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').getStore().load({
                        params: {
                            hour: 13,
                        },
                        callback: function(records, operation, success) {
                            Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(false);
                        },
                        scope: this
                    });
                }
            }, {
                text: 'ALL',
                border: 0.01,
                style: {
                    borderColor: 'black',
                    borderStyle: 'solid'
                },
                handler: function() {
                    pData.hour = 0;
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(true);
                    Ext.getCmp('sectionHourlyPunchDetailsGrid').getStore().load({
                        params: {
                            hour: 0,
                        },
                        callback: function(records, operation, success) {
                            Ext.getCmp('sectionHourlyPunchDetailsGrid').setLoading(false);
                        },
                        scope: this
                    });
                }
            },
            '->',
        ],
        bbar: [{
                text: 'Close',
                border: 0.01,
                style: {
                    borderColor: 'black',
                    borderStyle: 'solid'
                },
                handler: function() {
                    this.up('.window').close();
                }
            }, {
                text: 'Download',
                border: 0.01,
                style: {
                    borderColor: 'black',
                    borderStyle: 'solid'
                },
                handler: function() {
                    // var eData =Ext.getCmp('sectionHourlyPunchDetailsGrid').getStore().getData().items;
                    var f = 'sectionHourlyPunchDetailsGrid';
                    socket.emit('DownloadSectionHourlyPunchReport', pData, f).on('DownloadSectionHourlyPunchReport', function(r) {
                        Ext.MessageBox.alert({
                            title: 'Section Hourly Punch Details Download',
                            buttons: Ext.MessageBox.CANCEL,
                            msg: 'Please <a href="/uploads/pdf/' + f + '.pdf" download>click here</a> to confirm the file download',
                            animateTarget: 'mb4',
                            icon: Ext.MessageBox.QUESTION
                        });
                        panel.setLoading(false);
                    });
                }
            },
            '->',
            Ext.create('Ext.panel.Panel', {
                height: 10,
                width: 10,
            }), {
                xtype: 'tbtext',
                text: '<b><i>Present</i></b>'
            },
            Ext.create('Ext.panel.Panel', {
                height: 10,
                width: 10,
                bodyStyle: {
                    "background-color": "red"
                },
            }), {
                xtype: 'tbtext',
                text: '<b><i>Absent</i></b>'
            },
            Ext.create('Ext.panel.Panel', {
                height: 10,
                width: 10,
                bodyStyle: {
                    "background-color": "yellow"
                },
            }), {
                xtype: 'tbtext',
                text: '<b><i>Late</i></b>'
            },
            '->',
            '->',
        ],
        columns: [Ext.create('Ext.grid.RowNumberer'), {
            header: 'EMPLOYEE ID',
            dataIndex: 'id',
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                return addLeadingZero(9, value);
            },
            align: 'center',
            flex: 1.5,
            summaryType: 'count',
            summaryRenderer: function(value, summaryData, dataIndex) {
                return '<b><big>TOTAL:</big></b> ';
            }
        }, {
            header: 'NAME',
            dataIndex: 'name',
            align: 'left',
            flex: 3,
        }, {
            header: 'LAST PUNCH',
            dataIndex: 'last_punch',
            align: 'left',
            flex: 1.5,
        }, {
            header: '<small><small>IN TIME</small></small>',
            dataIndex: 'officeIn',
            align: 'left',
            flex: 1,
        }, {
            header: '<small><small>OUT TIME</small></small>',
            dataIndex: 'officeOut',
            align: 'left',
            flex: 1,
        }, {
            header: 'OVERTIME EMPLOYEE COUNT',
            align: 'left',
            sortable: false,
            columns: [{
                header: '<small><small>1 H</small></small>',
                dataIndex: 'ot1h',
                align: 'left',
                sortable: false,
                renderer: function(v, m, r, i, c, s, w) {
                    if (parseInt(v) == 1) {
                        m.style = "background-color:green;";
                    }
                    return '';
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b><big>' + value + '</big></b> ';
                },
                flex: 1
            }, {
                header: '<small><small>2 H</small></small>',
                dataIndex: 'ot2h',
                align: 'left',
                sortable: false,
                renderer: function(v, m, r, i, c, s, w) {
                    if (parseInt(v) == 1) {
                        m.style = "background-color:green;";
                    }
                    return '';
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b><big>' + value + '</big></b> ';
                },
                flex: 1
            }, {
                header: '<small><small>3 H</small></small>',
                dataIndex: 'ot3h',
                align: 'left',
                sortable: false,
                renderer: function(v, m, r, i, c, s, w) {
                    if (parseInt(v) == 1) {
                        m.style = "background-color:green;";
                    }
                    return '';
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b><big>' + value + '</big></b> ';
                },
                flex: 1
            }, {
                header: '<small><small>4 H</small></small>',
                dataIndex: 'ot4h',
                align: 'left',
                sortable: false,
                renderer: function(v, m, r, i, c, s, w) {
                    if (parseInt(v) == 1) {
                        m.style = "background-color:green;";
                    }
                    return '';
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b><big>' + value + '</big></b> ';
                },
                flex: 1
            }, {
                header: '<small><small>5 H</small></small>',
                dataIndex: 'ot5h',
                align: 'left',
                sortable: false,
                renderer: function(v, m, r, i, c, s, w) {
                    if (parseInt(v) == 1) {
                        m.style = "background-color:green;";
                    }
                    return '';
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b><big>' + value + '</big></b> ';
                },
                flex: 1
            }, {
                header: '<small><small>6 H</small></small>',
                dataIndex: 'ot6h',
                align: 'left',
                sortable: false,
                renderer: function(v, m, r, i, c, s, w) {
                    if (parseInt(v) == 1) {
                        m.style = "background-color:green;";
                    }
                    return '';
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b><big>' + value + '</big></b> ';
                },
                flex: 1
            }, {
                header: '<small><small>7 H</small></small>',
                dataIndex: 'ot7h',
                align: 'left',
                sortable: false,
                renderer: function(v, m, r, i, c, s, w) {
                    if (parseInt(v) == 1) {
                        m.style = "background-color:green;";
                    }
                    return '';
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b><big>' + value + '</big></b> ';
                },
                flex: 1
            }, {
                header: '<small><small>8 H</small></small>',
                dataIndex: 'ot8h',
                align: 'left',
                sortable: false,
                renderer: function(v, m, r, i, c, s, w) {
                    if (parseInt(v) == 1) {
                        m.style = "background-color:green;";
                    }
                    return '';
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b><big>' + value + '</big></b> ';
                },
                flex: 1
            }, {
                header: '<small><small>9 H</small></small>',
                dataIndex: 'ot9h',
                align: 'left',
                sortable: false,
                renderer: function(v, m, r, i, c, s, w) {
                    if (parseInt(v) == 1) {
                        m.style = "background-color:green;";
                    }
                    return '';
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b><big>' + value + '</big></b> ';
                },
                flex: 1
            }, {
                header: '<small><small>10 H</small></small>',
                dataIndex: 'ot10h',
                align: 'left',
                sortable: false,
                renderer: function(v, m, r, i, c, s, w) {
                    if (parseInt(v) == 1) {
                        m.style = "background-color:green;";
                    }
                    return '';
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b><big>' + value + '</big></b> ';
                },
                flex: 1
            }, {
                header: '<small><small>11 H</small></small>',
                dataIndex: 'ot11h',
                align: 'left',
                sortable: false,
                renderer: function(v, m, r, i, c, s, w) {
                    if (parseInt(v) == 1) {
                        m.style = "background-color:green;";
                    }
                    return '';
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b><big>' + value + '</big></b> ';
                },
                flex: 1
            }, {
                header: '<small><small>12 H</small></small>',
                dataIndex: 'ot12h',
                align: 'left',
                sortable: false,
                renderer: function(v, m, r, i, c, s, w) {
                    if (parseInt(v) == 1) {
                        m.style = "background-color:green;";
                    }
                    return '';
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b><big>' + value + '</big></b> ';
                },
                flex: 1
            }, {
                header: '<small><small>13 H</small></small>',
                dataIndex: 'ot13h',
                align: 'left',
                sortable: false,
                renderer: function(v, m, r, i, c, s, w) {
                    if (parseInt(v) == 1) {
                        m.style = "background-color:green;";
                    }
                    return '';
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b><big>' + value + '</big></b> ';
                },
                flex: 1
            }, ],
            flex: 4
        }, ]
    });
}