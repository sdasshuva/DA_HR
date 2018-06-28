var voucherIdArray = [];

function voucherTab() {
    if (Ext.getCmp('voucher_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("voucher_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Voucher',
            layout: 'fit',
            closable: true,
            id: 'voucher_tab',
            autoScroll: false,
            items: [Ext.create('Ext.grid.Panel', {
                id: 'voucher_grid',
                title: 'Voucher',
                columnLines: true,
                store: {
                    proxy: {
                        type: 'ajax',
                        url: '/getVoucher'
                    },
                    autoLoad: true,
                    autoSync: true,
                    model: Ext.define('VOUCHER_MODEL', {
                        extend: 'Ext.data.Model',
                        fields: [{
                            name: 'id',
                            type: 'int'
                        }, ]
                    }),
                },
                loadMask: true,
                viewConfig: {
                    emptyText: 'No records',
                    autoDestroy: false
                },
                listeners: {
                    rowclick: function(grid, row, e) {
                        var data = row.data;
                    }
                },
                autoScroll: true,
                columns: [Ext.create('Ext.grid.RowNumberer', {
                    header: '#',
                    width: 30
                }), {
                    header: 'DATE',
                    dataIndex: 'date',
                    align: 'center',
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        return new Date(value).DateFormat1();
                    },
                    flex: 1
                }, {
                    header: 'STATUS',
                    dataIndex: 'state',
                    align: 'center',
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        return (value) ? '<b style="color:green">ACTIVE</b>' : '<b style="color:red">INACTIVE</b>';
                    },
                    flex: 0.5
                }, {
                    header: 'CREATED ON',
                    dataIndex: 'created_at',
                    align: 'center',
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        return new Date(value).DateFormat1();
                    },
                    flex: 0.5
                }, {
                    xtype: 'actioncolumn',
                    header: ' ',
                    flex: 0.5,
                    align: 'center',
                    items: [{
                        icon: '/uploads/icons/delete.png',
                        tooltip: 'Delete',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            Ext.Msg.show({
                                title: 'Delete Voucher Type?',
                                msg: 'Are you sure you want to delete this information. <br>It will permanently delete this information from the server',
                                buttons: Ext.Msg.YESNO,
                                icon: Ext.Msg.WARNING,
                                fn: function(btn, text) {
                                    if (btn == 'yes') {
                                        socket.emit('DestroyVoucherType', rec.id).on('DestroyVoucherType', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('voucher_type_grid')) {
                                                    Ext.getCmp('voucher_type_grid').getStore().load();
                                                }
                                                Ext.MessageBox.alert('success', 'Successfully data deleted');
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
            tbar: [{
                xtype: 'button',
                icon: '/uploads/icons/create.png',
                text: 'Add New',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    voucherWindow();
                }
            }],
            bbar: [{
                xtype: 'button',
                text: 'Reload',
                icon: '/uploads/icons/refresh.png',
                iconCls: 'add',
                name: 'reload',
                tooltip: 'Reload',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    if (Ext.getCmp('voucher_grid')) {
                        Ext.getCmp('voucher_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}



function voucherWindow() {
    voucherIdArray = [];
    var count = 1;
    return Ext.create('Ext.window.Window', {
        title: 'Add New Voucher',
        modal: true,
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '50%',
            border: false,
            items: [{
                layout: {
                    type: 'vbox',
                    pack: 'start',
                    align: 'stretch'
                },
                items: [Ext.create('Ext.panel.Panel', {
                        border: false,
                        layout: {
                            type: 'hbox',
                            pack: 'start',
                            align: 'stretch'
                        },
                        items: [{
                            ///////////////// LEFT PANEL
                            bodyPadding: 20,
                            xtype: 'panel',
                            width: '50%',
                            border: true,
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [Ext.create('Ext.form.field.Text', {
                                    name: 'pay_to',
                                    fieldLabel: 'Pay To:',
                                    filedAlign: 'top',
                                    allowBlank: false,
                                    labelAlign: 'left',
                                    labelStyle: 'text-align:left;border solid 1px white;',
                                    labelSeparator: '',
                                    emptyText: 'Give Pay To...',
                                    labelClsExtra: 'some-class',
                                    fieldStyle: 'text-align: left;font-size: 12px;',
                                    autoScroll: true
                                }),
                                // Ext.create('Ext.form.field.Text', {
                                //   name: 'pay_by',
                                //   fieldLabel: 'Pay By:',
                                //   filedAlign: 'top',
                                //   allowBlank: false,
                                //   labelAlign: 'left',
                                //   labelStyle: 'text-align:left;border solid 1px white;',
                                //   labelSeparator: '',
                                //   emptyText: 'Give Pay By...',
                                //   labelClsExtra: 'some-class',
                                //   fieldStyle: 'text-align: left;font-size: 12px;',
                                //   autoScroll: true
                                // }),
                                Ext.create('Ext.form.ComboBox', {
                                    name: 'voucher_type',
                                    fieldLabel: 'Voucher Type:',
                                    filedAlign: 'top',
                                    allowBlank: false,
                                    editable: false,
                                    emptyText: 'Select Voucher Type',
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
                                            url: '/getVoucherType'
                                        },
                                        autoLoad: true,
                                        autoSync: true
                                    },
                                }),
                                // Ext.create('Ext.form.ComboBox', {
                                //   name: 'accounts_type',
                                //   fieldLabel: 'Accounts Type:',
                                //   filedAlign: 'top',
                                //   allowBlank: false,
                                //   editable : false,
                                //   emptyText: 'Select Accounts Type',
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
                                //       url: '/getAccountsType'
                                //     },
                                //     autoLoad: true,
                                //     autoSync: true
                                //   },
                                // }),
                                // Ext.create('Ext.form.ComboBox', {
                                //   name: 'accounts_head',
                                //   fieldLabel: 'Accounts Head:',
                                //   filedAlign: 'top',
                                //   allowBlank: false,
                                //   editable : false,
                                //   emptyText: 'Select Accounts Head',
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
                                //       url: '/getAccountsHead'
                                //     },
                                //     autoLoad: true,
                                //     autoSync: true
                                //   },
                                // }),
                                // Ext.create('Ext.form.ComboBox', {
                                //   name: 'sub_head',
                                //   fieldLabel: 'Sub Head:',
                                //   filedAlign: 'top',
                                //   allowBlank: false,
                                //   editable : false,
                                //   emptyText: 'Select Sub Head',
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
                                //       url: '/getSubHead'
                                //     },
                                //     autoLoad: true,
                                //     autoSync: true
                                //   },
                                // }),
                                // {
                                //   xtype      : 'fieldcontainer',
                                //   fieldLabel : 'Status',
                                //   defaultType: 'radiofield',
                                //   defaults: {
                                //     flex: 1
                                //   },
                                //   layout: 'hbox',
                                //   items: [
                                //     {
                                //       boxLabel  : 'ACTIVE',
                                //       name      : 'state',
                                //       checked   : true,
                                //       inputValue: 1,
                                //     },
                                //     {
                                //       boxLabel  : 'INACTIVE',
                                //       name      : 'state',
                                //       inputValue: 0,
                                //     }
                                //   ]
                                // },
                                Ext.create('Ext.form.field.TextArea', {
                                    name: 'comments',
                                    fieldLabel: 'Comments:',
                                    filedAlign: 'top',
                                    filedAlign: 'top',
                                    allowBlank: false,
                                    emptyText: 'Give Narration...',
                                    fieldStyle: 'text-align: left;font-size: 12px;',
                                    autoScroll: true
                                }),
                            ],
                        }, {
                            ///////////////// CENTER OR RIGHT PANEL
                            bodyPadding: 20,
                            width: '50%',
                            xtype: 'panel',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            border: true,
                            items: [Ext.create('Ext.form.field.Date', {
                                    name: 'date',
                                    fieldLabel: 'Date:',
                                    filedAlign: 'top',
                                    allowBlank: false,
                                    editable: false,
                                    labelAlign: 'left',
                                    labelStyle: 'text-align:left;border solid 1px white;',
                                    labelSeparator: '',
                                    value: new Date(),
                                    emptyText: 'Give Date...',
                                    labelClsExtra: 'some-class',
                                    fieldStyle: 'text-align: left;font-size: 12px;',
                                    autoScroll: true
                                }),
                                Ext.create('Ext.form.field.Text', {
                                    name: 'manual_voucher_no',
                                    fieldLabel: 'M. Voucher No:',
                                    filedAlign: 'top',
                                    allowBlank: false,
                                    labelAlign: 'left',
                                    labelStyle: 'text-align:left;border solid 1px white;',
                                    labelSeparator: '',
                                    emptyText: 'Give Manual Voucher No...',
                                    labelClsExtra: 'some-class',
                                    fieldStyle: 'text-align: left;font-size: 12px;',
                                    autoScroll: true
                                }),
                                // Ext.create('Ext.form.field.Text', {
                                //   name: 'ref_no',
                                //   fieldLabel: 'Ref. No:',
                                //   filedAlign: 'top',
                                //   allowBlank: false,
                                //   labelAlign: 'left',
                                //   labelStyle: 'text-align:left;border solid 1px white;',
                                //   labelSeparator: '',
                                //   emptyText: 'Give Ref. No...',
                                //   labelClsExtra: 'some-class',
                                //   fieldStyle: 'text-align: left;font-size: 12px;',
                                //   autoScroll: true
                                // }),
                                {
                                    xtype: 'fieldcontainer',
                                    fieldLabel: 'Pay Mode',
                                    defaultType: 'radiofield',
                                    defaults: {
                                        flex: 1
                                    },
                                    layout: 'hbox',
                                    items: [{
                                        boxLabel: 'CASH',
                                        name: 'payment_method',
                                        checked: true,
                                        inputValue: 1,
                                    }, {
                                        boxLabel: 'BANK',
                                        name: 'payment_method',
                                        inputValue: 2,
                                    }]
                                },
                                // Ext.create('Ext.form.field.Number', {
                                //   name: 'amount',
                                //   fieldLabel: 'Amount:',
                                //   filedAlign: 'top',
                                //   allowBlank: false,
                                //   minValue: 0,
                                //   value: 0,
                                //   labelAlign: 'left',
                                //   labelStyle: 'text-align:left;border solid 1px white;',
                                //   labelSeparator: '',
                                //   emptyText: 'Give Amount...',
                                //   labelClsExtra: 'some-class',
                                //   fieldStyle: 'text-align: left;font-size: 12px;',
                                //   autoScroll: true
                                // }),
                                Ext.create('Ext.form.field.Text', {
                                    name: 'check_no',
                                    fieldLabel: 'Check No:',
                                    filedAlign: 'top',
                                    allowBlank: false,
                                    labelAlign: 'left',
                                    labelStyle: 'text-align:left;border solid 1px white;',
                                    labelSeparator: '',
                                    emptyText: 'Give Check. No...',
                                    labelClsExtra: 'some-class',
                                    fieldStyle: 'text-align: left;font-size: 12px;',
                                    autoScroll: true
                                }),
                            ]
                        }],
                    }),
                    Ext.create('Ext.panel.Panel', {
                        ///////////////// BOTTOM PANEL
                        id: 'voucherFormBottomPanel',
                        border: false,
                        layout: {
                            type: 'hbox',
                            pack: 'start',
                            align: 'stretch'
                        },
                        items: [Ext.create('Ext.panel.Panel', {
                                title: '<div style="text-align:center;">Narration</div>',
                                id: 'voucherFormSubHeadPanel',
                                flex: 1,
                                bodyPadding: '15 0 15 0',
                                items: [Ext.create('Ext.form.ComboBox', {
                                    name: 'sub_head',
                                    editable: true,
                                    anyMatch: true,
                                    typeAhead: true,
                                    transform: 'stateSelect',
                                    forceSelection: true,
                                    filedAlign: 'top',
                                    allowBlank: false,
                                    emptyText: 'Select Sub Head',
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
                                            url: '/getSubHead'
                                        },
                                        autoLoad: true,
                                        autoSync: true
                                    },
                                }), ],
                                bbar: [{
                                    xtype: 'label',
                                    height: 15,
                                    margin: '5 0 0 5',
                                    text: 'TOTAL TAKA =>'
                                }]
                            }),
                            Ext.create('Ext.panel.Panel', {
                                title: '<div style="text-align:center;">Narration</div>',
                                id: 'voucherFormNarrationPanel',
                                flex: 1,
                                bodyPadding: '15 0 15 0',
                                items: [Ext.create('Ext.form.field.Text', {
                                    id: 'voucherFormNarration',
                                    // width: 100,
                                    name: 'narration',
                                    filedAlign: 'top',
                                    allowBlank: false,
                                    emptyText: 'Give Narration...',
                                    fieldStyle: 'text-align: left;font-size: 12px;',
                                    autoScroll: true
                                }), ],
                                bbar: [{
                                    xtype: 'label',
                                    height: 20,
                                }]
                            }),
                            Ext.create('Ext.panel.Panel', {
                                title: '<div style="text-align:center;">Debit</div>',
                                id: 'voucherFormDebitAmountPanel',
                                flex: 1,
                                bodyPadding: '15 0 15 0',
                                items: [Ext.create('Ext.form.field.Number', {
                                    id: 'voucherFormDebitAmount',
                                    name: 'debit_amount',
                                    // width: 100,
                                    filedAlign: 'top',
                                    anchor: '100%',
                                    allowBlank: false,
                                    emptyText: 'Give Debit Amount...',
                                    value: 0,
                                    minValue: 0,
                                    fieldStyle: 'text-align: right;font-size: 12px;',
                                    autoScroll: true,
                                    listeners: {
                                        change: {
                                            fn: function(field, value) {
                                                // var totalPrice = parseFloat(value);
                                                // Ext.getCmp('voucherFormTotalPrice').setValue(totalPrice);
                                                // var count = voucherIdArray.length, total_gross = 0;
                                                // for(var i = 0; i < count; i++){
                                                //   total_gross += parseFloat(
                                                //       Ext.getCmp('voucherFormTotalPrice'+voucherIdArray[i]).getValue()
                                                //   );
                                                // }
                                                // total_gross += parseFloat(Ext.getCmp('voucherFormTotalPrice').getValue());
                                                // Ext.getCmp('voucherFormTotalPriceBbar').setValue(total_gross);
                                            }
                                        }
                                    }
                                }), ],
                                bbar: [{
                                    xtype: 'label',
                                    height: 20,
                                }]
                            }),
                            Ext.create('Ext.panel.Panel', {
                                title: '<div style="text-align:center;">Credit</div>',
                                id: 'voucherFormCreditAmountPanel',
                                flex: 1,
                                bodyPadding: '15 0 15 0',
                                items: [Ext.create('Ext.form.field.Number', {
                                    id: 'voucherFormCreditAmount',
                                    name: 'credit_amount',
                                    // width: 100,
                                    filedAlign: 'top',
                                    anchor: '100%',
                                    allowBlank: false,
                                    emptyText: 'Give Credit Amount...',
                                    value: 0,
                                    minValue: 0,
                                    fieldStyle: 'text-align: right;font-size: 12px;',
                                    autoScroll: true,
                                    listeners: {
                                        change: {
                                            fn: function(field, value) {
                                                // var totalPrice = parseFloat(value);
                                                // Ext.getCmp('voucherFormTotalPrice').setValue(totalPrice);
                                                // var count = voucherIdArray.length, total_gross = 0;
                                                // for(var i = 0; i < count; i++){
                                                //   total_gross += parseFloat(
                                                //       Ext.getCmp('voucherFormTotalPrice'+voucherIdArray[i]).getValue()
                                                //   );
                                                // }
                                                // total_gross += parseFloat(Ext.getCmp('voucherFormTotalPrice').getValue());
                                                // Ext.getCmp('voucherFormTotalPriceBbar').setValue(total_gross);
                                            }
                                        }
                                    }
                                }), ],
                                bbar: [{
                                    xtype: 'label',
                                    height: 20,
                                }]
                            }),
                            // voucherFormTotalPricePanel(),
                            Ext.create('Ext.panel.Panel', {
                                title: '<div style="text-align:center;">Action</div>',
                                id: 'voucherFormAddButtonPanel',
                                flex: 0.5,
                                bodyPadding: 15,
                                layout: {
                                    type: 'vbox'
                                },
                                items: [{
                                    xtype: 'button',
                                    style: "width:22px!important;" +
                                        "height:22px!important;" +
                                        "background-image: none;" +
                                        "background-position: center center;" +
                                        "background-size: contain !important;" +
                                        "background-image: url('./uploads/icons/create.png') !important;" +
                                        "background-color: #ffffff; " +
                                        "border:none;" +
                                        "background-repeat: no-repeat;",
                                    margin: '0 0 5 0',
                                    handler: function() {
                                        count++;
                                        voucherIdArray.push(count);
                                        Ext.getCmp("voucherFormSubHeadPanel").add(voucherFormSubHead(count));
                                        Ext.getCmp("voucherFormNarrationPanel").add(voucherFormNarration(count));
                                        Ext.getCmp("voucherFormDebitAmountPanel").add(voucherFormDebitAmount(count));
                                        Ext.getCmp("voucherFormCreditAmountPanel").add(voucherFormCreditAmount(count));
                                        // Ext.getCmp("voucherFormTotalPricePanel").add(voucherFormTotalPrice(count));
                                        Ext.getCmp("voucherFormAddButtonPanel").add(voucherFormRemoveButton(count));
                                    }
                                }],
                                bbar: [{
                                    xtype: 'label',
                                    height: 20,
                                }]
                            })
                        ]
                    })
                ]
            }],
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
                    values.user = user.id;
                    values.VoucherItems = [{
                        narration: values.narration,
                        amount: values.amount,
                        entry_type: values.entry_type, //////// debit (1) > credit (2)
                        // total_price: values.total_price
                    }];
                    for (var i = 0; i < voucherIdArray.length; i++) {
                        var o = {};
                        o.narration = values['narration' + voucherIdArray[i]],
                            o.amount = values['amount' + voucherIdArray[i]],
                            o.entry_type = values['entry_type' + voucherIdArray[i]], //////// debit (1) > credit (2)
                            // o.total_price=values['total_price'+voucherIdArray[i]]
                            values.VoucherItems.push(o);
                    }
                    if (form.isValid()) {
                        socket.emit('CreateVoucher', values).on('CreateVoucher', function(message) {
                            if (message == "success") {
                                success = true;
                                if (Ext.getCmp('voucher_grid')) {
                                    Ext.getCmp('voucher_grid').getStore().load();
                                }
                                Ext.MessageBox.alert('success', 'Successfully data inserted');
                                win.close();
                            } else if (message == "error") {
                                Ext.MessageBox.alert('Error', 'Data not inserted. \nPossible problem could be duplicate entry');
                            }
                        });
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
        })]
    }).show();
}

function voucherFormCreditAmount(ID) {
    return Ext.create('Ext.form.field.Number', {
        id: 'voucherFormCreditAmount' + ID,
        name: 'credit_amount' + ID,
        // width: 100,
        filedAlign: 'top',
        anchor: '100%',
        allowBlank: false,
        emptyText: 'Give Credit Amount...',
        value: 0,
        minValue: 0,
        fieldStyle: 'text-align: right;font-size: 12px;',
        autoScroll: true,
        listeners: {
            change: {
                fn: function(field, value) {
                    // var totalPrice = parseFloat(value);
                    // Ext.getCmp('voucherFormTotalPrice'+ID).setValue(totalPrice);
                    // var count = voucherIdArray.length, total_gross = 0;
                    // for(var i = 0; i < count; i++){
                    //   total_gross += parseFloat(Ext.getCmp('voucherFormTotalPrice'+voucherIdArray[i]).getValue());
                    // }
                    // total_gross += parseFloat(Ext.getCmp('voucherFormTotalPrice').getValue());
                    // Ext.getCmp('voucherFormTotalPriceBbar').setValue(total_gross);
                }
            }
        }
    })
}

function voucherFormSubHead(ID) {
    return Ext.create('Ext.form.field.Text', {
        id: 'voucherFormSubHead' + ID,
        // width: 100,
        name: 'sub_head' + ID,
        filedAlign: 'top',
        allowBlank: false,
        emptyText: 'Give Sub Head...',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    })
}

function voucherFormDebitAmount(ID) {
    return Ext.create('Ext.form.field.Number', {
        id: 'voucherFormDebitAmount' + ID,
        name: 'debit_amount' + ID,
        // width: 100,
        filedAlign: 'top',
        anchor: '100%',
        allowBlank: false,
        emptyText: 'Give Debit Amount...',
        value: 0,
        minValue: 0,
        fieldStyle: 'text-align: right;font-size: 12px;',
        autoScroll: true,
        listeners: {
            change: {
                fn: function(field, value) {
                    // var totalPrice = parseFloat(value);
                    // Ext.getCmp('voucherFormTotalPrice'+ID).setValue(totalPrice);
                    // var count = voucherIdArray.length, total_gross = 0;
                    // for(var i = 0; i < count; i++){
                    //   total_gross += parseFloat(Ext.getCmp('voucherFormTotalPrice'+voucherIdArray[i]).getValue());
                    // }
                    // total_gross += parseFloat(Ext.getCmp('voucherFormTotalPrice').getValue());
                    // Ext.getCmp('voucherFormTotalPriceBbar').setValue(total_gross);
                }
            }
        }
    })
}

function voucherFormRemoveButton(id) {
    return Ext.create('Ext.Button', {
        id: 'voucherFormRemoveButton' + id,
        margin: '0 0 5 0',
        style: "width:22px!important;" +
            "height:22px!important;" +
            "background-image: none;" +
            "background-position: center center;" +
            "background-size: contain !important;" +
            "background-image: url('./uploads/icons/delete.png') !important;" +
            "background-color: #ffffff; " +
            "border:none;" +
            "background-repeat: no-repeat;",
        //style:'background-image:none;background-color:red;color:white',
        handler: function() {
            popFromArray(voucherIdArray, id);
            Ext.getCmp("voucherFormSubHeadPanel").remove("voucherFormSubHead" + id, true);
            Ext.getCmp("voucherFormDebitAmountPanel").remove("voucherFormDebitAmount" + id, true);
            Ext.getCmp("voucherFormCreditAmountPanel").remove("voucherFormCreditAmount" + id, true);
            // Ext.getCmp("voucherFormTotalPricePanel").remove("voucherFormTotalPrice"+id, true);
            Ext.getCmp("voucherFormAddButtonPanel").remove("voucherFormRemoveButton" + id, true);

            var count = voucherIdArray.length,
                total_gross = 0;
            // for(var i = 0; i < count; i++){
            //   total_gross += parseFloat(
            //       Ext.getCmp('tile_total_price'+voucherIdArray[i]).getValue()
            //   );
            // }
            // total_gross += parseFloat(Ext.getCmp('tile_total_price').getValue());
            // Ext.getCmp('sale_gross').setValue(total_gross);
        }
    });
}

function voucherFormNarration(ID) {
    return Ext.create('Ext.form.field.Text', {
        id: 'voucherFormNarration' + ID,
        // width: 100,
        name: 'narration' + ID,
        filedAlign: 'top',
        allowBlank: false,
        emptyText: 'Give Narration...',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    })
}