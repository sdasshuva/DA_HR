function hourlyPunchReportTab() {
    if (Ext.getCmp('hourly_punch_report_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("hourly_punch_report_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Hourly Punch Report',
            layout: 'fit',
            closable: true,
            id: 'hourly_punch_report_tab',
            autoScroll: false,
            items: [Ext.create('Ext.grid.Panel', {
                id: 'hourly_punch_report_grid',
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
                }, {
                    header: 'OVERTIME EMPLOYEE COUNT',
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
                                    Ext.getCmp('hourly_punch_report_grid').setLoading(true);
                                    Ext.getCmp('hourly_punch_report_grid').getStore().load({
                                        params: {
                                            date: values.date,
                                        },
                                        callback: function(records, operation, success) {
                                            Ext.getCmp('hourlyPunchTitle').setText(new Date(values.date).DateFormat1())
                                                // console.log(Ext.getCmp('hourlyPunchTitle'));
                                            Ext.getCmp('hourly_punch_report_grid').setLoading(false);
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
                    id: 'hourlyPunchTitle',
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