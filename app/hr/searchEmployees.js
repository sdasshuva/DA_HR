function searchEmployeesTab() {
    if (Ext.getCmp('search_employees_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("search_employees_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Search Employees',
            layout: 'fit',
            closable: true,
            id: 'search_employees_tab',
            autoScroll: true,
            items: [
                searchEmployeesGrid()
            ],
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function searchEmployeesGrid() {
    var store = Ext.create('Ext.data.Store', {
        pageSize: 30,
        remoteSort: true,
        //autoLoad: true,
        //autoSync: true,
        proxy: {
            type: 'ajax',
            url: '/search_employee_list',
            reader: {
                root: 'data',
                totalProperty: 'count'
            },
            simpleSortMode: true
        },
        sorters: [{
            property: 'id',
            direction: 'ASC'
        }],
        model: Ext.define('SEARCH_EMPLOYEE_MODEL', {
            extend: 'Ext.data.Model',
            fields: [{
                    name: 'id',
                    type: 'int',
                    mapping: 'id'
                }, {
                    name: 'card_no',
                    type: 'int',
                    mapping: 'userTable.card_no'
                }, {
                    name: 'finger_print_id',
                    type: 'int',
                    mapping: 'userTable.finger_print_id'
                }, {
                    name: 'first_name',
                    type: 'string',
                    mapping: 'userTable.first_name'
                }, {
                    name: 'last_name',
                    type: 'string',
                    mapping: 'userTable.last_name'
                }, {
                    name: 'name_bangla',
                    type: 'string',
                    mapping: 'userTable.name_bangla'
                }, {
                    name: 'email',
                    type: 'string',
                    mapping: 'userTable.email'
                }, {
                    name: 'access_level',
                    type: 'string',
                    mapping: 'userTable.access_level'
                }, {
                    name: 'photo',
                    type: 'string',
                    mapping: 'photo'
                }, {
                    name: 'designation',
                    type: 'string',
                    mapping: 'designationTable.name'
                }, {
                    name: 'department',
                    type: 'string',
                    mapping: 'departmentTable.name'
                }, {
                    name: 'working_place',
                    type: 'string',
                    mapping: 'workingPlaceTable.name'
                }, {
                    name: 'section',
                    type: 'string',
                    mapping: 'sectionTable.name'
                }, {
                    name: 'employee_type',
                    type: 'string',
                    mapping: 'employeeTypeTable.name'
                }, {
                    name: 'date_of_birth',
                    type: 'date',
                    mapping: 'date_of_birth'
                }, {
                    name: 'date_of_join',
                    type: 'date',
                    mapping: 'date_of_join'
                }, {
                    name: 'date_of_release',
                    type: 'date',
                    mapping: 'date_of_release'
                }, {
                    name: 'referer',
                    type: 'string',
                    mapping: 'refererTable.name'
                }, {
                    name: 'referer_address',
                    type: 'string',
                    mapping: 'refererTable.address'
                }, {
                    name: 'referer_contact_no',
                    type: 'string',
                    mapping: 'refererTable.contact_no'
                }, {
                    name: 'national_id',
                    type: 'string',
                    mapping: 'national_id'
                }, {
                    name: 'religion',
                    type: 'string',
                    mapping: 'religionTable.name'
                },
                // {
                //     name: 'marital_status',
                //     type: 'int',
                //     mapping: 'marital_status'
                // },
                {
                    name: 'contact_no',
                    type: 'string',
                    mapping: 'contact_no'
                }, {
                    name: 'blood_group',
                    type: 'string',
                    mapping: 'bloodGroupTable.name'
                }, {
                    name: 'remarks',
                    type: 'string',
                    mapping: 'remarks'
                }, {
                    name: 'duty_shift',
                    type: 'string',
                    mapping: 'dutyShiftTable.name'
                }, {
                    name: 'work_time',
                    type: 'string',
                    mapping: 'workTimeTable.in_time'
                }, {
                    name: 'statu',
                    type: 'string',
                    mapping: 'statu.name'
                }, {
                    name: 'sl',
                    type: 'string',
                }, {
                    name: 'cl',
                    type: 'string',
                }
            ]
        })

    });

    var gridPaging = Ext.create('Ext.toolbar.Paging', {
        override: 'Ext.toolbar.Paging',
        store: store,
        displayInfo: true,
        displayMsg: 'DISPLAYING EMPLOYEE {0} - {1} OF {2}',
        emptyMsg: "No records to display",
        moveFirst: function() {
            if (this.fireEvent("beforechange", this, 1) !== false) {
                this.store.loadPage(1);
                searchEmployeesGridReload();
                return true
            }
            searchEmployeesGridReload();
            return false
        },
        movePrevious: function() {
            var c = this,
                a = c.store,
                b = a.currentPage - 1;
            if (b > 0) {
                if (c.fireEvent("beforechange", c, b) !== false) {
                    a.previousPage();
                    searchEmployeesGridReload();
                    return true
                }
            }
            searchEmployeesGridReload();
            return false
        },
        moveNext: function() {
            var d = this,
                a = d.store,
                c = d.getPageData().pageCount,
                b = a.currentPage + 1;
            if (b <= c) {
                if (d.fireEvent("beforechange", d, b) !== false) {
                    a.nextPage();
                    searchEmployeesGridReload();
                    return true
                }
            }
            searchEmployeesGridReload();
            return false
        },
        moveLast: function() {
            var b = this,
                a = b.getPageData().pageCount;
            if (b.fireEvent("beforechange", b, a) !== false) {
                b.store.loadPage(a);
                searchEmployeesGridReload();
                return true
            }
            searchEmployeesGridReload();
            return false
        },
        doRefresh: function() {
            var b = this,
                a = b.store,
                c = a.currentPage;
            if (b.fireEvent("beforechange", b, c) !== false) {
                a.loadPage(c);
                searchEmployeesGridReload();
                return true
            }
            searchEmployeesGridReload();
            return false
        },
    });

    var search_employees_grid = Ext.create('Ext.grid.Panel', {
        id: 'search_employees_grid',
        loadMask: true,
        autoScroll: true,
        //selType: 'cellmodel',
        columnLines: true,
        store: store,
        viewConfig: {
            emptyText: 'No records',
            autoDestroy: false,
            getRowClass: function(record) {
                if (record.get('status') == 4) {
                    return 'gray-row';
                }
                if (record.get('status') == 3) {
                    return 'red-row';
                }
                if (record.get('status') == 2) {
                    return 'yellow-row';
                }
            }
        },
        listeners: {
            rowclick: function(grid, row, e) {
                var data = row.data;
            },
            afterrender: function(self, eOpts) {
                //console.log(self)
            }
        },
        plugins: [
            cellEditPlugin()
        ],
        //tbar: gridPaging,
        tbar: [Ext.create('Ext.Panel', {
            layout: {
                type: 'vbox',
                align: 'left'
            },
            bodyStyle: {
                background: '#d3e1f1',
            },
            items: [Ext.create('Ext.Panel', {
                    layout: {
                        type: 'hbox',
                        align: 'left'
                    },
                    items: [Ext.create('Ext.Panel', {
                        layout: {
                            type: 'vbox',
                            align: 'left'
                        },
                        items: [Ext.create('Ext.Panel', {
                                layout: {
                                    type: 'hbox',
                                    align: 'left'
                                },
                                items: [Ext.create('Ext.form.field.Number', {
                                        name: 'fp_id',
                                        id: 'search_employee_list_fp_id_search',
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
                                                        if (Ext.getCmp('search_employees_grid')) {
                                                            Ext.getCmp('search_employees_grid').setLoading(true);
                                                            //Ext.getCmp('search_employee_list_fp_id_search').setValue();
                                                            Ext.getCmp('search_employee_list_card_no_search').clearValue();
                                                            Ext.getCmp('search_employee_list_name_search').clearValue();
                                                            Ext.getCmp('search_employees_tab_department').clearValue();
                                                            Ext.getCmp('search_employees_tab_designation').clearValue();
                                                            Ext.getCmp('search_employees_tab_section').clearValue();
                                                            Ext.getCmp('search_employees_tab_employee_type').clearValue();
                                                            //Ext.getCmp('search_employees_grid').getStore().loadPage(1);
                                                            searchEmployeesGridReload();
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }),
                                    Ext.create('Ext.form.ComboBox', {
                                        id: 'search_employee_list_card_no_search',
                                        name: 'name',
                                        anyMatch: true,
                                        allowBlank: true,
                                        editable: true,
                                        typeAhead: true,
                                        transform: 'stateSelect',
                                        forceSelection: true,
                                        emptyText: 'Employee Card No ...',
                                        fieldStyle: 'text-align: left;font-size: 12px;',
                                        autoScroll: true,
                                        queryMode: 'local',
                                        displayField: 'card_no',
                                        valueField: 'id',
                                        selectOnFocus: true,
                                        triggerAction: 'all',
                                        store: {
                                            fields: ['id', 'card_no'],
                                            proxy: {
                                                type: 'ajax',
                                                url: '/card_no'
                                            },
                                            autoLoad: true,
                                            autoSync: true
                                        },
                                        listeners: {
                                            change: {
                                                fn: function(combo, value) {
                                                    if (value) {
                                                        if (Ext.getCmp('search_employees_grid')) {
                                                            Ext.getCmp('search_employees_grid').setLoading(true);
                                                            Ext.getCmp('search_employee_list_fp_id_search').setValue();
                                                            //Ext.getCmp('search_employee_list_card_no_search').clearValue();
                                                            Ext.getCmp('search_employee_list_name_search').clearValue();
                                                            Ext.getCmp('search_employees_tab_department').clearValue();
                                                            Ext.getCmp('search_employees_tab_designation').clearValue();
                                                            Ext.getCmp('search_employees_tab_section').clearValue();
                                                            Ext.getCmp('search_employees_tab_employee_type').clearValue();
                                                            //Ext.getCmp('search_employees_grid').getStore().loadPage(1);
                                                            searchEmployeesGridReload();
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }),
                                    Ext.create('Ext.form.ComboBox', {
                                        id: 'search_employee_list_name_search',
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
                                                url: '/name_list'
                                            },
                                            autoLoad: true,
                                            autoSync: true
                                        },
                                        listeners: {
                                            change: {
                                                fn: function(combo, value) {
                                                    if (value) {
                                                        if (Ext.getCmp('search_employees_grid')) {
                                                            Ext.getCmp('search_employees_grid').setLoading(true);
                                                            Ext.getCmp('search_employee_list_fp_id_search').setValue();
                                                            Ext.getCmp('search_employee_list_card_no_search').clearValue();
                                                            //Ext.getCmp('search_employee_list_name_search').clearValue();
                                                            Ext.getCmp('search_employees_tab_department').clearValue();
                                                            Ext.getCmp('search_employees_tab_designation').clearValue();
                                                            Ext.getCmp('search_employees_tab_section').clearValue();
                                                            Ext.getCmp('search_employees_tab_employee_type').clearValue();
                                                            //Ext.getCmp('search_employees_grid').getStore().loadPage(1);
                                                            searchEmployeesGridReload();
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }),
                                    Ext.create('Ext.form.ComboBox', {
                                        name: 'department',
                                        id: 'search_employees_tab_department',
                                        anyMatch: true,
                                        typeAhead: true,
                                        transform: 'stateSelect',
                                        forceSelection: true,
                                        editable: true,
                                        emptyText: 'Department Name',
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
                                            blur: function(self, The, eOpts) {
                                                if (Ext.getCmp('search_employees_grid')) {
                                                    Ext.getCmp('search_employees_grid').setLoading(true);
                                                    Ext.getCmp('search_employee_list_fp_id_search').setValue();
                                                    Ext.getCmp('search_employee_list_card_no_search').clearValue();
                                                    Ext.getCmp('search_employee_list_name_search').clearValue();
                                                    //Ext.getCmp('search_employees_tab_department').clearValue();
                                                    Ext.getCmp('search_employees_tab_designation').clearValue();
                                                    Ext.getCmp('search_employees_tab_section').clearValue();
                                                    Ext.getCmp('search_employees_tab_employee_type').clearValue();
                                                    //Ext.getCmp('search_employees_grid').getStore().loadPage(1);
                                                    searchEmployeesGridReload();
                                                }
                                            },
                                        }
                                    }),
                                ]
                            }),
                            Ext.create('Ext.Panel', {
                                layout: {
                                    type: 'hbox',
                                    align: 'center'
                                },
                                items: [Ext.create('Ext.form.ComboBox', {
                                        name: 'designation',
                                        id: 'search_employees_tab_designation',
                                        anyMatch: true,
                                        typeAhead: true,
                                        transform: 'stateSelect',
                                        forceSelection: true,
                                        editable: true,
                                        emptyText: 'Designation Name',
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
                                            blur: function(self, The, eOpts) {
                                                if (Ext.getCmp('search_employees_grid')) {
                                                    Ext.getCmp('search_employees_grid').setLoading(true);
                                                    Ext.getCmp('search_employee_list_fp_id_search').setValue();
                                                    Ext.getCmp('search_employee_list_card_no_search').clearValue();
                                                    Ext.getCmp('search_employee_list_name_search').clearValue();
                                                    Ext.getCmp('search_employees_tab_department').clearValue();
                                                    Ext.getCmp('search_employees_tab_section').clearValue();
                                                    Ext.getCmp('search_employees_tab_employee_type').clearValue();
                                                    //Ext.getCmp('search_employees_grid').getStore().loadPage(1);
                                                    searchEmployeesGridReload();
                                                }
                                            },
                                        }
                                    }),
                                    Ext.create('Ext.form.ComboBox', {
                                        name: 'section',
                                        id: 'search_employees_tab_section',
                                        anyMatch: true,
                                        typeAhead: true,
                                        transform: 'stateSelect',
                                        forceSelection: true,
                                        editable: true,
                                        emptyText: 'Section',
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
                                            blur: function(self, The, eOpts) {
                                                if (Ext.getCmp('search_employees_grid')) {
                                                    Ext.getCmp('search_employees_grid').setLoading(true);
                                                    Ext.getCmp('search_employee_list_fp_id_search').setValue();
                                                    Ext.getCmp('search_employee_list_card_no_search').clearValue();
                                                    Ext.getCmp('search_employee_list_name_search').clearValue();
                                                    Ext.getCmp('search_employees_tab_department').clearValue();
                                                    Ext.getCmp('search_employees_tab_designation').clearValue();
                                                    Ext.getCmp('search_employees_tab_employee_type').clearValue();
                                                    //Ext.getCmp('search_employees_grid').getStore().loadPage(1);
                                                    searchEmployeesGridReload();
                                                }
                                            },
                                        }
                                    }),
                                    Ext.create('Ext.form.ComboBox', {
                                        name: 'employee_type',
                                        id: 'search_employees_tab_employee_type',
                                        editable: true,
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
                                        listeners: {
                                            blur: function(self, The, eOpts) {
                                                if (Ext.getCmp('search_employees_grid')) {
                                                    Ext.getCmp('search_employees_grid').setLoading(true);
                                                    Ext.getCmp('search_employee_list_fp_id_search').setValue();
                                                    Ext.getCmp('search_employee_list_card_no_search').clearValue();
                                                    Ext.getCmp('search_employee_list_name_search').clearValue();
                                                    Ext.getCmp('search_employees_tab_department').clearValue();
                                                    Ext.getCmp('search_employees_tab_designation').clearValue();
                                                    Ext.getCmp('search_employees_tab_section').clearValue();
                                                    //Ext.getCmp('search_employees_grid').getStore().loadPage(1);
                                                    searchEmployeesGridReload();
                                                }
                                            },
                                        }
                                    }),
                                    Ext.create('Ext.form.ComboBox', {
                                        id: 'search_employee_list_status',
                                        name: 'status',
                                        anyMatch: true,
                                        allowBlank: true,
                                        editable: true,
                                        typeAhead: true,
                                        transform: 'stateSelect',
                                        forceSelection: true,
                                        emptyText: 'Status ...',
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
                                                url: '/status'
                                            },
                                            autoLoad: true,
                                            autoSync: true
                                        },
                                        listeners: {
                                            change: {
                                                fn: function(combo, value) {
                                                    if (value) {
                                                        searchEmployeesGridReload();
                                                    }
                                                }
                                            }
                                        }
                                    }),
                                ]
                            }),
                        ]
                    }), {
                        xtype: 'button',
                        text: '<big><b>SEARCH</b></big>',
                        icon: '/uploads/icons/search.png',
                        iconCls: 'add',
                        name: 'Search',
                        tooltip: 'Search',
                        width: 150,
                        height: 45,
                        border: 2,
                        style: {
                            borderColor: 'blue',
                            borderStyle: 'solid'
                        },
                        handler: function() {
                            searchEmployeesGridReload();
                        }
                    }, {
                        xtype: 'button',
                        text: '<big><b>DOWNLOAD</b></big>',
                        icon: '/uploads/icons/download.png',
                        iconCls: 'add',
                        name: 'Search',
                        tooltip: 'Search',
                        width: 150,
                        height: 45,
                        border: 2,
                        style: {
                            borderColor: 'green',
                            borderStyle: 'solid'
                        },
                        handler: function() {
                            downloadEmployeesGridList();
                        }
                    }, ]
                }),
                gridPaging
            ]
        }), ],
        bbar: [{
            xtype: 'button',
            icon: '/uploads/icons/create.png',
            text: 'Add New User',
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            handler: function() {
                userInputFormWindow();
            }
        }, {
            xtype: 'button',
            text: 'Reload',
            icon: '/uploads/icons/refresh.png',
            iconCls: 'add',
            name: 'reload',
            tooltip: 'Reload',
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            handler: function() {
                searchEmployeesGridReload();
            }
        }, {
            xtype: 'button',
            text: 'PRINT',
            icon: '/uploads/icons/print.png',
            iconCls: 'add',
            name: 'reload',
            tooltip: 'Print',
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            handler: function() {
                empPrintListWindow();
            }
        }],
        columns: [Ext.create('Ext.grid.RowNumberer', {
                //locked: true,
                header: '#',
                width: 30
            }), {
                xtype: 'actioncolumn',
                header: 'LEAVE',
                align: 'center',
                items: [{
                    icon: '/uploads/icons/eye.png',
                    tooltip: 'LEAVE DETAILS',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        employeeLeaveDetailsWindow(rec)
                    }
                }],
                width: 60,
            }, {
                xtype: 'actioncolumn',
                header: 'ATTENDANCE',
                align: 'center',
                items: [{
                    icon: '/uploads/icons/form.png',
                    tooltip: 'MONTHLY ATTENDANCE',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        monthlyUserAttendanceWindow(rec);
                    }
                }],
                width: 100,
            }, {
                xtype: 'actioncolumn',
                header: 'PASSWORD',
                align: 'center',
                listeners: {
                    beforerender: function(self, eOpts) {
                        self.hidden = userAccess(acLvl);
                    }
                },
                items: [{
                    icon: '/uploads/icons/password.png',
                    tooltip: 'Password',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        //assignUserPasswordWindow(rec);
                    }
                }],
                width: 60,
            }, {
                xtype: 'actioncolumn',
                header: 'SELECT',
                align: 'center',
                width: 100,
                hideable: false,
                items: [{
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        if (empIDStackForPrint.indexOf(rec.id) != -1) {
                            empIDStackForPrint.splice(empIDStackForPrint.indexOf(rec.id), 1);
                        } else {
                            empIDStackForPrint.push(rec.id);
                        }
                        searchEmployeesGridReload();
                    },
                    getClass: function(v, meta, rec) {
                        if (empIDStackForPrint.indexOf(rec.id) != -1) {
                            // this.items[0].tooltip = 'remove';
                            return 'icon-remove';
                        } else {
                            // this.items[0].tooltip = 'ok';
                            return 'icon-ok';
                        }
                    }
                }]
            }, {
                header: 'STATUS',
                dataIndex: 'statu',
                align: 'center',
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
                        proxy: {
                            type: 'ajax',
                            url: '/status'
                        },
                        autoLoad: true,
                        autoSync: true
                    },
                    listeners: {
                        blur: function(self, event, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.status = self.value;
                            if (self.value) {
                                socket.emit('UpdateEmployeeStatus', data).on('UpdateEmployeeStatus', function(message) {
                                    if (message == "success") {
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                width: 100
            }, {
                header: 'FP',
                dataIndex: 'finger_print_id',
                align: 'left',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return addLeadingZero(9, value);
                },
                width: 70
            }, {
                header: 'CARD NO',
                dataIndex: 'card_no',
                align: 'right',
                editor: {
                    xtype: 'numberfield',
                    editable: true,
                    listeners: {
                        change: function(self, newValue, oldValue, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.card_no = newValue;
                            if (newValue != oldValue) {
                                socket.emit('UpdateEmployeeCardNo', data).on('UpdateEmployeeCardNo', function(message) {
                                    if (message == "success") {
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                width: 80
            }, {
                header: 'GRADE',
                dataIndex: 'grade',
                align: 'right',
                editor: {
                    xtype: 'numberfield',
                    editable: true,
                    maxValue: 7,
                    minValue: 1,
                    listeners: {
                        change: function(self, newValue, oldValue, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.grade = newValue;
                            if (newValue != oldValue) {
                                socket.emit('UpdateEmployeeGrade', data).on('UpdateEmployeeGrade', function(message) {
                                    if (message == "success") {
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                width: 70
            }, {
                header: 'FIRST NAME',
                dataIndex: 'first_name',
                align: 'left',
                editor: {
                    xtype: 'textfield',
                    editable: true,
                    listeners: {
                        blur: function(self, event, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.first_name = self.value;
                            if (self.value) {
                                socket.emit('UpdateEmployeeFirstName', data).on('UpdateEmployeeFirstName', function(message) {
                                    if (message == "success") {
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                //locked: true,
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.toUpperCase();
                },
                width: 150
            },

            {
                header: 'NAME (<b>বাংলায়</b>)',
                dataIndex: 'name_bangla',
                align: 'left',
                editor: {
                    xtype: 'textfield',
                    editable: true,
                    listeners: {
                        blur: function(self, event, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.name_bangla = self.value;
                            if (isDoubleByte(data.name_bangla)) {
                                if (self.value) {
                                    socket.emit('UpdateEmployeeNameBangla', data).on('UpdateEmployeeNameBangla', function(message) {
                                        if (message == "success") {
                                            searchEmployeesGridReload();
                                        } else if (message == "error") {
                                            //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                        }
                                    });
                                }
                            } else {
                                Ext.MessageBox.alert('Type Error', 'Please Entry Only Unicode Text');
                            }
                        }
                    }
                },
                /*renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                    return value;
                },*/
                width: 130
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
                        blur: function(self, event, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.department = self.value;
                            if (self.value) {
                                socket.emit('UpdateEmployeeDepartment', data).on('UpdateEmployeeDepartment', function(message) {
                                    if (message == "success") {
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                width: 120
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
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.designation = self.value;
                            if (self.value) {
                                socket.emit('UpdateEmployeeDesignation', data).on('UpdateEmployeeDesignation', function(message) {
                                    if (message == "success") {
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        },
                    }
                },
                width: 120
            }, {
                header: 'SECTION',
                dataIndex: 'section',
                align: 'left',
                field: {
                    xtype: 'combo',
                    name: 'section',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Select Section...',
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
                            url: '/section'
                        },
                        autoLoad: true,
                        autoSync: true
                    },
                    listeners: {
                        blur: function(self, event, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.section = self.value;
                            if (self.value) {
                                socket.emit('UpdateEmployeeSection', data).on('UpdateEmployeeSection', function(message) {
                                    if (message == "success") {
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                width: 100
            }, {
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
                        blur: function(self, event, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.employee_type = self.value;
                            if (self.value) {
                                socket.emit('UpdateEmployeeType', data).on('UpdateEmployeeType', function(message) {
                                    if (message == "success") {
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                width: 100
            }, {
                header: 'WORK TIME',
                dataIndex: 'work_time',
                align: 'left',
                field: {
                    xtype: 'combo',
                    name: 'work_time',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Select Work Time...',
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
                            url: '/work_time'
                        },
                        autoLoad: true,
                        autoSync: true
                    },
                    listeners: {
                        blur: function(self, event, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.work_time = self.value;
                            if (self.value) {
                                socket.emit('UpdateEmployeeWorkTime', data).on('UpdateEmployeeWorkTime', function(message) {
                                    if (message == "success") {
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                width: 100
            }, {
                header: 'DATE OF BIRTH',
                dataIndex: 'date_of_birth',
                renderer: Ext.util.Format.dateRenderer('d, F Y'),
                align: 'left',
                editor: {
                    xtype: 'datefield',
                    editable: false,
                    listeners: {
                        change: function(self, newValue, oldValue, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
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
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                width: 120
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
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
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
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                width: 120
            }, {
                header: 'DATE OF RELEASE',
                dataIndex: 'date_of_release',
                renderer: Ext.util.Format.dateRenderer('d, F Y'),
                align: 'left',
                editor: {
                    xtype: 'datefield',
                    editable: false,
                    listeners: {
                        change: function(self, newValue, oldValue, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            var date = new Date(newValue);
                            var d = date.getDate();
                            var m = date.getMonth();
                            var y = date.getFullYear();
                            data.date_of_release = new Date(Date.UTC(y, m, d, 00, 00, 00));
                            if (newValue != oldValue) {
                                socket.emit('UpdateEmployeeDateOfRelease', data).on('UpdateEmployeeDateOfRelease', function(message) {
                                    if (message == "success") {
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                width: 120
            }, {
                header: 'CARD ISSUE',
                dataIndex: 'card_issue',
                renderer: Ext.util.Format.dateRenderer('d, F Y'),
                align: 'left',
                editor: {
                    xtype: 'datefield',
                    editable: false,
                    listeners: {
                        change: function(self, newValue, oldValue, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            var date = new Date(newValue);
                            var d = date.getDate();
                            var m = date.getMonth();
                            var y = date.getFullYear();
                            data.card_issue = new Date(Date.UTC(y, m, d, 00, 00, 00));
                            data.card_expire = new Date(Date.UTC(y + 2, m, d, 00, 00, 00));
                            if (newValue != oldValue) {
                                socket.emit('UpdateEmployeeCardIssue', data).on('UpdateEmployeeCardIssue', function(message) {
                                    if (message == "success") {
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                width: 120
            }, {
                header: 'CARD EXPIRE',
                dataIndex: 'card_expire',
                renderer: Ext.util.Format.dateRenderer('d, F Y'),
                align: 'left',
                width: 120
            }, {
                header: 'BLOOD GROUP',
                dataIndex: 'blood_group',
                align: 'left',
                field: {
                    xtype: 'combo',
                    name: 'blood_group',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Select Blood Group...',
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
                            url: '/getBloodGroup'
                        },
                        autoLoad: true,
                        autoSync: true
                    },
                    listeners: {
                        blur: function(self, event, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.blood_group = self.value;
                            if (self.value) {
                                socket.emit('UpdateEmployeeBloodGroup', data).on('UpdateEmployeeBloodGroup', function(message) {
                                    if (message == "success") {
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                width: 100
            }, {
                header: 'ADDRESS',
                dataIndex: 'address',
                align: 'left',
                editor: {
                    xtype: 'textfield',
                    editable: true,
                    listeners: {
                        blur: function(self, event, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.address = self.value;
                            if (self.value) {
                                socket.emit('UpdateEmployeeAddress', data).on('UpdateEmployeeAddress', function(message) {
                                    if (message == "success") {
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return (value) ? value.toUpperCase() : '';
                    // return value.toUpperCase();
                },
                width: 150
            }, {
                header: 'ADDRESS (<b>বাংলায়</b>)',
                dataIndex: 'address_bangla',
                align: 'left',
                editor: {
                    xtype: 'textfield',
                    editable: true,
                    listeners: {
                        blur: function(self, event, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.address_bangla = self.value;
                            if (isDoubleByte(data.address_bangla)) {
                                if (self.value) {
                                    socket.emit('UpdateEmployeeAddressBangla', data).on('UpdateEmployeeAddressBangla', function(message) {
                                        if (message == "success") {
                                            searchEmployeesGridReload();
                                        } else if (message == "error") {
                                            //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                        }
                                    });
                                }
                            } else {
                                Ext.MessageBox.alert('Type Error', 'Please Entry Only Unicode Text');
                            }
                        }
                    }
                },
                width: 130
            }, {
                header: 'CONTACT NO',
                dataIndex: 'contact_no',
                align: 'left',
                editor: {
                    xtype: 'textfield',
                    editable: true,
                    listeners: {
                        blur: function(self, event, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.contact_no = self.value;
                            if (self.value) {
                                socket.emit('UpdateEmployeeContactNo', data).on('UpdateEmployeeContactNo', function(message) {
                                    if (message == "success") {
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return (value) ? value.toUpperCase() : '';
                    // return value.toUpperCase();
                },
                width: 150
            }, {
                header: 'ACCESS',
                dataIndex: 'access_level',
                listeners: {
                    beforerender: function(self, eOpts) {
                        self.hidden = userAccess(acLvl);
                    }
                },
                /*renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                  if(value)
                    return value;
                  else
                    return '<b style="color:#CCC">Give Last Name</b>';
                },*/
                editor: {
                    xtype: 'numberfield',
                    editable: true,
                    listeners: {
                        blur: function(self, event, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.access_level = self.value;
                            if (self.value) {
                                socket.emit('UpdateUserAccessLevel', data).on('UpdateUserAccessLevel', function(message) {
                                    if (message == "success") {
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                align: 'left',
                width: 60,
            }, {
                header: 'NATIONAL ID',
                dataIndex: 'national_id',
                editor: {
                    xtype: 'textfield',
                    editable: true,
                    listeners: {
                        blur: function(self, event, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.national_id = self.value;
                            if (self.value) {
                                socket.emit('UpdateEmployeeNationalID', data).on('UpdateEmployeeNationalID', function(message) {
                                    if (message == "success") {
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                align: 'center',
                width: 120,
            }, {
                header: 'GENDER',
                dataIndex: 'gender',
                align: 'center',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    switch (value) {
                        case 1:
                            return 'MALE';
                            break;
                        case 2:
                            return 'FEMALE';
                            break;
                        default:
                            return '';
                    }
                },
                field: {
                    xtype: 'combo',
                    name: 'status',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Select Gender...',
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
                            url: '/getGender'
                        },
                        autoLoad: true,
                        autoSync: true
                    },
                    listeners: {
                        blur: function(self, event, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.gender = self.value;
                            if (self.value) {
                                socket.emit('UpdateEmployeeGender', data).on('UpdateEmployeeGender', function(message) {
                                    if (message == "success") {
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                width: 100
            }, {
                header: 'RELIGION',
                dataIndex: 'religion',
                align: 'center',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return (value) ? value.toUpperCase() : '';
                },
                field: {
                    xtype: 'combo',
                    name: 'status',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Select Religion...',
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
                            url: '/getReligion'
                        },
                        autoLoad: true,
                        autoSync: true
                    },
                    listeners: {
                        blur: function(self, event, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.religion = self.value;
                            if (self.value) {
                                socket.emit('UpdateEmployeeReligion', data).on('UpdateEmployeeReligion', function(message) {
                                    if (message == "success") {
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                width: 100
            }, {
                header: 'MARITAL STATUS',
                dataIndex: 'marital_status',
                align: 'center',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    switch (value) {
                        case 1:
                            return 'SINGLE';
                            break;
                        case 2:
                            return 'MARRIED';
                            break;
                        default:
                            return '';
                    }
                },
                field: {
                    xtype: 'combo',
                    name: 'status',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Select Marital Status...',
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
                            url: '/getMaritalStatus'
                        },
                        autoLoad: true,
                        autoSync: true
                    },
                    listeners: {
                        blur: function(self, event, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.marital_status = self.value;
                            if (self.value) {
                                socket.emit('UpdateEmployeeMaritalStatus', data).on('UpdateEmployeeMaritalStatus', function(message) {
                                    if (message == "success") {
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                width: 100
            }, {
                header: 'REMARKS',
                dataIndex: 'remarks',
                align: 'left',
                editor: {
                    xtype: 'textfield',
                    editable: true,
                    listeners: {
                        blur: function(self, event, eOpts) {
                            var row = Ext.getCmp('search_employees_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.remarks = self.value;
                            if (self.value) {
                                socket.emit('UpdateEmployeeRemarks', data).on('UpdateEmployeeRemarks', function(message) {
                                    if (message == "success") {
                                        searchEmployeesGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return (value) ? value.toCapitalize() : '';
                    // return value.toUpperCase();
                },
                width: 150
            },
        ]
    });
    store.loadPage(1);
    return search_employees_grid;
}

function searchEmployeesGridReload() {
    if (Ext.getCmp('search_employees_grid')) {
        var department = Ext.getCmp('search_employees_tab_department').value;
        var designation = Ext.getCmp('search_employees_tab_designation').value;
        var section = Ext.getCmp('search_employees_tab_section').value;
        var employee_type = Ext.getCmp('search_employees_tab_employee_type').value;
        var first_name = Ext.getCmp('search_employee_list_name_search').value;
        var id = Ext.getCmp('search_employee_list_fp_id_search').value;
        var card_no = Ext.getCmp('search_employee_list_card_no_search').value;
        var status = Ext.getCmp('search_employee_list_status').value;
        var params = {};
        if (first_name)
            params.id = first_name;
        if (id)
            params.id = id;
        if (card_no)
            params.id = card_no;
        if (department)
            params.department = department;
        if (designation)
            params.designation = designation;
        if (section)
            params.section = section;
        if (employee_type)
            params.employee_type = employee_type;
        if (status)
            params.status = status;
        Ext.getCmp('search_employees_grid').setLoading(true);
        Ext.getCmp('search_employees_grid').getStore().load({
            params: params,
            callback: function(records, operation, success) {
                Ext.getCmp('search_employees_grid').setLoading(false);
            },
            scope: this
        });
    }
}

function downloadEmployeesGridList() {
    success = true;
    if (Ext.getCmp('search_employees_grid')) {
        var department = Ext.getCmp('search_employees_tab_department').value;
        var designation = Ext.getCmp('search_employees_tab_designation').value;
        var section = Ext.getCmp('search_employees_tab_section').value;
        var employee_type = Ext.getCmp('search_employees_tab_employee_type').value;
        var first_name = Ext.getCmp('search_employee_list_name_search').value;
        var id = Ext.getCmp('search_employee_list_fp_id_search').value;
        var card_no = Ext.getCmp('search_employee_list_card_no_search').value;
        var status = Ext.getCmp('search_employee_list_status').value;
        var params = {};
        if (first_name)
            params.id = first_name;
        if (id)
            params.id = id;
        if (card_no)
            params.id = card_no;
        if (department)
            params.department = department;
        if (designation)
            params.designation = designation;
        if (section)
            params.section = section;
        if (employee_type)
            params.employee_type = employee_type;
        if (status)
            params.status = status;
        Ext.getCmp('search_employees_grid').setLoading(true);
        socket.emit('DownloadEmployeesGridList', params).on('DownloadEmployeesGridList', function(r) {
            Ext.getCmp('search_employees_grid').setLoading(false);
            if (success) {
                JSONToCSVConvertor(r, true);
                success = false;
                searchEmployeesGridReload();
            }
        });
    }
}

function JSONToCSVConvertor(JSONData, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    //Set Report title in first row or line

    // CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            //Now convert each value to string and comma-seprated
            if (index != 'name_bangla')
                row += index.toUpperCase() + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            if (index != 'name_bangla')
                row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        Ext.MessageBox.alert('Error', 'Something went wrong. \nPlease contact with the developer.');
        return;
    }

    //Generate a file name
    var fileName = "Employee_List";
    //this will remove the blank-spaces from the title and replace it with an underscore
    // fileName += ReportTitle.replace(/ /g,"_");   

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function employeeLeaveDetailsWindow(rec) {
    return Ext.create('Ext.window.Window', {
        title: rec.data.first_name.toUpperCase() + ' LEAVE DETAILS',
        width: '50%',
        modal: true,
        layout: 'fit',
        tbar: [{
            xtype: 'button',
            text: 'NEW LEAVE',
            icon: '/uploads/icons/create.png',
            iconCls: 'add',
            name: 'reload',
            tooltip: 'Reload',
            border: 1,
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            handler: function() {
                if (acLvl > 600 && acLvl < 700) {
                    Ext.MessageBox.alert('ERROR', 'Sorry You Dont Have The Excess.<br />Please Consult With The IT Department.<br /><small><b style="color:red">Repeatedly Doing Might Block Your Account</b></small>');
                } else {
                    employeeLeaveFormWindow(rec);
                }
            }
        }],
        items: [
            employeeLeaveDetailsGrid(rec)
        ],
        bbar: [{
                xtype: 'button',
                id: 'employee_leave_details_window_previous_year',
                icon: '/uploads/icons/go-previous.png',
                iconCls: 'add',
                name: 'previous',
                tooltip: 'Previous',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    var params = {};
                    params.year = (Ext.getCmp('employee_leave_details_window_current_year')) ?
                        parseInt(new Date(Ext.getCmp('employee_leave_details_window_current_year').getText()).getFullYear()) - 1 :
                        parseInt(new Date().getFullYear()) - 1;
                    Ext.getCmp('employee_leave_details_grid').setLoading(true);
                    Ext.getCmp('employee_leave_details_grid').getStore().load({
                        params: params,
                        callback: function(records, operation, success) {
                            if (Ext.getCmp('employee_leave_details_window_current_year')) {
                                Ext.getCmp('employee_leave_details_window_current_year').setText(params.year);
                            }
                            Ext.getCmp('employee_leave_details_grid').setLoading(false);
                        },
                        scope: this
                    });
                    //employeeLeaveFormWindow(rec)
                }
            }, {
                xtype: 'button',
                text: new Date().getFullYear(),
                id: 'employee_leave_details_window_current_year',
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
                    var params = {};
                    params.year = (Ext.getCmp('employee_leave_details_window_current_year')) ?
                        parseInt(new Date(Ext.getCmp('employee_leave_details_window_current_year').getText()).getFullYear()) :
                        parseInt(new Date().getFullYear());
                    Ext.getCmp('employee_leave_details_grid').setLoading(true);
                    Ext.getCmp('employee_leave_details_grid').getStore().load({
                        params: params,
                        callback: function(records, operation, success) {
                            if (Ext.getCmp('employee_leave_details_window_current_year')) {
                                Ext.getCmp('employee_leave_details_window_current_year').setText(params.year);
                                //Ext.getCmp('employee_leave_details_window_current_year').setDisabled(true);
                            }
                            Ext.getCmp('employee_leave_details_grid').setLoading(false);
                        },
                        scope: this
                    });
                }
            }, {
                xtype: 'button',
                id: 'employee_leave_details_window_next_year',
                icon: '/uploads/icons/go-next.png',
                iconCls: 'add',
                name: 'next',
                tooltip: 'Next',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    var params = {};
                    params.year = (Ext.getCmp('employee_leave_details_window_current_year')) ?
                        parseInt(new Date(Ext.getCmp('employee_leave_details_window_current_year').getText()).getFullYear()) + 1 :
                        parseInt(new Date().getFullYear()) + 1;
                    Ext.getCmp('employee_leave_details_grid').setLoading(true);
                    Ext.getCmp('employee_leave_details_grid').getStore().load({
                        params: params,
                        callback: function(records, operation, success) {
                            if (Ext.getCmp('employee_leave_details_window_current_year')) {
                                Ext.getCmp('employee_leave_details_window_current_year').setText(params.year);
                            }
                            Ext.getCmp('employee_leave_details_grid').setLoading(false);
                        },
                        scope: this
                    });
                }
            }
            // {
            //   xtype:'button',
            //   text:'Reload',
            //   icon: '/uploads/icons/refresh.png',
            //   iconCls: 'add',
            //   name:'reload',
            //   tooltip:'Reload',
            //   border: 1,
            //   style: {
            //     borderColor: 'blue',
            //     borderStyle: 'solid'
            //   },
            //   handler: function(){
            //     if(Ext.getCmp('employee_leave_details_grid')){
            //       Ext.getCmp('employee_leave_details_grid').getStore().load();
            //     }
            //   }
            // }
        ]
    }).show();
}

function userInputFormWindow() {
    var depID = 1;
    return Ext.create('Ext.window.Window', {
        title: 'Add New User',
        modal: true,
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '100%',
            border: false,
            items: [Ext.create('Ext.Panel', {
                    border: false,
                    width: '100%',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [{
                        xtype: 'panel',
                        // border: false,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        bodyPadding: 20,
                        items: [Ext.create('Ext.form.field.Text', {
                                name: 'first_name',
                                fieldLabel: 'Name' + RequiredMF,
                                filedAlign: 'top',
                                allowBlank: false,
                                labelAlign: 'left',
                                labelStyle: 'text-align:left;border solid 1px white;',
                                labelSeparator: '',
                                emptyText: 'Give Name...',
                                labelClsExtra: 'some-class',
                                fieldStyle: 'text-align: left;font-size: 12px;',
                                autoScroll: true
                            }),
                            Ext.create('Ext.form.field.Number', {
                                name: 'card_no',
                                id: 'userInputFormCardNoField',
                                fieldLabel: 'Card No' + RequiredMF,
                                filedAlign: 'top',
                                allowBlank: false,
                                minValue: 0,
                                value: 0,
                                labelAlign: 'left',
                                labelStyle: 'text-align:left;border solid 1px white;',
                                labelSeparator: '',
                                emptyText: 'Give Card No...',
                                labelClsExtra: 'some-class',
                                fieldStyle: 'text-align: left;font-size: 12px;',
                                autoScroll: true,
                                listeners: {
                                    blur: function(self, The, eOpts) {
                                        if (Ext.getCmp("userInputFormFingerPrintIDField").getValue() == 0)
                                            Ext.getCmp("userInputFormFingerPrintIDField").setValue(self.value);
                                    }
                                }
                            }),
                            Ext.create('Ext.form.ComboBox', {
                                fieldLabel: ' Work Time' + RequiredMF,
                                name: 'work_time',
                                allowBlank: false,
                                editable: false,
                                labelAlign: 'left',
                                labelSeparator: '',
                                emptyText: 'Select Work Time ...',
                                labelClsExtra: 'some-class',
                                fieldStyle: 'text-align: left;font-size: 12px;',
                                autoScroll: true,
                                value: 1,
                                queryMode: 'local',
                                displayField: 'name',
                                valueField: 'id',
                                selectOnFocus: true,
                                triggerAction: 'all',
                                store: {
                                    fields: ['id', 'name'],
                                    proxy: {
                                        type: 'ajax',
                                        url: '/work_time'
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
                            }),
                            Ext.create('Ext.form.ComboBox', {
                                fieldLabel: 'Department' + RequiredMF,
                                name: 'department',
                                anyMatch: true,
                                typeAhead: true,
                                transform: 'stateSelect',
                                forceSelection: true,
                                allowBlank: false,
                                editable: true,
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
                                    blur: function(self, The, eOpts) {
                                        if (self.value) {
                                            depID = self.value;
                                            Ext.getCmp("userInputFormSectionField").setDisabled(false);
                                            Ext.getCmp("userInputFormSectionField").getStore().setProxy({
                                                type: 'ajax',
                                                url: '/section/' + depID
                                            }).load();
                                        }
                                    }
                                }
                            }),
                            Ext.create('Ext.form.ComboBox', {
                                fieldLabel: 'Section' + RequiredMF,
                                id: 'userInputFormSectionField',
                                name: 'section',
                                anyMatch: true,
                                typeAhead: true,
                                transform: 'stateSelect',
                                forceSelection: true,
                                disabled: true,
                                allowBlank: false,
                                editable: true,
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
                                        url: '/section/' + depID
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
                            }),
                            Ext.create('Ext.form.field.Date', {
                                name: 'date_of_join',
                                fieldLabel: 'Date of Join' + RequiredMF,
                                filedAlign: 'top',
                                allowBlank: false,
                                editable: false,
                                labelAlign: 'left',
                                labelStyle: 'text-align:left;border solid 1px white;',
                                labelSeparator: '',
                                emptyText: 'Give Date of Join...',
                                labelClsExtra: 'some-class',
                                fieldStyle: 'text-align: left;font-size: 12px;',
                                autoScroll: true
                            }),
                        ]
                    }, {
                        xtype: 'panel',
                        // border: false,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        bodyPadding: 20,
                        items: [Ext.create('Ext.form.field.Text', {
                                name: 'name_bangla',
                                fieldLabel: 'Name (<b>বাংলায়</b>)' + RequiredMF,
                                filedAlign: 'top',
                                allowBlank: false,
                                labelAlign: 'left',
                                labelStyle: 'text-align:left;border solid 1px white;',
                                labelSeparator: '',
                                emptyText: 'Give Name (বাংলায়)...',
                                labelClsExtra: 'some-class',
                                fieldStyle: 'text-align: left;font-size: 12px;',
                                autoScroll: true,
                                listeners: {
                                    blur: function(self, The, eOpts) {
                                        var ascii = /^[ -~]+$/;
                                        if (ascii.test(self.value)) {
                                            Ext.MessageBox.alert('Error', 'Only Bangla Unicode Values Are Acceptable');
                                            self.setValue('');
                                        }
                                    }
                                }
                            }),
                            Ext.create('Ext.form.field.Number', {
                                name: 'finger_print_id',
                                id: 'userInputFormFingerPrintIDField',
                                fieldLabel: 'Finger Print ID' + RequiredMF,
                                filedAlign: 'top',
                                allowBlank: false,
                                minValue: 0,
                                value: 0,
                                labelAlign: 'left',
                                labelStyle: 'text-align:left;border solid 1px white;',
                                labelSeparator: '',
                                emptyText: 'Give Finger Print ID...',
                                labelClsExtra: 'some-class',
                                fieldStyle: 'text-align: left;font-size: 12px;',
                                autoScroll: true,
                                listeners: {
                                    blur: function(self, The, eOpts) {
                                        if (Ext.getCmp("userInputFormCardNoField").getValue() == 0)
                                            Ext.getCmp("userInputFormCardNoField").setValue(self.value);
                                    }
                                }
                            }),
                            Ext.create('Ext.form.field.Number', {
                                name: 'grade',
                                fieldLabel: 'Grade' + RequiredMF,
                                filedAlign: 'top',
                                allowBlank: false,
                                maxValue: 10,
                                minValue: 0,
                                labelAlign: 'left',
                                labelStyle: 'text-align:left;border solid 1px white;',
                                labelSeparator: '',
                                emptyText: 'Give Grade...',
                                labelClsExtra: 'some-class',
                                fieldStyle: 'text-align: left;font-size: 12px;',
                                autoScroll: true
                            }),
                            Ext.create('Ext.form.ComboBox', {
                                fieldLabel: 'Designation' + RequiredMF,
                                name: 'designation',
                                anyMatch: true,
                                typeAhead: true,
                                transform: 'stateSelect',
                                forceSelection: true,
                                allowBlank: false,
                                editable: true,
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
                            }),
                            Ext.create('Ext.form.ComboBox', {
                                fieldLabel: 'Employee Type' + RequiredMF,
                                name: 'employee_type',
                                allowBlank: false,
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
                            }),
                            Ext.create('Ext.form.field.Date', {
                                name: 'date_of_birth',
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
                            }),
                        ]
                    }, ]
                })

                // newTextField('First Name', 'first_name'),
                // newTextField('Last Name', 'last_name'),
                // numberField('Card No', 'card_no'),
                // numberField('Finger Print ID', 'finger_print_id', true),
                // employeeDepartmentCombo(),
                // employeeDesignationCombo(),
                // employeeSectionCombo(),
                // employeeTypeCombo(),
                // employeeDateOfJoin(),
                // employeeDateOfBirth()


                //emailField('Email', 'email'),
                //passwordField('Password', 'password'),
                //passwordField('Re Password', 'password'),
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
                    var success = false,
                        win = this.up('.window'),
                        panel = this.up('form'),
                        form = panel.getForm(),
                        values = form.getValues(); //,
                    //repass = form.monitor.getItems().items[1];
                    if (form.isValid()) {
                        /*if(values.password[0]!=values.password[1]){
                          Ext.MessageBox.alert('ERROR', 'Password not matched');
                          repass.reset();
                        }*/
                        socket.emit('CreateUser', values).on('CreateUser', function(message) {
                            if (message == "success") {
                                success = true;
                                if (Ext.getCmp('user_list_grid')) {
                                    Ext.getCmp('user_list_grid').getStore().load();
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


function empPrintListWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Employee Print List',
        width: '50%',
        height: 400,
        modal: true,
        layout: 'fit',
        items: [Ext.create('Ext.grid.Panel', {
            id: 'emp_print_list',
            columnLines: true,
            store: {
                proxy: {
                    type: 'ajax',
                    url: '/getEmpPrintList/' + ((empIDStackForPrint.length > 0) ? empIDStackForPrint : 0)
                },
                autoLoad: true,
                autoSync: true,
                model: Ext.define('EMPLOYEE_DETAILS_MODEL', {
                    extend: 'Ext.data.Model',
                    fields: [{
                            name: 'id',
                            type: 'int',
                            mapping: 'id'
                        }, {
                            name: 'card_no',
                            type: 'int',
                            mapping: 'userTable.card_no'
                        }, {
                            name: 'finger_print_id',
                            type: 'int',
                            mapping: 'userTable.finger_print_id'
                        }, {
                            name: 'first_name',
                            type: 'string',
                            mapping: 'userTable.first_name'
                        }, {
                            name: 'last_name',
                            type: 'string',
                            mapping: 'userTable.last_name'
                        }, {
                            name: 'name_bangla',
                            type: 'string',
                            mapping: 'userTable.name_bangla'
                        }, {
                            name: 'email',
                            type: 'string',
                            mapping: 'userTable.email'
                        }, {
                            name: 'access_level',
                            type: 'string',
                            mapping: 'userTable.access_level'
                        }, {
                            name: 'photo',
                            type: 'string',
                            mapping: 'photo'
                        }, {
                            name: 'designation',
                            type: 'string',
                            mapping: 'designationTable.name'
                        }, {
                            name: 'designationBangla',
                            type: 'string',
                            mapping: 'designationTable.name_bangla'
                        }, {
                            name: 'department',
                            type: 'string',
                            mapping: 'departmentTable.name'
                        }, {
                            name: 'working_place',
                            type: 'string',
                            mapping: 'workingPlaceTable.name'
                        }, {
                            name: 'section',
                            type: 'string',
                            mapping: 'sectionTable.name'
                        }, {
                            name: 'sectionBangla',
                            type: 'string',
                            mapping: 'sectionTable.name_bangla'
                        }, {
                            name: 'employee_type',
                            type: 'string',
                            mapping: 'employeeTypeTable.name'
                        }, {
                            name: 'date_of_birth',
                            type: 'date',
                            mapping: 'date_of_birth'
                        }, {
                            name: 'date_of_join',
                            type: 'date',
                            mapping: 'date_of_join'
                        }, {
                            name: 'date_of_release',
                            type: 'date',
                            mapping: 'date_of_release'
                        }, {
                            name: 'referer',
                            type: 'string',
                            mapping: 'refererTable.name'
                        }, {
                            name: 'referer_address',
                            type: 'string',
                            mapping: 'refererTable.address'
                        }, {
                            name: 'referer_contact_no',
                            type: 'string',
                            mapping: 'refererTable.contact_no'
                        }, {
                            name: 'national_id',
                            type: 'string',
                            mapping: 'national_id'
                        }, {
                            name: 'religion',
                            type: 'string',
                            mapping: 'religionTable.name'
                        },
                        // {
                        //     name: 'marital_status',
                        //     type: 'int',
                        //     mapping: 'marital_status'
                        // },
                        {
                            name: 'contact_no',
                            type: 'string',
                            mapping: 'contact_no'
                        }, {
                            name: 'blood_group',
                            type: 'string',
                            mapping: 'bloodGroupTable.name'
                        }, {
                            name: 'remarks',
                            type: 'string',
                            mapping: 'remarks'
                        }, {
                            name: 'duty_shift',
                            type: 'string',
                            mapping: 'dutyShiftTable.name'
                        }, {
                            name: 'work_time',
                            type: 'string',
                            mapping: 'workTimeTable.in_time'
                        }, {
                            name: 'statu',
                            type: 'string',
                            mapping: 'statu.name'
                        }, {
                            name: 'sl',
                            type: 'string',
                        }, {
                            name: 'cl',
                            type: 'string',
                        },
                    ]
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
            bbar: [{
                xtype: 'button',
                text: 'BANGLA ID FRONT',
                icon: '/uploads/icons/print.png',
                iconCls: 'add',
                name: 'reload',
                tooltip: 'Print',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    Ext.getCmp('emp_print_list').setLoading(true);
                    var GridItems = Ext.getCmp('emp_print_list').getStore().getData().items;
                    var EmpData = [];
                    for (var i = GridItems.length - 1; i >= 0; i--) {
                        EmpData.push(JSON.parse(JSON.stringify(GridItems[i].data)));
                    }
                    // employeeIDMaker
                    socket.emit('PrintBanglaIDCardFront', EmpData, site_url).on('PrintBanglaIDCardFront', function(message) {
                        Ext.getCmp('emp_print_list').setLoading(false);
                        Ext.MessageBox.alert({
                            title: 'Bangla ID Card Front Side Download',
                            buttons: Ext.MessageBox.CANCEL,
                            msg: 'Please <a href="/uploads/pdf/IDCardFront.pdf" download>click here</a> to confirm the file download',
                            animateTarget: 'mb4',
                            icon: Ext.MessageBox.QUESTION
                        });
                    });
                }
            }, {
                xtype: 'button',
                text: 'BANGLA ID BACK',
                icon: '/uploads/icons/print.png',
                iconCls: 'add',
                name: 'reload',
                tooltip: 'Print',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    Ext.getCmp('emp_print_list').setLoading(true);
                    var GridItems = Ext.getCmp('emp_print_list').getStore().getData().items;
                    var EmpData = [];
                    for (var i = GridItems.length - 1; i >= 0; i--) {
                        EmpData.push(JSON.parse(JSON.stringify(GridItems[i].data)));
                    }
                    socket.emit('PrintBanglaIDCardBack', EmpData, site_url).on('PrintBanglaIDCardBack', function(message) {
                        Ext.getCmp('emp_print_list').setLoading(false);
                        Ext.MessageBox.alert({
                            title: 'Bangla ID Card Back Side Download',
                            buttons: Ext.MessageBox.CANCEL,
                            msg: 'Please <a href="/uploads/pdf/IDCardBack.pdf" download>click here</a> to confirm the file download',
                            animateTarget: 'mb4',
                            icon: Ext.MessageBox.QUESTION
                        });
                    });
                }
            }],
            columns: [{
                header: 'ID',
                dataIndex: 'id',
                align: 'center',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return addLeadingZero(9, value);
                },
                flex: 0.7
            }, {
                header: 'NAME',
                dataIndex: 'first_name',
                align: 'left',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.toUpperCase();
                },
                flex: 1
            }, {
                header: 'DEPARTMENT',
                dataIndex: 'department',
                align: 'left',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.toUpperCase();
                },
                flex: 1
            }, {
                header: 'SECTION',
                dataIndex: 'section',
                align: 'left',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.toUpperCase();
                },
                flex: 1
            }, {
                header: 'DESIGNATION',
                dataIndex: 'designation',
                align: 'left',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.toUpperCase();
                },
                flex: 1.5
            }, {
                xtype: 'actioncolumn',
                header: 'ACTION',
                flex: 0.5,
                align: 'center',
                items: [{
                        icon: '/uploads/icons/eye.png',
                        tooltip: 'VIEW EMPLOYEE PROFILE',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            empProfileWindow(rec)
                        }
                    },
                    '-->', {
                        icon: '/uploads/icons/delete.png',
                        tooltip: 'Delete',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            if (empIDStackForPrint.indexOf(rec.id) != -1) {
                                empIDStackForPrint.splice(empIDStackForPrint.indexOf(rec.id), 1);
                            } else {
                                empIDStackForPrint.push(rec.id);
                            }
                            searchEmployeesGridReload();
                            Ext.getCmp('emp_print_list').getStore().load({
                                params: {
                                    STACK: ((empIDStackForPrint.length > 0) ? empIDStackForPrint : 0)
                                },
                                callback: function(records, operation, success) {
                                    Ext.getCmp('emp_print_list').setLoading(false);
                                },
                                scope: this
                            });
                        }
                    }
                ]
            }]
        })]
    }).show();
}

function empProfileWindow(rec) {
    return Ext.create('Ext.window.Window', {
        title: rec.data.first_name.toUpperCase() + ' (' + rec.data.name_bangla + ') FULL PROFILE',
        width: '50%',
        height: 400,
        modal: true,
        layout: {
            type: 'table',
            columns: 3,
            tableAttrs: {
                style: {
                    width: '100%'
                }
            }
        },
        defaults: {
            bodyPadding: '15 20',
            autoHeight: true,
            border: true
        },
        overflowY: 'auto',
        animScroll: false,
        tbar: [
            // {
            //   xtype:'button',
            //   text:'NEW LEAVE',
            //   icon: '/uploads/icons/create.png',
            //   iconCls: 'add',
            //   name:'reload',
            //   tooltip:'Reload',
            //   border: 1,
            //   style: {
            //     borderColor: 'blue',
            //     borderStyle: 'solid'
            //   },
            //   handler: function(){
            //     if(acLvl>600&&acLvl<700){
            //       Ext.MessageBox.alert('ERROR', 'Sorry You Dont Have The Excess.<br />Please Consult With The IT Department.<br /><small><b style="color:red">Repeatedly Doing Might Block Your Account</b></small>');
            //     }else{
            //       employeeLeaveFormWindow(rec);
            //     }
            //   }
            // }
        ],
        items: [Ext.create('Ext.Img', {
                src: '/uploads/images/profile/no-profile-image.png',
                width: 175,
                height: 225,
            }), {
                width: 525,
                height: 275,
                colspan: 2,
                rowspan: 2,
                html: '<div><h1><span style="color: #008000;">' + rec.data.first_name.toUpperCase() + ' (' + rec.data.name_bangla + ')</span></h1><h2>' + rec.data.designation.toUpperCase() + ' (' + rec.data.designationBangla + ')</h2><h3>' + rec.data.section.toUpperCase() + ' (' + rec.data.sectionBangla + ')</h3></div>',
            }, {
                html: 'Signature',
                width: 175,
                height: 45,
            }, {
                width: '100%',
                colspan: 3,
                bodyPadding: '0',
                layout: 'accordion',
                border: true,
                items: [{
                    title: '<b style="color: #008000;">CONTACT INFORMATION</b>',
                    border: false,
                    defaults: {
                        bodyPadding: '10 10',
                        border: false,
                    },
                    layout: {
                        type: 'table',
                        columns: 3,
                        tableAttrs: {
                            style: {
                                width: '100%'
                            }
                        }
                    },
                    items: [{
                        html: '<b>EMAIL</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: rec.data.email,
                        width: 500
                    }, {
                        html: '<b>CONTACT NO</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: rec.data.contact_no,
                        width: 500
                    }, {
                        html: '<b>ADDRESS (ENGLISH)</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: rec.data.address,
                        width: 500
                    }, {
                        html: '<b>ADDRESS (BANGLA)</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: rec.data.address_bangla,
                        width: 500
                    }, ]
                }, {
                    title: '<b style="color: #008000;">BASIC INFORMATION</b>',
                    border: false,
                    defaults: {
                        bodyPadding: '10 10',
                        border: false,
                    },
                    layout: {
                        type: 'table',
                        columns: 3,
                        tableAttrs: {
                            style: {
                                width: '100%'
                            }
                        }
                    },
                    items: [{
                        html: '<b>NAME (ENGLISH)</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: rec.data.first_name.toUpperCase(),
                        width: 500
                    }, {
                        html: '<b>NAME (BANGLA)</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: rec.data.name_bangla,
                        width: 500
                    }, {
                        html: '<b>EMPLOYEE TYPE</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: rec.data.employee_type.toUpperCase(),
                        width: 500
                    }, {
                        html: '<b>DEPARTMENT</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: rec.data.department.toUpperCase(),
                        width: 500
                    }, {
                        html: '<b>SECTION (ENGLISH)</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: rec.data.section.toUpperCase(),
                        width: 500
                    }, {
                        html: '<b>SECTION (BANGLA)</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: rec.data.sectionBangla,
                        width: 500
                    }, {
                        html: '<b>DESIGNATION (ENGLISH)</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: rec.data.designation.toUpperCase(),
                        width: 500
                    }, {
                        html: '<b>DESIGNATION (BANGLA)</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: rec.data.designationBangla,
                        width: 500
                    }, {
                        html: '<b>GRADE</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: rec.data.grade,
                        width: 500
                    }, {
                        html: '<b>DATE_OF_BIRTH</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: new Date(rec.data.date_of_birth).DateFormat1(),
                        width: 500
                    }, {
                        html: '<b>DATE OF JOIN</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: new Date(rec.data.date_of_join).DateFormat1(),
                        width: 500
                    }, {
                        html: '<b>DATE OF RELEASE</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: new Date(rec.data.date_of_release).DateFormat1(),
                        width: 500
                    }, ]
                }, {
                    title: '<b style="color: #008000;">PERSONAL INFORMATION</b>',
                    border: false,
                    defaults: {
                        bodyPadding: '10 10',
                        border: false,
                    },
                    layout: {
                        type: 'table',
                        columns: 3,
                        tableAttrs: {
                            style: {
                                width: '100%'
                            }
                        }
                    },
                    items: [{
                        html: '<b>BLOOD GROUP</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: rec.data.blood_group.toUpperCase(),
                        width: 500
                    }, {
                        html: '<b>NATIONAL ID</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: rec.data.national_id,
                        width: 500
                    }, {
                        html: '<b>RELIGION</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: rec.data.religion.toUpperCase(),
                        width: 500
                    }, {
                        html: '<b>MARITAL STATUS</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: (rec.data.marital_status == 1) ? 'MARRIED' : 'UNMARRIED',
                        width: 500
                    }, {
                        html: '<b>GENDER</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: (rec.data.gender == 1) ? 'MALE' : 'FEMALE',
                        width: 500
                    }, ]
                }, {
                    title: '<b style="color: #008000;">CARD INFORMATION</b>',
                    border: false,
                    defaults: {
                        bodyPadding: '10 10',
                        border: false,
                    },
                    layout: {
                        type: 'table',
                        columns: 3,
                        tableAttrs: {
                            style: {
                                width: '100%'
                            }
                        }
                    },
                    items: [{
                        html: '<b>CARD ISSUE DATE</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: new Date(rec.data.card_issue).DateFormat1(),
                        width: 500
                    }, {
                        html: '<b>CARD EXPIRE DATE</b>',
                        width: 200
                    }, {
                        html: '<b>:</b>',
                        width: 15
                    }, {
                        html: new Date(rec.data.card_expire).DateFormat1(),
                        width: 500
                    }, ]
                }, ]
            },
            // {
            //   html: 'Cell B content',
            //   colspan: 2
            // },
            // {
            //   html: 'Cell D content'
            // }
        ],
        bbar: [
            // {
            //   xtype:'button',
            //   text:'Reload',
            //   icon: '/uploads/icons/refresh.png',
            //   iconCls: 'add',
            //   name:'reload',
            //   tooltip:'Reload',
            //   border: 1,
            //   style: {
            //     borderColor: 'blue',
            //     borderStyle: 'solid'
            //   },
            //   handler: function(){
            //     if(Ext.getCmp('employee_leave_details_grid')){
            //       Ext.getCmp('employee_leave_details_grid').getStore().load();
            //     }
            //   }
            // }
        ]
    }).show();
}

function monthlyUserAttendanceWindow(rec) {
    var tmp = {};
    tmp.id = rec.id;
    tmp.department = rec.data.department;
    tmp.designation = rec.data.designation;
    tmp.date_of_join = (rec.data.date_of_join) ? rec.data.date_of_join : new Date();
    tmp.email = rec.data.email;
    tmp.name = rec.data.first_name.toUpperCase();
    if (rec.comliance)
        tmp.comliance = true;
    return Ext.create('Ext.window.Window', {
        title: 'Monthly User Attendance',
        modal: true,
        layout: 'fit',
        items: [
            monthlyUserAttendanceForm(tmp)
        ]
    }).show();
}

function monthlyUserAttendanceForm(rec) {
    // console.log(rec);
    return Ext.create('Ext.form.Panel', {
        width: '100%',
        bodyPadding: 20,
        border: false,
        layout: {
            type: 'vbox',
            align: 'stretch' // Child items are stretched to full width
        },
        items: [Ext.create('Ext.form.field.Date', {
            name: 'date',
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
        }), ],
        buttons: [{
            text: 'Download (OT)',
            icon: '/uploads/icons/download.png',
            formBind: true,
            handler: function() {
                var panel = this.up('form'),
                    form = panel.getForm(),
                    values = form.getValues();
                if (form.isValid()) {
                    values.date = (values.date != '') ? new Date(values.date) : new Date();
                    values.date.setDate(10);
                    values.file_name = rec.name + '_' + monthNames[values.date.getMonth()] + '_' + values.date.getFullYear() + '_Attendance_Report';
                    values.URL = site_url;
                    values.id = rec.id;
                    values.employee = rec.id;
                    if (tab_panel) {
                        panel.setLoading(true);
                        if (rec.comliance) {
                            socket.emit('DownloadComplianceEmployeeMonthlyAttendanceV2', values).on('DownloadComplianceEmployeeMonthlyAttendanceV2', function(r) {
                                Ext.MessageBox.alert({
                                    title: 'Monthly User Attendance Report Download',
                                    buttons: Ext.MessageBox.CANCEL,
                                    msg: 'Please <a href="/uploads/pdf/' + values.file_name + '.pdf" download>click here</a> to confirm the file download',
                                    animateTarget: 'mb4',
                                    icon: Ext.MessageBox.QUESTION
                                });
                                panel.setLoading(false);
                            });
                        } else {
                            socket.emit('DownloadEmployeeMonthlyAttendanceV2', values).on('DownloadEmployeeMonthlyAttendanceV2', function(r) {
                                Ext.MessageBox.alert({
                                    title: 'Monthly User Attendance Report Download',
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
            }
        }, {
            text: 'Download',
            icon: '/uploads/icons/download.png',
            formBind: true,
            handler: function() {
                var panel = this.up('form'),
                    form = panel.getForm(),
                    values = form.getValues();
                if (form.isValid()) {
                    values.date = (values.date != '') ? new Date(values.date) : new Date();
                    values.date.setDate(10);
                    values.file_name = rec.name + '_' + monthNames[values.date.getMonth()] + '_' + values.date.getFullYear() + '_Attendance_Report';
                    values.URL = site_url;
                    values.id = rec.id;
                    values.employee = rec.id;
                    if (tab_panel) {
                        panel.setLoading(true);
                        if (rec.comliance) {
                            socket.emit('DownloadComplianceEmployeeMonthlyAttendanceV2', values).on('DownloadComplianceEmployeeMonthlyAttendanceV2', function(r) {
                                Ext.MessageBox.alert({
                                    title: 'Monthly User Attendance Report Download',
                                    buttons: Ext.MessageBox.CANCEL,
                                    msg: 'Please <a href="/uploads/pdf/' + values.file_name + '.pdf" download>click here</a> to confirm the file download',
                                    animateTarget: 'mb4',
                                    icon: Ext.MessageBox.QUESTION
                                });
                                panel.setLoading(false);
                            });
                        } else {
                            // socket.emit('DownloadEmployeeMonthlyAttendance', values).on('DownloadEmployeeMonthlyAttendance', function (r) {
                            //   Ext.MessageBox.alert({
                            //     title:'Monthly User Attendance Report Download',
                            //     buttons: Ext.MessageBox.CANCEL,
                            //     msg: 'Please <a href="/uploads/pdf/'+values.file_name+'.pdf" download>click here</a> to confirm the file download',
                            //     animateTarget: 'mb4',
                            //     icon: Ext.MessageBox.QUESTION
                            //   });
                            //   panel.setLoading(false);
                            // });
                            socket.emit('DownloadEmployeeMonthlyAttendanceV2', values).on('DownloadEmployeeMonthlyAttendanceV2', function(r) {
                                Ext.MessageBox.alert({
                                    title: 'Monthly User Attendance Report Download',
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

            }
        }, {
            text: 'Close',
            handler: function() {
                this.up('.window').close();
            }
        }]
    });
}

function employeeLeaveDetailsGrid(rec) {
    return Ext.create('Ext.grid.Panel', {
        id: 'employee_leave_details_grid',
        loadMask: true,
        autoScroll: true,
        //selType: 'cellmodel',
        columnLines: true,
        width: '100%',
        height: 200,
        store: {
            proxy: {
                type: 'ajax',
                url: '/leave_report/' + rec.id
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
            header: 'LEAVE TYPE',
            dataIndex: 'leave',
            align: 'left',
            flex: 1
        }, {
            header: 'TOTAL',
            dataIndex: 'allocation',
            align: 'center',
            flex: 0.5
        }, {
            header: 'TAKEN',
            dataIndex: 'leaves',
            align: 'center',
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                return value.length;
            },
            flex: 0.5
        }, {
            header: 'REMAINS',
            dataIndex: 'leaves',
            align: 'center',
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                return record.get('allocation') - value.length;
            },
            flex: 0.5
        }, {
            xtype: 'actioncolumn',
            header: 'LEAVE DATES',
            flex: 1,
            align: 'center',
            items: [{
                icon: '/uploads/icons/eye.png',
                tooltip: 'LEAVE DATES',
                handler: function(grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex).data.leaves;
                    employeeLeaveDateWindow(rec);
                }
            }]
        }, ]
    });
}

function employeeLeaveFormWindow(rec) {
    var fp = rec.id
    var fn = rec.data.first_name
    var ln = rec.data.last_name
    return Ext.create('Ext.window.Window', {
        title: '(' + fp + ') ' + fn + ' ' + ln + ' Leave Form',
        modal: true,
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '100%',
            bodyPadding: 20,
            border: false,
            items: [
                newCombo('Leave Type', 'leave_type'),
                newDateField('Form Date', 'from_date'),
                newDateField('To Date', 'to_date')
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
                    var from_date = values.from_date.split("/");
                    var to_date = values.to_date.split("/");
                    var fd = parseInt(from_date[1]);
                    var fm = parseInt(from_date[0]) - 1;
                    var fy = parseInt(from_date[2]);
                    var td = parseInt(to_date[1]);
                    var tm = parseInt(to_date[0]) - 1;
                    var ty = parseInt(to_date[2]);
                    values.from_date = new Date(Date.UTC(fy, fm, fd));
                    values.to_date = new Date(Date.UTC(ty, tm, td));
                    values.employee = rec.id;
                    if (form.isValid()) {
                        socket.emit('CreateEmployeeLeave', values).on('CreateEmployeeLeave', function(message) {
                            if (message == "success") {
                                success = true;
                                if (Ext.getCmp('employee_list_grid')) {
                                    Ext.getCmp('employee_list_grid').getStore().load();
                                }
                                if (Ext.getCmp('employee_leave_details_grid')) {
                                    Ext.getCmp('employee_leave_details_grid').getStore().load();
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