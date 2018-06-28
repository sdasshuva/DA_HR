function userTab() {
    if (Ext.getCmp('user_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("user_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'User',
            layout: 'fit',
            closable: true,
            id: 'user_tab',
            autoScroll: true,
            items: [Ext.create('Ext.grid.Panel', {
                id: 'user_list_grid',
                store: {
                    proxy: {
                        type: 'ajax',
                        url: '/user'
                    },
                    autoLoad: true,
                    autoSync: true,
                    model: Ext.define('USER_MODEL', {
                        extend: 'Ext.data.Model',
                        fields: [{
                            name: 'id',
                            type: 'int'
                        }, {
                            name: 'card_no',
                            type: 'int'
                        }, {
                            name: 'finger_print_id',
                            type: 'int'
                        }, {
                            name: 'first_name',
                            type: 'string'
                        }, {
                            name: 'last_name',
                            type: 'string'
                        }, {
                            name: 'email',
                            type: 'string'
                        }, {
                            name: 'access_level',
                            type: 'string'
                        }]
                    })
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
                //selType: 'cellmodel',
                plugins: [
                    cellEditPlugin()
                ],
                columnLines: true,
                autoScroll: true,
                columns: [Ext.create('Ext.grid.RowNumberer', {
                    width: 50
                }), {
                    header: 'FP',
                    dataIndex: 'finger_print_id',
                    align: 'center',
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        return addLeadingZero(9, value);
                    },
                    flex: 0.5
                }, {
                    header: 'FIRST NAME',
                    dataIndex: 'first_name',
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        if (value)
                            return value;
                        else
                            return '<b style="color:#CCC">Give First Name</b>';
                    },
                    editor: {
                        xtype: 'textfield',
                        editable: true,
                        listeners: {
                            blur: function(self, event, eOpts) {
                                var row = Ext.getCmp('user_list_grid').getSelectionModel().getSelection()[0].data.id;
                                var data = {};
                                data.id = row;
                                data.first_name = self.value;
                                if (self.value) {
                                    socket.emit('UpdateUserFirstName', data).on('UpdateUserFirstName', function(message) {
                                        if (message == "success") {
                                            if (Ext.getCmp('user_list_grid')) {
                                                Ext.getCmp('user_list_grid').getStore().load();
                                                //Ext.MessageBox.alert('success', 'Successfully data updated');
                                            }
                                        } else if (message == "error") {
                                            //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                        }
                                    });
                                }
                            }
                        }
                    },
                    align: 'left',
                    flex: 1
                }, {
                    header: 'LAST NAME',
                    dataIndex: 'last_name',
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        if (value)
                            return value;
                        else
                            return '<b style="color:#CCC">Give Last Name</b>';
                    },
                    editor: {
                        xtype: 'textfield',
                        editable: true,
                        listeners: {
                            blur: function(self, event, eOpts) {
                                var row = Ext.getCmp('user_list_grid').getSelectionModel().getSelection()[0].data.id;
                                var data = {};
                                data.id = row;
                                data.last_name = self.value;
                                if (self.value) {
                                    socket.emit('UpdateUserLastName', data).on('UpdateUserLastName', function(message) {
                                        if (message == "success") {
                                            if (Ext.getCmp('user_list_grid')) {
                                                Ext.getCmp('user_list_grid').getStore().load();
                                                //Ext.MessageBox.alert('success', 'Successfully data updated');
                                            }
                                        } else if (message == "error") {
                                            //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                        }
                                    });
                                }
                            }
                        }
                    },
                    align: 'left',
                    flex: 1
                }, {
                    header: 'EMAIL',
                    dataIndex: 'email',
                    align: 'left',
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        if (value)
                            return value;
                        else
                            return '<b style="color:#CCC">Give Email Address</b>';
                    },
                    editor: {
                        xtype: 'textfield',
                        editable: true,
                        listeners: {
                            blur: function(self, event, eOpts) {
                                var row = Ext.getCmp('user_list_grid').getSelectionModel().getSelection()[0].data.id;
                                var data = {};
                                data.id = row;
                                data.email = self.value;
                                if (self.value) {
                                    socket.emit('UpdateUserEmail', data).on('UpdateUserEmail', function(message) {
                                        if (message == "success") {
                                            if (Ext.getCmp('user_list_grid')) {
                                                Ext.getCmp('user_list_grid').getStore().load();
                                                //Ext.MessageBox.alert('success', 'Successfully data updated');
                                            }
                                        } else if (message == "error") {
                                            //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                        }
                                    });
                                }
                            }
                        }
                    },
                    flex: 1
                }, {
                    header: 'ACCESS LEVEL',
                    dataIndex: 'access_level',
                    /*renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                        if(value)
                            return value;
                        else
                            return '<b style="color:#CCC">Give Last Name</b>';
                    },*/
                    editor: {
                        xtype: 'textfield',
                        editable: true,
                        listeners: {
                            blur: function(self, event, eOpts) {
                                var row = Ext.getCmp('user_list_grid').getSelectionModel().getSelection()[0].data.id;
                                var data = {};
                                data.id = row;
                                data.access_level = self.value;
                                if (self.value) {
                                    socket.emit('UpdateUserAccessLevel', data).on('UpdateUserAccessLevel', function(message) {
                                        if (message == "success") {
                                            if (Ext.getCmp('user_list_grid')) {
                                                Ext.getCmp('user_list_grid').getStore().load();
                                                //Ext.MessageBox.alert('success', 'Successfully data updated');
                                            }
                                        } else if (message == "error") {
                                            //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                        }
                                    });
                                }
                            }
                        }
                    },
                    align: 'left',
                    flex: 1
                }, {
                    xtype: 'actioncolumn',
                    header: 'PASSWORD',
                    flex: 0.5,
                    align: 'center',
                    items: [{
                        icon: '/uploads/icons/password.png',
                        tooltip: 'Password',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            assignUserPasswordWindow(rec);
                        }
                    }]
                }]
            })],
            tbar: [{
                xtype: 'button',
                icon: '/uploads/icons/create.png',
                text: 'Add New User',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    userInputFormWindow();
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
                    if (Ext.getCmp('user_list_grid')) {
                        Ext.getCmp('user_list_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function assignUserPasswordWindow(rec) {
    return Ext.create('Ext.window.Window', {
        title: 'Assign New Password',
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
            items: [Ext.create('Ext.form.field.Text', {
                    name: 'new_password',
                    id: 'new_password_field',
                    inputType: 'password',
                    fieldLabel: 'New Password',
                    filedAlign: 'top',
                    allowBlank: false,
                    labelAlign: 'left',
                    labelWidth: 130,
                    labelStyle: 'text-align:left;border solid 1px white;',
                    labelSeparator: '',
                    emptyText: 'Give New Password...',
                    labelClsExtra: 'some-class',
                    fieldStyle: 'text-align: left;font-size: 12px;',
                    autoScroll: true,
                    listeners: {
                        change: function(self, newValue, oldValue, eOpts) {
                            if (newValue == '') {
                                Ext.getCmp('new_password').remove(Ext.getCmp('new_password_img'));
                                Ext.getCmp('new_password').add(infoImage('new_password_img'));
                                Ext.getCmp('re_new_password_field').setValue('');
                                conf_new_pass = 0;
                            } else {
                                if (newValue.length < 8) {
                                    Ext.getCmp('new_password').remove(Ext.getCmp('new_password_img'));
                                    Ext.getCmp('new_password').add(failImage('new_password_img'));
                                    Ext.getCmp('re_new_password_field').setValue('');
                                    conf_new_pass = 0;
                                } else {
                                    Ext.getCmp('new_password').remove(Ext.getCmp('new_password_img'));
                                    Ext.getCmp('new_password').add(successImage('new_password_img'));
                                    conf_new_pass = 1;
                                }
                            }
                        }
                    }
                }),
                infoImage('new_password_img'),
                Ext.create('Ext.form.field.Text', {
                    name: 're_new_password',
                    id: 're_new_password_field',
                    inputType: 'password',
                    fieldLabel: 'Confirm New Password',
                    filedAlign: 'top',
                    allowBlank: false,
                    labelAlign: 'left',
                    labelWidth: 130,
                    labelStyle: 'text-align:left;border solid 1px white;',
                    labelSeparator: '',
                    emptyText: 'Confirm New Password...',
                    labelClsExtra: 'some-class',
                    fieldStyle: 'text-align: left;font-size: 12px;',
                    autoScroll: true,
                    listeners: {
                        change: function(self, newValue, oldValue, eOpts) {
                            if (newValue == '') {
                                Ext.getCmp('re_new_password').remove(Ext.getCmp('re_new_password_img'));
                                Ext.getCmp('re_new_password').add(infoImage('re_new_password_img'));
                                conf_renew_pass = 0;
                            } else {
                                if (newValue == Ext.getCmp('new_password_field').value) {
                                    Ext.getCmp('re_new_password').remove(Ext.getCmp('re_new_password_img'));
                                    Ext.getCmp('re_new_password').add(successImage('re_new_password_img'));
                                    conf_renew_pass = 1;
                                } else {
                                    Ext.getCmp('re_new_password').remove(Ext.getCmp('re_new_password_img'));
                                    Ext.getCmp('re_new_password').add(failImage('re_new_password_img'));
                                    conf_renew_pass = 0;
                                }
                            }
                        }
                    }
                }),
                infoImage('re_new_password_img')
            ],
            // items: [
            //   newPasswordPanel(),
            //   reNewPasswordPanel(),
            // ],
            buttons: [{
                text: 'Reset',
                handler: function() {
                    this.up('form').getForm().reset();
                }
            }, {
                text: 'Submit',
                formBind: true,
                handler: function() {
                    var win = this.up('.window');
                    var values = {};
                    values.id = rec.id;
                    values.password = Ext.getCmp('re_new_password_field').value;
                    var panel = this.up('form'),
                        form = panel.getForm();
                    if (form.isValid()) {
                        if (conf_new_pass == 1) {
                            if (conf_renew_pass == 1) {
                                socket.emit('AssignUserPassword', values).on('AssignUserPassword', function(message) {
                                    if (message == "success") {
                                        Ext.MessageBox.alert('success', 'Successfully password changed');
                                        win.close();
                                    } else {
                                        Ext.MessageBox.alert('Error', 'Something went wrong while changing password. Please try again.');
                                    }
                                });
                            } else {
                                Ext.MessageBox.alert('Password Unmatched', 'Please confirm password correctly');
                            }
                        } else {
                            Ext.MessageBox.alert('Low Password', 'Please give minimum 8 character');
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

// function assignUserPasswordForm(rec) {
//   return ;
// }