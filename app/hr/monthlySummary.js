function monthlySummaryTab() {
    if (Ext.getCmp('monthly_summary_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("monthly_summary_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Monthly Summary',
            layout: 'fit',
            closable: true,
            id: 'monthly_summary_tab',
            autoScroll: false,
            items: [Ext.create('Ext.grid.Panel', {
                id: 'monthly_summary_grid',
                autoScroll: true,
                columnLines: true,
                store: {
                    proxy: {
                        type: 'ajax',
                        url: '/getMonthlySummary'
                    },
                    autoLoad: true,
                    autoSync: true,
                    model: Ext.define('MONTHLY_SUMMARY_MODEL', {
                        extend: 'Ext.data.Model',
                        fields: [{
                            name: 'id',
                            type: 'int'
                        }, {
                            name: 'employee',
                            type: 'string',
                            mapping: 'employeeTable.userTable.first_name'
                        }, {
                            name: 'designation',
                            type: 'string',
                            mapping: 'employeeTable.designationTable.name'
                        }, {
                            name: 'status',
                            type: 'string',
                            mapping: 'employeeTable.statu.name'
                        }, {
                            name: 'bonus',
                            type: 'boolean',
                            convert: function(v, rec) {
                                return (v) ? 'YES' : 'NO';
                            }
                        }]
                    }),
                    remoteSort: false,
                    sorters: [{
                        property: 'section',
                        direction: 'ASC'
                    }],
                    listeners: {
                        beforeload: function() {
                            Ext.getCmp('monthly_summary_grid').setLoading(true);
                        },
                        load: {
                            fn: function() {
                                Ext.getCmp('monthly_summary_grid').setLoading(false);
                            }
                        }
                    }
                },
                loadMask: true,
                viewConfig: {
                    emptyText: 'No records',
                    loadMask: true,
                    autoDestroy: false,
                    getRowClass: function(record) {
                        if (record.get('status') == 'Transferred') {
                            return 'gray-row';
                        }
                        if (record.get('status') == 'Disappointed') {
                            return 'red-row';
                        }
                        if (record.get('status') == 'Hold') {
                            return 'yellow-row';
                        }
                    }
                },
                features: [{
                    ftype: 'summary',
                    dock: 'bottom'
                }],
                listeners: {
                    rowclick: function(grid, row, e) {
                        var data = row.data;
                        // data.date = Ext.getCmp('hourlyPunchTitle').text;
                        // sectionHourlyPunchDetailsWindow(data);
                    }
                },
                columns: [Ext.create('Ext.grid.RowNumberer'), {
                    header: 'EMPLOYEE NAME',
                    dataIndex: 'employee',
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        return value.toUpperCase();
                    },
                    align: 'left',
                    flex: 2,
                    summaryType: 'count',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b><big>TOTAL:</big></b> ';
                    }
                }, {
                    header: 'DESIGNATION',
                    dataIndex: 'designation',
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        return value.toUpperCase();
                    },
                    align: 'left',
                    flex: 1,
                }, {
                    header: 'STATUS',
                    dataIndex: 'status',
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        return value.toUpperCase();
                    },
                    align: 'left',
                    flex: 1,
                }, {
                    header: '<small>PRESENT<br />DAYS</small>',
                    dataIndex: 'present_days',
                    align: 'center',
                    sortable: false,
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b><big>' + value + '</big></b> ';
                    },
                    flex: 0.5
                }, {
                    header: '<small>ABSENT<br />DAYS</small>',
                    dataIndex: 'absent_days',
                    // renderer: Ext.util.Format.dateRenderer('d-M-Y'),
                    align: 'center',
                    sortable: false,
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b><big>' + value + '</big></b> ';
                    },
                    flex: 0.5
                }, {
                    header: '<small>OVERTIME (H)</small>',
                    dataIndex: 'overtime',
                    align: 'center',
                    sortable: false,
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b><big>' + value + '</big></b> ';
                    },
                    flex: 0.5
                }, {
                    header: '<small>EXCESS<br />OVERTIME (H)</small>',
                    dataIndex: 'excess_overtime',
                    align: 'center',
                    sortable: false,
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b><big>' + value + '</big></b> ';
                    },
                    flex: 0.5
                }, {
                    header: '<small>IN LATE</small>',
                    dataIndex: 'in_late',
                    align: 'center',
                    sortable: false,
                    flex: 0.5
                }, {
                    header: '<small>OUT LATE</small>',
                    dataIndex: 'out_late',
                    align: 'center',
                    sortable: false,
                    flex: 0.5
                }, {
                    header: '<small>BONUS</small>',
                    dataIndex: 'bonus',
                    align: 'center',
                    sortable: false,
                    flex: 0.5
                }, {
                    xtype: 'actioncolumn',
                    header: ' ',
                    width: 25,
                    align: 'center',
                    items: [{
                        icon: '/uploads/icons/delete.png',
                        tooltip: 'Delete',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            Ext.Msg.show({
                                title: 'Delete Employee Month Summary?',
                                msg: 'Are you sure you want to delete this information. <br>It will permanently delete this information from the server',
                                buttons: Ext.Msg.YESNO,
                                icon: Ext.Msg.WARNING,
                                fn: function(btn, text) {
                                    if (btn == 'yes') {
                                        socket.emit('DestroyMonthlySummary', rec.id).on('DestroyMonthlySummary', function(message) {
                                            if (message == "success") {
                                                grid.getStore().load();
                                                if (Ext.getCmp('monthly_summary_grid')) {
                                                    Ext.getCmp('monthly_summary_grid').getStore().load();
                                                }
                                                Ext.MessageBox.alert('success', 'Successfully data removed');
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
                                }
                            });
                        }
                    }]
                }]
            })],
            tbar: [Ext.create('Ext.form.Panel', {
                    // width:'30%',
                    bodyPadding: 10,
                    border: false,
                    layout: {
                        type: 'hbox',
                        align: 'stretch' // Child items are stretched to full width
                    },
                    items: [Ext.create('Ext.form.field.Date', {
                            name: 'month_year',
                            filedAlign: 'top',
                            allowBlank: false,
                            editable: false,
                            emptyText: 'Select Month & Year',
                            format: "M-Y",
                            autoScroll: true,
                            safeParse: function(value, format) {
                                var FDF = this.picker.value[0] + 1 + "/1/" + this.picker.value[1];
                                return new Date(FDF);
                            },
                            createPicker: function() {
                                var me = this,
                                    format = Ext.String.format;
                                return new Ext.picker.Month({
                                    pickerField: me,
                                    ownerCt: me.ownerCt,
                                    renderTo: document.body,
                                    floating: true,
                                    hidden: true,
                                    focusOnShow: true,
                                    showButtons: false,
                                    minDate: me.minValue,
                                    maxDate: me.maxValue,
                                    disabledDatesRE: me.disabledDatesRE,
                                    disabledDatesText: me.disabledDatesText,
                                    disabledDays: me.disabledDays,
                                    disabledDaysText: me.disabledDaysText,
                                    format: me.format,
                                    showToday: me.showToday,
                                    startDay: me.startDay,
                                    minText: format(me.minText, me.formatDate(me.minValue)),
                                    maxText: format(me.maxText, me.formatDate(me.maxValue)),
                                    listeners: {
                                        scope: me,
                                        select: me.onSelect
                                    },
                                    keyNavConfig: {
                                        esc: function() {
                                            me.collapse();
                                        }
                                    }
                                });
                            },
                        }),
                        Ext.create('Ext.form.ComboBox', {
                            name: 'section',
                            anyMatch: true,
                            typeAhead: true,
                            transform: 'stateSelect',
                            forceSelection: true,
                            editable: true,
                            allowBlank: false,
                            emptyText: 'Section',
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
                                    url: '/section'
                                },
                                autoLoad: true,
                                autoSync: true
                            },
                            listeners: {
                                blur: function(self, The, eOpts) {},
                            }
                        }),
                    ],
                    buttons: [{
                        text: 'Reset',
                        handler: function() {
                            this.up('form').getForm().reset();
                        }
                    }, {
                        text: 'Search',
                        formBind: true,
                        handler: function() {
                            var win = this.up('.window');
                            var panel = this.up('form'),
                                form = panel.getForm(),
                                values = form.getValues();
                            values.date = new Date(values.month_year);
                            values.year = values.date.getFullYear();
                            values.month = values.date.getMonth() + 1;
                            values.status = [1, 2];
                            if (form.isValid()) {
                                if (tab_panel) {
                                    Ext.getCmp('monthly_summary_grid').setLoading(true);
                                    Ext.getCmp('monthly_summary_grid').getStore().load({
                                        params: values,
                                        callback: function(records, operation, success) {
                                            // Ext.getCmp('hourlyPunchTitle').setText(new Date(values.date).DateFormat1())
                                            // console.log(Ext.getCmp('hourlyPunchTitle'));
                                            Ext.getCmp('monthly_summary_grid').setLoading(false);
                                        },
                                        scope: this
                                    });
                                }
                            }
                        }
                    }, {
                        text: 'Update',
                        formBind: true,
                        handler: function() {
                            var success = false;
                            var panel = this.up('form'),
                                form = panel.getForm(),
                                values = form.getValues();
                            values.date = new Date(values.month_year);
                            values.year = values.date.getFullYear();
                            values.month = values.date.getMonth() + 1;
                            values.date.setDate(10);
                            values.status = [1, 2];
                            if (form.isValid()) {
                                if (tab_panel) {
                                    var sectionStore = Ext.create('Ext.data.Store', {
                                        proxy: {
                                            type: 'ajax',
                                            url: '/section'
                                        },
                                        autoLoad: true,
                                        autoSync: true,
                                        model: Ext.define('SECTION_MODEL', {
                                            extend: 'Ext.data.Model',
                                            fields: [{
                                                name: 'id',
                                                type: 'int'
                                            }, {
                                                name: 'name',
                                                type: 'string'
                                            }]
                                        })
                                    });
                                    sectionStore.load({
                                        callback: function(records, operation, success) {

                                            records.sort(function(a, b) {
                                                if (a.id > b.id)
                                                    return -1;
                                                if (a.id < b.id)
                                                    return 1;
                                                return 0;
                                            });
                                            console.log(records);

                                            function myFLoopS(i) {
                                                values.section = records[i].id;
                                                console.log('============S=============');
                                                console.log(records[i].data);
                                                console.log(records[i].data.name);

                                                Ext.getCmp('monthly_summary_grid').setLoading(true);
                                                socket.emit('CreateMonthlyAttendance', values).on('CreateMonthlyAttendance' + values.section, function(message) {
                                                    Ext.getCmp('monthly_summary_grid').setLoading(false);
                                                    console.log(records[i].data.name);
                                                    console.log('============E=============');
                                                    i--;
                                                    if (i < 0) {
                                                        console.log('FINISH');
                                                    } else {
                                                        myFLoopS(i);
                                                    }
                                                });
                                            }
                                            myFLoopS(records.length - 1);


                                            // Ext.getCmp('monthly_summary_grid').setLoading(true);
                                            // socket.emit('CreateMonthlyAttendance', values).on('CreateMonthlyAttendance'+values.section, function (message) {
                                            //   console.log(records[i].data.name);
                                            //   Ext.getCmp('monthly_summary_grid').setLoading(false);
                                            //   console.log('============E=============');
                                            // });
                                        },
                                        scope: this
                                    });
                                }
                            }
                        }
                    }]
                }),
                // '->',
                // {
                //   xtype: 'label',
                //   id: 'hourlyPunchTitle',
                //   text: new Date().DateFormat1(),
                //   labelCls: 'biggertext',
                //   style: {
                //     'font-size': '18px'
                //   },
                //   margin: '0 0 0 10'
                // },
                // '->',
            ]
        });
        tab_panel.setActiveTab(new_tab);
    }
}