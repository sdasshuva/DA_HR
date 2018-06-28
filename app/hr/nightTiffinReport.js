function nightTiffinReportTab() {
    if (Ext.getCmp('night_tiffin_report_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("night_tiffin_report_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Night Tiffin Report',
            layout: 'fit',
            closable: true,
            id: 'night_tiffin_report_tab',
            autoScroll: false,
            items: [Ext.create('Ext.grid.Panel', {
                id: 'night_tiffin_report_grid',
                autoScroll: true,
                columnLines: true,
                store: {
                    proxy: {
                        type: 'ajax',
                        url: '/getHourlyPunchReport'
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
                            Ext.getCmp('night_tiffin_report_grid').setLoading(true);
                        },
                        load: {
                            fn: function() {
                                Ext.getCmp('night_tiffin_report_grid').setLoading(false);
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
                        data.date = Ext.getCmp('nightTiffinTitle').text;
                        // sectionHourlyPunchDetailsWindow(data);
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
                    header: 'WEEK 1',
                    align: 'left',
                    sortable: false,
                    columns: [{
                        header: '<small><small>1 H</small></small>',
                        dataIndex: 'ot1h',
                        align: 'left',
                        sortable: false,
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
                        summaryType: 'sum',
                        summaryRenderer: function(value, summaryData, dataIndex) {
                            return '<b><big>' + value + '</big></b> ';
                        },
                        flex: 1
                    }, ],
                    flex: 4
                }, ]
            })],
            tbar: [Ext.create('Ext.form.Panel', {
                    width: '30%',
                    bodyPadding: 10,
                    border: false,
                    layout: {
                        type: 'vbox',
                        align: 'stretch' // Child items are stretched to full width
                    },
                    items: [Ext.create('Ext.form.field.Date', {
                        name: 'date',
                        fieldLabel: 'Date:',
                        filedAlign: 'top',
                        allowBlank: false,
                        editable: false,
                        labelAlign: 'left',
                        maxValue: new Date(),
                        labelStyle: 'text-align:left;border solid 1px white;',
                        labelSeparator: '',
                        emptyText: 'Give Date...',
                        labelClsExtra: 'some-class',
                        fieldStyle: 'text-align: left;font-size: 12px;',
                        autoScroll: true
                    })],
                    buttons: [{
                        text: 'Reset',
                        handler: function() {
                            this.up('form').getForm().reset();
                        }
                    }, {
                        text: 'Submit',
                        formBind: true,
                        handler: function() {
                            var success = false;
                            var win = this.up('.window');
                            var panel = this.up('form'),
                                form = panel.getForm(),
                                values = form.getValues();
                            if (form.isValid()) {
                                if (tab_panel) {
                                    Ext.getCmp('night_tiffin_report_grid').setLoading(true);
                                    Ext.getCmp('night_tiffin_report_grid').getStore().load({
                                        params: {
                                            date: values.date,
                                        },
                                        callback: function(records, operation, success) {
                                            Ext.getCmp('nightTiffinTitle').setText(new Date(values.date).DateFormat1())
                                                // console.log(Ext.getCmp('nightTiffinTitle'));
                                            Ext.getCmp('night_tiffin_report_grid').setLoading(false);
                                        },
                                        scope: this
                                    });
                                }
                            }
                        }
                    }, {
                        text: 'Download',
                        formBind: true,
                        handler: function() {

                        }
                    }]
                }),
                '->', {
                    xtype: 'label',
                    id: 'nightTiffinTitle',
                    text: new Date().DateFormat1(),
                    labelCls: 'biggertext',
                    style: {
                        'font-size': '18px'
                    },
                    margin: '0 0 0 10'
                },
                '->',
            ]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function nightTiffinReportWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Night Tiffin Report Window',
        modal: true,
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '100%',
            bodyPadding: 20,
            border: false,
            layout: {
                type: 'vbox',
                align: 'stretch' // Child items are stretched to full width
            },
            items: [Ext.create('Ext.form.field.Date', {
                    name: 'form_date',
                    id: 'nightTiffinReportFromDate',
                    fieldLabel: 'From Date:',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
                    // value : new Date(),
                    labelAlign: 'left',
                    labelStyle: 'text-align:left;border solid 1px white;',
                    labelSeparator: '',
                    emptyText: 'Give From Date...',
                    labelClsExtra: 'some-class',
                    fieldStyle: 'text-align: left;font-size: 12px;',
                    autoScroll: true,
                    listeners: {
                        blur: function(self, The, eOpts) {
                            var min = self.getValue();
                            min.setDate(min.getDate() + 1);
                            var max = self.getValue();
                            max.setDate(max.getDate() + 15);
                            Ext.getCmp('nightTiffinReportToDate').setMaxValue(max);
                            Ext.getCmp('nightTiffinReportToDate').setMinValue(min);
                            Ext.getCmp('nightTiffinReportToDate').setDisabled(false);
                            Ext.getCmp('nightTiffinReportToDate').setValue('');
                        },
                    }
                }),
                Ext.create('Ext.form.field.Date', {
                    name: 'to_date',
                    id: 'nightTiffinReportToDate',
                    fieldLabel: 'To Date:',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
                    disabled: true,
                    // value : new Date(),
                    labelAlign: 'left',
                    labelStyle: 'text-align:left;border solid 1px white;',
                    labelSeparator: '',
                    emptyText: 'Give To Date...',
                    labelClsExtra: 'some-class',
                    fieldStyle: 'text-align: left;font-size: 12px;',
                    autoScroll: true
                }),
                Ext.create('Ext.form.ComboBox', {
                    name: 'employee_type',
                    fieldLabel: 'Employee Type:',
                    filedAlign: 'top',
                    allowBlank: true,
                    editable: true,
                    emptyText: 'Employee Type',
                    autoScroll: true,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    selectOnFocus: true,
                    triggerAction: 'all',
                    store: {
                        fields: ['id', 'name'],
                        proxy: {
                            type: 'ajax',
                            url: '/employee_type'
                        },
                        autoLoad: true,
                        autoSync: true
                    }
                }),
                Ext.create('Ext.form.ComboBox', {
                    name: 'status',
                    fieldLabel: 'Employee Status:',
                    filedAlign: 'top',
                    allowBlank: true,
                    editable: true,
                    emptyText: 'Employee Status',
                    autoScroll: true,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    selectOnFocus: true,
                    triggerAction: 'all',
                    store: {
                        fields: ['id', 'name'],
                        proxy: {
                            type: 'ajax',
                            url: '/getStatus'
                        },
                        autoLoad: true,
                        autoSync: true
                    }
                }),
                Ext.create('Ext.form.ComboBox', {
                    name: 'from_time',
                    fieldLabel: 'From Time',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
                    fieldLabel: 'From Time',
                    emptyText: 'From Punch Time...',
                    autoScroll: true,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    selectOnFocus: true,
                    triggerAction: 'all',
                    store: {
                        fields: ['id', 'name'],
                        proxy: {
                            type: 'ajax',
                            url: '/getTimeRange'
                        },
                        autoLoad: true,
                        autoSync: true
                    }
                }),
                Ext.create('Ext.form.ComboBox', {
                    name: 'to_time',
                    fieldLabel: 'To Time',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
                    fieldLabel: 'To Time',
                    emptyText: 'To Punch Time...',
                    autoScroll: true,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    selectOnFocus: true,
                    triggerAction: 'all',
                    store: {
                        fields: ['id', 'name'],
                        proxy: {
                            type: 'ajax',
                            url: '/getTimeRange'
                        },
                        autoLoad: true,
                        autoSync: true
                    }
                }),
                // {
                //   xtype: 'timefield',
                //   name: 'from_time',
                //   editable : false,
                //   allowBlank: false,
                //   fieldLabel: 'From Time',
                //   emptyText: 'From Punch Time...',
                //   format: 'h:i:s A',
                //   minValue: Ext.Date.parse('17:00:00', 'h:i:s'),
                //   maxValue: Ext.Date.parse('25:59:59', 'h:i:s'),
                //   increment: 10,
                //   anchor: '100%'
                // },
                // {
                //   xtype: 'timefield',
                //   name: 'to_time',
                //   editable : false,
                //   allowBlank: false,
                //   fieldLabel: 'To Time',
                //   emptyText: 'To Punch Time...',
                //   format: 'h:i:s A',
                //   minValue: Ext.Date.parse('17:00:00', 'h:i:s'),
                //   maxValue: Ext.Date.parse('25:59:59', 'h:i:s'),
                //   increment: 10,
                //   anchor: '100%'
                // }
            ],
            buttons: [{
                text: 'Reset',
                handler: function() {
                    this.up('form').getForm().reset();
                }
            }, {
                text: 'Download',
                icon: '/uploads/icons/dowload.png',
                formBind: true,
                handler: function() {
                    var panel = this.up('form'),
                        form = panel.getForm(),
                        values = form.getValues();
                    if (form.isValid()) {
                        var ms = new Date();
                        values.file_name = ms.getDate() + '_' + monthNames[ms.getMonth()] + '_' + ms.getUTCFullYear() + '_Night_Tiffin_Report';
                        values.fromTimeArray = values.from_time.split(":");
                        values.from_time_h = parseInt(values.fromTimeArray[0]);
                        values.from_time_m = parseInt(values.fromTimeArray[1]);
                        values.toTimeArray = values.to_time.split(":");
                        values.to_time_h = parseInt(values.toTimeArray[0]);
                        values.to_time_m = parseInt(values.toTimeArray[1]);
                        values.dateArray = getDateArray(values.form_date, values.to_date);
                        if (tab_panel) {
                            panel.setLoading(true);
                            socket.emit('DownloadNightTiffinDetailsReport', values).on('DownloadNightTiffinDetailsReport', function(r) {
                                Ext.MessageBox.alert({
                                    title: 'Night Tiffin Report Download',
                                    buttons: Ext.MessageBox.CANCEL,
                                    msg: 'Please <a href="/uploads/pdf/' + values.file_name + '.pdf" download>click here</a> to confirm the file download',
                                    animateTarget: 'mb4',
                                    icon: Ext.MessageBox.QUESTION
                                });
                                panel.setLoading(false);
                            });
                        }
                    }
                }
            }, {
                text: 'Close',
                handler: function() {
                    this.up('.window').close();
                }
            }]
        })]
    }).show();
}