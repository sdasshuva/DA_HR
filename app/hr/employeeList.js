function employeeListTab() {
    if (Ext.getCmp('employee_list_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("employee_list_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Employee',
            layout: 'fit',
            closable: true,
            id: 'employee_list_tab',
            autoScroll: true,
            items: [
                employeeListGrid()
            ],
            tbar: [{
                xtype: 'button',
                icon: '/uploads/icons/create.png',
                text: 'Add New',
                border: 1,
                disabled: true,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    employeeInputFormWindow();
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
                    if (Ext.getCmp('employee_list_grid')) {
                        Ext.getCmp('employee_list_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}


function employeeListGrid() {
    var statusChange = false;
    var departmentChange = false;
    var designationChange = false;
    return Ext.create('Ext.grid.Panel', {
        id: 'employee_list_grid',
        loadMask: true,
        autoScroll: true,
        //selType: 'cellmodel',
        columnLines: true,
        store: {
            proxy: {
                type: 'ajax',
                url: '/employee'
            },
            autoLoad: true,
            autoSync: true,
            model: Ext.define('EMPLOYEE_MODEL', {
                extend: 'Ext.data.Model',
                fields: [{
                    name: 'id',
                    type: 'int',
                    mapping: 'employee.id'
                }, {
                    name: 'card_no',
                    type: 'int',
                    mapping: 'employee.userTable.card_no'
                }, {
                    name: 'finger_print_id',
                    type: 'int',
                    mapping: 'employee.userTable.finger_print_id'
                }, {
                    name: 'first_name',
                    type: 'string',
                    mapping: 'employee.userTable.first_name'
                }, {
                    name: 'last_name',
                    type: 'string',
                    mapping: 'employee.userTable.last_name'
                }, {
                    name: 'access_level',
                    type: 'string',
                    mapping: 'employee.userTable.access_level'
                }, {
                    name: 'email',
                    type: 'string',
                    mapping: 'employee.userTable.email'
                }, {
                    name: 'photo',
                    type: 'string',
                    mapping: 'employee.photo'
                }, {
                    name: 'designation',
                    type: 'string',
                    mapping: 'employee.designationTable.name'
                }, {
                    name: 'department',
                    type: 'string',
                    mapping: 'employee.departmentTable.name'
                }, {
                    name: 'working_place',
                    type: 'string',
                    mapping: 'employee.workingPlaceTable.name'
                }, {
                    name: 'section',
                    type: 'string',
                    mapping: 'employee.sectionTable.name'
                }, {
                    name: 'employee_type',
                    type: 'string',
                    mapping: 'employee.employeeTypeTable.name'
                }, {
                    name: 'date_of_birth',
                    type: 'date',
                    mapping: 'employee.date_of_birth'
                }, {
                    name: 'date_of_join',
                    type: 'date',
                    mapping: 'employee.date_of_join'
                }, {
                    name: 'date_of_release',
                    type: 'date',
                    mapping: 'employee.date_of_release'
                }, {
                    name: 'referer',
                    type: 'string',
                    mapping: 'employee.refererTable.name'
                }, {
                    name: 'referer_address',
                    type: 'string',
                    mapping: 'employee.refererTable.address'
                }, {
                    name: 'referer_contact_no',
                    type: 'string',
                    mapping: 'employee.refererTable.contact_no'
                }, {
                    name: 'national_id',
                    type: 'int',
                    mapping: 'employee.national_id'
                }, {
                    name: 'religion',
                    type: 'string',
                    mapping: 'employee.religionTable.name'
                }, {
                    name: 'marital_status',
                    type: 'int',
                    mapping: 'employee.marital_status'
                }, {
                    name: 'contact_no',
                    type: 'string',
                    mapping: 'employee.contact_no'
                }, {
                    name: 'blood_group',
                    type: 'string',
                    mapping: 'employee.bloodGroupTable.name'
                }, {
                    name: 'remarks',
                    type: 'string',
                    mapping: 'employee.remarks'
                }, {
                    name: 'duty_shift',
                    type: 'string',
                    mapping: 'employee.dutyShiftTable.name'
                }, {
                    name: 'work_time',
                    type: 'string',
                    mapping: 'employee.workTimeTable.in_time'
                }, {
                    name: 'status',
                    type: 'string',
                    mapping: 'employee.statusTable.status'
                }, {
                    name: 'payment_method',
                    type: 'string',
                    mapping: 'employee.payment_method'
                }, {
                    name: 'sl',
                    type: 'string',
                }, {
                    name: 'cl',
                    type: 'string',
                }, ]
            })
        },
        viewConfig: {
            emptyText: 'No records',
            autoDestroy: false
                /*getRowClass: function(record) { 
                    return record.get('status') < 18 ? 'child-row' : 'adult-row'; 
                }*/
        },
        listeners: {
            rowclick: function(grid, row, e) {
                var data = row.data;
            },
            afterrender: function(self, eOpts) {
                var manual = {
                    xtype: 'actioncolumn',
                    header: 'MANUAL',
                    flex: 0.5,
                    align: 'center',
                    items: [{
                        icon: '/uploads/icons/add.png',
                        tooltip: 'MANUAL',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            employeeManualAttendanceFormWindow(rec)
                        }
                    }]
                };
                if (parseInt(user.access_level) == 0) {
                    self.headerCt.add(manual);
                }
            }
        },
        plugins: [
            cellEditPlugin()
        ],
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
                header: 'NAME',
                dataIndex: 'first_name',
                align: 'left',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return record.get('first_name') + ' ' + record.get('last_name');
                },
                flex: 1
            }, {
                header: 'DESIGNATION',
                dataIndex: 'designation',
                align: 'left',
                field: {
                    xtype: 'combo',
                    name: 'designation',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Select Designation...',
                    autoScroll: true,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    selectOnFocus: true,
                    selectOnTab: true,
                    triggerAction: 'all',
                    lazyRender: true,
                    store: {
                        fields: ['id', 'name'],
                        proxy: {
                            type: 'ajax',
                            url: '/designation'
                        },
                        autoLoad: true,
                        autoSync: true
                    },
                    listeners: {
                        blur: function(self, event, eOpts) {
                            var row = Ext.getCmp('employee_list_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.designation = self.value;
                            if (designationChange) {
                                socket.emit('UpdateEmployeeDesignation', data).on('UpdateEmployeeDesignation', function(message) {
                                    if (message == "success") {
                                        if (Ext.getCmp('employee_list_grid')) {
                                            Ext.getCmp('employee_list_grid').getStore().load();
                                        }
                                    } else if (message == "error") {
                                        Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        },
                        change: function(self, newValue, oldValue, eOpts) {
                            if (parseInt(newValue) > 0 && newValue != oldValue) {
                                designationChange = true;
                            } else {
                                designationChange = false;
                            }
                        },
                    }
                },
                flex: 0.8
            }, {
                header: 'DEPARTMENT',
                dataIndex: 'department',
                align: 'left',
                field: {
                    xtype: 'combo',
                    name: 'department',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Select Department...',
                    autoScroll: true,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    selectOnFocus: true,
                    selectOnTab: true,
                    triggerAction: 'all',
                    lazyRender: true,
                    store: {
                        fields: ['id', 'name'],
                        proxy: {
                            type: 'ajax',
                            url: '/department'
                        },
                        autoLoad: true,
                        autoSync: true
                    },
                    listeners: {
                        change: function(self, newValue, oldValue, eOpts) {
                            if (parseInt(newValue) > 0 && newValue != oldValue) {
                                departmentChange = true;
                            } else {
                                departmentChange = false;
                            }
                        },
                        blur: function(self, event, eOpts) {
                            var row = Ext.getCmp('employee_list_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.department = self.value;
                            if (departmentChange) {
                                socket.emit('UpdateEmployeeDepartment', data).on('UpdateEmployeeDepartment', function(message) {
                                    if (message == "success") {
                                        if (Ext.getCmp('employee_list_grid')) {
                                            Ext.getCmp('employee_list_grid').getStore().load();
                                        }
                                    } else if (message == "error") {
                                        Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                flex: 0.8
            },
            /*
            {
                header: 'EMP. TYPE',
                dataIndex: 'employee_type',
                align: 'left',
                field: {
                    xtype: 'combo',
                    name: 'employee_type',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Select Employee Type...',
                    autoScroll: true,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    selectOnFocus: true,
                    selectOnTab: true,
                    triggerAction: 'all',
                    lazyRender: true,
                    store: {
                        fields: ['id', 'name'],
                        proxy: {
                            type: 'ajax',
                            url: '/employee_type'
                        },
                        autoLoad: true,
                        autoSync: true
                    },
                    listeners: {
                        blur: function ( self, event, eOpts ){
                            var row = Ext.getCmp('employee_list_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.employee_type = self.value;
                            if (self.value){
                                socket.emit('UpdateEmployeeType', data).on('UpdateEmployeeType', function (message) {
                                    if (message == "success") {
                                        if(Ext.getCmp('employee_list_grid')){
                                            Ext.getCmp('employee_list_grid').getStore().load();
                                        }
                                    } else if(message == "error") {
                                        Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                flex: 0.8
            },*/
            {
                header: 'DATE OF BIRTH',
                dataIndex: 'date_of_birth',
                renderer: Ext.util.Format.dateRenderer('d, F Y'),
                align: 'left',
                editor: {
                    xtype: 'datefield',
                    editable: false,
                    listeners: {
                        change: function(self, newValue, oldValue, eOpts) {
                            var row = Ext.getCmp('employee_list_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            var date = new Date(newValue);
                            var d = date.getDate();
                            var m = date.getMonth();
                            var y = date.getFullYear();
                            data.date_of_birth = new Date(Date.UTC(y, m, d, 00, 00, 00));
                            if (newValue != oldValue) {
                                socket.emit('UpdateEmployeeDateOfBirth', data).on('UpdateEmployeeDateOfBirth', function(message) {
                                    if (message == "success") {
                                        if (Ext.getCmp('employee_list_grid')) {
                                            Ext.getCmp('employee_list_grid').getStore().load();
                                        }
                                    } else if (message == "error") {
                                        Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                flex: 0.8
            }, {
                header: 'DATE OF JOIN',
                dataIndex: 'date_of_join',
                renderer: Ext.util.Format.dateRenderer('d, F Y'),
                align: 'left',
                editor: {
                    xtype: 'datefield',
                    editable: false,
                    listeners: {
                        change: function(self, newValue, oldValue, eOpts) {
                            var row = Ext.getCmp('employee_list_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            var date = new Date(newValue);
                            var d = date.getDate();
                            var m = date.getMonth();
                            var y = date.getFullYear();
                            data.date_of_join = new Date(Date.UTC(y, m, d, 00, 00, 00));
                            if (newValue != oldValue) {
                                socket.emit('UpdateEmployeeDateOfJoin', data).on('UpdateEmployeeDateOfJoin', function(message) {
                                    if (message == "success") {
                                        if (Ext.getCmp('employee_list_grid')) {
                                            Ext.getCmp('employee_list_grid').getStore().load();
                                        }
                                    } else if (message == "error") {
                                        Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                flex: 0.8
            },
            /*{
                header: 'STATUS',
                dataIndex: 'status',
                align: 'center',
                renderer: function(val, meta, record){
                    if(parseInt(val)==0)
                        return 'REGULAR';
                    else if(parseInt(val)==1)
                        return 'SUSPEND';
                },
                field: {
                    xtype: 'combo',
                    name: 'status',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Select Status...',
                    autoScroll: true,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    selectOnFocus: true,
                    selectOnTab: true,
                    triggerAction: 'all',
                    lazyRender: true,
                    store: {
                        fields: ['id', 'name'],
                        data: [
                            {id: 0, name: 'REGULAR'},
                            {id: 1, name: 'SUSPEND'}
                        ]
                        //autoLoad: true,
                        //autoSync: true
                    },
                    listeners: {
                        change: function ( self, newValue, oldValue, eOpts ){
                            if (parseInt(newValue)>=0&&newValue!=oldValue){
                                statusChange = true;
                            }else{
                                statusChange = false;
                            }
                        },
                        blur: function ( self, event, eOpts ){
                            var row = Ext.getCmp('employee_list_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.status = self.value;
                            console.log(row)
                            console.log(self.value)
                            if (statusChange){
                                socket.emit('UpdateEmployeeStatus', data).on('UpdateEmployeeStatus', function (message) {
                                    if (message == "success") {
                                        if(Ext.getCmp('employee_list_grid')){
                                            Ext.getCmp('employee_list_grid').getStore().load();
                                        }
                                    } else if(message == "error") {
                                        Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                flex: 0.6
            },
            {
                xtype:'actioncolumn',
                header: 'MANUAL',
                flex: 0.5,
                align: 'center',
                items: [
                    {
                        icon: '/uploads/icons/add.png',
                        tooltip: 'MANUAL',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            employeeManualAttendanceFormWindow(rec)
                        }
                    }
                ]
            },
            {
                xtype:'actioncolumn',
                header: ' ',
                width:25,
                align: 'left',
                items: [
                    {
                        icon: '/uploads/icons/eye.png',
                        tooltip: 'Approve',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex).data;
                            viewEmployeeDetailsWindow(rec);
                        }
                    }
                ]
            },
            {
                xtype:'actioncolumn',
                header: ' ',
                width:25,
                align: 'left',
                items: [
                    {
                        icon: '/uploads/icons/delete.png',
                        tooltip: 'Delete',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            socket.emit('DestroyEmployee', rec.id).on('DestroyEmployee', function (message) {
                              if (message == "success") {
                                if(Ext.getCmp('employee_list_grid')){
                                  Ext.getCmp('employee_list_grid').getStore().load();
                                }
                                Ext.MessageBox.alert('success', 'Successfully data deleted');
                              } else if(message == "error") {
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
                ]
            }*/
        ]
    });
}


function employeeInputFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Employee Profile',
        modal: true,
        id: 'employeeInputFormWindow',
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
                id: 'employeeInputForm',
                width: '100%',
                bodyPadding: 20,
                border: false,
                layout: {
                    type: 'vbox',
                    align: 'stretch' // Child items are stretched to full width
                },
                items: [
                    employeeNameTextField(),
                    employeePhotoFileField(),
                    employeeDesignationCombo(),
                    employeeDepartmentCombo(),
                    employeeSectionCombo(),
                    employeeWorkingPlaceCombo(),
                    employeeTypeCombo(),
                    employeeDateOfBirth(),
                    employeeDateOfJoin(),
                    employeeDateOfRelease()
                ],
                buttons: [{
                    text: 'Reset',
                    handler: function() {
                        this.up('form').getForm().reset();
                    }
                }, {
                    text: 'Submit',
                    id: 'employeeInputFormSubmitButton',
                    handler: function() {
                        var panel = this.up('form'),
                            form = panel.getForm(),
                            filefield = panel.query('filefield')[0],
                            values = form.getValues();
                        if (form.isValid()) {
                            form.submit({
                                url: '/CreateEmployee',
                                waitMsg: 'Uploading your Audio file...',
                                success: function(fp, o) {
                                    msg('Success', 'Processed file "' + o.result.file + '" on the server');
                                }
                            });
                        }
                    }
                }, {
                    text: 'Close',
                    handler: function() {
                        this.up('.window').close();
                    }
                }]
            })
        ]
    }).show();
}

function employeeManualAttendanceFormWindow(rec) {
    return Ext.create('Ext.window.Window', {
        title: 'Employee Manual Attendance',
        modal: true,
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '100%',
            bodyPadding: 20,
            border: false,
            items: [
                newDateField('Manual Date', 'date'), {
                    xtype: 'timefield',
                    name: 'time',
                    editable: false,
                    allowBlank: false,
                    fieldLabel: 'Manual Time',
                    emptyText: 'Give Manual Time...',
                    format: 'h:i:s A',
                    minValue: Ext.Date.parse('09:00:00 AM', 'h:i:s A'),
                    maxValue: Ext.Date.parse('06:00:00 PM', 'h:i:s A'),
                    increment: 0.1,
                    anchor: '100%'
                }
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
                    var date = new Date(values.date);
                    var d = date.getDate();
                    var m = date.getMonth();
                    var y = date.getFullYear();
                    var time = values.time.split(":");
                    values.punch_time = new Date(Date.UTC(y, m, d, parseInt(time[0]), parseInt(time[1]), 00));
                    values.employee = rec.id;
                    values.type = 1;
                    if (form.isValid()) {
                        socket.emit('CreateEmployeeManualPunch', values).on('CreateEmployeeManualPunch', function(message) {
                            if (message == "success") {
                                success = true;
                                if (Ext.getCmp('employee_type_list_grid')) {
                                    Ext.getCmp('employee_type_list_grid').getStore().load();
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


function employeeNameTextField() {
    return Ext.create('Ext.form.field.Text', {
        name: 'name',
        id: 'employee_name_input_form_text_field',
        fieldLabel: 'Employee Name' +
            '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
        filedAlign: 'top',
        allowBlank: false,
        width: 300,
        labelWidth: 120,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give Employee Name...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });
}

function employeePhotoFileField() {
    return Ext.create('Ext.form.field.File', {
        name: 'photo',
        id: 'employee_photo_input_form_file_field',
        fieldLabel: 'Photo' +
            '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
        filedAlign: 'top',
        allowBlank: false,
        width: 300,
        labelWidth: 120,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give Photo...',
        clearOnSubmit: false,
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        buttonText: 'B',
        buttonConfig: {
            //'background-image': 'url(uploads/images/logo.png) !important',
        },
        /*listeners: {
            change: function (filefield, value) {
                'use strict';
                var newValue = value.replace(/(^.*(\\|\/))?/, "");
                filefield.setRawValue(newValue);
            }
        },*/
        //draggable: true,
        autoScroll: true
    });
}

function employeeDesignationCombo() {
    return Ext.create('Ext.form.ComboBox', {
        id: 'employee_designation_input_form_combo_box',
        fieldLabel: 'Designation',
        name: 'designation',
        allowBlank: true,
        editable: false,
        labelAlign: 'left',
        labelSeparator: '',
        emptyText: 'Select Employee Designation ...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
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
                url: '/designation'
            },
            autoLoad: true,
            autoSync: true
        },
        listeners: {
            change: {
                fn: function(combo, value) {
                    //console.log(value)
                }
            }
        }
    });
}

function employeeDepartmentCombo() {
    return Ext.create('Ext.form.ComboBox', {
        id: 'employee_department_input_form_combo_box',
        fieldLabel: 'Department' +
            '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
        name: 'department',
        allowBlank: false,
        editable: false,
        labelAlign: 'left',
        labelSeparator: '',
        emptyText: 'Select Employee Department ...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
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
                url: '/department'
            },
            autoLoad: true,
            autoSync: true
        },
        listeners: {
            change: {
                fn: function(combo, value) {
                    //console.log(value)
                }
            }
        }
    });
}

function employeeSectionCombo() {
    return Ext.create('Ext.form.ComboBox', {
        id: 'employee_section_input_form_combo_box',
        fieldLabel: 'Section',
        name: 'section',
        allowBlank: true,
        editable: false,
        labelAlign: 'left',
        labelSeparator: '',
        emptyText: 'Select Employee Section ...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
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
            change: {
                fn: function(combo, value) {
                    //console.log(value)
                }
            }
        }
    });
}

function employeeWorkingPlaceCombo() {
    return Ext.create('Ext.form.ComboBox', {
        id: 'employee_working_place_input_form_combo_box',
        fieldLabel: 'Work Place',
        name: 'working_place',
        allowBlank: true,
        editable: false,
        labelAlign: 'left',
        labelSeparator: '',
        emptyText: 'Select Employee Department ...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
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
                url: '/working_place'
            },
            autoLoad: true,
            autoSync: true
        },
        listeners: {
            change: {
                fn: function(combo, value) {
                    //console.log(value)
                }
            }
        }
    });
}

function employeeTypeCombo() {
    return Ext.create('Ext.form.ComboBox', {
        id: 'employee_type_input_form_combo_box',
        fieldLabel: 'Employee Type',
        name: 'employee_type',
        allowBlank: true,
        editable: false,
        labelAlign: 'left',
        labelSeparator: '',
        emptyText: 'Select Employee Type ...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
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
        listeners: {
            change: {
                fn: function(combo, value) {
                    //console.log(value)
                }
            }
        }
    });
}

function employeeDateOfBirth() {
    return Ext.create('Ext.form.field.Date', {
        name: 'date_of_birth',
        id: 'employee_date_of_birth_input_form_date_field',
        fieldLabel: 'Date of Birth',
        filedAlign: 'top',
        allowBlank: true,
        editable: false,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give Date of Birth...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });
}

function employeeDateOfJoin() {
    return Ext.create('Ext.form.field.Date', {
        name: 'date_of_join',
        id: 'employee_date_of_join_input_form_date_field',
        fieldLabel: 'Date of Join',
        filedAlign: 'top',
        allowBlank: true,
        editable: false,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give Date of Join...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });
}

function employeeDateOfRelease() {
    return Ext.create('Ext.form.field.Date', {
        name: 'date_of_release',
        id: 'employee_date_of_release_input_form_date_field',
        fieldLabel: 'Date of Release',
        filedAlign: 'top',
        allowBlank: true,
        editable: false,
        width: 300,
        labelWidth: 120,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give Date of Release...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true
    });
}


function viewEmployeeDetailsWindow(data) {
    return Ext.create('Ext.window.Window', {
        title: 'Employee Profile',
        modal: true,
        id: 'viewEmployeeDetailsWindow' + data.id,
        layout: 'fit',
        items: [Ext.create('Ext.panel.Panel', {
            id: 'viewEmployeeDetailsPanel' + data.id,
            width: '80%',
            height: 500,
            layout: 'fit',
            border: false,
            autoScroll: true,
            items: [Ext.create('Ext.panel.Panel', {
                    id: 'viewEmployeePersonalDetailsPanel' + data.id,
                    html: '<p style="text-align: center;margin-top: 0;padding-top:0;margin-bottom: 0;padding-bottom:0;"><img width="250" alt="" src="/uploads/images/logo.png" style="float: center;" /></p>' +
                        '<h3 style="text-align: center;margin-top: 0;padding-top:0;margin-bottom: 0;padding-bottom:0;"><u>EMPLOYEE PROFILE</u></h3>' +
                        '<table><col width="120"><col width="350"><col width="200">' +
                        '<tbody>' +
                        '<tr>' +
                        '<td style="text-align: right;">' +
                        '<p><b>Card No: </b></p>' +
                        '</td>' +
                        '<td>' +
                        '<p><span style="font-weight: 400;">' +
                        data.card_no +
                        '</span></p>' +
                        '</td>' +
                        '<td>' +
                        '<p><b>Status: </b>Active</p>' +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="text-align: right;">' +
                        '<p><b>Name: </b></p>' +
                        '</td>' +
                        '<td>' +
                        '<p><span style="font-weight: 400;">' +
                        data.name +
                        '</span></p>' +
                        '</td>' +
                        '<td rowspan="5"><img width="200" alt="" src="/uploads/images/profile/' +
                        data.photo +
                        '" style="float: left;" /></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="text-align: right;">' +
                        '<p><b>Designation: </b></p>' +
                        '</td>' +
                        '<td>' +
                        '<p><span style="font-weight: 400;">' +
                        data.designationTable.name +
                        '</span></p>' +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="text-align: right;">' +
                        '<p><b>Department: </b></p>' +
                        '</td>' +
                        '<td>' +
                        '<p><span style="font-weight: 400;">' +
                        data.departmentTable.name +
                        '</span></p>' +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="text-align: right;">' +
                        '<p><b>Section: </b></p>' +
                        '</td>' +
                        '<td>' +
                        '<p><span style="font-weight: 400;">' +
                        data.sectionTable.name +
                        '</span></p>' +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="text-align: right;">' +
                        '<p><b>Work Place: </b></p>' +
                        '</td>' +
                        '<td>' +
                        '<p><span style="font-weight: 400;">' +
                        data.workingPlaceTable.name +
                        '</span></p>' +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="text-align: right;">' +
                        '<p><b>Employee Type: </b></p>' +
                        '</td>' +
                        '<td>' +
                        '<p><span style="font-weight: 400;">' +
                        data.employeeTypeTable.name +
                        '</span></p>' +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="text-align: right;">' +
                        '<p><b>Date of Birth: </b></p>' +
                        '</td>' +
                        '<td>' +
                        '<p><span style="font-weight: 400;">' +
                        new Date(data.date_of_birth).getDate() + '/' + new Date(data.date_of_birth).getMonth() + '/' + new Date(data.date_of_birth).getFullYear() +
                        '</span></p>' +
                        '</td>' +
                        '<td>' +
                        '<p><b>Age: </b></p>' +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="text-align: right;">' +
                        '<p><b>Date of Join: </b></p>' +
                        '</td>' +
                        '<td>' +
                        '<p><span style="font-weight: 400;">' +
                        new Date(data.date_of_join).getDate() + '/' + new Date(data.date_of_join).getMonth() + '/' + new Date(data.date_of_join).getFullYear() +
                        '</span></p>' +
                        '</td>' +
                        '<td>&nbsp;</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="text-align: right;">' +
                        '<p><b>Date of Release: </b></p>' +
                        '</td>' +
                        '<td>' +
                        '<p><span style="font-weight: 400;">' +
                        //(data.date_of_release==null) ? "Too young":"Old enough"+
                        '</span></p>' +
                        '</td>' +
                        '<td>&nbsp;</td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>'
                        /*items: [
                          //brandToolBar(),
                          //brandGrid()
                        ]*/
                })
                //brandGrid()
            ]
        })],
        buttons: [{
            text: 'Close',
            handler: function() {
                this.up('.window').close();
            }
        }],
    }).show();
}

function userAttendanceSummaryPanel(records) {
    var data = records[records.length - 1].data;
    var p = parseInt(data.present);
    var present = '<b>:</b> ' + addLeadingZero(2, data.present) + '';
    var a = parseInt(data.absent);
    var absent = '<b>:</b> ' + addLeadingZero(2, data.absent) + '';
    var l = parseInt(data.late);
    var late = '<b>:</b> ' + addLeadingZero(2, data.late) + '';
    var w = parseInt(data.weekend);
    var weekend = '<b>:</b> ' + addLeadingZero(2, data.weekend) + '';
    var h = parseInt(data.holiday);
    var holiday = '<b>:</b> ' + addLeadingZero(2, data.holiday) + '';
    var total_day = p + a + l + w + h;
    var total_days = '<b>:</b> ' + addLeadingZero(2, total_day);
    var item_boder = false;
    var value_padding = '3 10';
    var fp_id = data.finger_print_id;
    var name = data.name;
    var email = data.email;
    var card_no = data.card_no;
    return Ext.create('Ext.panel.Panel', {
        id: 'user_attendance_summary_panel',
        width: '100%',
        layout: {
            type: 'table',
            columns: 6
        },
        padding: 20,
        border: false,
        items: [
            ///////////////////////////ROW1////////////////////////////////////
            ///////////////////////////COL1////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>PRESENT</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: present,
            },
            ///////////////////////////COL2////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>FP ID:</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: fp_id,
            },
            ///////////////////////////COL3////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>DEPARTMENT:</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: data.department.toUpperCase(),
            },

            ///////////////////////////ROW2////////////////////////////////////
            ///////////////////////////COL1////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>ABSENT</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: absent,
            },
            ///////////////////////////COL2////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>CARD NO:</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: card_no,
            },
            ///////////////////////////COL3////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>DESIGNATION:</b>'
            }, {
                border: item_boder,
                width: 300,
                padding: value_padding,
                html: data.designation.toUpperCase(),
            },


            ///////////////////////////ROW3////////////////////////////////////
            ///////////////////////////COL1////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>LATE</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: late,
            },
            ///////////////////////////COL2////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>NAME:</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: name,
            },
            ///////////////////////////COL3////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: ''
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: '',
            },


            ///////////////////////////ROW4////////////////////////////////////
            ///////////////////////////COL1////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>WEEKEND</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: weekend,
            },
            ///////////////////////////COL2////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>EMAIL:</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: email,
            },
            ///////////////////////////COL3////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: ''
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: '',
            },


            ///////////////////////////ROW4////////////////////////////////////
            ///////////////////////////COL1////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>HOLIDAYS</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: holiday,
            },
            ///////////////////////////COL2////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>DATE OF JOIN:</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: new Date(data.date_of_join).formatDate(),
            },
            ///////////////////////////COL3////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: ''
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: '',
            },


            ///////////////////////////ROW5////////////////////////////////////
            ///////////////////////////COL1////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                html: '<b>TOTAL</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                html: total_days,
            },
            ///////////////////////////COL2////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                //html:'<b>Email:</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                //html: email,
            },
            ///////////////////////////COL3////////////////////////////////////
            {
                border: item_boder,
                width: 100,
                //html:'<b>Email:</b>'
            }, {
                border: item_boder,
                width: 200,
                padding: value_padding,
                //html: email,
            },

        ]
    });
}


function employeeRefererInfoPanel(data) {
    return Ext.create('Ext.panel.Panel', {
        title: 'REFERER INFO',
        width: 600,
        layout: {
            type: 'table',
            // The total column count must be specified here
            columns: 4
        },
        tools: [{
            xtype: 'button',
            text: 'Edit',
            icon: '/uploads/icons/edit_s.png',
            handler: function(event, toolEl, panel) {
                //console.log(panel);
            }
        }],
        bodyStyle: 'padding-left:30px; padding-right:30px;padding-top:20px;padding-bottom:0px;',
        id: 'employeeRefererInfoPanel' + data.id,
        defaults: {
            // applied to each contained panel
            bodyStyle: 'padding-left:8px;padding-right:8px;',
            border: false
        },
        items: [{
                html: '<b>Referer Name. : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 150,
                flex: 1
            }, {
                html: data.referer,
                height: 30,
                width: 280
            }, {
                html: '<b>Contact No. : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 100,
                flex: 0.5
            }, {
                html: data.referer_contact_no,
                height: 30,
                width: 100
            },

            {
                html: '<b>Address : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 150,
                flex: 1
            }, {
                html: data.address,
                height: 30,
                width: 280,
                colspan: 3
            }

        ],
        renderTo: Ext.getBody()
    });
}

function employeeBasicDetailsPanel(data) {
    return Ext.create('Ext.panel.Panel', {
        title: 'BASIC INFO',
        width: 600,
        layout: {
            type: 'table',
            // The total column count must be specified here
            columns: 4
        },
        tools: [{
            xtype: 'button',
            text: 'Edit',
            icon: '/uploads/icons/edit_s.png',
            handler: function(event, toolEl, panel) {
                //console.log(panel);
            }
        }],
        bodyStyle: 'padding-left:30px; padding-right:30px;padding-top:20px;padding-bottom:0px;',
        id: 'employeeBasicDetailsPanel' + data.id,
        defaults: {
            // applied to each contained panel
            bodyStyle: 'padding-left:8px;padding-right:8px;',
            border: false
        },
        items: [
            /*
      {
        html: '<h2>'+data.name+'`s Profile</h2>',
        bodyStyle: 'text-align: center',
        style:{
          textAlign:'center',
        },
        colspan: 4
      },

      {
        html: '<h3><u>Basic Info:</u></h3>',
        bodyStyle: 'text-align: left',
        colspan: 4
      },
*/
            {
                html: '<b>ID No. : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 150,
                flex: 1
            }, {
                html: data.id,
                height: 30,
                width: 280
            }, {
                html: '<b>Status : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 100,
                flex: 0.5
            }, {
                html: '',
                height: 30,
            },

            {
                html: '<b>Card No. : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 150,
                flex: 1
            }, {
                html: data.card_no,
                height: 30,
                flex: 3
            }, {
                html: '<b>Photo : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 100,
                flex: 0.5
            }, {
                html: '<img width="160" alt="" src="/uploads/images/profile/' + data.photo + '" />',
                height: 30 * 6,
                rowspan: 6
            },

            {
                html: '<b>Name : </b>',
                bodyStyle: 'text-align: right',
                height: 30,
                width: 150,
                flex: 1
            }, {
                html: data.name,
                height: 30,
                flex: 3
            }, {
                html: '',
                height: 30 * 5,
                flex: 0.5,
                rowspan: 5
            },

            {
                html: '<b>Designation : </b>',
                height: 30,
                width: 150,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.designation,
                height: 30,
                flex: 3
            }, {
                html: '<b>Department : </b>',
                height: 30,
                width: 150,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.department,
                height: 30,
                flex: 3
            }, {
                html: '<b>Section : </b>',
                height: 30,
                width: 150,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.section,
                height: 30,
                flex: 3
            }, {
                html: '<b>Employee Type : </b>',
                height: 30,
                width: 150,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.employee_type,
                height: 30,
                flex: 3
            },

            {
                html: '<b>Date of Birth : </b>',
                height: 30,
                width: 150,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.date_of_birth,
                height: 30,
                flex: 3
            }, {
                html: '<b>Age : </b>',
                height: 30,
                width: 100,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: '',
                height: 30,
                flex: 3
            },

            {
                html: '<b>Date of Join : </b>',
                height: 30,
                width: 150,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.date_of_join,
                height: 30,
                flex: 3
            }, {
                html: '<b>Religion : </b>',
                height: 30,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.religion,
                height: 30,
                flex: 3
            },

            {
                html: '<b>Date of Release : </b>',
                height: 30,
                width: 150,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.date_of_release,
                height: 30,
                flex: 3
            }, {
                html: '<b>Marital Status : </b>',
                height: 30,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: (data.marital_status == 1) ? 'Married' : 'Unmarried',
                height: 30,
                flex: 3
            },

            {
                html: '<b>National ID No. : </b>',
                height: 30,
                width: 150,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.national_id,
                height: 30,
                flex: 3
            }, {
                html: '<b>Contact No. : </b>',
                height: 30,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.contact_no,
                height: 30,
                flex: 3
            },

            {
                html: '<b>Blood Group : </b>',
                height: 30,
                width: 150,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.blood_group,
                height: 30,
                flex: 3
            }, {
                html: '<b>Duty Shift : </b>',
                height: 30,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.duty_shift,
                height: 30,
                flex: 3
            }, {
                html: '<b>Status : </b>',
                height: 30,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.status,
                height: 30,
                flex: 3
            },

            {
                html: '<b>Remarks : </b>',
                height: 30,
                width: 150,
                bodyStyle: 'text-align: right',
                flex: 1
            }, {
                html: data.remarks,
                height: 30,
                flex: 3,
                colspan: 4
            },

            /*
                  {
                    html: '<h3><u>Education:</u></h3>',
                    bodyStyle: 'text-align: left',
                    colspan: 4
                  },
            */
        ],
        renderTo: Ext.getBody()
    });
}