function complianceROSalaryStatementWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Salary Statement Report',
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
            items: [Ext.create('Ext.form.field.Date', {
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
                }), Ext.create('Ext.form.ComboBox', {
                    name: 'section',
                    fieldLabel: 'Section:',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Section',
                    autoScroll: true,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    selectOnFocus: true,
                    triggerAction: 'all',
                    store: {
                        fields: ['id', 'name', 'employee_type', 'name_bangla'],
                        proxy: {
                            type: 'ajax',
                            url: '/section'
                        },
                        autoLoad: true,
                        autoSync: true
                    },
                }), Ext.create('Ext.form.ComboBox', {
                    name: 'employee_type',
                    fieldLabel: 'Employee Type:',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
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
                }), Ext.create('Ext.form.field.Text', {
                    name: 'status',
                    value: 1,
                    hidden: true
                }),
                // Ext.create('Ext.form.ComboBox', {
                //   name: 'status',
                //   fieldLabel: 'Status:',
                //   filedAlign: 'top',
                //   allowBlank: false,
                //   editable : false,
                //   emptyText: 'Status',
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
                //       url: '/status'
                //     },
                //     autoLoad: true,
                //     autoSync: true
                //   },
                // }),
                Ext.create('Ext.form.ComboBox', {
                    name: 'payment_method',
                    fieldLabel: 'Payment Method:',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Payment Method',
                    autoScroll: true,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    selectOnFocus: true,
                    triggerAction: 'all',
                    store: {
                        fields: ['id', 'name'],
                        data: [{
                            id: 1,
                            name: 'CASH'
                        }, {
                            id: 2,
                            name: 'BANK'
                        }],
                        autoLoad: true,
                        autoSync: true
                    },
                }),
            ],
            buttons: [{
                text: 'Bangla',
                icon: '/uploads/icons/download.png',
                formBind: true,
                handler: function() {
                    var panel = this.up('form'),
                        form = panel.getForm(),
                        values = form.getValues();
                    if (form.isValid()) {
                        values.date = (values.month_search != '') ? new Date(values.month_search) : new Date();
                        var tDate = new Date();
                        values.date.setDate(10);
                        values.file_name = tDate.getDate() + '_' + monthNames[values.date.getMonth()] + '_' + values.date.getUTCFullYear() + '_Salary_Statement_Report';
                        values.sectionName = form.findField("section").rawValue.toUpperCase();
                        values.sectionBanglaName = form.findField("section").valueModels[0].data.name_bangla;
                        values.employeeType = form.findField("employee_type").rawValue.toUpperCase();
                        values.URL = site_url;
                        // var SectionStore = Ext.create('Ext.data.Store', {
                        //   proxy: {
                        //     type: 'ajax',
                        //     url : '/getSection'
                        //   },
                        //   autoLoad: true,
                        //   autoSync: true,
                        //   model: 'TEST_MODEL'
                        // });
                        // SectionStore.load({
                        //   callback: function (records, operation, success) {
                        //     // comparativeSalaryTab(records[0].data);
                        //     console.log(records[0].data)
                        //   },
                        //   scope: this
                        // });


                        // console.log(form.findField("section").valueModels[0].data.employee_type);
                        // console.log(form.findField("section").valueModels[0].data);
                        if (tab_panel) {
                            panel.setLoading(true);
                            socket.emit('DownloadComplianceROBanglaSalaryStatementReport', values).on('DownloadComplianceROBanglaSalaryStatementReport', function(r) {
                                Ext.MessageBox.alert({
                                    title: 'Salary Statement Report Download',
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
            }, {
                text: 'Download',
                icon: '/uploads/icons/download.png',
                formBind: true,
                handler: function() {
                    var panel = this.up('form'),
                        form = panel.getForm(),
                        values = form.getValues();
                    if (form.isValid()) {
                        values.date = (values.month_search != '') ? new Date(values.month_search) : new Date();
                        var tDate = new Date();
                        values.date.setDate(10);
                        values.file_name = tDate.getDate() + '_' + monthNames[values.date.getMonth()] + '_' + values.date.getUTCFullYear() + '_Salary_Statement_Report';
                        values.sectionName = form.findField("section").rawValue.toUpperCase();
                        values.employeeType = form.findField("employee_type").rawValue.toUpperCase();
                        values.URL = site_url;
                        // console.log(form.findField("section").valueModels[0].data.employee_type);
                        if (tab_panel) {
                            panel.setLoading(true);
                            socket.emit('DownloadComplianceROSalaryStatementReport', values).on('DownloadComplianceROSalaryStatementReport', function(r) {
                                Ext.MessageBox.alert({
                                    title: 'Salary Statement Report Download',
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
            }, {
                text: 'Close',
                handler: function() {
                    this.up('.window').close();
                }
            }]
        })]
    }).show();
}

function comlianceEmployeeListTab() {
    if (Ext.getCmp('comliance_employee_list_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("comliance_employee_list_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Employee List',
            layout: 'fit',
            closable: true,
            id: 'comliance_employee_list_tab',
            autoScroll: true,
            items: [
                complianceEmployeeListGrid()
            ],
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function complianceEmployeeListGrid() {
    var store = Ext.create('Ext.data.Store', {
        pageSize: 30,
        remoteSort: true,
        //autoLoad: true,
        //autoSync: true,
        proxy: {
            type: 'ajax',
            url: '/getComplianceEmployeeList',
            reader: {
                root: 'rows',
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
                },
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
                comlianceEmployeesGridReload();
                return true
            }
            comlianceEmployeesGridReload();
            return false
        },
        movePrevious: function() {
            var c = this,
                a = c.store,
                b = a.currentPage - 1;
            if (b > 0) {
                if (c.fireEvent("beforechange", c, b) !== false) {
                    a.previousPage();
                    comlianceEmployeesGridReload();
                    return true
                }
            }
            comlianceEmployeesGridReload();
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
                    comlianceEmployeesGridReload();
                    return true
                }
            }
            comlianceEmployeesGridReload();
            return false
        },
        moveLast: function() {
            var b = this,
                a = b.getPageData().pageCount;
            if (b.fireEvent("beforechange", b, a) !== false) {
                b.store.loadPage(a);
                comlianceEmployeesGridReload();
                return true
            }
            comlianceEmployeesGridReload();
            return false
        },
        doRefresh: function() {
            var b = this,
                a = b.store,
                c = a.currentPage;
            if (b.fireEvent("beforechange", b, c) !== false) {
                a.loadPage(c);
                comlianceEmployeesGridReload();
                return true
            }
            comlianceEmployeesGridReload();
            return false
        },
    });
    var comliance_employees_list_grid = Ext.create('Ext.grid.Panel', {
        id: 'comliance_employees_grid',
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
        tbar: [Ext.create('Ext.form.field.Text', {
                name: 'fp_id',
                id: 'comliance_employee_list_fp_id_search',
                filedAlign: 'top',
                allowBlank: true,
                minValue: 1,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Type Here',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true,
                listeners: {
                    change: {
                        fn: function(combo, value) {
                            if (value) {
                                if (Ext.getCmp('comliance_employees_grid')) {
                                    Ext.getCmp('comliance_employees_grid').setLoading(true);
                                    comlianceEmployeesGridReload();
                                }
                            }
                        }
                    }
                }
            }), {
                xtype: 'button',
                text: 'SEARCH',
                icon: '/uploads/icons/search.png',
                iconCls: 'add',
                name: 'Search',
                tooltip: 'Search',
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    comlianceEmployeesGridReload();
                }
            },
            '->',
            gridPaging
        ],
        bbar: [{
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
            header: '#',
            width: 30
        }), {
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
                    comlianceEmployeesGridReload();
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
                    rec.comliance = true;
                    monthlyUserAttendanceWindow(rec);
                }
            }],
            width: 60,
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
            width: 80
        }, {
            header: 'GRADE',
            dataIndex: 'grade',
            align: 'right',
            width: 70
        }, {
            header: 'FIRST NAME',
            dataIndex: 'first_name',
            align: 'left',
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                return value.toUpperCase();
            },
            width: 150
        }, {
            header: 'NAME (<b>বাংলায়</b>)',
            dataIndex: 'name_bangla',
            align: 'left',
            width: 130
        }, {
            header: 'DEPARTMENT',
            dataIndex: 'department',
            align: 'left',
            width: 120
        }, {
            header: 'DESIGNATION',
            dataIndex: 'designation',
            align: 'left',
            width: 120
        }, {
            header: 'SECTION',
            dataIndex: 'section',
            align: 'left',
            width: 100
        }, {
            header: 'EMP. TYPE',
            dataIndex: 'employee_type',
            align: 'left',
            width: 100
        }, {
            header: 'WORK TIME',
            dataIndex: 'work_time',
            align: 'left',
            width: 100
        }, {
            header: 'DATE OF BIRTH',
            dataIndex: 'date_of_birth',
            renderer: Ext.util.Format.dateRenderer('d, F Y'),
            align: 'left',
            width: 120
        }, {
            header: 'DATE OF JOIN',
            dataIndex: 'date_of_join',
            renderer: Ext.util.Format.dateRenderer('d, F Y'),
            align: 'left',
            width: 120
        }, {
            header: 'STATUS',
            dataIndex: 'statu',
            align: 'center',
            width: 100
        }, ]
    });
    store.loadPage(1);
    return comliance_employees_list_grid;
}

function dailyComplianceAttendanceWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Daily Attendance Report',
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
            items: [Ext.create('Ext.form.field.Date', {
                name: 'date',
                fieldLabel: 'Report Date:',
                filedAlign: 'top',
                allowBlank: false,
                editable: false,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                disabledDays: [5],
                emptyText: 'Give Date...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            })],
            buttons: [{
                text: 'Download',
                icon: '/uploads/icons/dowload.png',
                formBind: true,
                handler: function() {
                    var panel = this.up('form'),
                        form = panel.getForm(),
                        values = form.getValues();
                    if (form.isValid()) {
                        var ms = (values.date != '') ? new Date(values.date) : new Date();
                        values.file_name = ms.getDate() + '_' + monthNames[ms.getMonth()] + '_' + ms.getUTCFullYear() + '_Daily_Report';
                        values.url = site_url;
                        if (tab_panel) {
                            panel.setLoading(true);
                            socket.emit('DownloadDailyAttendanceComplianceReportPDF', values).on('DownloadDailyAttendanceComplianceReportPDF', function(r) {
                                Ext.MessageBox.alert({
                                    title: 'Daily Attendance Download',
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
            }, {
                text: 'Close',
                handler: function() {
                    this.up('.window').close();
                }
            }]
        })]
    }).show();
}

function comlianceEmployeesGridReload() {
    if (Ext.getCmp('comliance_employees_grid')) {
        var id = Ext.getCmp('comliance_employee_list_fp_id_search').value;
        var params = {};
        if (id)
            params.id = id;
        Ext.getCmp('comliance_employees_grid').setLoading(true);
        Ext.getCmp('comliance_employees_grid').getStore().load({
            params: params,
            callback: function(records, operation, success) {
                Ext.getCmp('comliance_employees_grid').setLoading(false);
            },
            scope: this
        });
    }
}