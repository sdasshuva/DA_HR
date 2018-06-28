function lineProductionTab(line) {
    var tmp = new Date();
    var b = '<b style="font-size:60%">';

    if (Ext.getCmp('line_production_tab' + line.id)) {
        tab_panel.setActiveTab(Ext.getCmp("line_production_tab" + line.id));
    } else {
        var new_tab = tab_panel.add({
            title: line.name + ' Production Status',
            layout: 'fit',
            closable: true,
            id: 'line_production_tab' + line.id,
            autoScroll: true,
            items: [Ext.create('Ext.grid.Panel', {
                loadMask: true,
                autoScroll: true,
                id: 'line_production_grid' + line.id,
                //selType: 'cellmodel',
                columnLines: true,
                store: {
                    proxy: {
                        type: 'ajax',
                        url: '/line_production/' + line.id
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
                },
                viewConfig: {
                    emptyText: 'No records',
                    autoDestroy: false
                        /*getRowClass: function(record) { 
                            return record.get('status') < 18 ? 'child-row' : 'adult-row'; 
                        }*/
                },
                features: [{
                    ftype: 'summary',
                    dock: 'bottom'
                }],
                listeners: {
                    afterrender: function(self, eOpts) {
                        var d = new Date();
                        var pd = new Date(d);
                        var nd = new Date(d);
                        pd.setDate(pd.getDate() - 1);
                        nd.setDate(nd.getDate() + 1);
                        var grid = Ext.getCmp('line_production_grid' + line.id);
                        var prev = Ext.getCmp('line_production_grid_previous_button' + line.id);
                        var next = Ext.getCmp('line_production_grid_next_button' + line.id);
                        var title = Ext.getCmp('line_production_grid_current_month_title' + line.id);
                        prev.setText(pd.getDate() + ' ' + monthCapitalNames[pd.getMonth()] + ' ' + pd.getFullYear());
                        next.setText(nd.getDate() + ' ' + monthCapitalNames[nd.getMonth()] + ' ' + nd.getFullYear());
                        title.setText(d.getDate() + ' ' + monthCapitalNames[d.getMonth()] + ' ' + d.getFullYear());
                    }
                },
                tbar: [{
                        xtype: 'button',
                        id: 'line_production_grid_previous_button' + line.id,
                        text: '',
                        icon: '/uploads/icons/go-previous.png',
                        iconCls: 'add',
                        name: 'go-previous',
                        tooltip: 'GO PREVIOUS',
                        border: 1,
                        style: {
                            borderColor: 'blue',
                            borderStyle: 'solid'
                        },
                        handler: function() {
                            if (Ext.getCmp('line_production_grid' + line.id)) {
                                var grid = Ext.getCmp('line_production_grid' + line.id);
                                var prev = Ext.getCmp('line_production_grid_previous_button' + line.id);
                                var next = Ext.getCmp('line_production_grid_next_button' + line.id);
                                var title = Ext.getCmp('line_production_grid_current_month_title' + line.id);
                                tmp.setDate(tmp.getDate() - 1);
                                var d = new Date(tmp);
                                var pd = new Date(d);
                                var nd = new Date(d);
                                pd.setDate(pd.getDate() - 1);
                                nd.setDate(nd.getDate() + 1);
                                prev.setText(pd.getDate() + ' ' + monthCapitalNames[pd.getMonth()] + ' ' + pd.getFullYear());
                                next.setText(nd.getDate() + ' ' + monthCapitalNames[nd.getMonth()] + ' ' + nd.getFullYear());
                                title.setText(d.getDate() + ' ' + monthCapitalNames[d.getMonth()] + ' ' + d.getFullYear());
                                grid.getStore().load({
                                    params: {
                                        date: d
                                    },
                                    callback: function(records, operation, success) {

                                    },
                                    scope: this
                                });
                            }
                        }
                    },
                    '->', {
                        xtype: 'label',
                        id: 'line_production_grid_current_month_title' + line.id,
                        text: '',
                    },
                    '->', {
                        xtype: 'button',
                        id: 'line_production_grid_next_button' + line.id,
                        text: '',
                        icon: '/uploads/icons/go-next.png',
                        iconCls: 'add',
                        name: 'go-next',
                        tooltip: 'GO NEXT',
                        border: 1,
                        style: {
                            borderColor: 'blue',
                            borderStyle: 'solid'
                        },
                        handler: function() {
                            if (Ext.getCmp('line_production_grid' + line.id)) {
                                var grid = Ext.getCmp('line_production_grid' + line.id);
                                var prev = Ext.getCmp('line_production_grid_previous_button' + line.id);
                                var next = Ext.getCmp('line_production_grid_next_button' + line.id);
                                var title = Ext.getCmp('line_production_grid_current_month_title' + line.id);
                                tmp.setDate(tmp.getDate() + 1);
                                var d = new Date(tmp);
                                var pd = new Date(d);
                                var nd = new Date(d);
                                pd.setDate(pd.getDate() - 1);
                                nd.setDate(nd.getDate() + 1);
                                prev.setText(pd.getDate() + ' ' + monthCapitalNames[pd.getMonth()] + ' ' + pd.getFullYear());
                                next.setText(nd.getDate() + ' ' + monthCapitalNames[nd.getMonth()] + ' ' + nd.getFullYear());
                                title.setText(d.getDate() + ' ' + monthCapitalNames[d.getMonth()] + ' ' + d.getFullYear());
                                grid.getStore().load({
                                    params: {
                                        date: d
                                    },
                                    callback: function(records, operation, success) {

                                    },
                                    scope: this
                                });
                            }
                        }
                    }
                ],
                columns: [Ext.create('Ext.grid.RowNumberer', {
                    width: 50
                }), {
                    header: 'BUYER',
                    dataIndex: 'buyer',
                    align: 'center',
                    flex: 0.4
                }, {
                    header: 'STYLE',
                    dataIndex: 'style',
                    align: 'center',
                    flex: 0.4
                }, {
                    header: 'PO NO',
                    dataIndex: 'po_no',
                    align: 'center',
                    flex: 0.4
                }, {
                    header: 'INPUT DATE',
                    dataIndex: 'input_date',
                    renderer: Ext.util.Format.dateRenderer('jS F, Y'),
                    align: 'center',
                    flex: 0.4
                }, {
                    header: 'OUTPUT DATE',
                    dataIndex: 'output_date',
                    renderer: Ext.util.Format.dateRenderer('jS F, Y'),
                    align: 'center',
                    flex: 0.4
                }, {
                    header: 'TOTAL COMPLETED',
                    dataIndex: 'total_quantity',
                    align: 'right',
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        if (value)
                            return value + ' PCS';
                        else
                            return '0 PCS';
                    },
                    summaryType: 'count',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b><big>LINE TOTAL</big></b> ';
                    },
                    flex: 0.4
                }, {
                    header: 'DAY QUANTITY',
                    dataIndex: 'quantity',
                    align: 'right',
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        if (value)
                            return value + ' PCS';
                        else
                            return '0 PCS';
                    },
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b><big>' + value + ' PCS</big></b> ';
                    },
                    flex: 0.4
                }, {
                    xtype: 'actioncolumn',
                    header: 'HOURLY PROD.',
                    flex: 0.4,
                    align: 'center',
                    items: [{
                        icon: '/uploads/icons/create.png',
                        tooltip: 'Approve',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex).data;
                            rec.date = tmp;
                            jobHourlyProductionWindow(rec);
                        }
                    }]
                }, ]
            })],
            /*bbar:[
              {
                xtype:'button',
                text:'Reload',
                icon: '/uploads/icons/refresh.png',
                iconCls: 'add',
                name:'reload',
                tooltip:'Reload',
                border: 1,
                style: {
                  borderColor: 'blue',
                  borderStyle: 'solid'
                },
                handler: function(){
                  if(Ext.getCmp('line_production_grid'+line.id)){
                    Ext.getCmp('line_production_grid'+line.id).getStore().load();
                  }
                }
              }
            ]*/
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function jobHourlyProductionWindow(rec) {
    var pd = new Date(rec.date);
    var hpd = new Date(job.date);
    return Ext.create('Ext.window.Window', {
        title: 'JOB HOURLY PRODUCTION DETAILS (' + pd.getDate() + ' ' + monthCapitalNames[pd.getMonth()] + ' ' + pd.getFullYear() + ')',
        modal: true,
        width: 320,
        //height: 200,
        layout: 'fit',
        items: [Ext.create('Ext.grid.Panel', {
            loadMask: true,
            autoScroll: true,
            width: '100%',
            id: 'job_hourly_production_grid' + job.id,
            //selType: 'cellmodel',
            columnLines: true,
            store: {
                proxy: {
                    type: 'ajax',
                    url: '/job_hourly_production/' + job.id + '/' + hpd
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
            },
            viewConfig: {
                emptyText: 'No records',
                autoDestroy: false
                    /*getRowClass: function(record) { 
                        return record.get('status') < 18 ? 'child-row' : 'adult-row'; 
                    }*/
            },
            features: [{
                ftype: 'summary',
                dock: 'bottom'
            }],
            bbar: [{
                xtype: 'button',
                text: 'ADD NEW',
                icon: '/uploads/icons/create.png',
                iconCls: 'add',
                name: 'reload',
                tooltip: 'ADD',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    jobHourlyProductionFormWindow(job);
                }
            }],
            columns: [Ext.create('Ext.grid.RowNumberer', {
                header: '#',
                width: 30
            }), {
                header: 'TIME',
                dataIndex: 'duration',
                align: 'center',
                flex: 0.4,
                summaryType: 'count',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b><big>TOTAL:</big></b> ';
                },
            }, {
                header: 'QUANTITY',
                dataIndex: 'quantity',
                align: 'right',
                flex: 0.4,
                renderer: function(val, meta, record) {
                    return val + ' PCS';
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b><big>' + value + ' PCS</big></b> ';
                },
            }, {
                xtype: 'actioncolumn',
                header: ' ',
                width: 35,
                align: 'center',
                items: [{
                    icon: '/uploads/icons/delete.png',
                    tooltip: 'Delete',
                    handler: function(grid, rowIndex, colIndex) {
                        var row_data = grid.getStore().getAt(rowIndex).data;
                        socket.emit('DestroyJobHourlyProduction', row_data.id).on('DestroyJobHourlyProduction', function(message) {
                            if (message == "success") {
                                if (Ext.getCmp('job_hourly_production_grid' + job.id)) {
                                    Ext.getCmp('job_hourly_production_grid' + job.id).getStore().load();
                                }
                                Ext.MessageBox.alert('success', '<b style="color: red">Successfully data has been deleted</b>');
                            } else if (message == "error") {
                                Ext.MessageBox.alert('Error',
                                    'Please contact with the developer');
                            } else {
                                Ext.MessageBox.alert('Unauthorized',
                                    'You are not authorized to perform this task. ' +
                                    'Repeatedly doing this might block your ID');
                            }
                        });
                    }
                }]
            }]
        })]
    }).show();
}

function jobHourlyProductionFormWindow(job) {
    return Ext.create('Ext.window.Window', {
        title: 'Job Hourly Production Form',
        modal: true,
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            //id: 'employeeInputForm',
            width: '100%',
            bodyPadding: 20,
            border: false,
            layout: {
                type: 'vbox',
                align: 'stretch' // Child items are stretched to full width
            },
            items: [Ext.create('Ext.form.field.Number', {
                name: 'line_job',
                hidden: true,
                value: job.id
            }), Ext.create('Ext.form.field.Date', {
                name: 'date',
                hidden: true,
                format: 'Y-m-d',
                value: new Date(job.date)
            }), Ext.create('Ext.form.ComboBox', {
                fieldLabel: 'Time Duration' +
                    '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
                name: 'time_duration',
                typeAhead: true,
                transform: 'stateSelect',
                forceSelection: true,
                allowBlank: false,
                editable: true,
                labelAlign: 'left',
                labelSeparator: '',
                emptyText: 'Select Time Duration ...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
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
                        url: '/time_duration'
                    },
                    autoLoad: true,
                    autoSync: true
                },
                listeners: {
                    change: {
                        fn: function(combo, value) {
                            //console.log(value)
                        }
                    }
                }
            }), Ext.create('Ext.form.field.Number', {
                name: 'quantity',
                fieldLabel: 'Quantity',
                filedAlign: 'top',
                allowBlank: true,
                minValue: 0,
                value: 0,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Quantity...',
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
                    var panel = this.up('form');
                    var win = this.up('window');
                    var form = panel.getForm();
                    var values = form.getValues();
                    if (form.isValid()) {
                        socket.emit('AddJobHourlyProduction', values).on('AddJobHourlyProduction', function(message) {
                            if (message == "success") {
                                Ext.MessageBox.alert('success', 'Successfully data inserted');
                                win.close();
                                if (Ext.getCmp('job_hourly_production_grid' + job.id)) {
                                    Ext.getCmp('job_hourly_production_grid' + job.id).getStore().load();
                                }
                            } else if (message == "error") {
                                Ext.MessageBox.alert('Error', 'Data not inserted. \nPossible problem could be duplicate entry');
                            }
                        });
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