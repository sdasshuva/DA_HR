function bankStatementTabB() {
    if (Ext.getCmp('bank_statement_tab_b')) {
        tab_panel.setActiveTab(Ext.getCmp("bank_statement_tab_b"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Bank Statement B',
            layout: 'fit',
            closable: true,
            id: 'bank_statement_tab_b',
            autoScroll: false,
            items: [
                Ext.create('Ext.grid.Panel', {
                    id: 'salary_payment_grid_b',
                    autoScroll: true,
                    columnLines: true,
                    store: {
                        proxy: {
                            type: 'ajax',
                            url: '/getSalaryPayment'
                        },
                        autoLoad: true,
                        autoSync: true,
                        model: Ext.define('SALARY_PAYMENT_MODEL', {
                            extend: 'Ext.data.Model',
                            fields: [{
                                name: 'id',
                                type: 'int'
                            }, ]
                        }),
                        remoteSort: false,
                        listeners: {
                            beforeload: function() {
                                Ext.getCmp('salary_payment_grid_b').setLoading(true);
                            },
                            load: {
                                fn: function() {
                                    Ext.getCmp('salary_payment_grid_b').setLoading(false);
                                }
                            }
                        }
                    },
                    loadMask: true,
                    viewConfig: {
                        emptyText: 'No records',
                        loadMask: true,
                        autoDestroy: false,
                        getRowClass: function(record) {}
                    },
                    features: [{
                        ftype: 'summary',
                        dock: 'bottom'
                    }],
                    listeners: {
                        rowclick: function(grid, row, e) {
                            var data = row.data;
                        }
                    },
                    columns: [
                        Ext.create('Ext.grid.RowNumberer', {
                            header: '####',
                            align: 'left',
                            width: 40,
                        }), {
                            header: 'EMP ID',
                            dataIndex: 'id',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return addLeadingZero(9, value);
                            },
                            align: 'center',
                            width: 80,
                        }, {
                            header: 'EMPLOYEE NAME',
                            dataIndex: 'name',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return value.toUpperCase();
                            },
                            align: 'left',
                            width: 180,
                            summaryType: 'count',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b><big>TOTAL:</big></b> ';
                            }
                        }, {
                            header: 'DESIGNATION',
                            dataIndex: 'designationName',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return value.toUpperCase();
                            },
                            align: 'left',
                            width: 140,
                        }, {
                            header: 'SECTION',
                            dataIndex: 'sectionName',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return value.toUpperCase();
                            },
                            align: 'left',
                            width: 180,
                        }, {
                            header: 'EMP TYPE',
                            dataIndex: 'employeeTypeName',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return value.toUpperCase();
                            },
                            align: 'left',
                            width: 80,
                        }, {
                            header: 'SALARY',
                            dataIndex: 'salary_amount',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return value.formatMoney(2, '.', ',');
                            },
                            align: 'right',
                            width: 100,
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b><big>' + value.formatMoney(2, '.', ',') + '</big></b>';
                            }
                        }, {
                            header: 'DEDUCT',
                            dataIndex: 'deduct_amount',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return value.formatMoney(2, '.', ',');
                            },
                            align: 'right',
                            width: 100,
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b><big>' + value.formatMoney(2, '.', ',') + '</big></b>';
                            }
                        }, {
                            header: 'PAY AMOUNT',
                            dataIndex: 'paid_amount',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return value.formatMoney(2, '.', ',');
                            },
                            align: 'right',
                            width: 100,
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b><big>' + value.formatMoney(2, '.', ',') + '</big></b>';
                            }
                        }, {
                            header: 'BANK',
                            dataIndex: 'bank',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return value.toUpperCase();
                            },
                            align: 'left',
                            width: 180,
                        }, {
                            header: 'ACCOUNT',
                            dataIndex: 'account',
                            align: 'center',
                            width: 100,
                        }, {
                            xtype: 'actioncolumn',
                            header: 'UPDATE',
                            width: 80,
                            align: 'center',
                            items: [{
                                icon: '/uploads/icons/update.png',
                                tooltip: 'UPDATE',
                                handler: function(grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex).data;
                                    updateEMPBankAccountWindow(rec);
                                }
                            }]
                        }, {
                            header: 'PAY MODE',
                            dataIndex: 'pay_mode',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return value.toUpperCase();
                            },
                            align: 'left',
                            width: 80,
                        }, {
                            header: 'STATUS',
                            dataIndex: 'statusName',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return value.toUpperCase();
                            },
                            align: 'left',
                            width: 80,
                        },
                    ]
                })
            ],
            tbar: [
                Ext.create('Ext.form.Panel', {
                    // width:'30%',
                    bodyPadding: 10,
                    border: false,
                    layout: {
                        type: 'hbox',
                        align: 'stretch' // Child items are stretched to full width
                    },
                    items: [
                        Ext.create('Ext.form.field.Date', {
                            id: 'bank_statement_tab_month_year_b',
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
                            id: 'bank_statement_tab_payment_type_b',
                            name: 'payment_type',
                            filedAlign: 'top',
                            allowBlank: false,
                            editable: false,
                            emptyText: 'Payment Type',
                            autoScroll: true,
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'id',
                            value: 1,
                            selectOnFocus: true,
                            triggerAction: 'all',
                            store: {
                                fields: ['id', 'name'],
                                proxy: {
                                    type: 'ajax',
                                    url: '/getPaymentType'
                                },
                                autoLoad: true,
                                autoSync: true
                            },
                        }),
                    ],
                    buttons: [{
                        text: 'Reset',
                        handler: function() {
                            this.up('form').getForm().reset();
                        }
                    }, {
                        text: 'Search',
                        formBind: false,
                        handler: function() {
                            var panel = this.up('form'),
                                form = panel.getForm(),
                                values = form.getValues();
                            values.date = (values.month_year) ? new Date(values.month_year) : new Date();
                            values.year = values.date.getFullYear();
                            values.month = values.date.getMonth() + 1;
                            values.date.setDate(10);
                            if (tab_panel) {
                                Ext.getCmp('salary_payment_grid_b').setLoading(true);
                                Ext.getCmp('salary_payment_grid_b').getStore().load({
                                    params: values,
                                    callback: function(records, operation, success) {
                                        Ext.getCmp('salary_payment_grid_b').setLoading(false);
                                    },
                                    scope: this
                                });
                            }
                        }
                    }, {
                        text: 'Update',
                        formBind: true,
                        handler: function() {
                            var success = false;
                            var win = this.up('.window');
                            var panel = this.up('form'),
                                form = panel.getForm(),
                                values = form.getValues();
                            values.user = user;
                            values.date = new Date(values.month_year);
                            values.year = values.date.getFullYear();
                            values.month = values.date.getMonth() + 1;
                            values.date.setDate(10);
                            values.status = [1, 2];
                            if (form.isValid()) {
                                if (tab_panel) {
                                    BankStatementSectionUpdateWindowB(values);
                                }
                            }
                        }
                    }]
                })
            ],
            bbar: [{
                xtype: 'button',
                text: 'Bank Statement Download B',
                icon: '/uploads/icons/download.png',
                iconCls: 'add',
                name: 'download',
                tooltip: 'Download',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    bankPaymentDownloadWindow();
                    // salaryBankStatementWindow();
                }
            }],
        });
        tab_panel.setActiveTab(new_tab);
    }
}


function BankStatementSectionUpdateWindowB(QUERY) {
    var updateSectionStack = [];
    var successSectionStack = [];
    return Ext.create('Ext.window.Window', {
        title: 'BANK STATEMENT UPDATE B',
        id: 'BankStatementSectionUpdateWindowB',
        width: '50%',
        modal: true,
        closable: false,
        draggable: false,
        resizable: false,
        layout: 'fit',
        bbar: [{
            xtype: 'button',
            text: 'UPDATE',
            id: 'BankStatementSectionUpdateUpdateButtonB',
            icon: '/uploads/icons/update.png',
            iconCls: 'add',
            name: 'reload',
            tooltip: 'Update',
            border: 1,
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            handler: function() {
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
                        Ext.getCmp('BankStatementSectionUpdateUpdateButtonB').disable();
                        Ext.getCmp('BankStatementSectionUpdateCloseButtonB').disable();

                        function myFLoopS(i) {
                            QUERY.section = records[i].id;
                            updateSectionStack.push(records[i].id);
                            Ext.getCmp('BankStatementSectionUpdateGridB').getStore().load({
                                callback: function(records, operation, success) {
                                    socket.emit('CreateUpdateSalaryPaymentB', QUERY).on('CreateUpdateSalaryPaymentB' + QUERY.section, function(r) {
                                        successSectionStack.push(records[i].id);
                                        Ext.getCmp('BankStatementSectionUpdateGridB').getStore().load({
                                            callback: function(records, operation, success) {
                                                i++;
                                                if (i > records.length - 1) {
                                                    Ext.getCmp('BankStatementSectionUpdateCloseButtonB').enable();
                                                } else {
                                                    myFLoopS(i);
                                                }
                                            },
                                            scope: this
                                        });
                                    });
                                },
                                scope: this
                            });
                        }
                        myFLoopS(0);
                    },
                    scope: this
                });
            }
        }, {
            xtype: 'button',
            text: 'CLOSE',
            id: 'BankStatementSectionUpdateCloseButtonB',
            icon: '/uploads/icons/cross.png',
            iconCls: 'add',
            name: 'reload',
            tooltip: 'Update',
            border: 1,
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            handler: function() {
                Ext.getCmp('BankStatementSectionUpdateWindowB').close();
            }
        }],
        items: [
            Ext.create('Ext.grid.Panel', {
                loadMask: true,
                autoScroll: true,
                id: 'BankStatementSectionUpdateGridB',
                columnLines: true,
                width: '100%',
                height: 200,
                store: {
                    proxy: {
                        type: 'ajax',
                        url: '/section'
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
                },
                columns: [
                    Ext.create('Ext.grid.RowNumberer'), {
                        header: 'SECTION NAME',
                        dataIndex: 'name',
                        align: 'left',
                        flex: 1
                    }, {
                        header: 'STATUS',
                        dataIndex: 'id',
                        align: 'canter',
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            if (updateSectionStack.indexOf(value) != -1) {
                                if (successSectionStack.indexOf(value) != -1) {
                                    return '<b style="color:green;">SUCCESS..........</b>';
                                } else {
                                    return '<b style="color:red;">LOADING..........</b>';
                                }
                            } else {
                                return '<b style="color:blue;">WAITING..........</b>';
                            }
                        },
                        flex: 1
                    },
                ]
            })
        ],
    }).show();
}