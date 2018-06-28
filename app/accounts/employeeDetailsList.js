function employeeDetailsListTab() {
    if (Ext.getCmp('employee_details_list_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("employee_details_list_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Employee',
            layout: 'fit',
            closable: true,
            id: 'employee_details_list_tab',
            autoScroll: true,
            items: [
                Ext.create('Ext.grid.Panel', {
                    id: 'employee_details_list_grid',
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
                    },
                    listeners: {
                        rowclick: function(grid, row, e) {
                            var data = row.data;
                        },
                    },
                    columns: [{
                            header: 'FP ID',
                            dataIndex: 'finger_print_id',
                            align: 'center',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return addLeadingZero(9, value);
                            },
                            width: 80
                        }, {
                            header: 'FIRST NAME',
                            dataIndex: 'first_name',
                            align: 'left',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                if (value)
                                    return value.toUpperCase();
                            },
                            flex: 2
                        }, {
                            header: 'LAST NAME',
                            dataIndex: 'last_name',
                            align: 'left',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                if (value)
                                    return value.toUpperCase();
                            },
                            flex: 1
                        }, {
                            header: 'DEPARTMENT',
                            dataIndex: 'department',
                            align: 'left',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                if (value)
                                    return value.toUpperCase();
                            },
                            flex: 1.5
                        }, {
                            header: 'DESIGNATION',
                            dataIndex: 'designation',
                            align: 'left',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                if (value)
                                    return value.toUpperCase();
                            },
                            flex: 1.5
                        }, {
                            header: 'DATE OF BIRTH',
                            dataIndex: 'date_of_birth',
                            renderer: Ext.util.Format.dateRenderer('d, F Y'),
                            align: 'left',
                            flex: 1.5
                        }, {
                            header: 'DATE OF JOIN',
                            dataIndex: 'date_of_join',
                            renderer: Ext.util.Format.dateRenderer('d, F Y'),
                            align: 'left',
                            flex: 1.5
                        },
                        // {
                        //     xtype:'actioncolumn',
                        //     header: 'DEDUCTION',
                        //     align: 'center',
                        //     items: [
                        //         {
                        //             icon: '/uploads/icons/eye.png',
                        //             tooltip: 'SALARY DEDUCTION',
                        //             handler: function(grid, rowIndex, colIndex) {
                        //                 var rec = grid.getStore().getAt(rowIndex);
                        //                 salaryDeductionDetailsWindow(rec)
                        //             }
                        //         }
                        //     ],
                        //     flex: 1
                        // },
                    ]
                })
            ],
            tbar: [
                Ext.create('Ext.form.field.Number', {
                    name: 'fp_id',
                    id: 'employee_details_list_fp_id_search',
                    filedAlign: 'top',
                    allowBlank: true,
                    minValue: 1,
                    labelAlign: 'left',
                    labelStyle: 'text-align:left;border solid 1px white;',
                    labelSeparator: '',
                    emptyText: 'Give FP ID',
                    labelClsExtra: 'some-class',
                    fieldStyle: 'text-align: left;font-size: 12px;',
                    autoScroll: true,
                    listeners: {
                        change: {
                            fn: function(combo, value) {
                                if (value) {
                                    Ext.getCmp('employee_details_list_name_search').setValue('');
                                    Ext.getCmp('employee_details_list_department_search').setValue('');
                                    Ext.getCmp('employee_details_list_status_search').setValue('');
                                }
                            }
                        }
                    }
                }),
                Ext.create('Ext.form.ComboBox', {
                    id: 'employee_details_list_name_search',
                    name: 'name',
                    anyMatch: true,
                    allowBlank: true,
                    editable: true,
                    typeAhead: true,
                    transform: 'stateSelect',
                    forceSelection: true,
                    emptyText: 'Employee First Name ...',
                    fieldStyle: 'text-align: left;font-size: 12px;',
                    autoScroll: true,
                    queryMode: 'local',
                    displayField: 'first_name',
                    valueField: 'finger_print_id',
                    selectOnFocus: true,
                    triggerAction: 'all',
                    store: {
                        fields: ['finger_print_id', 'first_name'],
                        proxy: {
                            type: 'ajax',
                            url: '/user'
                        },
                        autoLoad: true,
                        autoSync: true
                    },
                    listeners: {
                        change: {
                            fn: function(combo, value) {
                                if (value) {
                                    Ext.getCmp('employee_details_list_fp_id_search').setValue('');
                                    Ext.getCmp('employee_details_list_department_search').setValue('');
                                    Ext.getCmp('employee_details_list_status_search').setValue('');
                                }
                            }
                        }
                    }
                }),
                Ext.create('Ext.form.ComboBox', {
                    id: 'employee_details_list_department_search',
                    name: 'department',
                    anyMatch: true,
                    allowBlank: true,
                    editable: true,
                    typeAhead: true,
                    transform: 'stateSelect',
                    forceSelection: true,
                    emptyText: 'Department ...',
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
                                if (value) {
                                    Ext.getCmp('employee_details_list_fp_id_search').setValue('');
                                    Ext.getCmp('employee_details_list_name_search').setValue('');
                                    Ext.getCmp('employee_details_list_status_search').setValue('');
                                }
                            }
                        }
                    }
                }), {
                    xtype: 'button',
                    icon: '/uploads/icons/search.png',
                    text: 'SEARCH',
                    border: 1,
                    style: {
                        borderColor: 'blue',
                        borderStyle: 'solid'
                    },
                    handler: function() {
                        var param = {};
                        var em;
                        if (Ext.getCmp('employee_details_list_fp_id_search').value)
                            param.employee = Ext.getCmp('employee_details_list_fp_id_search').value;
                        else if (Ext.getCmp('employee_details_list_name_search').value)
                            param.employee = Ext.getCmp('employee_details_list_name_search').value;
                        else if (Ext.getCmp('employee_details_list_department_search').value)
                            param.department = Ext.getCmp('employee_details_list_department_search').value;
                        else if (Ext.getCmp('employee_details_list_status_search').value)
                            param.status = Ext.getCmp('employee_details_list_status_search').value;
                        if (param.employee || param.department || param.status) {
                            Ext.getCmp('employee_details_list_grid').setLoading(true);
                            Ext.getCmp('employee_details_list_grid').getStore().load({
                                params: param,
                                callback: function(records, operation, success) {
                                    Ext.getCmp('employee_details_list_grid').setLoading(false);
                                },
                                scope: this
                            });
                        } else {
                            Ext.MessageBox.alert('Error', 'Give id or employee name');
                        }
                    }
                }
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
                    if (Ext.getCmp('employee_details_list_grid')) {
                        Ext.getCmp('employee_details_list_grid').getStore().load();
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}