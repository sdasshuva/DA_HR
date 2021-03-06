function bankStatementTab() {
    if (Ext.getCmp('bank_statement_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("bank_statement_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Bank Statement',
            layout: 'fit',
            closable: true,
            id: 'bank_statement_tab',
            autoScroll: false,
            items: [Ext.create('Ext.grid.Panel', {
                id: 'salary_payment_grid',
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
                            },
                            // {
                            //   name: 'employee',
                            //   type: 'string',
                            //   mapping: 'employeeTable.userTable.first_name'
                            // },
                            // {
                            //   name: 'designation',
                            //   type: 'string',
                            //   mapping: 'employeeTable.designationTable.name'
                            // },
                            // {
                            //   name: 'status',
                            //   type: 'string',
                            //   mapping: 'employeeTable.statu.name'
                            // },
                            // {
                            //   name: 'bonus',
                            //   type: 'boolean',
                            //   convert:function(v,rec){
                            //     return (v)?'YES':'NO';
                            //   }
                            // }
                        ]
                    }),
                    remoteSort: false,
                    // sorters: [{
                    //   property : 'section',
                    //   direction: 'ASC'
                    // }],
                    listeners: {
                        beforeload: function() {
                            Ext.getCmp('salary_payment_grid').setLoading(true);
                        },
                        load: {
                            fn: function() {
                                Ext.getCmp('salary_payment_grid').setLoading(false);
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
                        // if(record.get('status') == 'Transferred'){
                        //   return 'gray-row';
                        // }
                        // if(record.get('status') == 'Disappointed'){
                        //   return 'red-row';
                        // }
                        // if(record.get('status') == 'Hold'){
                        //   return 'yellow-row';
                        // }
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
                columns: [Ext.create('Ext.grid.RowNumberer', {
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
                }, ]
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
                        id: 'bank_statement_tab_month_year',
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
                    // Ext.create('Ext.form.ComboBox', {
                    //   id: 'bank_statement_tab_section',
                    //   name: 'section',
                    //   anyMatch: true,
                    //   typeAhead: true,
                    //   transform: 'stateSelect',
                    //   forceSelection: true,
                    //   editable : true,
                    //   allowBlank: false,
                    //   emptyText: 'Section',
                    //   autoScroll: true,
                    //   queryMode: 'local',
                    //   displayField: 'name',
                    //   valueField: 'id',
                    //   selectOnFocus: true,
                    //   triggerAction: 'all',
                    //   store: {
                    //     fields: ['id', 'name'],
                    //     proxy: {
                    //       type: 'ajax',
                    //       url: '/section'
                    //     },
                    //     autoLoad: true,
                    //     autoSync: true
                    //   },
                    //   listeners: {
                    //     blur: function(self, The, eOpts){
                    //     },
                    //   }
                    // }),
                    Ext.create('Ext.form.ComboBox', {
                        id: 'bank_statement_tab_payment_type',
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
                    // Ext.create('Ext.form.ComboBox', {
                    //   id: 'monthly_payment_tab_download_type',
                    //   name: 'download_type',
                    //   filedAlign: 'top',
                    //   allowBlank: true,
                    //   editable : false,
                    //   emptyText: 'Download Type',
                    //   autoScroll: true,
                    //   queryMode: 'local',
                    //   displayField: 'name',
                    //   valueField: 'id',
                    //   selectOnFocus: true,
                    //   triggerAction: 'all',
                    //   store: {
                    //     fields: ['id', 'name'],
                    //     data: [
                    //       { id: 1, name: 'SALARY STATEMENT' },
                    //       { id: 2, name: 'BANGLA STATEMENT' },
                    //       { id: 3, name: 'BANK STATEMENT' },
                    //       { id: 4, name: 'REGULER OVERTIME' },
                    //       { id: 5, name: 'EXTRA OVERTIME' },
                    //       { id: 6, name: '1H EXTRA OVERTIME' },
                    //       { id: 7, name: '2H EXTRA OVERTIME' },
                    //     ],
                    //     autoLoad: true,
                    //     autoSync: true
                    //   },
                    //   listeners: {
                    //     change: function (thisCombo, newValue, oldValue, eOpts) {
                    //       if (Ext.isEmpty(newValue)) {
                    //         Ext.getCmp('monthly_payment_tab_download').setDisabled(true);
                    //       } else {
                    //         Ext.getCmp('monthly_payment_tab_download').setDisabled(false);
                    //       }
                    //     }
                    //   }
                    // }),
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
                            Ext.getCmp('salary_payment_grid').setLoading(true);
                            Ext.getCmp('salary_payment_grid').getStore().load({
                                params: values,
                                callback: function(records, operation, success) {
                                    // Ext.getCmp('hourlyPunchTitle').setText(new Date(values.date).DateFormat1())
                                    // console.log(Ext.getCmp('hourlyPunchTitle'));
                                    Ext.getCmp('salary_payment_grid').setLoading(false);
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
                                BankStatementSectionUpdateWindow(values);
                            }
                        }
                    }
                }]
            })],
            bbar: [{
                xtype: 'button',
                text: 'Bank Statement Download',
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


function BankStatementSectionUpdateWindow(QUERY) {
    var updateSectionStack = [];
    var successSectionStack = [];
    return Ext.create('Ext.window.Window', {
        title: 'BANK STATEMENT UPDATE',
        id: 'BankStatementSectionUpdateWindow',
        width: '50%',
        modal: true,
        closable: false,
        draggable: false,
        resizable: false,
        layout: 'fit',
        bbar: [{
            xtype: 'button',
            text: 'UPDATE',
            id: 'BankStatementSectionUpdateUpdateButton',
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
                        Ext.getCmp('BankStatementSectionUpdateUpdateButton').disable();
                        Ext.getCmp('BankStatementSectionUpdateCloseButton').disable();

                        function myFLoopS(i) {
                            QUERY.section = records[i].id;
                            updateSectionStack.push(records[i].id);
                            Ext.getCmp('BankStatementSectionUpdateGrid').getStore().load({
                                callback: function(records, operation, success) {

                                    // socket.emit('CreateUpdateSalaryPayment', QUERY).on('CreateUpdateSalaryPayment'+QUERY.section, function (cBack) {
                                    //   if(cBack){
                                    //     Ext.getCmp('bank_statement_tab').setLoading(false);
                                    //     Ext.MessageBox.alert('success', 'Successfully data inserted');
                                    //   }else{
                                    //     Ext.getCmp('bank_statement_tab').setLoading(false);
                                    //     Ext.MessageBox.alert('Error', 'Data not updated. \nContact with the developer');
                                    //   }
                                    // });

                                    socket.emit('CreateUpdateSalaryPayment', QUERY).on('CreateUpdateSalaryPayment' + QUERY.section, function(r) {
                                        successSectionStack.push(records[i].id);
                                        Ext.getCmp('BankStatementSectionUpdateGrid').getStore().load({
                                            callback: function(records, operation, success) {
                                                i++;
                                                if (i > records.length - 1) {
                                                    Ext.getCmp('BankStatementSectionUpdateCloseButton').enable();
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
            id: 'BankStatementSectionUpdateCloseButton',
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
                Ext.getCmp('BankStatementSectionUpdateWindow').close();
            }
        }],
        items: [Ext.create('Ext.grid.Panel', {
            loadMask: true,
            autoScroll: true,
            id: 'BankStatementSectionUpdateGrid',
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
            columns: [Ext.create('Ext.grid.RowNumberer'), {
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
            }, ]
        })],
    }).show();
}

function updateEMPBankAccountWindow(rec) {
    return Ext.create('Ext.window.Window', {
        title: 'UPDATE ' + rec.name + ' BANK ACCOUNT',
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
            items: [Ext.create('Ext.grid.Panel', {
                    id: 'employee_bank_account_grid',
                    width: 350,
                    autoScroll: true,
                    columnLines: true,
                    store: {
                        proxy: {
                            type: 'ajax',
                            url: '/getEMPBankAccountList/' + eData.id
                        },
                        autoLoad: true,
                        autoSync: true,
                        model: Ext.define('EMP_BANK_ACCOUNT_MODEL', {
                            extend: 'Ext.data.Model',
                            fields: [{
                                    name: 'id',
                                    type: 'int'
                                },
                                // {
                                //   name: 'employee',
                                //   type: 'string',
                                //   mapping: 'employeeTable.userTable.first_name'
                                // },
                                // {
                                //   name: 'designation',
                                //   type: 'string',
                                //   mapping: 'employeeTable.designationTable.name'
                                // },
                                // {
                                //   name: 'status',
                                //   type: 'string',
                                //   mapping: 'employeeTable.statu.name'
                                // },
                                // {
                                //   name: 'bonus',
                                //   type: 'boolean',
                                //   convert:function(v,rec){
                                //     return (v)?'YES':'NO';
                                //   }
                                // }
                            ]
                        }),
                        remoteSort: false,
                        // sorters: [{
                        //   property : 'section',
                        //   direction: 'ASC'
                        // }],
                        listeners: {
                            beforeload: function() {
                                Ext.getCmp('employee_bank_account_grid').setLoading(true);
                            },
                            load: {
                                fn: function() {
                                    Ext.getCmp('employee_bank_account_grid').setLoading(false);
                                }
                            }
                        }
                    },
                    loadMask: true,
                    viewConfig: {

                        // listeners: {
                        //   refresh: function(view) {
                        //     var nodes = view.getNodes();
                        //     for (var i = 0; i < nodes.length; i++) {
                        //       var node = nodes[i];
                        //       // get node record
                        //       var record = view.getRecord(node);
                        //       // get color from record data
                        //       var color = record.get('is_active');
                        //       // get all td elements
                        //       var cells = Ext.get(node).query('td');  
                        //       // set bacground color to all row td elements
                        //       for(var j = 0; j < cells.length; j++) {
                        //         console.log(cells[j]);
                        //         Ext.fly(cells[j]).setStyle('background-color', color);
                        //       }
                        //     }
                        //   }      
                        // },
                        emptyText: 'No records',
                        loadMask: true,
                        autoDestroy: false,
                        getRowClass: function(record) {
                            if (record.get('is_active') == 1) {
                                return 'green-row';
                            }
                            if (record.get('is_active') == 0) {
                                return 'red-row';
                            }
                        }
                    },
                    listeners: {
                        rowclick: function(grid, row, e) {
                            var data = row.data;
                            // data.date = Ext.getCmp('hourlyPunchTitle').text;
                            // sectionHourlyPunchDetailsWindow(data);
                        }
                    },
                    columns: [{
                        header: 'BANK NAME',
                        dataIndex: 'bankName',
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            return value.toUpperCase();
                        },
                        align: 'left',
                        flex: 1,
                    }, {
                        header: 'ACCOUNT',
                        dataIndex: 'account',
                        align: 'center',
                        flex: 0.7,
                    }, {
                        header: 'STATUS',
                        dataIndex: 'is_active',
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            if (value == 1) {
                                return 'ACTIVE';
                            } else {
                                return 'DEACTIVE';
                            }
                        },
                        align: 'center',
                        flex: 0.5,
                    }, {
                        xtype: 'actioncolumn',
                        header: ' ',
                        flex: 0.2,
                        align: 'center',
                        items: [{
                            icon: '/uploads/icons/update.png',
                            tooltip: 'UPDATE',
                            handler: function(grid, rowIndex, colIndex) {
                                var rec = grid.getStore().getAt(rowIndex).data;
                                Ext.getCmp('employee_bank_account_grid').setLoading(true);
                                socket.emit('ActivateEMPBankAccount', rec).on('ActivateEMPBankAccount', function(r) {
                                    if (r == "success") {
                                        Ext.MessageBox.alert('success', 'Successfully data updated');
                                    } else if (r == "error") {
                                        Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                    Ext.getCmp('employee_bank_account_grid').getStore().load({
                                        callback: function(records, operation, success) {
                                            Ext.getCmp('employee_bank_account_grid').setLoading(false);
                                        },
                                        scope: this
                                    });
                                });
                            }
                        }]
                    }]
                }),
                Ext.create('Ext.form.ComboBox', {
                    name: 'bank',
                    fieldLabel: 'Bank Name',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Bank Name',
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
                            url: '/getBankList'
                        },
                        autoLoad: true,
                        autoSync: true
                    },
                }),
                Ext.create('Ext.form.field.Number', {
                    name: 'branch_code',
                    fieldLabel: 'Branch Code',
                    //width: 170,
                    labelWidth: 100,
                    filedAlign: 'top',
                    allowBlank: false,
                    minValue: 0,
                    // value: branch_code,
                    maxLength: 3,
                    enforceMaxLength: 3,
                    labelAlign: 'left',
                    labelStyle: 'text-align:left;border solid 1px white;',
                    labelSeparator: '',
                    emptyText: 'Branch...',
                    labelClsExtra: 'some-class',
                    fieldStyle: 'text-align: left;font-size: 12px;',
                    autoScroll: true
                }),
                Ext.create('Ext.form.field.Number', {
                    name: 'account_type',
                    fieldLabel: 'Account Type',
                    //width: 70,
                    filedAlign: 'top',
                    allowBlank: false,
                    minValue: 0,
                    // value: account_type,
                    maxLength: 3,
                    enforceMaxLength: 3,
                    labelAlign: 'left',
                    labelStyle: 'text-align:left;border solid 1px white;',
                    labelSeparator: '',
                    emptyText: 'Type...',
                    labelClsExtra: 'some-class',
                    fieldStyle: 'text-align: left;font-size: 12px;',
                    autoScroll: true
                }),
                Ext.create('Ext.form.field.Number', {
                    name: 'account_no',
                    fieldLabel: 'Account Number',
                    //width: 100,
                    filedAlign: 'top',
                    allowBlank: false,
                    minValue: 0,
                    // value: account_no,
                    maxLength: 7,
                    enforceMaxLength: 7,
                    labelAlign: 'left',
                    labelStyle: 'text-align:left;border solid 1px white;',
                    labelSeparator: '',
                    emptyText: 'Account No...',
                    labelClsExtra: 'some-class',
                    fieldStyle: 'text-align: left;font-size: 12px;',
                    autoScroll: true
                }), {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Set Active',
                    defaultType: 'radiofield',
                    defaults: {
                        flex: 2,
                    },
                    layout: 'hbox',
                    items: [{
                        boxLabel: ' ACTIVATE',
                        name: 'is_active',
                        inputValue: 1,
                        checked: true,
                        id: 'is_active_emp_bank_account1'
                    }, {
                        boxLabel: ' DEACTIVATE ',
                        name: 'is_active',
                        inputValue: 0,
                        checked: false,
                        id: 'is_active_emp_bank_account2'
                    }]
                }
            ],
            buttons: [{
                text: 'Update',
                icon: '/uploads/icons/update.png',
                formBind: true,
                handler: function() {
                    var success = false;
                    var win = this.up('.window');
                    var panel = this.up('form'),
                        form = panel.getForm(),
                        values = form.getValues();
                    if (form.isValid()) {
                        if (tab_panel) {
                            panel.setLoading(true);
                            socket.emit('CreateUpdateEMPBankAccount', values, rec).on('CreateUpdateEMPBankAccount', function(r) {
                                if (r == "success") {
                                    Ext.MessageBox.alert('success', 'Successfully data updated');
                                } else if (r == "error") {
                                    Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                }
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

function bankPaymentDownloadWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Bank Payment Download',
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
                    name: 'month_search',
                    fieldLabel: 'Select Month',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Select Month',
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
                    name: 'employee_type',
                    fieldLabel: 'Employee Type',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
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
                    },
                }),
                Ext.create('Ext.form.ComboBox', {
                    name: 'status',
                    fieldLabel: 'Status',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Status',
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
                    },
                }),
                Ext.create('Ext.form.ComboBox', {
                    name: 'bank',
                    fieldLabel: 'Bank Name',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Bank Name',
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
                            url: '/getBankList'
                        },
                        autoLoad: true,
                        autoSync: true
                    },
                }),
            ],
            buttons: [{
                text: 'Security Download',
                icon: '/uploads/icons/download.png',
                formBind: true,
                handler: function() {
                    var success = false;
                    var win = this.up('.window');
                    var panel = this.up('form'),
                        form = panel.getForm(),
                        values = form.getValues();
                    values.date = new Date(values.month_search);
                    values.year = values.date.getFullYear();
                    values.month = values.date.getMonth() + 1;
                    values.date.setDate(10);
                    values.payment_method = 2;
                    // values.status = 1;
                    values.employee_type = 1;
                    values.employeeType = 'STAFF';
                    values.file_name = values.date.getDate() + '_' + monthNames[values.date.getMonth()] + '_' + values.date.getUTCFullYear() + '_' + values.employeeType + '_Salary_Bank_Statement_Report';
                    if (form.isValid()) {
                        if (tab_panel) {
                            panel.setLoading(true);
                            socket.emit('DownloadSecurityBankPaymentStatement', values).on('DownloadSecurityBankPaymentStatement', function(r) {
                                Ext.MessageBox.alert({
                                    title: 'Salary Statement Report Download',
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
                text: 'Download',
                icon: '/uploads/icons/download.png',
                formBind: true,
                handler: function() {
                    var success = false;
                    var win = this.up('.window');
                    var panel = this.up('form'),
                        form = panel.getForm(),
                        values = form.getValues();
                    values.date = new Date(values.month_search);
                    values.year = values.date.getFullYear();
                    values.month = values.date.getMonth() + 1;
                    values.date.setDate(10);
                    values.payment_method = 2;
                    // values.status = 1;
                    values.employeeType = form.findField("employee_type").rawValue.toUpperCase();
                    values.file_name = values.date.getDate() + '_' + monthNames[values.date.getMonth()] + '_' + values.date.getUTCFullYear() + '_' + values.employeeType + '_Salary_Bank_Statement_Report';
                    if (form.isValid()) {
                        if (tab_panel) {
                            panel.setLoading(true);
                            socket.emit('DownloadBankPaymentStatement', values).on('DownloadBankPaymentStatement', function(r) {
                                Ext.MessageBox.alert({
                                    title: 'Salary Statement Report Download',
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