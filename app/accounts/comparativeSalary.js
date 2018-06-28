function comparativeSalaryTab(rec) {
    var salDate = new Date();
    salDate.setMonth(salDate.getMonth() - 1);
    var salTitle = '<b>' + monthCapitalNames[salDate.getMonth()] + ' COMPARATIVE SALARY</b>';
    var lastUpdate = new Date(rec.last_update)
    lastUpdate.setHours(lastUpdate.getHours() - 6);
    if (Ext.getCmp('comparative_salary_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("comparative_salary_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Comparative Salary',
            layout: 'accordion',
            layoutConfig: {
                titleCollapse: false,
                animate: true,
                activeOnTop: true
            },
            closable: true,
            id: 'comparative_salary_tab',
            autoScroll: true,
            items: [
                comparativeSalaryTypeGrid(1),
                comparativeSalaryTypeGrid(2),
                comparativeSalarySummaryPanel(),
                // comparativeSalaryGrid()
            ],
            tbar: {
                xtype: 'container',
                layout: 'anchor',
                items: [
                    new Ext.Toolbar({
                        items: [
                            Ext.create('Ext.form.field.Date', {
                                name: 'month_search',
                                id: 'comparative_salary_tab_date_search',
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
                            Ext.create('Ext.button.Button', {
                                icon: '/uploads/icons/search.png',
                                text: 'SEARCH',
                                border: 1,
                                style: {
                                    borderColor: 'blue',
                                    borderStyle: 'solid'
                                },
                                formBind: true,
                                handler: function() {
                                    var param = {};
                                    if (Ext.getCmp('comparative_salary_tab_date_search').value) {
                                        param.date = Ext.getCmp('comparative_salary_tab_date_search').value;
                                        param.date.setDate(10);
                                    }
                                    if (param.date && param.date < new Date()) {
                                        var salTitle = '<b>' + monthCapitalNames[param.date.getMonth()] + ' COMPARATIVE SALARY</b>';
                                        Ext.getCmp('comparative_salary_type_grid_1').setLoading(true);
                                        Ext.getCmp('comparative_salary_type_grid_2').setLoading(true);
                                        Ext.getCmp('comparative_salary_summary_panel').setLoading(true);
                                        // socket.emit('CreateComparativeSalaryReport', param).on('CreateComparativeSalaryReport', function (r) {
                                        //   Ext.getCmp('comparative_salary_type_grid_1').getStore().load({
                                        //     params: param,
                                        //     callback: function (records, operation, success){
                                        //       Ext.getCmp('comparative_salary_type_grid_1').setLoading(false);
                                        //     },
                                        //     scope: this
                                        //   });
                                        //   Ext.getCmp('comparative_salary_type_grid_2').getStore().load({
                                        //     params: param,
                                        //     callback: function (records, operation, success){
                                        //       Ext.getCmp('comparative_salary_type_grid_2').setLoading(false);
                                        //     },
                                        //     scope: this
                                        //   });
                                        //   socket.emit('ComparativeSalarySummaryHTML', param).on('ComparativeSalarySummaryHTML', function (rHTData) {
                                        //     Ext.getCmp('comparative_salary_summary_panel').update(rHTData);
                                        //     Ext.getCmp('comparative_salary_summary_panel').setLoading(false);
                                        //   });
                                        //   Ext.getCmp('comparative_salary_title').setTitle(salTitle);
                                        // });
                                        Ext.getCmp('comparative_salary_type_grid_1').getStore().load({
                                            params: param,
                                            callback: function(records, operation, success) {
                                                Ext.getCmp('comparative_salary_type_grid_1').setLoading(false);
                                            },
                                            scope: this
                                        });
                                        Ext.getCmp('comparative_salary_type_grid_2').getStore().load({
                                            params: param,
                                            callback: function(records, operation, success) {
                                                Ext.getCmp('comparative_salary_type_grid_2').setLoading(false);
                                            },
                                            scope: this
                                        });
                                        socket.emit('ComparativeSalarySummaryHTML', param).on('ComparativeSalarySummaryHTML', function(rHTData) {
                                            Ext.getCmp('comparative_salary_summary_panel').update(rHTData);
                                            Ext.getCmp('comparative_salary_summary_panel').setLoading(false);
                                        });
                                    } else {
                                        Ext.MessageBox.alert('Error', 'Select Valid Month First');
                                    }
                                }
                            }),
                            Ext.create('Ext.button.Button', {
                                icon: '/uploads/icons/update.png',
                                text: 'UPDATE',
                                border: 1,
                                style: {
                                    backgroundColor: '#FFAAAA',
                                    borderColor: 'blue',
                                    borderStyle: 'solid'
                                },
                                formBind: true,
                                handler: function() {
                                    var param = {};
                                    if (Ext.getCmp('comparative_salary_tab_date_search').value) {
                                        param.date = Ext.getCmp('comparative_salary_tab_date_search').value;
                                        param.date.setDate(10);
                                    }
                                    if (param.date && param.date < new Date()) {
                                        var searchedMonthFullName = monthCapitalNames[param.date.getMonth()];
                                        var salTitle = '<b>' + searchedMonthFullName + ' COMPARATIVE SALARY</b>';

                                        ComparativeSalarySectionUpdateWindow(param, salTitle);

                                        // var salTitle = '<b>'+monthCapitalNames[param.date.getMonth()]+' COMPARATIVE SALARY</b>';
                                        // param.update = true;
                                        // Ext.getCmp('comparative_salary_type_grid_1').setLoading(true);
                                        // Ext.getCmp('comparative_salary_type_grid_2').setLoading(true);
                                        // Ext.getCmp('comparative_salary_summary_panel').setLoading(true);
                                        // socket.emit('CreateComparativeSalaryReport', param).on('CreateComparativeSalaryReport', function (r) {
                                        //   Ext.getCmp('comparative_salary_type_grid_1').getStore().load({
                                        //     params: param,
                                        //     callback: function (records, operation, success){
                                        //       Ext.getCmp('comparative_salary_type_grid_1').setLoading(false);
                                        //     },
                                        //     scope: this
                                        //   });
                                        //   Ext.getCmp('comparative_salary_type_grid_2').getStore().load({
                                        //     params: param,
                                        //     callback: function (records, operation, success){
                                        //       Ext.getCmp('comparative_salary_type_grid_2').setLoading(false);
                                        //     },
                                        //     scope: this
                                        //   });
                                        //   socket.emit('ComparativeSalarySummaryHTML', param).on('ComparativeSalarySummaryHTML', function (rHTData) {
                                        //     Ext.getCmp('comparative_salary_summary_panel').update(rHTData);
                                        //     Ext.getCmp('comparative_salary_summary_panel').setLoading(false);
                                        //   });
                                        //   Ext.getCmp('comparative_salary_title').setTitle(salTitle);
                                        // });
                                    } else {
                                        Ext.MessageBox.alert('Error', 'Select Valid Month First');
                                    }
                                }
                            }),
                            Ext.create('Ext.button.Button', {
                                icon: '/uploads/icons/download.png',
                                text: 'DOWNLOAD',
                                border: 1,
                                style: {
                                    backgroundColor: '#AAFFAA',
                                    borderColor: 'blue',
                                    borderStyle: 'solid'
                                },
                                formBind: true,
                                handler: function() {
                                    var param = {};
                                    if (Ext.getCmp('comparative_salary_tab_date_search').value) {
                                        param.date = Ext.getCmp('comparative_salary_tab_date_search').value;
                                        param.date.setDate(10);
                                    }
                                    if (param.date && param.date < new Date()) {
                                        var salTitle = '<b>' + monthCapitalNames[param.date.getMonth()] + ' COMPARATIVE SALARY</b>';
                                        param.download = true;
                                        param.file_name = monthNames[param.date.getMonth()] + '_' + param.date.getUTCFullYear() + '_Comparative_Salary_Statement_Report';
                                        Ext.getCmp('comparative_salary_type_grid_1').setLoading(true);
                                        Ext.getCmp('comparative_salary_type_grid_2').setLoading(true);
                                        Ext.getCmp('comparative_salary_summary_panel').setLoading(true);
                                        socket.emit('CreateComparativeSalaryReport', param).on('CreateComparativeSalaryReport', function(rData) {
                                            Ext.getCmp('comparative_salary_type_grid_1').getStore().load({
                                                params: param,
                                                callback: function(records, operation, success) {
                                                    Ext.getCmp('comparative_salary_type_grid_1').setLoading(false);
                                                },
                                                scope: this
                                            });
                                            Ext.getCmp('comparative_salary_type_grid_2').getStore().load({
                                                params: param,
                                                callback: function(records, operation, success) {
                                                    Ext.getCmp('comparative_salary_type_grid_2').setLoading(false);
                                                },
                                                scope: this
                                            });
                                            socket.emit('ComparativeSalarySummaryHTML', param).on('ComparativeSalarySummaryHTML', function(rHTData) {
                                                Ext.getCmp('comparative_salary_summary_panel').update(rHTData);
                                                Ext.getCmp('comparative_salary_summary_panel').setLoading(false);
                                            });
                                            Ext.getCmp('comparative_salary_title').setTitle(salTitle);
                                            if (rData == 'downloaded') {
                                                Ext.MessageBox.alert({
                                                    title: 'Comparative Salary Report Download',
                                                    buttons: Ext.MessageBox.CANCEL,
                                                    msg: 'Please <a href="/uploads/pdf/' + param.file_name + '.pdf" download>click here</a> to confirm the file download',
                                                    animateTarget: 'mb4',
                                                    icon: Ext.MessageBox.QUESTION
                                                });
                                            }
                                        });
                                    } else {
                                        Ext.MessageBox.alert('Error', 'Select Valid Month First');
                                    }
                                }
                            }),
                            '->', {
                                html: '<b>LAST UPDATED AT => ' + lastUpdate + '</b>'
                            },
                        ]
                    }),
                    Ext.create('Ext.panel.Panel', {
                        items: [{
                            id: 'comparative_salary_title',
                            title: salTitle
                        }, ]
                    }),
                ]
            },
        });
        tab_panel.setActiveTab(new_tab);
    }
}


function ComparativeSalarySectionUpdateWindow(QUERY, TITLE) {
    var updateSectionStack = [];
    var successSectionStack = [];
    return Ext.create('Ext.window.Window', {
        title: TITLE,
        id: 'ComparativeSalarySectionUpdateWindow',
        width: '50%',
        modal: true,
        closable: false,
        draggable: false,
        resizable: false,
        layout: 'fit',
        bbar: [{
            xtype: 'button',
            text: 'UPDATE',
            id: 'ComparativeSalarySectionUpdateUpdateButton',
            icon: '/uploads/icons/update.png',
            iconCls: 'add',
            name: 'reload',
            tooltip: 'Update',
            border: 1,
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            handler: function() {
                var sectionStore = Ext.create('Ext.data.Store', {
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
                            name: 'name',
                            type: 'string'
                        }]
                    })
                });
                sectionStore.load({
                    callback: function(records, operation, success) {
                        Ext.getCmp('ComparativeSalarySectionUpdateUpdateButton').disable();
                        Ext.getCmp('ComparativeSalarySectionUpdateCloseButton').disable();

                        function myFLoopS(i) {
                            QUERY.section = records[i].id;
                            QUERY.secName = records[i].data.name;
                            QUERY.employee_type = records[i].data.employee_type;
                            updateSectionStack.push(records[i].id);
                            Ext.getCmp('ComparativeSalarySectionUpdateGrid').getStore().load({
                                callback: function(records, operation, success) {
                                    socket.emit('UpdateComparativeSalarySection', QUERY).on('UpdateComparativeSalarySection' + QUERY.section, function(r) {
                                        successSectionStack.push(records[i].id);
                                        Ext.getCmp('ComparativeSalarySectionUpdateGrid').getStore().load({
                                            callback: function(records, operation, success) {
                                                i++;
                                                if (i > records.length - 1) {
                                                    Ext.getCmp('ComparativeSalarySectionUpdateCloseButton').enable();
                                                    // Ext.getCmp('ComparativeSalarySectionUpdateGrid').setLoading(false);
                                                } else {
                                                    myFLoopS(i);
                                                }
                                            },
                                            scope: this
                                        });
                                    });
                                },
                                scope: this
                            });
                        }
                        myFLoopS(0);
                    },
                    scope: this
                });
            }
        }, {
            xtype: 'button',
            text: 'CLOSE',
            id: 'ComparativeSalarySectionUpdateCloseButton',
            icon: '/uploads/icons/cross.png',
            iconCls: 'add',
            name: 'reload',
            tooltip: 'Update',
            border: 1,
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            handler: function() {
                Ext.getCmp('ComparativeSalarySectionUpdateWindow').close();
            }
        }],
        items: [
            Ext.create('Ext.grid.Panel', {
                loadMask: true,
                autoScroll: true,
                id: 'ComparativeSalarySectionUpdateGrid',
                columnLines: true,
                width: '100%',
                height: 200,
                store: {
                    proxy: {
                        type: 'ajax',
                        url: '/section'
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
                columns: [
                    Ext.create('Ext.grid.RowNumberer'), {
                        header: 'SECTION NAME',
                        dataIndex: 'name',
                        align: 'left',
                        flex: 1
                    }, {
                        header: 'STATUS',
                        dataIndex: 'id',
                        align: 'canter',
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            if (updateSectionStack.indexOf(value) != -1) {
                                if (successSectionStack.indexOf(value) != -1) {
                                    return '<b style="color:green;">SUCCESS..........</b>';
                                } else {
                                    return '<b style="color:red;">LOADING..........</b>';
                                }
                            } else {
                                return '<b style="color:blue;">WAITING..........</b>';
                            }
                        },
                        flex: 1
                    },
                ]
            })
        ],
    }).show();
}

function comparativeSalaryTypeGrid(typeID) {
    var salaryAmountSummary = 0;
    var OTAmountSummary = 0;
    return Ext.create('Ext.grid.Panel', {
        title: (typeID == 1) ? '<big><b style="color:green;">STAFF COMPARATIVE SALARY</b></big>' : '<big><b style="color:green;">WORKER COMPARATIVE SALARY</b></big>',
        id: 'comparative_salary_type_grid_' + typeID,
        loadMask: true,
        autoScroll: true,
        columnLines: true,
        animCollapse: false,
        store: {
            proxy: {
                type: 'ajax',
                // url: '/getComparativeSalaryGridList/TYPE/'+typeID
                url: '/getComparativeSalaryGridList/' + typeID
            },
            autoLoad: true,
            autoSync: true,
            groupField: [
                'section'
            ],
            // model: 'COMPARATIVE_SALARY_MODEL'
            model: Ext.define('COMPARATIVE_SALARY_MODEL_NEW', {
                extend: 'Ext.data.Model',
                fields: [{
                    name: 'id',
                    type: 'int'
                }, {
                    name: 'date',
                    type: 'string'
                }, {
                    name: 'section',
                    type: 'string',
                    mapping: 'sectionTable.name'
                }, {
                    name: 'status',
                    type: 'string',
                    mapping: 'statusTable.name'
                }, {
                    name: 'employee_type',
                    type: 'string',
                    mapping: 'employeeTypeTable.name'
                }, {
                    name: 'payment_method',
                    type: 'string',
                    mapping: 'paymentMethodTable.name'
                }, {
                    name: 'employee_count',
                    type: 'int',
                }, {
                    name: 'salary_amount',
                    type: 'float'
                }, {
                    name: 'ot_amount',
                    type: 'float',
                }, ]
            })
        },
        viewConfig: {
            emptyText: 'No records',
            autoDestroy: false
        },
        features: [{
            ftype: 'groupingsummary',
            groupHeaderTpl: [
                'SECTION: ',
                '{[values.name.toUpperCase()]} ',
                ' - <button value="reload" name="section" style="display: inline-block;background-color: #99bce8;">RELOAD</button>'
            ],
            // groupHeaderTpl: '{columnName}: {[values.name.toUpperCase()]}',
            collapsible: false,
            enableGroupingMenu: true
        }, {
            ftype: 'summary',
            dock: 'bottom'
        }],
        listeners: {
            groupclick: function(view, node, group, e, eOpts) {
                if (e.getTarget().value == 'reload') {
                    var sectionByName = Ext.create('Ext.data.Store', {
                        proxy: {
                            type: 'ajax',
                            url: '/getSectionID/' + group
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
                    });
                    sectionByName.load({
                        callback: function(records, operation, success) {
                            var param = {};
                            if (Ext.getCmp('comparative_salary_tab_date_search').value) {
                                param.date = Ext.getCmp('comparative_salary_tab_date_search').value;
                                param.date.setDate(10);
                                param.section = records[records.length - 1].data.id;
                                param.secName = records[records.length - 1].data.name;
                                param.employee_type = records[records.length - 1].data.employee_type;
                            }
                            if (param.date && param.date < new Date()) {
                                Ext.getCmp('comparative_salary_type_grid_1').setLoading(true);
                                Ext.getCmp('comparative_salary_type_grid_2').setLoading(true);
                                Ext.getCmp('comparative_salary_summary_panel').setLoading(true);
                                socket.emit('UpdateComparativeSalarySection', param).on('UpdateComparativeSalarySection' + param.section, function(rData) {
                                    Ext.getCmp('comparative_salary_type_grid_1').getStore().load({
                                        params: param,
                                        callback: function(records, operation, success) {
                                            Ext.getCmp('comparative_salary_type_grid_1').setLoading(false);
                                        },
                                        scope: this
                                    });
                                    Ext.getCmp('comparative_salary_type_grid_2').getStore().load({
                                        params: param,
                                        callback: function(records, operation, success) {
                                            Ext.getCmp('comparative_salary_type_grid_2').setLoading(false);
                                        },
                                        scope: this
                                    });
                                    socket.emit('ComparativeSalarySummaryHTML', param).on('ComparativeSalarySummaryHTML', function(rHTData) {
                                        Ext.getCmp('comparative_salary_summary_panel').update(rHTData);
                                        Ext.getCmp('comparative_salary_summary_panel').setLoading(false);
                                    });
                                    // Ext.getCmp('comparative_salary_title').setTitle(salTitle);
                                });
                            } else {
                                Ext.MessageBox.alert('Error', 'Select Valid Month First');
                            }
                            // console.log(records[records.length-1].data);
                        },
                        scope: this
                    });
                }
            }
        },
        columns: [{
            header: 'SECTION',
            dataIndex: 'section',
            hidden: true,
            align: 'left',
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                if (value)
                    return value.toUpperCase();
            },
            flex: 1.5
        }, {
            header: 'STATUS',
            dataIndex: 'status',
            align: 'left',
            // rowSpan: 2,
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                if (value)
                    return value.toUpperCase();
            },
            summaryType: 'count',
            summaryRenderer: function(value, summaryData, dataIndex) {
                return '<b><big><center>TOTAL</center></big></b> ';
            },
            flex: 0.8
        }, {
            header: 'PAY METHOD',
            dataIndex: 'payment_method',
            align: 'left',
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                if (value)
                    return value.toUpperCase();
            },
            flex: 0.8
        }, {
            header: 'EMP',
            dataIndex: 'employee_count',
            align: 'center',
            summaryType: 'sum',
            summaryRenderer: function(value, summaryData, dataIndex) {
                return '<b><big>' + value + '</big></b> ';
            },
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                return value;
            },
            flex: 0.5
        }, {
            header: 'SALARY',
            dataIndex: 'salary_amount',
            align: 'right',
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                return value.formatMoney(2, '.', ',');
            },
            summaryType: 'sum',
            summaryRenderer: function(value, summaryData, dataIndex) {
                salaryAmountSummary = value;
                return '<b><big>' + value.formatMoney(2, '.', ',') + '</big></b> ';
            },
            flex: 1.5
        }, {
            header: 'OVERTIME',
            dataIndex: 'ot_amount',
            align: 'right',
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                return value.formatMoney(2, '.', ',');
            },
            summaryType: 'sum',
            summaryRenderer: function(value, summaryData, dataIndex) {
                OTAmountSummary = value;
                return '<b><big>' + value.formatMoney(2, '.', ',') + '</big></b> ';
            },
            flex: 1.5
        }, {
            header: 'TOTAL',
            dataIndex: 'id',
            align: 'right',
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                var salary_amount = parseFloat(record.get('salary_amount'));
                var ot_amount = parseFloat(record.get('ot_amount'));
                var sr = salary_amount + ot_amount;
                return sr.formatMoney(2, '.', ',');
            },
            summaryType: 'sum',
            summaryRenderer: function(value, summaryData, dataIndex) {
                var totalAmount = OTAmountSummary + salaryAmountSummary;
                return '<b><big>' + totalAmount.formatMoney(2, '.', ',') + '</big></b> ';
            },
            flex: 1.5
        }, ]
    });
}

function comparativeSalarySummaryPanel() {
    return Ext.create('Ext.panel.Panel', {
        id: 'comparative_salary_summary_panel',
        title: '<big><b style="color:green;">COMPARATIVE SALARY SUMMARY PANEL</b></big>',
        html: '<div id="outer" style="width:100%;margin: 20px;">' +
            '<div style="display: table;margin: 0 auto;">NOTHING FOUND</div>' +
            '</div>'
    });
}