function salaryTab() {
    if (Ext.getCmp('salary_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("salary_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Employee Salary List',
            layout: 'fit',
            closable: true,
            id: 'salary_tab',
            autoScroll: false,
            items: [
                salaryListGrid()
            ],
            tbar: [
                Ext.create('Ext.Panel', {
                    layout: {
                        type: 'hbox',
                        align: 'left'
                    },
                    items: [
                        Ext.create('Ext.Panel', {
                            layout: {
                                type: 'vbox',
                                align: 'left'
                            },
                            items: [
                                Ext.create('Ext.Panel', {
                                    layout: {
                                        type: 'hbox',
                                        align: 'left'
                                    },
                                    items: [Ext.create('Ext.form.field.Number', {
                                            name: 'fp_id',
                                            id: 'salary_list_fp_id_search',
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
                                                            if (Ext.getCmp('salary_list_grid')) {
                                                                Ext.getCmp('salary_list_grid').setLoading(true);
                                                                //Ext.getCmp('salary_list_fp_id_search').setValue();
                                                                Ext.getCmp('salary_list_card_no_search').clearValue();
                                                                Ext.getCmp('salary_list_name_search').clearValue();
                                                                Ext.getCmp('salary_tab_department').clearValue();
                                                                Ext.getCmp('salary_tab_designation').clearValue();
                                                                Ext.getCmp('salary_tab_section').clearValue();
                                                                Ext.getCmp('salary_tab_employee_type').clearValue();
                                                                Ext.getCmp('salary_list_status').clearValue();
                                                                salaryGridReload();
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }),
                                        Ext.create('Ext.form.ComboBox', {
                                            id: 'salary_list_card_no_search',
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
                                                            if (Ext.getCmp('salary_list_grid')) {
                                                                Ext.getCmp('salary_list_grid').setLoading(true);
                                                                Ext.getCmp('salary_list_fp_id_search').setValue();
                                                                //Ext.getCmp('salary_list_card_no_search').clearValue();
                                                                Ext.getCmp('salary_list_name_search').clearValue();
                                                                Ext.getCmp('salary_tab_department').clearValue();
                                                                Ext.getCmp('salary_tab_designation').clearValue();
                                                                Ext.getCmp('salary_tab_section').clearValue();
                                                                Ext.getCmp('salary_tab_employee_type').clearValue();
                                                                Ext.getCmp('salary_list_status').clearValue();
                                                                salaryGridReload();
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }),
                                        Ext.create('Ext.form.ComboBox', {
                                            id: 'salary_list_name_search',
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
                                                            if (Ext.getCmp('salary_list_grid')) {
                                                                Ext.getCmp('salary_list_grid').setLoading(true);
                                                                Ext.getCmp('salary_list_fp_id_search').setValue();
                                                                Ext.getCmp('salary_list_card_no_search').clearValue();
                                                                //Ext.getCmp('salary_list_name_search').clearValue();
                                                                Ext.getCmp('salary_tab_department').clearValue();
                                                                Ext.getCmp('salary_tab_designation').clearValue();
                                                                Ext.getCmp('salary_tab_section').clearValue();
                                                                Ext.getCmp('salary_tab_employee_type').clearValue();
                                                                Ext.getCmp('salary_list_status').clearValue();
                                                                salaryGridReload();
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }),
                                        Ext.create('Ext.form.ComboBox', {
                                            name: 'department',
                                            id: 'salary_tab_department',
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
                                                    if (Ext.getCmp('salary_list_grid')) {
                                                        Ext.getCmp('salary_list_grid').setLoading(true);
                                                        Ext.getCmp('salary_list_fp_id_search').setValue();
                                                        Ext.getCmp('salary_list_card_no_search').clearValue();
                                                        Ext.getCmp('salary_list_name_search').clearValue();
                                                        //Ext.getCmp('salary_tab_department').clearValue();
                                                        Ext.getCmp('salary_tab_designation').clearValue();
                                                        Ext.getCmp('salary_tab_section').clearValue();
                                                        Ext.getCmp('salary_tab_employee_type').clearValue();
                                                        Ext.getCmp('salary_list_status').clearValue();
                                                        salaryGridReload();
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
                                            name: 'section',
                                            id: 'salary_tab_section',
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
                                                    if (Ext.getCmp('salary_list_grid')) {
                                                        Ext.getCmp('salary_list_grid').setLoading(true);
                                                        Ext.getCmp('salary_list_fp_id_search').setValue();
                                                        Ext.getCmp('salary_list_card_no_search').clearValue();
                                                        Ext.getCmp('salary_list_name_search').clearValue();
                                                        Ext.getCmp('salary_tab_department').clearValue();
                                                        Ext.getCmp('salary_tab_designation').clearValue();
                                                        //Ext.getCmp('salary_tab_section').clearValue();
                                                        Ext.getCmp('salary_tab_employee_type').clearValue();
                                                        Ext.getCmp('salary_list_status').clearValue();
                                                        salaryGridReload();
                                                    }
                                                },
                                            }
                                        }),
                                        Ext.create('Ext.form.ComboBox', {
                                            name: 'designation',
                                            id: 'salary_tab_designation',
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
                                                    if (Ext.getCmp('salary_list_grid')) {
                                                        Ext.getCmp('salary_list_grid').setLoading(true);
                                                        Ext.getCmp('salary_list_fp_id_search').setValue();
                                                        Ext.getCmp('salary_list_card_no_search').clearValue();
                                                        Ext.getCmp('salary_list_name_search').clearValue();
                                                        Ext.getCmp('salary_tab_department').clearValue();
                                                        //Ext.getCmp('salary_tab_designation').clearValue();
                                                        Ext.getCmp('salary_tab_section').clearValue();
                                                        Ext.getCmp('salary_tab_employee_type').clearValue();
                                                        Ext.getCmp('salary_list_status').clearValue();
                                                        salaryGridReload();
                                                    }
                                                },
                                            }
                                        }),
                                        Ext.create('Ext.form.ComboBox', {
                                            name: 'employee_type',
                                            id: 'salary_tab_employee_type',
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
                                                    if (Ext.getCmp('salary_list_grid')) {
                                                        Ext.getCmp('salary_list_grid').setLoading(true);
                                                        Ext.getCmp('salary_list_fp_id_search').setValue();
                                                        Ext.getCmp('salary_list_card_no_search').clearValue();
                                                        Ext.getCmp('salary_list_name_search').clearValue();
                                                        Ext.getCmp('salary_tab_department').clearValue();
                                                        Ext.getCmp('salary_tab_designation').clearValue();
                                                        Ext.getCmp('salary_tab_section').clearValue();
                                                        //Ext.getCmp('salary_tab_employee_type').clearValue();
                                                        Ext.getCmp('salary_list_status').clearValue();
                                                        salaryGridReload();
                                                    }
                                                },
                                            }
                                        }),
                                        Ext.create('Ext.form.ComboBox', {
                                            id: 'salary_list_status',
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
                                                            if (Ext.getCmp('salary_list_grid')) {
                                                                Ext.getCmp('salary_list_grid').setLoading(true);
                                                                Ext.getCmp('salary_list_fp_id_search').setValue();
                                                                Ext.getCmp('salary_list_card_no_search').clearValue();
                                                                Ext.getCmp('salary_list_name_search').clearValue();
                                                                Ext.getCmp('salary_tab_department').clearValue();
                                                                Ext.getCmp('salary_tab_designation').clearValue();
                                                                Ext.getCmp('salary_tab_section').clearValue();
                                                                Ext.getCmp('salary_tab_employee_type').clearValue();
                                                                salaryGridReload();
                                                            }
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
                                salaryGridReload();
                            }
                        },
                    ]
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
                    salaryGridReload();
                }
            }, {
                xtype: 'button',
                text: 'Download',
                icon: '/uploads/icons/upload.png',
                iconCls: 'add',
                name: 'reload',
                tooltip: 'Download Salary Details',
                target: '_blank',
                hrefTarget: '_blank',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    var file_name = 'Employee_Salary_Report';
                    Ext.getCmp('salary_list_grid').setLoading(true);
                    socket.emit('SalaryListPDFDownload', site_url, file_name).on('SalaryListPDFDownload', function(message) {
                        if (message == "success") {
                            Ext.getCmp('salary_list_grid').setLoading(false);
                            Ext.MessageBox.alert({
                                title: 'Salary List Report Download',
                                buttons: Ext.MessageBox.CANCEL,
                                msg: 'Please <a href="/uploads/pdf/' + file_name + '.pdf" download>click here</a> to confirm the file download',
                                animateTarget: 'mb4',
                                icon: Ext.MessageBox.QUESTION
                            });
                        } else if (message == "error") {
                            Ext.MessageBox.alert('Error', 'Something really went wrong. \n Contact with the developer');
                        }
                    });
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function salaryListGrid() {
    var store = Ext.create('Ext.data.Store', {
        pageSize: 30,
        remoteSort: true,
        //autoLoad: true,
        //autoSync: true,
        proxy: {
            type: 'ajax',
            url: '/employee_salary',
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
        model: Ext.define('EMPLOYEE_SALARY_MODEL', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'id',
                type: 'int'
            }, {
                name: 'name',
                type: 'string'
            }, {
                name: 'salary',
                type: 'int'
            }, {
                name: 'approve_date',
                type: 'string'
            } ]
        })

    });
    var gridPaging = Ext.create('Ext.toolbar.Paging', {
        store: store,
        displayInfo: true,
        displayMsg: 'DISPLAYING EMPLOYEE {0} - {1} OF {2}',
        emptyMsg: "No records to display",
        listeners: {
            beforechange: function() {
                salaryGridReload();
            },
            doRefresh: function() {
                salaryGridReload();
            }
        },
    });
    var employee_salary = Ext.create('Ext.grid.Panel', {
        id: 'salary_list_grid',
        columnLines: true,
        store: store,
        loadMask: true,
        autoScroll: true,
        viewConfig: {
            emptyText: 'No records',
            autoDestroy: false,
            getRowClass: function(record) {
                if (record.get('statusID') == 4) {
                    return 'gray-row';
                }
                if (record.get('statusID') == 3) {
                    return 'red-row';
                }
                if (record.get('statusID') == 2) {
                    return 'yellow-row';
                }
            }
        },
        listeners: {
            rowclick: function(grid, row, e) {
                var data = row.data;
                //employeeProfileTab(data);
            },
        },
        features: [{
            ftype: 'summary',
            dock: 'bottom'
        }],
        plugins: [
            cellEditPlugin()
        ],
        tbar: gridPaging,
        columns: [
            Ext.create('Ext.grid.RowNumberer', {
                header: '###',
                align: 'center',
                width: 40,
            }), {
                header: 'FP ID',
                dataIndex: 'id',
                align: 'center',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return addLeadingZero(9, value);
                },
                width: 80,
                summaryType: 'count',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b><big>TOTAL:</big></b> ';
                }
            }, {
                header: 'CARD',
                dataIndex: 'card_no',
                align: 'center',
                // editor: {
                //   xtype: 'numberfield',
                //   editable: true,
                //   minValue:0,
                //   listeners: {
                //     blur: function ( self, event, eOpts ){
                //       var row = Ext.getCmp('salary_list_grid').getSelectionModel().getSelection()[0].data.id;
                //       var data = {};
                //       data.id = row;
                //       data.card_no = self.value;
                //       if (self.value>=0){
                //         socket.emit('UpdateEmployeeCardNo', data).on('UpdateEmployeeCardNo', function (message) {
                //           if (message == "success") {
                //             salaryGridReload();
                //           } else if(message == "error") {
                //               //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                //           }
                //         });
                //       }
                //     }
                //   }
                // },
                width: 60
            }, {
                header: 'GRADE',
                dataIndex: 'grade',
                align: 'left',
                editor: {
                    xtype: 'numberfield',
                    editable: true,
                    minValue: 0,
                    listeners: {
                        blur: function(self, event, eOpts) {
                            var row = Ext.getCmp('salary_list_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.grade = self.value;
                            if (self.value >= 0) {
                                socket.emit('UpdateEmployeeGrade', data).on('UpdateEmployeeGrade', function(message) {
                                    if (message == "success") {
                                        salaryGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                width: 50
            }, {
                header: 'NAME',
                dataIndex: 'name',
                sortable: false,
                align: 'left',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.toUpperCase();
                },
                // editor: {
                //   xtype: 'textfield',
                //   editable: true,
                //   listeners: {
                //     blur: function ( self, event, eOpts ){
                //       var row = Ext.getCmp('salary_list_grid').getSelectionModel().getSelection()[0].data.id;
                //       var data = {};
                //       data.id = row;
                //       data.first_name = self.value;
                //       if (self.value){
                //         socket.emit('UpdateEmployeeFirstName', data).on('UpdateEmployeeFirstName', function (message) {
                //           if (message == "success") {
                //             salaryGridReload();
                //           } else if(message == "error") {
                //               //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                //           }
                //         });
                //       }
                //     }
                //   }
                // },
                width: 150
            }, {
                header: 'NAME (<b>বাংলায়</b>)',
                dataIndex: 'name_bangla',
                align: 'left',
                // editor: {
                //   xtype: 'textfield',
                //   editable: true,
                //   listeners: {
                //     blur: function ( self, event, eOpts ){
                //       var row = Ext.getCmp('salary_list_grid').getSelectionModel().getSelection()[0].data.id;
                //       var data = {};
                //       data.id = row;
                //       data.name_bangla = self.value;
                //       if (self.value){
                //         socket.emit('UpdateEmployeeNameBangla', data).on('UpdateEmployeeNameBangla', function (message) {
                //           if (message == "success") {
                //             salaryGridReload();
                //           } else if(message == "error") {
                //               //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                //           }
                //         });
                //       }
                //     }
                //   }
                // },
                width: 130
            }, {
                header: 'DEPARTMENT',
                dataIndex: 'department',
                align: 'left',
                // field: {
                //   xtype: 'combo',
                //   name: 'department',
                //   allowBlank: false,
                //   editable: false,
                //   emptyText: 'Select Department...',
                //   autoScroll: true,
                //   queryMode: 'local',
                //   displayField: 'name',
                //   valueField: 'id',
                //   selectOnFocus: true,
                //   selectOnTab: true,
                //   triggerAction: 'all',
                //   lazyRender: true,
                //   store: {
                //     fields: ['id', 'name'],
                //     proxy: {
                //       type: 'ajax',
                //       url: '/department'
                //     },
                //     autoLoad: true,
                //     autoSync: true
                //   },
                //   listeners: {
                //     blur: function ( self, event, eOpts ){
                //       var row = Ext.getCmp('salary_list_grid').getSelectionModel().getSelection()[0].data.id;
                //       var data = {};
                //       data.id = row;
                //       data.department = self.value;
                //       if (self.value){
                //         socket.emit('UpdateEmployeeDepartment', data).on('UpdateEmployeeDepartment', function (message) {
                //           if (message == "success") {
                //             salaryGridReload();
                //           } else if(message == "error") {
                //               //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                //           }
                //         });
                //       }
                //     }
                //   }
                // },
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.toUpperCase();
                },
                width: 150
            }, {
                header: 'SECTION',
                dataIndex: 'section',
                sortable: false,
                align: 'left',
                // field: {
                //   xtype: 'combo',
                //   name: 'section',
                //   allowBlank: false,
                //   editable: false,
                //   emptyText: 'Select Section...',
                //   autoScroll: true,
                //   queryMode: 'local',
                //   displayField: 'name',
                //   valueField: 'id',
                //   selectOnFocus: true,
                //   selectOnTab: true,
                //   triggerAction: 'all',
                //   lazyRender: true,
                //   store: {
                //     fields: ['id', 'name'],
                //     proxy: {
                //       type: 'ajax',
                //       url: '/section'
                //     },
                //     autoLoad: true,
                //     autoSync: true
                //   },
                //   listeners: {
                //     blur: function ( self, event, eOpts ){
                //       var row = Ext.getCmp('salary_list_grid').getSelectionModel().getSelection()[0].data.id;
                //       var data = {};
                //       data.id = row;
                //       data.section = self.value;
                //       if (self.value){
                //         socket.emit('UpdateEmployeeSection', data).on('UpdateEmployeeSection', function (message) {
                //           if (message == "success") {
                //             salaryGridReload();
                //           } else if(message == "error") {
                //               //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                //           }
                //         });
                //       }
                //     }
                //   }
                // },
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.toUpperCase();
                },
                width: 150
            }, {
                header: 'DESIGNATION',
                dataIndex: 'designation',
                sortable: false,
                align: 'left',
                // field: {
                //   xtype: 'combo',
                //   name: 'designation',
                //   allowBlank: false,
                //   editable: false,
                //   emptyText: 'Select Designation...',
                //   autoScroll: true,
                //   queryMode: 'local',
                //   displayField: 'name',
                //   valueField: 'id',
                //   selectOnFocus: true,
                //   selectOnTab: true,
                //   triggerAction: 'all',
                //   lazyRender: true,
                //   store: {
                //     fields: ['id', 'name'],
                //     proxy: {
                //       type: 'ajax',
                //       url: '/designation'
                //     },
                //     autoLoad: true,
                //     autoSync: true
                //   },
                //   listeners: {
                //     blur: function ( self, event, eOpts ){
                //       var row = Ext.getCmp('salary_list_grid').getSelectionModel().getSelection()[0].data.id;
                //       var data = {};
                //       data.id = row;
                //       data.designation = self.value;
                //       if (self.value){
                //         socket.emit('UpdateEmployeeDesignation', data).on('UpdateEmployeeDesignation', function (message) {
                //           if (message == "success") {
                //             salaryGridReload();
                //           } else if(message == "error") {
                //               //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                //           }
                //         });
                //       }
                //     },
                //   }
                // },
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.toUpperCase();
                },
                width: 150
            }, {
                header: 'EMP. TYPE',
                dataIndex: 'employee_type',
                align: 'left',
                // field: {
                //   xtype: 'combo',
                //   name: 'employee_type',
                //   allowBlank: false,
                //   editable: false,
                //   emptyText: 'Select Employee Type...',
                //   autoScroll: true,
                //   queryMode: 'local',
                //   displayField: 'name',
                //   valueField: 'id',
                //   selectOnFocus: true,
                //   selectOnTab: true,
                //   triggerAction: 'all',
                //   lazyRender: true,
                //   store: {
                //     fields: ['id', 'name'],
                //     proxy: {
                //       type: 'ajax',
                //       url: '/employee_type'
                //     },
                //     autoLoad: true,
                //     autoSync: true
                //   },
                //   listeners: {
                //     blur: function ( self, event, eOpts ){
                //       var row = Ext.getCmp('salary_list_grid').getSelectionModel().getSelection()[0].data.id;
                //       var data = {};
                //       data.id = row;
                //       data.employee_type = self.value;
                //       if (self.value){
                //         socket.emit('UpdateEmployeeType', data).on('UpdateEmployeeType', function (message) {
                //           if (message == "success") {
                //             salaryGridReload();
                //           } else if(message == "error") {
                //               //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                //           }
                //         });
                //       }
                //     }
                //   }
                // },
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.toUpperCase();
                },
                width: 100
            }, {
                header: 'STATUS',
                dataIndex: 'status',
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
                            var row = Ext.getCmp('salary_list_grid').getSelectionModel().getSelection()[0].data.id;
                            var data = {};
                            data.id = row;
                            data.status = self.value;
                            if (self.value) {
                                socket.emit('UpdateEmployeeStatus', data).on('UpdateEmployeeStatus', function(message) {
                                    if (message == "success") {
                                        salaryGridReload();
                                    } else if (message == "error") {
                                        //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                    }
                                });
                            }
                        }
                    }
                },
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.toUpperCase();
                },
                width: 150
            }, {
                header: 'DATE OF BIRTH',
                dataIndex: 'date_of_birth',
                renderer: Ext.util.Format.dateRenderer('d, F Y'),
                align: 'left',
                // editor: {
                //   xtype: 'datefield',
                //   editable: false,
                //   listeners: {
                //     change: function ( self, newValue, oldValue, eOpts ){
                //       var row = Ext.getCmp('salary_list_grid').getSelectionModel().getSelection()[0].data.id;
                //       var data = {};
                //       data.id = row;
                //       var date = new Date(newValue);
                //       var d = date.getDate();
                //       var m = date.getMonth();
                //       var y = date.getFullYear();
                //       data.date_of_birth = new Date(Date.UTC(y, m, d, 00, 00, 00));
                //       if (newValue!=oldValue){
                //         socket.emit('UpdateEmployeeDateOfBirth', data).on('UpdateEmployeeDateOfBirth', function (message) {
                //           if (message == "success") {
                //             salaryGridReload();
                //           } else if(message == "error") {
                //               //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                //           }
                //         });
                //       }
                //     }
                //   }
                // },
                width: 120
            }, {
                header: 'DATE OF JOIN',
                dataIndex: 'date_of_join',
                renderer: Ext.util.Format.dateRenderer('d, F Y'),
                align: 'left',
                // editor: {
                //   xtype: 'datefield',
                //   editable: false,
                //   listeners: {
                //     change: function ( self, newValue, oldValue, eOpts ){
                //       var row = Ext.getCmp('salary_list_grid').getSelectionModel().getSelection()[0].data.id;
                //       var data = {};
                //       data.id = row;
                //       var date = new Date(newValue);
                //       var d = date.getDate();
                //       var m = date.getMonth();
                //       var y = date.getFullYear();
                //       data.date_of_join = new Date(Date.UTC(y, m, d, 00, 00, 00));
                //       if (newValue!=oldValue){
                //         socket.emit('UpdateEmployeeDateOfJoin', data).on('UpdateEmployeeDateOfJoin', function (message) {
                //           if (message == "success") {
                //             salaryGridReload();
                //           } else if(message == "error") {
                //               //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                //           }
                //         });
                //       }
                //     }
                //   }
                // },
                width: 120
            }, {
                header: 'SALARY',
                dataIndex: 'salary',
                sortable: false,
                align: 'right',
                width: 100,
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.formatMoney(2, '.', ',');
                },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return '<b><big>' + value.formatMoney(2, '.', ',') + '</big></b> ';
                },
            }, {
                header: 'APPROVE DATE',
                dataIndex: 'approve_date',
                sortable: false,
                align: 'center',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    if (value == '00-00-0000') {
                        return 'OOO-0000';
                    } else {
                        var date = new Date(value);
                        return mthCPNames[date.getMonth()] + '-' + date.getFullYear();
                    }
                },
                width: 100
            }, {
                xtype: 'actioncolumn',
                header: 'PROMOTE',
                sortable: false,
                width: 110,
                align: 'center',
                items: [{
                    icon: '/uploads/icons/eye.png',
                    tooltip: 'PROMOTE EMPLOYEE',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        employeePromotionWindow(rec.data);
                    }
                }]
            }, {
                xtype: 'actioncolumn',
                header: 'SAL. DETAILS',
                sortable: false,
                width: 110,
                align: 'center',
                items: [{
                    icon: '/uploads/icons/eye.png',
                    tooltip: 'SALARY DETAILS',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        salaryDetailsWindow(rec.data);
                    }
                }]
            }, {
                xtype: 'actioncolumn',
                header: 'SAL. UPDATE',
                sortable: false,
                width: 110,
                align: 'center',
                items: [{
                    icon: '/uploads/icons/update.png',
                    tooltip: 'UPDATE SALARY',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        salaryInputFormWindow(rec.data);
                    }
                }]
            }, {
                xtype: 'actioncolumn',
                header: 'SAL. DEDUCT',
                align: 'center',
                items: [{
                    icon: '/uploads/icons/eye.png',
                    tooltip: 'SALARY DEDUCTION',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        salaryDeductionDetailsWindow(rec.data)
                    }
                }],
                width: 110
            }, {
                header: 'PAYMENT<br />METHOD',
                dataIndex: 'payment_method',
                sortable: false,
                align: 'center',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return (value == 1) ? 'CASH' : 'BANK';
                },
                width: 100
            }, {
                header: 'ACCOUNT NO',
                dataIndex: 'account_no',
                sortable: false,
                align: 'center',
                width: 130,
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value;
                },
            },
        ]
    });
    store.loadPage(1);
    return employee_salary;
}

function salaryGridReload() {
    if (Ext.getCmp('salary_list_grid')) {
        var department = Ext.getCmp('salary_tab_department').value;
        var designation = Ext.getCmp('salary_tab_designation').value;
        var section = Ext.getCmp('salary_tab_section').value;
        var employee_type = Ext.getCmp('salary_tab_employee_type').value;
        var first_name = Ext.getCmp('salary_list_name_search').value;
        var id = Ext.getCmp('salary_list_fp_id_search').value;
        var card_no = Ext.getCmp('salary_list_card_no_search').value;
        var status = Ext.getCmp('salary_list_status').value;
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
        Ext.getCmp('salary_list_grid').setLoading(true);
        Ext.getCmp('salary_list_grid').getStore().load({
            params: params,
            callback: function(records, operation, success) {
                Ext.getCmp('salary_list_grid').setLoading(false);
            },
            scope: this
        });
    }
}


function employeePromotionWindow(rec) {
    return Ext.create('Ext.window.Window', {
        title: 'Promote ' + rec.name,
        modal: true,
        width: '40%',
        items: [Ext.create('Ext.grid.Panel', {
            id: 'employeePromotionGrid',
            width: '100%',
            columnLines: true,
            loadMask: true,
            autoScroll: true,
            store: {
                proxy: {
                    type: 'ajax',
                    url: '/promotion/' + rec.id
                },
                autoLoad: true,
                autoSync: true,
                model: Ext.define('PROMOTION_MODEL', {
                    extend: 'Ext.data.Model',
                    fields: [{
                        name: 'id',
                        type: 'int'
                    }, {
                        name: 'employee',
                        type: 'string',
                        mapping: 'employeeTable.name'
                    }, {
                        name: 'old_designation',
                        type: 'string',
                        mapping: 'oldDesignation.name'
                    }, {
                        name: 'new_designation',
                        type: 'string',
                        mapping: 'newDesignation.name'
                    }, {
                        name: 'approve_date',
                        type: 'date'
                    }]
                })
            },
            viewConfig: {
                emptyText: 'No records',
                autoDestroy: false
            },
            listeners: {
                rowclick: function(grid, row, e) {
                    var data = row.data;
                }
            },
            features: [{
                ftype: 'summary',
                dock: 'bottom'
            }],
            plugins: [
                cellEditPlugin()
            ],
            tbar: [{
                xtype: 'button',
                text: 'PROMOTE',
                icon: '/uploads/icons/create.png',
                iconCls: 'add',
                name: 'reload',
                tooltip: 'PROMOTE EMPLOYEE',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    employeePromotionFormWindow(rec);
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
                    if (Ext.getCmp('employeePromotionGrid')) {
                        Ext.getCmp('employeePromotionGrid').getStore().load();
                    }
                }
            }],
            columns: [
                Ext.create('Ext.grid.RowNumberer'), {
                    header: 'OLD DESIGNATION',
                    dataIndex: 'old_designation',
                    align: 'center',
                    flex: 0.8
                }, {
                    header: 'NEW DESIGNATION',
                    dataIndex: 'new_designation',
                    align: 'center',
                    flex: 0.8
                }, {
                    header: 'APPROVED MONTH',
                    dataIndex: 'month',
                    renderer: Ext.util.Format.dateRenderer('d, F Y'),
                    align: 'center',
                    flex: 0.8
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
                            Ext.Msg.show({
                                title: 'Delete Promotion?',
                                msg: 'Are you sure you want to delete this information. <br>It will permanently delete this information from the server',
                                buttons: Ext.Msg.YESNO,
                                icon: Ext.Msg.WARNING,
                                fn: function(btn, text) {
                                    if (btn == 'yes') {
                                        socket.emit('DestroyPromotion', rec.id).on('DestroyPromotion', function(message) {
                                            if (message == "success") {
                                                grid.getStore().load();
                                                Ext.MessageBox.alert('success', 'Successfully data removed');
                                            } else if (message == "error") {
                                                Ext.MessageBox.alert('Error', 'Please contact with the developer');
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
                }
            ]
        })]
    }).show();
}

function employeePromotionFormWindow(rec) {
    return Ext.create('Ext.window.Window', {
        title: 'Promote ' + rec.name,
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
            items: [Ext.create('Ext.form.ComboBox', {
                    name: 'old_designation',
                    fieldLabel: 'Old Designation:',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Old Designation',
                    autoScroll: true,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    value: rec.designationID,
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
                }),
                Ext.create('Ext.form.ComboBox', {
                    name: 'new_designation',
                    fieldLabel: 'New Designation:',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'New Designation',
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
                }),
                Ext.create('Ext.form.field.Date', {
                    name: 'month_search',
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
                }),
            ],
            buttons: [{
                text: 'Submit',
                icon: '/uploads/icons/ok.png',
                formBind: true,
                handler: function() {
                    var win = this.up('.window');
                    var panel = this.up('form'),
                        form = panel.getForm(),
                        values = form.getValues();
                    if (form.isValid()) {
                        values.month = (values.month_search != '') ? new Date(values.month_search) : new Date();
                        values.employee = rec.id;
                        values.month.setDate(2);
                        if (tab_panel) {
                            panel.setLoading(true);
                            socket.emit('CreatePromotion', values).on('CreatePromotion', function(r) {
                                Ext.MessageBox.alert({
                                    title: 'Success',
                                    buttons: Ext.MessageBox.CANCEL,
                                    msg: 'Employee ' + rec.name + ' Successfully Promoted',
                                    animateTarget: 'mb4',
                                });
                                win.close();
                                if (Ext.getCmp('employeePromotionGrid')) {
                                    Ext.getCmp('employeePromotionGrid').getStore().load();
                                }
                                salaryGridReload();
                                panel.setLoading(false);
                            });
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

function salaryDetailsWindow(rec) {
    return Ext.create('Ext.window.Window', {
        title: 'Salary Details For ' + rec.name,
        modal: true,
        width: '25%',
        items: [Ext.create('Ext.grid.Panel', {
            id: 'salaryDetailsGrid',
            columnLines: true,
            loadMask: true,
            autoScroll: true,
            store: {
                proxy: {
                    type: 'ajax',
                    url: '/salary/' + rec.id
                },
                autoLoad: true,
                autoSync: true,
                model: Ext.define('SALARY_MODEL', {
                    extend: 'Ext.data.Model',
                    fields: [{
                        name: 'id',
                        type: 'int'
                    }, {
                        name: 'employee',
                        type: 'string',
                        mapping: 'employeeTable.name'
                    }, {
                        name: 'amount',
                        type: 'float'
                    }, {
                        name: 'approve_date',
                        type: 'date'
                    }]
                })
            },
            viewConfig: {
                emptyText: 'No records',
                autoDestroy: false
            },
            listeners: {
                rowclick: function(grid, row, e) {
                    var data = row.data;
                }
            },
            features: [{
                ftype: 'summary',
                dock: 'bottom'
            }],
            plugins: [
                cellEditPlugin()
            ],
            columns: [
                Ext.create('Ext.grid.RowNumberer'), {
                    header: 'SALARY (BDT)',
                    dataIndex: 'amount',
                    align: 'right',
                    flex: 0.5,
                    editor: {
                        xtype: 'numberfield',
                        editable: true,
                        listeners: {
                            blur: function(self, event, eOpts) {
                                var row = Ext.getCmp('salaryDetailsGrid').getSelectionModel().getSelection()[0].data.id;
                                var data = {};
                                data.id = row;
                                data.amount = self.value;
                                if (self.value) {
                                    socket.emit('UpdateSalaryAmount', data).on('UpdateSalaryAmount', function(message) {
                                        if (message == "success") {
                                            if (Ext.getCmp('salaryDetailsGrid')) {
                                                Ext.getCmp('salaryDetailsGrid').getStore().load();
                                            }
                                            if (Ext.getCmp('salary_list_grid')) {
                                                Ext.getCmp('salary_list_grid').getStore().load();
                                            }
                                        } else if (message == "error") {
                                            //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                        }
                                    });
                                }
                            }
                        }
                    },
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        return value.formatMoney(2, '.', ',');
                    },
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b>' + value.formatMoney(2, '.', ',') + '</b> ';
                    },
                }, {
                    header: 'APPROVE DATE',
                    dataIndex: 'approve_date',
                    align: 'center',
                    editor: {
                        xtype: 'datefield',
                        format: 'M-Y', // or other format you'd like
                        editable: false,
                        safeParse: function(value, format) {
                            if (this.picker) {
                                var FDF = this.picker.value[0] + 1 + "/1/" + this.picker.value[1];
                                return new Date(FDF);
                            } else {
                                return new Date(value);
                            }
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
                        emptyText: 'APPROVE DATE',
                        listeners: {
                            blur: function(self, event, eOpts) {
                                var row = Ext.getCmp('salaryDetailsGrid').getSelectionModel().getSelection()[0].data.id;
                                var data = {};
                                data.id = row;
                                data.approve_date = self.value;
                                if (self.value) {
                                    socket.emit('UpdateSalaryApproveDate', data).on('UpdateSalaryApproveDate', function(message) {
                                        if (message == "success") {
                                            if (Ext.getCmp('salaryDetailsGrid')) {
                                                Ext.getCmp('salaryDetailsGrid').getStore().load();
                                                //Ext.MessageBox.alert('success', 'Successfully data updated');
                                            }
                                            if (Ext.getCmp('salary_list_grid')) {
                                                Ext.getCmp('salary_list_grid').getStore().load();
                                            }
                                        } else if (message == "error") {
                                            //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                        }
                                    });
                                }
                            }
                        }
                    },
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        var date = new Date(value);
                        return mthNames[date.getMonth()] + '-' + date.getFullYear();
                    },
                    flex: 0.8
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
                            Ext.Msg.show({
                                title: 'Delete Salary?',
                                msg: 'Are you sure you want to delete this information. <br>It will permanently delete this information from the server',
                                buttons: Ext.Msg.YESNO,
                                icon: Ext.Msg.WARNING,
                                fn: function(btn, text) {
                                    if (btn == 'yes') {
                                        socket.emit('DestroySalary', rec.id).on('DestroySalary', function(message) {
                                            if (message == "success") {
                                                grid.getStore().load();
                                                if (Ext.getCmp('salary_list_grid')) {
                                                    Ext.getCmp('salary_list_grid').getStore().load();
                                                }
                                                Ext.MessageBox.alert('success', 'Successfully data removed');
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
                }
            ]
        })]
    }).show();
}

function employeeBankAccountGrid(eData) {
    return Ext.create('Ext.grid.Panel', {
        id: 'employee_bank_account_grid',
        width: 350,
        autoScroll: true,
        columnLines: true,
        store: {
            proxy: {
                type: 'ajax',
                url: '/getEMPBankAccountList/' + eData.id
            },
            autoLoad: true,
            autoSync: true,
            model: Ext.define('EMP_BANK_ACCOUNT_MODEL', {
                extend: 'Ext.data.Model',
                fields: [{
                        name: 'id',
                        type: 'int'
                    },
                    // {
                    //   name: 'employee',
                    //   type: 'string',
                    //   mapping: 'employeeTable.userTable.first_name'
                    // },
                    // {
                    //   name: 'designation',
                    //   type: 'string',
                    //   mapping: 'employeeTable.designationTable.name'
                    // },
                    // {
                    //   name: 'status',
                    //   type: 'string',
                    //   mapping: 'employeeTable.statu.name'
                    // },
                    // {
                    //   name: 'bonus',
                    //   type: 'boolean',
                    //   convert:function(v,rec){
                    //     return (v)?'YES':'NO';
                    //   }
                    // }
                ]
            }),
            remoteSort: false,
            // sorters: [{
            //   property : 'section',
            //   direction: 'ASC'
            // }],
            listeners: {
                beforeload: function() {
                    Ext.getCmp('employee_bank_account_grid').setLoading(true);
                },
                load: {
                    fn: function() {
                        Ext.getCmp('employee_bank_account_grid').setLoading(false);
                    }
                }
            }
        },
        loadMask: true,
        viewConfig: {

            // listeners: {
            //   refresh: function(view) {
            //     var nodes = view.getNodes();
            //     for (var i = 0; i < nodes.length; i++) {
            //       var node = nodes[i];
            //       // get node record
            //       var record = view.getRecord(node);
            //       // get color from record data
            //       var color = record.get('is_active');
            //       // get all td elements
            //       var cells = Ext.get(node).query('td');  
            //       // set bacground color to all row td elements
            //       for(var j = 0; j < cells.length; j++) {
            //         console.log(cells[j]);
            //         Ext.fly(cells[j]).setStyle('background-color', color);
            //       }
            //     }
            //   }      
            // },
            emptyText: 'No records',
            loadMask: true,
            autoDestroy: false,
            getRowClass: function(record) {
                if (record.get('is_active') == 1) {
                    return 'green-row';
                }
                if (record.get('is_active') == 0) {
                    return 'red-row';
                }
            }
        },
        listeners: {
            rowclick: function(grid, row, e) {
                var data = row.data;
                // data.date = Ext.getCmp('hourlyPunchTitle').text;
                // sectionHourlyPunchDetailsWindow(data);
            }
        },
        columns: [{
            header: 'BANK NAME',
            dataIndex: 'bankName',
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                return value.toUpperCase();
            },
            align: 'left',
            flex: 1,
        }, {
            header: 'ACCOUNT',
            dataIndex: 'account',
            align: 'center',
            flex: 0.7,
        }, {
            header: 'STATUS',
            dataIndex: 'is_active',
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                if (value == 1) {
                    return 'ACTIVE';
                } else {
                    return 'DEACTIVE';
                }
            },
            align: 'center',
            flex: 0.5,
        }, {
            xtype: 'actioncolumn',
            header: ' ',
            flex: 0.2,
            align: 'center',
            items: [{
                icon: '/uploads/icons/update.png',
                tooltip: 'UPDATE',
                handler: function(grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex).data;
                    Ext.getCmp('employee_bank_account_grid').setLoading(true);
                    socket.emit('ActivateEMPBankAccount', rec).on('ActivateEMPBankAccount', function(r) {
                        if (r == "success") {
                            Ext.MessageBox.alert('success', 'Successfully data updated');
                        } else if (r == "error") {
                            Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                        }
                        Ext.getCmp('employee_bank_account_grid').getStore().load({
                            callback: function(records, operation, success) {
                                Ext.getCmp('employee_bank_account_grid').setLoading(false);
                            },
                            scope: this
                        });
                    });
                }
            }]
        }]
    });
}

function salaryDeductionDetailsWindow(rec) {
    return Ext.create('Ext.window.Window', {
        title: rec.name.toUpperCase() + ' DEDUCTION DETAILS',
        width: '80%',
        modal: true,
        layout: 'fit',
        items: [Ext.create('Ext.grid.Panel', {
            id: 'salary_deduction_details_grid',
            loadMask: true,
            autoScroll: true,
            //selType: 'cellmodel',
            columnLines: true,
            width: '100%',
            height: 200,
            store: {
                proxy: {
                    type: 'ajax',
                    url: '/deduction_details/' + rec.id
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
            plugins: [
                cellEditPlugin()
            ],
            tbar: [{
                xtype: 'button',
                text: 'NEW DEDUCTION',
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
                    salaryDeductionFormWindow(rec)
                }
            }],
            columns: [
                Ext.create('Ext.grid.RowNumberer'), {
                    header: 'MONTH',
                    dataIndex: 'month',
                    renderer: Ext.util.Format.dateRenderer('F Y'),
                    align: 'left',
                    flex: 1
                }, {
                    header: 'ADVANCE (TK)',
                    dataIndex: 'advance',
                    align: 'center',
                    editor: {
                        xtype: 'numberfield',
                        editable: true,
                        minValue: 0,
                        listeners: {
                            blur: function(self, event, eOpts) {
                                var row = Ext.getCmp('salary_deduction_details_grid').getSelectionModel().getSelection()[0].data.id;
                                var data = {};
                                data.id = row;
                                data.advance = self.value;
                                if (self.value >= 0) {
                                    socket.emit('UpdateDeductionAdvance', data).on('UpdateDeductionAdvance', function(message) {
                                        if (message == "success") {
                                            salaryGridReload();
                                            if (Ext.getCmp('salary_deduction_details_grid')) {
                                                Ext.getCmp('salary_deduction_details_grid').getStore().load();
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
                    header: 'MEDICAL (TK)',
                    dataIndex: 'medical',
                    align: 'center',
                    editor: {
                        xtype: 'numberfield',
                        editable: true,
                        minValue: 0,
                        listeners: {
                            blur: function(self, event, eOpts) {
                                var row = Ext.getCmp('salary_deduction_details_grid').getSelectionModel().getSelection()[0].data.id;
                                var data = {};
                                data.id = row;
                                data.medical = self.value;
                                if (self.value >= 0) {
                                    socket.emit('UpdateDeductionMedical', data).on('UpdateDeductionMedical', function(message) {
                                        if (message == "success") {
                                            salaryGridReload();
                                            if (Ext.getCmp('salary_deduction_details_grid')) {
                                                Ext.getCmp('salary_deduction_details_grid').getStore().load();
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
                    header: 'STAMP (TK)',
                    dataIndex: 'stamp',
                    align: 'center',
                    editor: {
                        xtype: 'numberfield',
                        editable: true,
                        minValue: 0,
                        listeners: {
                            blur: function(self, event, eOpts) {
                                var row = Ext.getCmp('salary_deduction_details_grid').getSelectionModel().getSelection()[0].data.id;
                                var data = {};
                                data.id = row;
                                data.stamp = self.value;
                                if (self.value >= 0) {
                                    socket.emit('UpdateDeductionStamp', data).on('UpdateDeductionStamp', function(message) {
                                        if (message == "success") {
                                            salaryGridReload();
                                            if (Ext.getCmp('salary_deduction_details_grid')) {
                                                Ext.getCmp('salary_deduction_details_grid').getStore().load();
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
                    header: 'AIT (TK)',
                    dataIndex: 'ait',
                    align: 'center',
                    editor: {
                        xtype: 'numberfield',
                        editable: true,
                        minValue: 0,
                        listeners: {
                            blur: function(self, event, eOpts) {
                                var row = Ext.getCmp('salary_deduction_details_grid').getSelectionModel().getSelection()[0].data.id;
                                var data = {};
                                data.id = row;
                                data.ait = self.value;
                                if (self.value >= 0) {
                                    socket.emit('UpdateDeductionAit', data).on('UpdateDeductionAit', function(message) {
                                        if (message == "success") {
                                            salaryGridReload();
                                            if (Ext.getCmp('salary_deduction_details_grid')) {
                                                Ext.getCmp('salary_deduction_details_grid').getStore().load();
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
                    header: 'LUNCH OUT (TK)',
                    dataIndex: 'lunch_out',
                    align: 'center',
                    editor: {
                        xtype: 'numberfield',
                        editable: true,
                        minValue: 0,
                        listeners: {
                            blur: function(self, event, eOpts) {
                                var row = Ext.getCmp('salary_deduction_details_grid').getSelectionModel().getSelection()[0].data.id;
                                var data = {};
                                data.id = row;
                                data.lunch_out = self.value;
                                if (self.value >= 0) {
                                    socket.emit('UpdateDeductionLunchOut', data).on('UpdateDeductionLunchOut', function(message) {
                                        if (message == "success") {
                                            salaryGridReload();
                                            if (Ext.getCmp('salary_deduction_details_grid')) {
                                                Ext.getCmp('salary_deduction_details_grid').getStore().load();
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
                    header: 'OTHERS (TK)',
                    dataIndex: 'others',
                    align: 'center',
                    editor: {
                        xtype: 'numberfield',
                        editable: true,
                        minValue: 0,
                        listeners: {
                            blur: function(self, event, eOpts) {
                                var row = Ext.getCmp('salary_deduction_details_grid').getSelectionModel().getSelection()[0].data.id;
                                var data = {};
                                data.id = row;
                                data.others = self.value;
                                if (self.value >= 0) {
                                    socket.emit('UpdateDeductionOthers', data).on('UpdateDeductionOthers', function(message) {
                                        if (message == "success") {
                                            salaryGridReload();
                                            if (Ext.getCmp('salary_deduction_details_grid')) {
                                                Ext.getCmp('salary_deduction_details_grid').getStore().load();
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
                    header: 'OVERTIME (H)',
                    dataIndex: 'overtime',
                    align: 'center',
                    editor: {
                        xtype: 'numberfield',
                        editable: true,
                        minValue: 0,
                        listeners: {
                            blur: function(self, event, eOpts) {
                                var row = Ext.getCmp('salary_deduction_details_grid').getSelectionModel().getSelection()[0].data.id;
                                var data = {};
                                data.id = row;
                                data.overtime = self.value;
                                if (self.value >= 0) {
                                    socket.emit('UpdateDeductionOvertime', data).on('UpdateDeductionOvertime', function(message) {
                                        if (message == "success") {
                                            salaryGridReload();
                                            if (Ext.getCmp('salary_deduction_details_grid')) {
                                                Ext.getCmp('salary_deduction_details_grid').getStore().load();
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
                    header: 'EXCESS OVERTIME (H)',
                    dataIndex: 'excess_overtime',
                    align: 'center',
                    editor: {
                        xtype: 'numberfield',
                        editable: true,
                        minValue: 0,
                        listeners: {
                            blur: function(self, event, eOpts) {
                                var row = Ext.getCmp('salary_deduction_details_grid').getSelectionModel().getSelection()[0].data.id;
                                var data = {};
                                data.id = row;
                                data.excess_overtime = self.value;
                                if (self.value >= 0) {
                                    socket.emit('UpdateDeductionExcessOvertime', data).on('UpdateDeductionExcessOvertime', function(message) {
                                        if (message == "success") {
                                            salaryGridReload();
                                            if (Ext.getCmp('salary_deduction_details_grid')) {
                                                Ext.getCmp('salary_deduction_details_grid').getStore().load();
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
                    xtype: 'actioncolumn',
                    header: ' ',
                    width: 25,
                    align: 'center',
                    items: [{
                        icon: '/uploads/icons/delete.png',
                        tooltip: 'Delete',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            socket.emit('DestroySalaryDeduction', rec.id).on('DestroySalaryDeduction', function(message) {
                                if (message == "success") {
                                    if (Ext.getCmp('employee_details_list_grid')) {
                                        Ext.getCmp('employee_details_list_grid').getStore().load();
                                    }
                                    if (Ext.getCmp('salary_deduction_details_grid')) {
                                        Ext.getCmp('salary_deduction_details_grid').getStore().load();
                                    }
                                    Ext.MessageBox.alert('success', 'Successfully Data REMOVED');
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
                }
            ]
        })],
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
                if (Ext.getCmp('salary_deduction_details_grid')) {
                    Ext.getCmp('salary_deduction_details_grid').getStore().load();
                }
            }
        }]
    }).show();
}

function salaryDeductionFormWindow(rec) {
    var fp = rec.id
    var name = rec.name
    return Ext.create('Ext.window.Window', {
        title: '(' + fp + ') ' + name + ' Deduction Form',
        modal: true,
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '100%',
            bodyPadding: 20,
            border: false,
            items: [
                Ext.create('Ext.form.field.Date', {
                    name: 'month',
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
                }),
                numberField('Advance (TK)', 'advance', true),
                numberField('Medical (TK)', 'medical', true),
                numberField('Stamp (TK)', 'stamp', true),
                numberField('AIT (TK)', 'ait', true),
                Ext.create('Ext.form.field.Number', {
                    name: 'lunch_out',
                    fieldLabel: 'Lunch Out (H)',
                    filedAlign: 'top',
                    allowBlank: false,
                    minValue: 0,
                    value: 0,
                    maxValue: 9,
                    labelAlign: 'left',
                    labelStyle: 'text-align:left;border solid 1px white;',
                    labelSeparator: '',
                    emptyText: 'Give Lunch Out...',
                    labelClsExtra: 'some-class',
                    fieldStyle: 'text-align: left;font-size: 12px;',
                    autoScroll: true
                }),
                // numberField('Lunch Out', 'lunch_out', true),
                numberField('Others (TK)', 'others', true),
                numberField('Overtime (H)', 'overtime', true),
                numberField('Excess Overtime (H)', 'excess_overtime', true),
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
                    values.month = new Date(values.month);
                    values.month = Date.UTC(values.month.getFullYear(), values.month.getMonth(), 1, 00, 00, 00);
                    // values.month.setDate(2);
                    values.employee = rec.id;
                    if (form.isValid()) {
                        // console.log(values);
                        socket.emit('CreateSalaryDeduction', values).on('CreateSalaryDeduction', function(message) {
                            if (message == "success") {
                                success = true;
                                if (Ext.getCmp('employee_details_list_grid')) {
                                    Ext.getCmp('employee_details_list_grid').getStore().load();
                                }
                                salaryGridReload()
                                if (Ext.getCmp('salary_deduction_details_grid')) {
                                    Ext.getCmp('salary_deduction_details_grid').getStore().load();
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


function newMonthPicker(a) {
    return Ext.create('Ext.form.field.Date', {
        name: a,
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
}