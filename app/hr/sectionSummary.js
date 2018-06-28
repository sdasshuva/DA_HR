function sectionSummaryTab() {
    if (Ext.getCmp('section_summary_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("section_summary_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Section Summary',
            layout: 'fit',
            closable: true,
            id: 'section_summary_tab',
            autoScroll: false,
            items: [Ext.create('Ext.grid.Panel', {
                id: 'section_summary_grid',
                autoScroll: true,
                columnLines: true,
                store: {
                    proxy: {
                        type: 'ajax',
                        url: '/getSectionSummary'
                    },
                    autoLoad: true,
                    autoSync: true,
                    model: Ext.define('SECTION_SUMMARY_MODEL', {
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
                            //   name: 'bonus',
                            //   type: 'boolean',
                            //   convert:function(v,rec){
                            //     return (v)?'YES':'NO';
                            //   }
                            // }
                        ]
                    }),
                    remoteSort: false,
                    sorters: [{
                        property: 'section',
                        direction: 'ASC'
                    }],
                    listeners: {
                        beforeload: function() {
                            Ext.getCmp('section_summary_grid').setLoading(true);
                        },
                        load: {
                            fn: function() {
                                Ext.getCmp('section_summary_grid').setLoading(false);
                            }
                        }
                    }
                },
                loadMask: true,
                viewConfig: {
                    emptyText: 'No records',
                    loadMask: true,
                    autoDestroy: false
                },
                features: [{
                    ftype: 'summary',
                    dock: 'bottom'
                }],
                listeners: {
                    rowclick: function(grid, row, e) {
                        var data = row.data;
                        // data.date = Ext.getCmp('hourlyPunchTitle').text;
                        // sectionHourlyPunchDetailsWindow(data);
                    }
                },
                columns: [Ext.create('Ext.grid.RowNumberer'), {
                        columns: [{
                                columns: [{
                                    header: ' ----- SECTION NAME ----- ',
                                    dataIndex: 'name',
                                    sortable: false,
                                    align: 'left',
                                    flex: 0.50,
                                }]
                            }]
                            // header: 'SECTION NAME',
                            // dataIndex: 'name',
                            // sortable: false,
                            // renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                            //   return value.toUpperCase();
                            // },
                            // align: 'left',
                            // flex: 0.50,
                            // summaryType: 'count',
                            // summaryRenderer: function(value, summaryData, dataIndex) {
                            //   return '<b><big>TOTAL:</big></b> ';
                            // }
                    }, {
                        header: 'REGULAR',
                        align: 'center',
                        sortable: false,
                        // flex: 4.50,
                        columns: [{
                            header: 'BANK',
                            align: 'center',
                            sortable: false,
                            // flex: 2,
                            columns: [{
                                // header: '<small><small>FOOD</small></small>',
                                header: 'EMP.',
                                dataIndex: 'regular_bank_emp',
                                align: 'center',
                                sortable: false,
                                flex: 0.30,
                            }, {
                                header: 'SALARY',
                                dataIndex: 'regular_bank_salary',
                                align: 'right',
                                sortable: false,
                                flex: 0.50,
                            }, {
                                header: 'EX. OT',
                                dataIndex: 'regular_bank_ex_ot',
                                align: 'right',
                                sortable: false,
                                flex: 0.50,
                            }, {
                                header: 'TOTAL',
                                dataIndex: 'regular_bank_total',
                                align: 'right',
                                sortable: false,
                                flex: 0.50,
                            }, ],
                        }, {
                            header: 'CASH',
                            align: 'center',
                            sortable: false,
                            // flex: 2,
                            columns: [{
                                header: 'EMP.',
                                dataIndex: 'regular_cash_emp',
                                align: 'center',
                                sortable: false,
                                flex: 0.30,
                            }, {
                                header: 'SALARY',
                                dataIndex: 'regular_cash_salary',
                                align: 'right',
                                sortable: false,
                                flex: 0.50,
                            }, {
                                header: 'EX. OT',
                                dataIndex: 'regular_cash_ex_ot',
                                align: 'right',
                                sortable: false,
                                flex: 0.50,
                            }, {
                                header: 'TOTAL',
                                dataIndex: 'regular_cash_total',
                                align: 'right',
                                sortable: false,
                                flex: 0.50,
                            }, ],
                        }, {
                            header: 'REGULAR',
                            columns: [{
                                header: 'TOTAL',
                                dataIndex: 'regular_total',
                                align: 'right',
                                sortable: false,
                                flex: 0.50,
                            }]
                        }, ]
                    }, {
                        header: 'HOLD',
                        align: 'center',
                        sortable: false,
                        // flex: 4.50,
                        columns: [{
                            header: 'BANK',
                            align: 'center',
                            sortable: false,
                            // flex: 2,
                            columns: [{
                                header: 'EMP.',
                                dataIndex: 'hold_bank_emp',
                                align: 'center',
                                sortable: false,
                                flex: 0.30,
                            }, {
                                header: 'SALARY',
                                dataIndex: 'hold_bank_salary',
                                align: 'right',
                                sortable: false,
                                flex: 0.50,
                            }, {
                                header: 'EX. OT',
                                dataIndex: 'hold_bank_ex_ot',
                                align: 'right',
                                sortable: false,
                                flex: 0.50,
                            }, {
                                header: 'TOTAL',
                                dataIndex: 'hold_bank_total',
                                align: 'right',
                                sortable: false,
                                flex: 0.50,
                            }, ],
                        }, {
                            header: 'CASH',
                            align: 'center',
                            sortable: false,
                            // flex: 2,
                            columns: [{
                                header: 'EMP.',
                                dataIndex: 'hold_cash_emp',
                                align: 'center',
                                sortable: false,
                                flex: 0.30,
                            }, {
                                header: 'SALARY',
                                dataIndex: 'hold_cash_salary',
                                align: 'right',
                                sortable: false,
                                flex: 0.50,
                            }, {
                                header: 'EX. OT',
                                dataIndex: 'hold_cash_ex_ot',
                                align: 'right',
                                sortable: false,
                                flex: 0.50,
                            }, {
                                header: 'TOTAL',
                                dataIndex: 'hold_cash_total',
                                align: 'right',
                                sortable: false,
                                flex: 0.50,
                            }, ],
                        }, {
                            header: 'HOLD',
                            columns: [{
                                header: 'TOTAL',
                                dataIndex: 'hold_total',
                                align: 'right',
                                sortable: false,
                                flex: 0.50,
                            }]
                        }, ]
                    }, {
                        columns: [{
                            header: 'SALARY',
                            columns: [{
                                header: 'TOTAL',
                                dataIndex: 'total_salary',
                                align: 'right',
                                sortable: false,
                                flex: 0.50,
                            }]
                        }]
                    },
                    // {
                    //   header: 'DESIGNATION',
                    //   dataIndex: 'designation',
                    //   align: 'left',
                    //   flex: 1,
                    // },
                    // {
                    //   header: '<small>PRESENT<br />DAYS</small>',
                    //   dataIndex: 'present_days',
                    //   align: 'center',
                    //   sortable: false,
                    //   summaryType: 'sum',
                    //   summaryRenderer: function(value, summaryData, dataIndex) {
                    //     return '<b><big>'+value+'</big></b> ';
                    //   },
                    //   flex: 0.5
                    // },
                    // {
                    //   header: '<small>ABSENT<br />DAYS</small>',
                    //   dataIndex: 'absent_days',
                    //   // renderer: Ext.util.Format.dateRenderer('d-M-Y'),
                    //   align: 'center',
                    //   sortable: false,
                    //   summaryType: 'sum',
                    //   summaryRenderer: function(value, summaryData, dataIndex) {
                    //     return '<b><big>'+value+'</big></b> ';
                    //   },
                    //   flex: 0.5
                    // },
                    // {
                    //   header: '<small>OVERTIME (H)</small>',
                    //   dataIndex: 'overtime',
                    //   align: 'center',
                    //   sortable: false,
                    //   summaryType: 'sum',
                    //   summaryRenderer: function(value, summaryData, dataIndex) {
                    //     return '<b><big>'+value+'</big></b> ';
                    //   },
                    //   flex: 0.5
                    // },
                    // {
                    //   header: '<small>EXCESS<br />OVERTIME (H)</small>',
                    //   dataIndex: 'excess_overtime',
                    //   align: 'center',
                    //   sortable: false,
                    //   summaryType: 'sum',
                    //   summaryRenderer: function(value, summaryData, dataIndex) {
                    //     return '<b><big>'+value+'</big></b> ';
                    //   },
                    //   flex: 0.5
                    // },
                    // {
                    //   header: '<small>IN LATE</small>',
                    //   dataIndex: 'in_late',
                    //   align: 'center',
                    //   sortable: false,
                    //   flex: 0.5
                    // },
                    // {
                    //   header: '<small>OUT LATE</small>',
                    //   dataIndex: 'out_late',
                    //   align: 'center',
                    //   sortable: false,
                    //   flex: 0.5
                    // },
                    // {
                    //   header: '<small>BONUS</small>',
                    //   dataIndex: 'bonus',
                    //   align: 'center',
                    //   sortable: false,
                    //   flex: 0.5
                    // },
                ]
            })],
            tbar: [Ext.create('Ext.form.Panel', {
                // width:'30%',
                bodyPadding: 10,
                border: false,
                layout: {
                    type: 'hbox',
                    align: 'stretch' // Child items are stretched to full width
                },
                items: [Ext.create('Ext.form.field.Date', {
                        name: 'month_year',
                        filedAlign: 'top',
                        allowBlank: false,
                        editable: false,
                        emptyText: 'Select Month & Year',
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
                    // Ext.create('Ext.form.ComboBox', {
                    //   name: 'status',
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
                    //       url: '/statusRegularAndHold'
                    //     },
                    //     autoLoad: true,
                    //     autoSync: true
                    //   },
                    // }),
                ],
                buttons: [{
                    text: 'Reset',
                    handler: function() {
                        this.up('form').getForm().reset();
                    }
                }, {
                    text: 'Search',
                    formBind: true,
                    handler: function() {
                        var win = this.up('.window');
                        var panel = this.up('form'),
                            form = panel.getForm(),
                            values = form.getValues();
                        values.date = new Date(values.month_year);
                        values.year = values.date.getFullYear();
                        values.month = values.date.getMonth() + 1;
                        values.status = [1, 2];
                        if (form.isValid()) {
                            if (tab_panel) {
                                Ext.getCmp('section_summary_grid').setLoading(true);
                                Ext.getCmp('section_summary_grid').getStore().load({
                                    params: values,
                                    callback: function(records, operation, success) {
                                        // Ext.getCmp('hourlyPunchTitle').setText(new Date(values.date).DateFormat1())
                                        // console.log(Ext.getCmp('hourlyPunchTitle'));
                                        Ext.getCmp('section_summary_grid').setLoading(false);
                                    },
                                    scope: this
                                });
                            }
                        }
                    }
                }]
            })]
        });
        tab_panel.setActiveTab(new_tab);
    }
}