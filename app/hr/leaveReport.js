function leaveReportTab() {
    if (Ext.getCmp('leave_report_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("leave_report_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Leave Report',
            id: 'leave_report_tab',
            layout: 'fit',
            closable: true,
            autoScroll: false,
            items: [
                leaveReportGrid()
            ],
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function leaveReportGrid() {
    var store = Ext.create('Ext.data.Store', {
        pageSize: 30,
        remoteSort: true,
        //autoLoad: true,
        //autoSync: true,
        proxy: {
            type: 'ajax',
            url: '/getLeaveList',
            reader: {
                root: 'rows',
                totalProperty: 'count'
            },
            simpleSortMode: true
        },
        sorters: [{
            property: 'date',
            direction: 'DESC'
        }],
        model: Ext.define('LEAVE_LIST_MODEL', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'id',
                type: 'int',
                mapping: 'id'
            }, {
                name: 'leave',
                type: 'string',
                mapping: 'leaveTypeTable.name'
            }, {
                name: 'amount',
                type: 'string',
                mapping: 'leaveTypeTable.amount'
            }, {
                name: 'finger_print_id',
                type: 'int',
                mapping: 'employeeTable.userTable.finger_print_id'
            }, {
                name: 'name',
                type: 'string',
                mapping: 'employeeTable.userTable.first_name'
            }, {
                name: 'date',
                type: 'date',
                mapping: 'date'
            }, ]
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
                leaveReportGridReload();
                return true
            }
            leaveReportGridReload();
            return false
        },
        movePrevious: function() {
            var c = this,
                a = c.store,
                b = a.currentPage - 1;
            if (b > 0) {
                if (c.fireEvent("beforechange", c, b) !== false) {
                    a.previousPage();
                    leaveReportGridReload();
                    return true
                }
            }
            leaveReportGridReload();
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
                    leaveReportGridReload();
                    return true
                }
            }
            leaveReportGridReload();
            return false
        },
        moveLast: function() {
            var b = this,
                a = b.getPageData().pageCount;
            if (b.fireEvent("beforechange", b, a) !== false) {
                b.store.loadPage(a);
                leaveReportGridReload();
                return true
            }
            leaveReportGridReload();
            return false
        },
        doRefresh: function() {
            var b = this,
                a = b.store,
                c = a.currentPage;
            if (b.fireEvent("beforechange", b, c) !== false) {
                a.loadPage(c);
                leaveReportGridReload();
                return true
            }
            leaveReportGridReload();
            return false
        },
    });

    var lGrid = Ext.create('Ext.grid.Panel', {
        id: 'leave_report_grid',
        loadMask: true,
        autoScroll: true,
        //selType: 'cellmodel',
        columnLines: true,
        width: '200%',
        store: store,
        viewConfig: {
            emptyText: 'No records',
            autoDestroy: false
        },
        tbar: [
            Ext.create('Ext.form.ComboBox', {
                name: 'name',
                id: 'leave_report_grid_emp',
                anyMatch: true,
                allowBlank: true,
                editable: true,
                typeAhead: true,
                transform: 'stateSelect',
                forceSelection: true,
                emptyText: 'Select Employee ...',
                labelAlign: 'left',
                labelClsExtra: 'some-class',
                labelStyle: 'text-align:left;border solid 1px white;',
                filedAlign: 'top',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'id',
                selectOnFocus: true,
                triggerAction: 'all',
                style: {
                    borderColor: '#99bce8',
                    borderStyle: 'solid'
                },
                store: {
                    fields: ['id', 'name'],
                    proxy: {
                        type: 'ajax',
                        url: '/getEmployeeCombo'
                    },
                    autoLoad: true,
                    autoSync: true
                },
            }),
            Ext.create('Ext.form.field.Date', {
                name: 'date',
                id: 'leave_report_grid_date',
                filedAlign: 'top',
                allowBlank: true,
                editable: false,
                emptyText: 'Select Month',
                format: "M-Y",
                autoScroll: true,
                style: {
                    borderColor: '#99bce8',
                    borderStyle: 'solid'
                },
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
                    leaveReportGridReload();
                }
            },
            '->',
            gridPaging
        ],
        columns: [
            Ext.create('Ext.grid.RowNumberer', {
                header: '####',
                width: 50
            }), {
                header: 'FP ID',
                dataIndex: 'finger_print_id',
                align: 'center',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    var zero = '';
                    var zero_length = 9 - value.toString().length;
                    while (zero_length > 0) {
                        zero += '0'
                        zero_length--;
                    }
                    return zero + value;
                },
                width: 90
            }, {
                header: 'EMPLOYEE NAME',
                dataIndex: 'name',
                sortable: false,
                align: 'left',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.toUpperCase();
                },
                flex: 1
            }, {
                header: 'LEAVE DATE',
                dataIndex: 'date',
                renderer: Ext.util.Format.dateRenderer('d, F Y'),
                align: 'left',
                flex: 1
            }, {
                header: 'LEAVE',
                sortable: false,
                dataIndex: 'leave',
                align: 'left',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.toUpperCase();
                },
                flex: 0.6
            },
        ]
    });
    store.loadPage(1);
    return lGrid;
}

function leaveReportGridReload() {
    if (Ext.getCmp('leave_report_grid')) {
        var id = Ext.getCmp('leave_report_grid_emp').value;
        var date = Ext.getCmp('leave_report_grid_date').value;
        var params = {};
        if (id)
            params.employee = id;
        if (date)
            params.date = date;
        Ext.getCmp('leave_report_grid').setLoading(true);
        Ext.getCmp('leave_report_grid').getStore().load({
            params: params,
            callback: function(records, operation, success) {
                Ext.getCmp('leave_report_grid').setLoading(false);
            },
            scope: this
        });
    }
}