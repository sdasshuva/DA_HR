function salaryListToolBar() {
    return Ext.create('Ext.toolbar.Toolbar', {
        items: [{
            xtype: 'button',
            icon: '/uploads/icons/create.png',
            text: 'Add New',
            border: 1,
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            handler: function() {
                salaryInputFormWindow();
            }
        }]
    });
}

function salaryInputFormWindow(rec) {
    return Ext.create('Ext.window.Window', {
        title: 'Update Salary For ' + rec.name,
        modal: true,
        layout: 'fit',
        items: [
            salaryInputForm(rec)
        ]
    }).show();
}

function salaryInputForm(rec) {
    var itemArray = [];
    var account_no = 0;
    var account_type = 0;
    var branch_code = 0;
    if (rec.bank_account) {
        account_no = rec.bank_account.account_no;
        account_type = rec.bank_account.account_type;
        branch_code = rec.bank_account.branch_code;
    }
    var inputSalary = {
        xtype: 'fieldcontainer',
        //fieldLabel : 'Update Salary',
        defaultType: 'checkboxfield',
        defaults: {
            flex: 2,
        },
        layout: 'hbox',
        items: [{
            boxLabel: ' Update Salary ',
            name: 'input_salary',
            // inputValue: 1,
            checked: true,
            id: 'input_salary_checkbox1',
            listeners: {
                change: function(self, newValue, oldValue, eOpts) {
                    if (self.checked) {
                        Ext.getCmp('salaryBoxFieldContainer').show();
                        Ext.getCmp('salaryBoxFieldContainer').enable();
                    } else {
                        Ext.getCmp('salaryBoxFieldContainer').hide();
                        Ext.getCmp('salaryBoxFieldContainer').disable();
                    }
                },
            }
        }]
    };

    var salaryBox = {
        xtype: 'fieldcontainer',
        id: 'salaryBoxFieldContainer',
        defaults: {
            flex: 2,
        },
        hidden: false,
        layout: 'vbox',
        items: []
    };

    var payMethod = {
        xtype: 'fieldcontainer',
        fieldLabel: 'Payment Method',
        defaultType: 'radiofield',
        defaults: {
            flex: 2,
        },
        layout: 'hbox',
        items: [{
            boxLabel: ' CASH ',
            name: 'payment_method',
            inputValue: 1,
            checked: (rec.payment_method == 1) ? true : false,
            id: 'payMethod1'
        }, {
            boxLabel: ' BANK ',
            name: 'payment_method',
            inputValue: 2,
            checked: (rec.payment_method == 2) ? true : false,
            id: 'payMethod2'
        }]
    };

    var branchCode = Ext.create('Ext.form.field.Number', {
        name: 'branch_code',
        fieldLabel: 'Branch Code',
        width: 350,
        // labelWidth: 100,
        filedAlign: 'top',
        allowBlank: false,
        minValue: 0,
        value: branch_code,
        maxLength: 3,
        enforceMaxLength: 3,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Branch...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });
    var accountType = Ext.create('Ext.form.field.Number', {
        name: 'account_type',
        fieldLabel: 'Account Type',
        width: 350,
        filedAlign: 'top',
        allowBlank: false,
        minValue: 0,
        value: account_type,
        maxLength: 3,
        enforceMaxLength: 3,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Type...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });
    var accountNo = Ext.create('Ext.form.field.Number', {
        name: 'account_no',
        fieldLabel: 'Account Number',
        width: 350,
        filedAlign: 'top',
        allowBlank: false,
        minValue: 0,
        value: account_no,
        maxLength: 7,
        enforceMaxLength: 7,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Account No...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });
    var ppdateAmount = Ext.create('Ext.form.field.Number', {
        name: 'amount',
        width: 350,
        fieldLabel: 'Update Amount',
        filedAlign: 'top',
        allowBlank: false,
        minValue: 0,
        value: 0,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give Update Amount...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });

    var bankList = Ext.create('Ext.form.ComboBox', {
        name: 'bank',
        width: 350,
        fieldLabel: 'Bank Name',
        filedAlign: 'top',
        allowBlank: false,
        editable: false,
        value: 1,
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
    });

    var newMonthPicker = Ext.create('Ext.form.field.Date', {
        name: 'approve_date',
        width: 350,
        fieldLabel: 'Select Month',
        filedAlign: 'top',
        allowBlank: true,
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
    });

    var activateAccount = {
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
            id: 'is_active_emp_bank_account_1'
        }, {
            boxLabel: ' DEACTIVATE ',
            name: 'is_active',
            inputValue: 0,
            checked: false,
            id: 'is_active_emp_bank_account_2'
        }]
    };

    salaryBox.items.push(ppdateAmount);
    salaryBox.items.push(newMonthPicker);
    itemArray.push(inputSalary);
    itemArray.push(salaryBox);
    //itemArray.push(numberField('Update Amount', 'amount', true));
    //itemArray.push(newMonthPicker('approve_date'));

    itemArray.push(payMethod);
    itemArray.push(bankList);
    itemArray.push(branchCode);
    itemArray.push(accountType);
    itemArray.push(accountNo);
    itemArray.push(activateAccount);
    itemArray.push(employeeBankAccountGrid(rec));

    var salary_input_form = Ext.create('Ext.form.Panel', {
        width: '100%',
        bodyPadding: 20,
        border: false,
        items: itemArray,
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
                values.approve_date = new Date(values.approve_date);
                values.approve_date.setDate(2);
                values.employee = rec.id;
                if (parseInt(values.amount) > 0 && new Date(values.approve_date)) {
                    values.update_salary = true;
                } else {
                    values.update_salary = false;
                }
                if (form.isValid()) {
                    if (values.input_salary) {
                        if (parseInt(values.amount) > 0 && values.approve_date != 'Invalid Date') {
                            socket.emit('CreateSalary', values).on('CreateSalary', function(message) {
                                if (message == "success") {
                                    success = true;
                                    salaryGridReload();
                                    Ext.MessageBox.alert('success', 'Successfully data inserted');
                                    win.close();
                                } else if (message == "error") {
                                    Ext.MessageBox.alert('Error', 'Data not inserted. \nPossible problem could be duplicate entry');
                                }

                                // Ext.getCmp('employee_bank_account_grid').getStore().load({
                                //   callback: function (records, operation, success) {
                                //     // Ext.getCmp('employee_bank_account_grid').setLoading(false);
                                //   },
                                //   scope: this
                                // });
                            });
                        } else {
                            Ext.MessageBox.alert('Error', 'Fill Up Salary Amount & Month Details Properly');
                        }
                    } else {
                        socket.emit('CreateSalary', values).on('CreateSalary', function(message) {
                            if (message == "success") {
                                success = true;
                                salaryGridReload();
                                Ext.MessageBox.alert('success', 'Successfully data inserted');
                                win.close();
                            } else if (message == "error") {
                                Ext.MessageBox.alert('Error', 'Data not inserted. \nPossible problem could be duplicate entry');
                            }
                            // Ext.getCmp('employee_bank_account_grid').getStore().load({
                            //   callback: function (records, operation, success) {
                            //     Ext.getCmp('employee_bank_account_grid').setLoading(false);
                            //   },
                            //   scope: this
                            // });
                        });
                    }
                }
                if (success) {
                    this.up('.window').close();
                }
            }
        }, {
            text: 'Close',
            handler: function() {
                this.up('.window').close();
            }
        }]
    });
    return salary_input_form;
}