function sectionTab() {
    if (Ext.getCmp('section_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("section_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Section',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            closable: true,
            id: 'section_tab',
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
                            sectionInputFormWindow();
                        }
                    }]
                }),
                Ext.create('Ext.grid.Panel', {
                    id: 'section_list_grid',
                    title: 'Section',
                    columnLines: true,
                    store: {
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
                                name: 'department',
                                type: 'string',
                                mapping: 'departmentTable.name'
                            }, {
                                name: 'name',
                                type: 'string'
                            }, {
                                name: 'employee_type',
                                type: 'string',
                                mapping: 'employeeTypeTable.name'
                            }, ]
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
                    autoScroll: true,
                    columns: [{
                        header: 'DEPARTMENT',
                        dataIndex: 'department',
                        align: 'center',
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            return value.toUpperCase();
                        },
                        flex: 1
                    }, {
                        header: 'NAME',
                        dataIndex: 'name',
                        align: 'center',
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            return value.toUpperCase();
                        },
                        flex: 1
                    }, {
                        header: 'EMPLOYEE TYPE',
                        dataIndex: 'employee_type',
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
                                socket.emit('DestroySection', rec.id).on('DestroySection', function(message) {
                                    if (message == "success") {
                                        if (Ext.getCmp('section_list_grid')) {
                                            Ext.getCmp('section_list_grid').getStore().load();
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
                    if (Ext.getCmp('section_list_grid')) {
                        Ext.getCmp('section_list_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function sectionInputFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New Section',
        modal: true,
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '100%',
            bodyPadding: 20,
            border: false,
            items: [
                newTextField('Section', 'name')
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
                        socket.emit('CreateSection', values).on('CreateSection', function(message) {
                            if (message == "success") {
                                success = true;
                                if (Ext.getCmp('section_list_grid')) {
                                    Ext.getCmp('section_list_grid').getStore().load();
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