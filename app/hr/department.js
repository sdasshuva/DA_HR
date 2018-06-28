function departmentTab() {
    if (Ext.getCmp('department_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("department_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Department',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            closable: true,
            id: 'department_tab',
            autoScroll: true,
            items: [Ext.create('Ext.toolbar.Toolbar', {
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
                            departmentInputFormWindow();
                        }
                    }]
                }),
                Ext.create('Ext.grid.Panel', {
                    id: 'department_list_grid',
                    title: 'DEPARTMENT',
                    columnLines: true,
                    store: Ext.create('Ext.data.Store', {
                        proxy: {
                            type: 'ajax',
                            url: '/department'
                        },
                        autoLoad: true,
                        autoSync: true,
                        model: Ext.define('DEPARTMENT_MODEL', {
                            extend: 'Ext.data.Model',
                            fields: [{
                                name: 'id',
                                type: 'int'
                            }, {
                                name: 'name',
                                type: 'string'
                            }]
                        }),
                    }),
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
                    columns: [{
                        header: 'NAME',
                        dataIndex: 'name',
                        align: 'center',
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            return value.toUpperCase();
                        },
                        flex: 1
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
                                socket.emit('DestroyDepartment', rec.id).on('DestroyDepartment', function(message) {
                                    if (message == "success") {
                                        if (Ext.getCmp('department_list_grid')) {
                                            Ext.getCmp('department_list_grid').getStore().load();
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
                        }]
                    }]
                })
            ],
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
                    if (Ext.getCmp('department_list_grid')) {
                        Ext.getCmp('department_list_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function departmentInputFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New Department',
        modal: true,
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '100%',
            bodyPadding: 20,
            border: false,
            items: [
                newTextField('Department', 'name')
            ],
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
                        socket.emit('CreateDepartment', values).on('CreateDepartment', function(message) {
                            if (message == "success") {
                                success = true;
                                if (Ext.getCmp('department_list_grid')) {
                                    Ext.getCmp('department_list_grid').getStore().load();
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