function employeeEducationListGrid(data) {
    return Ext.create('Ext.grid.Panel', {
        id: 'employee_education_list_grid' + data.id,
        title: 'EDUCATION',
        columnLines: true,
        store: {
            proxy: {
                type: 'ajax',
                url: '/education/' + data.id
            },
            autoLoad: true,
            autoSync: true,
            model: Ext.define('EDUCATION_MODEL', {
                extend: 'Ext.data.Model',
                fields: [{
                    name: 'id',
                    type: 'int'
                }, {
                    name: 'employee',
                    type: 'string',
                    mapping: 'employeeTable.name'
                }, {
                    name: 'exam_name',
                    type: 'string'
                }, {
                    name: 'major',
                    type: 'string'
                }, {
                    name: 'pass_year',
                    type: 'date'
                }, ]
            })
        },
        tools: [{
            xtype: 'button',
            text: 'Add',
            icon: '/uploads/icons/create.png',
            handler: function(event, toolEl, panel) {
                employeeEducationInputFormWindow(data);
            }
        }],
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
            header: 'EXAM NAME',
            dataIndex: 'exam_name',
            align: 'center',
            flex: 1
        }, {
            header: 'MAJOR',
            dataIndex: 'major',
            align: 'center',
            flex: 1
        }, {
            header: 'PASS YEAR',
            dataIndex: 'pass_year',
            renderer: Ext.util.Format.dateRenderer('Y'),
            align: 'center',
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
                    socket.emit('DestroyEmployeeEducation', rec.id).on('DestroyEmployeeEducation', function(message) {
                        if (message == "success") {
                            if (Ext.getCmp('employee_education_list_grid' + data.id)) {
                                Ext.getCmp('employee_education_list_grid' + data.id).getStore().load();
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
    });
}

function employeeEducationInputFormWindow(data) {
    return Ext.create('Ext.window.Window', {
        title: 'Add Education Details',
        modal: true,
        id: 'employeeEducationInputForm' + data.id,
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            id: 'employeeEducationInputForm_' + data.id,
            width: '100%',
            bodyPadding: 20,
            border: false,
            layout: {
                type: 'vbox',
                align: 'stretch' // Child items are stretched to full width
            },
            items: [],
            buttons: [{
                text: 'Reset',
                handler: function() {
                    this.up('form').getForm().reset();
                }
            }, {
                text: 'Submit',
                id: 'employeeEducationInputFormSubmitButton',
                handler: function() {

                    var panel = this.up('form'),
                        form = panel.getForm(),
                        filefield = panel.query('filefield')[0],
                        values = form.getValues();
                    if (form.isValid()) {


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