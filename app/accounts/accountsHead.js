function accountsHeadTab() {
    if (Ext.getCmp('accounts_head_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("accounts_head_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Accounts Head',
            layout: 'fit',
            closable: true,
            id: 'accounts_head_tab',
            autoScroll: false,
            items: [Ext.create('Ext.grid.Panel', {
                id: 'accounts_head_grid',
                title: 'Accounts Head',
                columnLines: true,
                store: {
                    proxy: {
                        type: 'ajax',
                        url: '/getAccountsHead'
                    },
                    autoLoad: true,
                    autoSync: true,
                    model: Ext.define('ACCOUNTS_HEAD_MODEL', {
                        extend: 'Ext.data.Model',
                        fields: [{
                            name: 'id',
                            type: 'int'
                        }, {
                            name: 'accountsTypeName',
                            type: 'string',
                            mapping: 'accountsTypeTable.name'
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
                    header: 'ACCOUNTS TYPE',
                    dataIndex: 'accountsTypeName',
                    align: 'left',
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        return value.toUpperCase();
                    },
                    flex: 1
                }, {
                    header: 'ACCOUNTS HEAD',
                    dataIndex: 'name',
                    align: 'left',
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        return value.toUpperCase();
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
                                title: 'Delete Accounts Head?',
                                msg: 'Are you sure you want to delete this information. <br>It will permanently delete this information from the server',
                                buttons: Ext.Msg.YESNO,
                                icon: Ext.Msg.WARNING,
                                fn: function(btn, text) {
                                    if (btn == 'yes') {
                                        socket.emit('DestroyAccountsHead', rec.id).on('DestroyAccountsHead', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('accounts_head_grid')) {
                                                    Ext.getCmp('accounts_head_grid').getStore().load();
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
                    accountsHeadWindow();
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
                    if (Ext.getCmp('accounts_head_grid')) {
                        Ext.getCmp('accounts_head_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function accountsHeadWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New Accounts Head',
        modal: true,
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '100%',
            bodyPadding: 20,
            border: false,
            items: [Ext.create('Ext.form.ComboBox', {
                name: 'accounts_type',
                fieldLabel: 'Accounts Type:',
                filedAlign: 'top',
                allowBlank: false,
                editable: false,
                emptyText: 'Select Accounts Type',
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
                        url: '/getAccountsType'
                    },
                    autoLoad: true,
                    autoSync: true
                },
            }), {
                xtype: 'textfield',
                name: 'name',
                fieldLabel: 'Accounts Head',
                filedAlign: 'top',
                allowBlank: false,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Accounts Head...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: 'Status',
                defaultType: 'radiofield',
                defaults: {
                    flex: 1
                },
                layout: 'hbox',
                items: [{
                    boxLabel: 'Active',
                    name: 'state',
                    checked: true,
                    inputValue: 1,
                }, {
                    boxLabel: 'Inactive',
                    name: 'state',
                    inputValue: 0,
                }]
            }, ],
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
                        socket.emit('CreateAccountsHead', values).on('CreateAccountsHead', function(message) {
                            if (message == "success") {
                                success = true;
                                if (Ext.getCmp('accounts_head_grid')) {
                                    Ext.getCmp('accounts_head_grid').getStore().load();
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