function monthlyPaymentTab() {
    if (Ext.getCmp('monthly_payment_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("monthly_payment_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Monthly Payment',
            layout: 'fit',
            closable: true,
            id: 'monthly_payment_tab',
            autoScroll: false,
            items: [Ext.create('Ext.grid.Panel', {
                id: 'monthly_payment_grid',
                autoScroll: true,
                columnLines: true,
                store: {
                    proxy: {
                        type: 'ajax',
                        url: '/getMonthlyPayment'
                    },
                    autoLoad: true,
                    autoSync: true,
                    model: Ext.define('MONTHLY_PAYMENT_MODEL', {
                        extend: 'Ext.data.Model',
                        fields: [{
                                name: 'id',
                                type: 'int'
                            }, {
                                name: 'fp_id',
                                type: 'int',
                                mapping: 'monthlyAttendanceTable.employee'
                            }, {
                                name: 'employeeName',
                                type: 'string',
                                mapping: 'monthlyAttendanceTable.employeeTable.userTable.first_name'
                            }, {
                                name: 'designationName',
                                type: 'string',
                                mapping: 'monthlyAttendanceTable.employeeTable.designationTable.name'
                            }, {
                                name: 'date_of_join',
                                type: 'date',
                                mapping: 'monthlyAttendanceTable.employeeTable.date_of_join',
                            }, {
                                name: 'card_no',
                                type: 'int',
                                mapping: 'monthlyAttendanceTable.employeeTable.userTable.card_no'
                            }, {
                                name: 'grade',
                                type: 'int',
                                mapping: 'monthlyAttendanceTable.employeeTable.grade'
                            }, {
                                name: 'present_days',
                                type: 'int',
                                mapping: 'monthlyAttendanceTable.present_days'
                            }, {
                                name: 'absent_days',
                                type: 'int',
                                mapping: 'monthlyAttendanceTable.absent_days'
                            },
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
                    //   property : 'id',
                    //   direction: 'ASC'
                    // }],
                    listeners: {
                        beforeload: function() {
                            Ext.getCmp('monthly_payment_grid').setLoading(true);
                        },
                        load: {
                            fn: function() {
                                Ext.getCmp('monthly_payment_grid').setLoading(false);
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
                plugins: [
                    cellEditPlugin()
                ],
                listeners: {
                    rowclick: function(grid, row, e) {
                        var data = row.data;
                        // data.date = Ext.getCmp('hourlyPunchTitle').text;
                        // sectionHourlyPunchDetailsWindow(data);
                    }
                },
                columns: [
                    Ext.create('Ext.grid.RowNumberer'), {
                        header: 'FP ID',
                        dataIndex: 'fp_id',
                        align: 'center',
                        sortable: false,
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            return addLeadingZero(9, value);
                        },
                        width: 100,
                    }, {
                        header: 'EMPLOYEE NAME',
                        dataIndex: 'employeeName',
                        sortable: false,
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            return value.toUpperCase();
                        },
                        align: 'left',
                        width: 150,
                        summaryType: 'count',
                        summaryRenderer: function(value, summaryData, dataIndex) {
                            return '<b><big>TOTAL:</big></b> ';
                        }
                    }, {
                        header: 'DESIGNATION',
                        dataIndex: 'designationName',
                        sortable: false,
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            return value.toUpperCase();
                        },
                        align: 'left',
                        width: 150,
                    }, {
                        header: 'JOIN DATE',
                        dataIndex: 'date_of_join',
                        align: 'center',
                        sortable: false,
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            return value.formatDate();
                        },
                        width: 100,
                    }, {
                        header: '<small><small>CARD NO</small></small>',
                        dataIndex: 'card_no',
                        align: 'center',
                        sortable: false,
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            return addLeadingZero(9, value);
                        },
                        width: 100,
                    }, {
                        header: '<small><small>GRADE</small></small>',
                        dataIndex: 'grade',
                        align: 'center',
                        sortable: false,
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            return value;
                        },
                        width: 60,
                    }, {
                        header: '<small><small>T.D.</small></small>',
                        dataIndex: 'total_days',
                        align: 'center',
                        sortable: false,
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            return value;
                        },
                        summaryType: 'average',
                        summaryRenderer: function(value, summaryData, dataIndex) {
                            return '<b>' + value + '</b> ';
                        },
                        width: 50,
                    }, {
                        header: '<small><small>P.D.</small></small>',
                        dataIndex: 'present_days',
                        align: 'center',
                        sortable: false,
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            return value;
                        },
                        summaryType: 'average',
                        summaryRenderer: function(value, summaryData, dataIndex) {
                            return '<b>' + value + '</b> ';
                        },
                        width: 50,
                    }, {
                        header: '<small><small>A.D.</small></small>',
                        dataIndex: 'absent_days',
                        align: 'center',
                        sortable: false,
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            return value;
                        },
                        summaryType: 'average',
                        summaryRenderer: function(value, summaryData, dataIndex) {
                            return '<b>' + value + '</b> ';
                        },
                        width: 50,
                    }, {
                        header: 'BASIC',
                        dataIndex: 'basic',
                        align: 'right',
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            // var gross = parseFloat(record.get('salary'));
                            // var basic = gross/100*60;
                            // return basic.formatMoney();
                            return value.formatMoney();
                        },
                        sortable: false,
                        summaryType: 'sum',
                        summaryRenderer: function(value, summaryData, dataIndex) {
                            return '<b><big>' + value.formatMoney() + '</big></b> ';
                        },
                        width: 80,
                    }, {
                        header: 'ALLOWANCES',
                        align: 'center',
                        sortable: false,
                        columns: [{
                            header: '<small><small>HOUSE RENT</small></small>',
                            dataIndex: 'house_rent',
                            align: 'right',
                            sortable: false,
                            renderer: function(v, m, r, i, c, s, w) {
                                // var gross = parseFloat(r.get('salary'));
                                // var house_rent = gross/100*30;
                                // return house_rent.formatMoney();
                                return v.formatMoney();
                            },
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b>' + value.formatMoney() + '</b> ';
                            },
                            width: 80,
                        }, {
                            header: '<small><small>MEDICAL</small></small>',
                            dataIndex: 'medical',
                            align: 'right',
                            sortable: false,
                            renderer: function(v, m, r, i, c, s, w) {
                                // var gross = parseFloat(r.get('salary'));
                                // var medical = gross/100*5;
                                // return medical.formatMoney();
                                return v.formatMoney();
                            },
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b>' + value.formatMoney() + '</b> ';
                            },
                            width: 80,
                        }, {
                            header: '<small><small>CONVEYANCE</small></small>',
                            dataIndex: 'conveyance',
                            align: 'right',
                            sortable: false,
                            renderer: function(v, m, r, i, c, s, w) {
                                // var gross = parseFloat(r.get('salary'));
                                // var conveyance = gross/100*5;
                                // return conveyance.formatMoney();
                                return v.formatMoney();
                            },
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b>' + value.formatMoney() + '</b> ';
                            },
                            width: 80,
                        }, {
                            header: '<small><small>FOOD</small></small>',
                            dataIndex: 'food',
                            align: 'right',
                            sortable: false,
                            renderer: function(v, m, r, i, c, s, w) {
                                // var gross = parseFloat(r.get('salary'));
                                // var food = 650;
                                // return food.formatMoney();
                                return v.formatMoney();
                            },
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b>' + value.formatMoney() + '</b> ';
                            },
                            width: 80,
                        }, ],
                    }, {
                        header: 'GROSS<br />SALARY',
                        align: 'center',
                        sortable: false,
                        columns: [{
                            // header: 'GROSS<br />SALARY',
                            dataIndex: 'salary',
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return value.formatMoney();
                            },
                            sortable: false,
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b><big>' + value.formatMoney() + '</big></b> ';
                            },
                            width: 100,
                        }]
                    }, {
                        header: 'DEDUCTION',
                        align: 'center',
                        sortable: false,
                        columns: [{
                            header: '<small><small>ABSENT</small></small>',
                            dataIndex: 'absent_deduct',
                            align: 'right',
                            sortable: false,
                            renderer: function(v, m, r, i, c, s, w) {
                                // var gross = parseFloat(r.get('salary'));
                                // var house_rent = gross/100*30;
                                // return house_rent.formatMoney();
                                return v.formatMoney();
                            },
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b>' + value.formatMoney() + '</b> ';
                            },
                            width: 80,
                        }, {
                            header: '<small><small>ADVANCE</small></small>',
                            dataIndex: 'advance_deduct',
                            align: 'right',
                            sortable: false,
                            renderer: function(v, m, r, i, c, s, w) {
                                // var gross = parseFloat(r.get('salary'));
                                // var medical = gross/100*5;
                                // return medical.formatMoney();
                                return v.formatMoney();
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('monthly_payment_grid').getSelectionModel().getSelection()[0].data;
                                        var data = {};
                                        data.id = row.deduction;
                                        data.advance = self.value;
                                        socket.emit('UpdateDeductionAdvance', data).on('UpdateDeductionAdvance', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('monthly_payment_grid')) {
                                                    var params = {};
                                                    if (Ext.getCmp('monthly_payment_tab_month_year')) {
                                                        params.date = new Date(Ext.getCmp('monthly_payment_tab_month_year').value);
                                                        params.year = params.date.getFullYear();
                                                        params.month = params.date.getMonth() + 1;
                                                    }
                                                    if (Ext.getCmp('monthly_payment_tab_section')) {
                                                        params.section = Ext.getCmp('monthly_payment_tab_section').value;
                                                    }
                                                    if (Ext.getCmp('monthly_payment_tab_payment_type')) {
                                                        params.payment_type = Ext.getCmp('monthly_payment_tab_payment_type').value;
                                                    }
                                                    params.status = [1, 2];

                                                    Ext.getCmp('monthly_payment_grid').setLoading(true);
                                                    Ext.getCmp('monthly_payment_grid').getStore().load({
                                                        params: params,
                                                        callback: function(records, operation, success) {
                                                            Ext.getCmp('monthly_payment_grid').setLoading(false);
                                                        },
                                                        scope: this
                                                    });
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b>' + value.formatMoney() + '</b> ';
                            },
                            width: 80,
                        }, {
                            header: '<small><small>MEDICAL</small></small>',
                            dataIndex: 'medical_deduct',
                            align: 'right',
                            sortable: false,
                            renderer: function(v, m, r, i, c, s, w) {
                                // var gross = parseFloat(r.get('salary'));
                                // var conveyance = gross/100*5;
                                // return conveyance.formatMoney();
                                return v.formatMoney();
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('monthly_payment_grid').getSelectionModel().getSelection()[0].data;
                                        var data = {};
                                        data.id = row.deduction;
                                        data.medical = self.value;
                                        socket.emit('UpdateDeductionMedical', data).on('UpdateDeductionMedical', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('monthly_payment_grid')) {
                                                    var params = {};
                                                    if (Ext.getCmp('monthly_payment_tab_month_year')) {
                                                        params.date = new Date(Ext.getCmp('monthly_payment_tab_month_year').value);
                                                        params.year = params.date.getFullYear();
                                                        params.month = params.date.getMonth() + 1;
                                                    }
                                                    if (Ext.getCmp('monthly_payment_tab_section')) {
                                                        params.section = Ext.getCmp('monthly_payment_tab_section').value;
                                                    }
                                                    if (Ext.getCmp('monthly_payment_tab_payment_type')) {
                                                        params.payment_type = Ext.getCmp('monthly_payment_tab_payment_type').value;
                                                    }
                                                    params.status = [1, 2];
                                                    Ext.getCmp('monthly_payment_grid').setLoading(true);
                                                    Ext.getCmp('monthly_payment_grid').getStore().load({
                                                        params: params,
                                                        callback: function(records, operation, success) {
                                                            Ext.getCmp('monthly_payment_grid').setLoading(false);
                                                        },
                                                        scope: this
                                                    });
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b>' + value.formatMoney() + '</b> ';
                            },
                            width: 80,
                        }, {
                            header: '<small><small>STAMP</small></small>',
                            dataIndex: 'stamp_deduct',
                            align: 'right',
                            sortable: false,
                            renderer: function(v, m, r, i, c, s, w) {
                                // var gross = parseFloat(r.get('salary'));
                                // var stamp_deduct = 650;
                                // return stamp_deduct.formatMoney();
                                return v.formatMoney();
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('monthly_payment_grid').getSelectionModel().getSelection()[0].data;
                                        var data = {};
                                        data.id = row.deduction;
                                        data.stamp = self.value;
                                        socket.emit('UpdateDeductionStamp', data).on('UpdateDeductionStamp', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('monthly_payment_grid')) {
                                                    var params = {};
                                                    if (Ext.getCmp('monthly_payment_tab_month_year')) {
                                                        params.date = new Date(Ext.getCmp('monthly_payment_tab_month_year').value);
                                                        params.year = params.date.getFullYear();
                                                        params.month = params.date.getMonth() + 1;
                                                    }
                                                    if (Ext.getCmp('monthly_payment_tab_section')) {
                                                        params.section = Ext.getCmp('monthly_payment_tab_section').value;
                                                    }
                                                    if (Ext.getCmp('monthly_payment_tab_payment_type')) {
                                                        params.payment_type = Ext.getCmp('monthly_payment_tab_payment_type').value;
                                                    }
                                                    params.status = [1, 2];
                                                    Ext.getCmp('monthly_payment_grid').setLoading(true);
                                                    Ext.getCmp('monthly_payment_grid').getStore().load({
                                                        params: params,
                                                        callback: function(records, operation, success) {
                                                            Ext.getCmp('monthly_payment_grid').setLoading(false);
                                                        },
                                                        scope: this
                                                    });
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b>' + value.formatMoney() + '</b> ';
                            },
                            width: 80,
                        }, {
                            header: '<small><small>LUNCH<br />OUT</small></small>',
                            dataIndex: 'lunch_out_deduct',
                            align: 'right',
                            sortable: false,
                            renderer: function(v, m, r, i, c, s, w) {
                                // var gross = parseFloat(r.get('salary'));
                                // var lunch_out = 650;
                                // return lunch_out.formatMoney();
                                return v.formatMoney();
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('monthly_payment_grid').getSelectionModel().getSelection()[0].data;
                                        var data = {};
                                        data.id = row.deduction;
                                        data.lunch_out = self.value;
                                        socket.emit('UpdateDeductionLunchOut', data).on('UpdateDeductionLunchOut', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('monthly_payment_grid')) {
                                                    var params = {};
                                                    if (Ext.getCmp('monthly_payment_tab_month_year')) {
                                                        params.date = new Date(Ext.getCmp('monthly_payment_tab_month_year').value);
                                                        params.year = params.date.getFullYear();
                                                        params.month = params.date.getMonth() + 1;
                                                    }
                                                    if (Ext.getCmp('monthly_payment_tab_section')) {
                                                        params.section = Ext.getCmp('monthly_payment_tab_section').value;
                                                    }
                                                    if (Ext.getCmp('monthly_payment_tab_payment_type')) {
                                                        params.payment_type = Ext.getCmp('monthly_payment_tab_payment_type').value;
                                                    }
                                                    params.status = [1, 2];
                                                    Ext.getCmp('monthly_payment_grid').setLoading(true);
                                                    Ext.getCmp('monthly_payment_grid').getStore().load({
                                                        params: params,
                                                        callback: function(records, operation, success) {
                                                            Ext.getCmp('monthly_payment_grid').setLoading(false);
                                                        },
                                                        scope: this
                                                    });
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b>' + value.formatMoney() + '</b> ';
                            },
                            width: 80,
                        }, {
                            header: '<small><small>OTHERS</small></small>',
                            dataIndex: 'others_deduct',
                            align: 'right',
                            sortable: false,
                            renderer: function(v, m, r, i, c, s, w) {
                                // var gross = parseFloat(r.get('salary'));
                                // var others_deduct = 650;
                                // return others_deduct.formatMoney();
                                return v.formatMoney();
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('monthly_payment_grid').getSelectionModel().getSelection()[0].data;
                                        var data = {};
                                        data.id = row.deduction;
                                        data.others = self.value;
                                        socket.emit('UpdateDeductionOthers', data).on('UpdateDeductionOthers', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('monthly_payment_grid')) {
                                                    var params = {};
                                                    if (Ext.getCmp('monthly_payment_tab_month_year')) {
                                                        params.date = new Date(Ext.getCmp('monthly_payment_tab_month_year').value);
                                                        params.year = params.date.getFullYear();
                                                        params.month = params.date.getMonth() + 1;
                                                    }
                                                    if (Ext.getCmp('monthly_payment_tab_section')) {
                                                        params.section = Ext.getCmp('monthly_payment_tab_section').value;
                                                    }
                                                    if (Ext.getCmp('monthly_payment_tab_payment_type')) {
                                                        params.payment_type = Ext.getCmp('monthly_payment_tab_payment_type').value;
                                                    }
                                                    params.status = [1, 2];
                                                    Ext.getCmp('monthly_payment_grid').setLoading(true);
                                                    Ext.getCmp('monthly_payment_grid').getStore().load({
                                                        params: params,
                                                        callback: function(records, operation, success) {
                                                            Ext.getCmp('monthly_payment_grid').setLoading(false);
                                                        },
                                                        scope: this
                                                    });
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b>' + value.formatMoney() + '</b> ';
                            },
                            width: 80,
                        }, {
                            header: '<small><small>AIT</small></small>',
                            dataIndex: 'ait_deduct',
                            align: 'right',
                            sortable: false,
                            renderer: function(v, m, r, i, c, s, w) {
                                // var gross = parseFloat(r.get('salary'));
                                // var ait_deduct = 650;
                                // return ait_deduct.formatMoney();
                                return v.formatMoney();
                            },
                            editor: {
                                xtype: 'numberfield',
                                editable: true,
                                listeners: {
                                    blur: function(self, event, eOpts) {
                                        var row = Ext.getCmp('monthly_payment_grid').getSelectionModel().getSelection()[0].data;
                                        var data = {};
                                        data.id = row.deduction;
                                        data.ait = self.value;
                                        socket.emit('UpdateDeductionAit', data).on('UpdateDeductionAit', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('monthly_payment_grid')) {
                                                    var params = {};
                                                    if (Ext.getCmp('monthly_payment_tab_month_year')) {
                                                        params.date = new Date(Ext.getCmp('monthly_payment_tab_month_year').value);
                                                        params.year = params.date.getFullYear();
                                                        params.month = params.date.getMonth() + 1;
                                                    }
                                                    if (Ext.getCmp('monthly_payment_tab_section')) {
                                                        params.section = Ext.getCmp('monthly_payment_tab_section').value;
                                                    }
                                                    if (Ext.getCmp('monthly_payment_tab_payment_type')) {
                                                        params.payment_type = Ext.getCmp('monthly_payment_tab_payment_type').value;
                                                    }
                                                    params.status = [1, 2];
                                                    Ext.getCmp('monthly_payment_grid').setLoading(true);
                                                    Ext.getCmp('monthly_payment_grid').getStore().load({
                                                        params: params,
                                                        callback: function(records, operation, success) {
                                                            Ext.getCmp('monthly_payment_grid').setLoading(false);
                                                        },
                                                        scope: this
                                                    });
                                                }
                                            } else if (message == "error") {
                                                //Ext.MessageBox.alert('Error', 'Data not updated. \nPossible problem could be duplicate entry');
                                            }
                                        });
                                    }
                                }
                            },
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b>' + value.formatMoney() + '</b> ';
                            },
                            width: 80,
                        }, ],
                    }, {
                        header: 'TOTAL<br />DEDUCT',
                        align: 'center',
                        sortable: false,
                        columns: [{
                            // header: 'TOTAL<br />DEDUCT',
                            dataIndex: 'total_deduct',
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return value.formatMoney();
                            },
                            sortable: false,
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b><big>' + value.formatMoney() + '</big></b> ';
                            },
                            width: 100,
                        }, ]
                    }, {
                        header: 'ATT<br />BONUS',
                        align: 'center',
                        sortable: false,
                        columns: [{
                            // header: 'ATT<br />BONUS',
                            dataIndex: 'attendanceBonus',
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return value.formatMoney();
                            },
                            sortable: false,
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b><big>' + value.formatMoney() + '</big></b> ';
                            },
                            width: 100,
                        }, ]
                    }, {
                        header: 'OVERTIME',
                        align: 'center',
                        sortable: false,
                        columns: [{
                            header: '<small><small>HOUR</small></small>',
                            dataIndex: 'ot_hour',
                            align: 'center',
                            sortable: false,
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b>' + value + '</b> ';
                            },
                            width: 80,
                        }, {
                            header: '<small><small>RATE</small></small>',
                            dataIndex: 'ot_rate',
                            align: 'right',
                            sortable: false,
                            renderer: function(v, m, r, i, c, s, w) {
                                return v.formatMoney();
                            },
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b>' + value.formatMoney() + '</b> ';
                            },
                            width: 80,
                        }, {
                            header: '<small><small>TAKA</small></small>',
                            dataIndex: 'ot_taka',
                            align: 'right',
                            sortable: false,
                            renderer: function(v, m, r, i, c, s, w) {
                                return v.formatMoney();
                            },
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b>' + value.formatMoney() + '</b> ';
                            },
                            width: 80,
                        }, ],
                    }, {
                        header: 'NET<br />PAYABLE',
                        align: 'center',
                        sortable: false,
                        columns: [{
                            // header: 'NET<br />PAYABLE',
                            dataIndex: 'net_payable',
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return value.formatMoney();
                            },
                            sortable: false,
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b><big>' + value.formatMoney() + '</big></b> ';
                            },
                            width: 100,
                        }]
                    }, {
                        header: 'EXCESS OVERTIME',
                        align: 'center',
                        sortable: false,
                        columns: [{
                            header: '<small><small>HOUR</small></small>',
                            dataIndex: 'ex_ot_hour',
                            align: 'center',
                            sortable: false,
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b>' + value + '</b> ';
                            },
                            width: 80,
                        }, {
                            header: '<small><small>RATE</small></small>',
                            dataIndex: 'ex_ot_rate',
                            align: 'right',
                            sortable: false,
                            renderer: function(v, m, r, i, c, s, w) {
                                return v.formatMoney();
                            },
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b>' + value.formatMoney() + '</b> ';
                            },
                            width: 80,
                        }, {
                            header: '<small><small>TAKA</small></small>',
                            dataIndex: 'ex_ot_taka',
                            align: 'right',
                            sortable: false,
                            renderer: function(v, m, r, i, c, s, w) {
                                return v.formatMoney();
                            },
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b>' + value.formatMoney() + '</b> ';
                            },
                            width: 80,
                        }, ],
                    }, {
                        header: 'TOTAL<br />PAYABLE',
                        align: 'center',
                        sortable: false,
                        columns: [{
                            // header: 'TOTAL<br />PAYABLE',
                            dataIndex: 'total_payable',
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return value.formatMoney();
                            },
                            sortable: false,
                            summaryType: 'sum',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b><big>' + value.formatMoney() + '</big></b> ';
                            },
                            width: 100,
                        }]
                    }, {
                        header: 'PAY<br />MODE',
                        dataIndex: 'pay_mode',
                        align: 'center',
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            return value;
                        },
                        width: 100,
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
                                    title: 'Delete Employee Payment Details?',
                                    msg: 'Are you sure you want to delete this information. <br>It will permanently delete this information from the server',
                                    buttons: Ext.Msg.YESNO,
                                    icon: Ext.Msg.WARNING,
                                    fn: function(btn, text) {
                                        if (btn == 'yes') {
                                            socket.emit('DestroyMonthlyPayment', rec.id).on('DestroyMonthlyPayment', function(message) {
                                                if (message == "success") {
                                                    var params = {};
                                                    if (Ext.getCmp('monthly_payment_tab_month_year')) {
                                                        params.date = new Date(Ext.getCmp('monthly_payment_tab_month_year').value);
                                                        params.year = params.date.getFullYear();
                                                        params.month = params.date.getMonth() + 1;
                                                    }
                                                    if (Ext.getCmp('monthly_payment_tab_section')) {
                                                        params.section = new Date(Ext.getCmp('monthly_payment_tab_section').value);
                                                    }
                                                    if (Ext.getCmp('monthly_payment_tab_payment_type')) {
                                                        params.payment_type = new Date(Ext.getCmp('monthly_payment_tab_payment_type').value);
                                                    }
                                                    params.status = [1, 2];
                                                    Ext.getCmp('monthly_payment_grid').setLoading(true);
                                                    Ext.getCmp('monthly_payment_grid').getStore().load({
                                                        params: params,
                                                        callback: function(records, operation, success) {
                                                            Ext.getCmp('monthly_payment_grid').setLoading(false);
                                                        },
                                                        scope: this
                                                    });
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
            })],
            tbar: [
                Ext.create('Ext.form.Panel', {
                    // width:'30%',
                    bodyPadding: 10,
                    border: false,
                    layout: {
                        type: 'hbox',
                        align: 'stretch' // Child items are stretched to full width
                    },
                    items: [Ext.create('Ext.form.field.Date', {
                            id: 'monthly_payment_tab_month_year',
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
                        Ext.create('Ext.form.ComboBox', {
                            id: 'monthly_payment_tab_section',
                            name: 'section',
                            anyMatch: true,
                            typeAhead: true,
                            transform: 'stateSelect',
                            forceSelection: true,
                            editable: true,
                            allowBlank: false,
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
                                blur: function(self, The, eOpts) {},
                            }
                        }),
                        Ext.create('Ext.form.ComboBox', {
                            id: 'monthly_payment_tab_payment_type',
                            name: 'payment_type',
                            filedAlign: 'top',
                            allowBlank: false,
                            editable: false,
                            emptyText: 'Payment Type',
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
                                    url: '/getPaymentType'
                                },
                                autoLoad: true,
                                autoSync: true
                            },
                        }),
                        Ext.create('Ext.form.ComboBox', {
                            id: 'monthly_payment_tab_download_type',
                            name: 'download_type',
                            filedAlign: 'top',
                            allowBlank: true,
                            editable: false,
                            emptyText: 'Download Type',
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
                                    name: 'SALARY STATEMENT'
                                }, {
                                    id: 2,
                                    name: 'BANGLA STATEMENT'
                                }, {
                                    id: 3,
                                    name: 'BANK STATEMENT'
                                }, {
                                    id: 4,
                                    name: 'REGULER OVERTIME'
                                }, {
                                    id: 5,
                                    name: 'EXTRA OVERTIME'
                                }, {
                                    id: 6,
                                    name: '1H EXTRA OVERTIME'
                                }, {
                                    id: 7,
                                    name: '2H EXTRA OVERTIME'
                                }, ],
                                autoLoad: true,
                                autoSync: true
                            },
                            listeners: {
                                change: function(thisCombo, newValue, oldValue, eOpts) {
                                    if (Ext.isEmpty(newValue)) {
                                        Ext.getCmp('monthly_payment_tab_download').setDisabled(true);
                                    } else {
                                        Ext.getCmp('monthly_payment_tab_download').setDisabled(false);
                                    }
                                }
                            }
                        }),
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
                            var panel = this.up('form'),
                                form = panel.getForm(),
                                values = form.getValues();
                            values.date = new Date(values.month_year);
                            values.year = values.date.getFullYear();
                            values.month = values.date.getMonth() + 1;
                            values.status = [1, 2];
                            if (form.isValid()) {
                                if (tab_panel) {
                                    Ext.getCmp('monthly_payment_grid').setLoading(true);
                                    Ext.getCmp('monthly_payment_grid').getStore().load({
                                        params: values,
                                        callback: function(records, operation, success) {
                                            // Ext.getCmp('hourlyPunchTitle').setText(new Date(values.date).DateFormat1())
                                            // console.log(Ext.getCmp('hourlyPunchTitle'));
                                            Ext.getCmp('monthly_payment_grid').setLoading(false);
                                        },
                                        scope: this
                                    });
                                }
                            }
                        }
                    }, {
                        text: 'Update',
                        formBind: true,
                        handler: function() {
                            var success = false;
                            var win = this.up('.window');
                            var panel = this.up('form'),
                                form = panel.getForm(),
                                values = form.getValues();
                            values.user = user;
                            values.date = new Date(values.month_year);
                            values.year = values.date.getFullYear();
                            values.month = values.date.getMonth() + 1;
                            values.date.setDate(10);
                            values.status = [1, 2];
                            if (form.isValid()) {
                                if (tab_panel) {
                                    Ext.getCmp('monthly_payment_tab').setLoading(true);
                                    var EmpCount = 0;
                                    var AttEmpCount = 0;
                                    var sectionEmployee = Ext.create('Ext.data.Store', {
                                        proxy: {
                                            type: 'ajax',
                                            url: '/getAllEmployeeID'
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
                                    sectionEmployee.load({
                                        params: {
                                            section: values.section,
                                            status: values.status
                                        },
                                        callback: function(records, operation, success) {
                                            var monthlyAttendance = Ext.create('Ext.data.Store', {
                                                proxy: {
                                                    type: 'ajax',
                                                    url: '/getMonthlySummary'
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
                                            monthlyAttendance.load({
                                                params: values,
                                                callback: function(mAttData, operation1, success1) {
                                                    EmpCount = (records) ? records.length : 0;
                                                    AttEmpCount = (mAttData) ? mAttData.length : 0;
                                                    if (EmpCount == AttEmpCount) {
                                                        socket.emit('CreateMonthlyPayment', values).on('CreateMonthlyPayment', function(cBack) {
                                                            if (cBack) {
                                                                Ext.getCmp('monthly_payment_tab').setLoading(false);
                                                                Ext.MessageBox.alert('success', 'Successfully data inserted');
                                                            } else {
                                                                Ext.getCmp('monthly_payment_tab').setLoading(false);
                                                                Ext.MessageBox.alert('Error', 'Data not updated. \nContact with the developer');
                                                            }
                                                        });
                                                    } else if (EmpCount > AttEmpCount) {
                                                        var tmpO = {};
                                                        tmpO.date =
                                                            tmpO.date = values.date;
                                                        tmpO.year = values.year;
                                                        tmpO.month = values.month;
                                                        tmpO.status = [1, 2];
                                                        socket.emit('CreateMonthlyAttendance', tmpO).on('CreateMonthlyAttendance', function(message) {
                                                            Ext.getCmp('monthly_payment_tab').setLoading(false);
                                                            Ext.MessageBox.alert('ERROR', 'Try Again Or Update Employee Attendance First');
                                                        });
                                                    } else if (EmpCount < AttEmpCount) {
                                                        Ext.getCmp('monthly_payment_tab').setLoading(false);
                                                        Ext.MessageBox.alert('ERROR', 'Monthly Attendance Employee Count Cant Be Greater Then Regular Employee Count');
                                                    }
                                                },
                                                scope: this
                                            });
                                        },
                                        scope: this
                                    });
                                }
                            }
                        }
                    }, {
                        text: 'Download',
                        id: 'monthly_payment_tab_download',
                        formBind: true,
                        disabled: true,
                        handler: function() {
                            var win = this.up('.window');
                            var panel = this.up('form'),
                                form = panel.getForm(),
                                values = form.getValues();
                            values.user = user;
                            values.date = new Date(values.month_year);
                            values.year = values.date.getFullYear();
                            values.month = values.date.getMonth() + 1;
                            values.date.setDate(10);
                            values.status = [1, 2];
                            values.URL = site_url;
                            values.file_name = monthNames[values.month - 1] + '_' + values.year + '_Salary_Statement_Report';
                            if (values.date && values.payment_type && values.download_type) {
                                if (values.download_type == 1 || values.download_type == 2) {
                                    Ext.getCmp('monthly_payment_tab').setLoading(true);
                                    socket.emit('DownloadMonthlyPaymentReport', values).on('DownloadMonthlyPaymentReport', function(r) {
                                        Ext.MessageBox.alert({
                                            title: 'Salary Statement Report Download',
                                            buttons: Ext.MessageBox.CANCEL,
                                            msg: 'Please <a href="/uploads/pdf/' + values.file_name + '.pdf" download>click here</a> to confirm the file download',
                                            animateTarget: 'mb4',
                                            icon: Ext.MessageBox.QUESTION
                                        });
                                        Ext.getCmp('monthly_payment_tab').setLoading(false);
                                    });
                                } else {
                                    Ext.MessageBox.alert('ERROR', 'Something Went Wrong. Please Contact With The Developer.');
                                }
                            } else {
                                Ext.MessageBox.alert('ERROR', 'Something Went Wrong. Please Contact With The Developer.');
                            }
                        }
                    }]
                })
            ]
        });
        tab_panel.setActiveTab(new_tab);
    }
}