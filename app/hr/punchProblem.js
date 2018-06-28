function punchProblemTab() {
    if (Ext.getCmp('punch_problem_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("punch_problem_tab"));
    } else {
        var punchProblemPendingList = {
            title: 'Pending List',
            layout: 'fit',
            autoScroll: false,
            active: true,
            items: [
                punchProblemGrid(1)
            ],
        };

        var punchProblemAppliedList = {
            title: 'Applied List',
            layout: 'fit',
            autoScroll: false,
            items: [
                punchProblemGrid(2)
            ],
        };

        var punchProblemConfirmedList = {
            title: 'Confirmed List',
            layout: 'fit',
            autoScroll: false,
            items: [
                punchProblemGrid(3)
            ],
        };

        var punchProblemApprovedList = {
            title: 'Approved List',
            layout: 'fit',
            autoScroll: false,
            items: [
                punchProblemGrid(4)
            ],
        };

        var punchProblemRejectedList = {
            title: 'Rejected List',
            layout: 'fit',
            autoScroll: false,
            items: [
                punchProblemGrid(5)
            ],
        };

        var new_tab = tab_panel.add(Ext.create('Ext.tab.Panel', {
            title: 'Punch Problem',
            region: 'center',
            layout: 'border',
            closable: true,
            id: 'punch_problem_tab',
            autoScroll: false,
            items: [
                punchProblemPendingList,
                punchProblemAppliedList,
                // punchProblemConfirmedList,
                // punchProblemApprovedList,
                // punchProblemRejectedList
            ],
        }));
        new_tab.add(punchProblemConfirmedList);
        new_tab.add(punchProblemApprovedList);
        new_tab.add(punchProblemRejectedList);
        tab_panel.setActiveTab(new_tab);
    }
}

function punchProblemGrid(PGID) {
    var store = Ext.create('Ext.data.Store', {
        id: 'punchProblemGridStore' + PGID,
        pageSize: 30,
        remoteSort: true,
        //autoLoad: true,
        //autoSync: true,
        proxy: {
            type: 'ajax',
            url: '/getPunchProblemList/' + PGID,
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
        model: Ext.define('PUNCH_PROBLEM_MODEL', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'id',
                type: 'int'
            }, {
                name: 'employee',
                type: 'int',
            }, {
                name: 'date',
                type: 'date',
            }, {
                name: 'time',
                type: 'string',
            }, {
                name: 'card_no',
                type: 'int',
                mapping: 'employeeTable.userTable.card_no'
            }, {
                name: 'name',
                type: 'string',
                mapping: 'employeeTable.userTable.first_name'
            }, {
                name: 'section',
                type: 'string',
                mapping: 'employeeTable.sectionTable.name'
            }, {
                name: 'reason',
                type: 'string',
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
                punchProblemGridReload(PGID);
                return true
            }
            punchProblemGridReload(PGID);
            return false
        },
        movePrevious: function() {
            var c = this,
                a = c.store,
                b = a.currentPage - 1;
            if (b > 0) {
                if (c.fireEvent("beforechange", c, b) !== false) {
                    a.previousPage();
                    punchProblemGridReload(PGID);
                    return true
                }
            }
            punchProblemGridReload(PGID);
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
                    punchProblemGridReload(PGID);
                    return true
                }
            }
            punchProblemGridReload(PGID);
            return false
        },
        moveLast: function() {
            var b = this,
                a = b.getPageData().pageCount;
            if (b.fireEvent("beforechange", b, a) !== false) {
                b.store.loadPage(a);
                punchProblemGridReload(PGID);
                return true
            }
            punchProblemGridReload(PGID);
            return false
        },
        doRefresh: function() {
            var b = this,
                a = b.store,
                c = a.currentPage;
            if (b.fireEvent("beforechange", b, c) !== false) {
                a.loadPage(c);
                punchProblemGridReload(PGID);
                return true
            }
            punchProblemGridReload(PGID);
            return false
        },
    });
    var punch_problem_grid = Ext.create('Ext.grid.Panel', {
        id: 'punch_problem_grid_' + PGID,
        loadMask: true,
        autoScroll: true,
        columnLines: true,
        store: store,
        viewConfig: {
            emptyText: 'No records',
            autoDestroy: false,
            getRowClass: function(record) {
                return 'white-space: normal;';
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
        tbar: [Ext.create('Ext.form.ComboBox', {
                name: 'name',
                id: 'punch_problem_grid_emp_' + PGID,
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
                id: 'punch_problem_grid_date_' + PGID,
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
                    if (Ext.getCmp('punch_problem_grid_date_' + PGID).value) {
                        punchProblemGridReload(PGID);
                    } else if (Ext.getCmp('punch_problem_grid_emp_' + PGID).value) {
                        punchProblemGridReload(PGID);
                    } else {
                        Ext.MessageBox.alert('Error', 'Please select month first');
                    }
                }
            },
            gridPaging
        ],
        bbar: [{
            xtype: 'button',
            icon: '/uploads/icons/create.png',
            text: 'Add New',
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            hideable: true,
            listeners: {
                afterrender: function(cmp) {
                    cmp.hidden = (PGID != 1 || acLvl > 300 && acLvl != 0) ? true : false;
                }
            },
            handler: function() {
                punchProblemInputFormWindow(PGID);
            }
        }, {
            xtype: 'button',
            id: 'punch_problem_grid_bbar_apply' + PGID,
            icon: '/uploads/icons/checkmark.png',
            text: 'APPLY',
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            hideable: true,
            listeners: {
                afterrender: function(cmp) {
                    cmp.hidden = (PGID == 4 || PGID == 5 || ((PGID == 2 || PGID == 3) && acLvl > 200 && acLvl < 300) || (acLvl > 300 && (PGID == 1 || PGID == 3))) ? true : false;
                }
            },
            handler: function() {
                var cellSelectArr = Ext.getCmp("punch_problem_grid_" + PGID).getSelectionModel().getSelection();
                var tmpArr = []
                for (var i = 0; i < cellSelectArr.length; i++) {
                    var OJ = {};
                    OJ.id = cellSelectArr[i].data.id;
                    OJ.reason = cellSelectArr[i].data.reason;
                    tmpArr.push(OJ);
                }
                var o = {};
                o.array = tmpArr;
                o.type = PGID + 1;
                var tmpR = (o.type == 2) ?
                    'Applied' :
                    (o.type == 3) ?
                    'Confirmed' :
                    (o.type == 4) ?
                    'Approved' :
                    'Error';
                if (cellSelectArr.length > 0) {
                    Ext.MessageBox.prompt({
                        title: 'Approve Manual Punch?',
                        multiline: true,
                        width: 300,
                        msg: 'Are you sure you want to approve this information. <br>Please leave reason behind your action.',
                        buttons: Ext.Msg.YESNO,
                        icon: Ext.Msg.WARNING,
                        fn: function(btn, text) {
                            if (btn == 'yes') {
                                o.reason = ' <br /> ' + tmpR + ': ' + ((text != '') ? text : 'No reason given');
                                socket.emit('UpdatePunchProblem', o).on('UpdatePunchProblem', function(message) {
                                    if (message == "success") {
                                        punchProblemGridReload(PGID);
                                        Ext.MessageBox.alert('success', 'Successfully data updated');
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
                } else {
                    Ext.MessageBox.alert('Error', 'No Selection Found');
                }
            }
        }, {
            xtype: 'button',
            id: 'punch_problem_grid_bbar_reject' + PGID,
            icon: '/uploads/icons/erase.png',
            text: 'REJECT',
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            hideable: true,
            listeners: {
                afterrender: function(cmp) {
                    cmp.hidden = (PGID == 4 || PGID == 5 || ((PGID == 2 || PGID == 3) && acLvl > 200 && acLvl < 300) || (acLvl > 300 && (PGID == 1 || PGID == 3))) ? true : false;
                }
            },
            handler: function() {
                var cellSelectArr = Ext.getCmp("punch_problem_grid_" + PGID).getSelectionModel().getSelection();
                var tmpArr = []
                for (var i = 0; i < cellSelectArr.length; i++) {
                    var OJ = {};
                    OJ.id = cellSelectArr[i].data.id;
                    OJ.reason = cellSelectArr[i].data.reason;
                    tmpArr.push(OJ);
                }
                var o = {};
                o.array = tmpArr;
                o.type = 5;
                if (cellSelectArr.length > 0) {
                    Ext.MessageBox.prompt({
                        title: 'Reject Manual Punch?',
                        multiline: true,
                        width: 300,
                        msg: 'Are you sure you want to reject this information. <br>Please leave reason behind your action.',
                        buttons: Ext.Msg.YESNO,
                        icon: Ext.Msg.WARNING,
                        fn: function(btn, text) {
                            if (btn == 'yes') {
                                o.reason = ' <br /> Rejected: ' + ((text != '') ? text : 'No reason given');
                                socket.emit('UpdatePunchProblem', o).on('UpdatePunchProblem', function(message) {
                                    if (message == "success") {
                                        punchProblemGridReload(PGID);
                                        Ext.MessageBox.alert('success', 'Successfully data updated');
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
                } else {
                    Ext.MessageBox.alert('Error', 'No Selection Found');
                }
            }
        }],
        selModel: Ext.create('Ext.selection.CheckboxModel', {
            id: 'punch_problem_grid_selection_model' + PGID,
            mode: 'MULTI',
            listeners: {
                select: function(sm, index, eOpts) {
                    // console.log('select');
                },
                deselect: function(sm, index, eOpts) {
                    // console.log('deselect');
                },
                selectionchange: function(sm, selected, eOpts) {


                    // if(PGID==4||PGID==5||sm.getSelection().length==0||((PGID==2||PGID==3)&&acLvl>200&&acLvl<300)){
                    //   Ext.getCmp('punch_problem_grid_bbar_apply'+PGID).getEl().hide();
                    //   Ext.getCmp('punch_problem_grid_bbar_reject'+PGID).getEl().hide();
                    // }else{
                    //   Ext.getCmp('punch_problem_grid_bbar_apply'+PGID).getEl().show();
                    //   Ext.getCmp('punch_problem_grid_bbar_reject'+PGID).getEl().show();
                    // }



                    // Ext.getCmp('punch_problem_grid_bbar_apply'+PGID).getEl().toggle();
                    // console.log('sel change');
                    // console.log(Ext.getCmp('punch_problem_grid_'+PGID));
                    var recLen = Ext.getCmp('punch_problem_grid_' + PGID).store.getRange().length;
                    // console.log('sm=>');
                    // console.log(sm.getSelection());
                    // console.log(sm.getCount());
                    // var tmpArr = []
                    // for (var i = 0; i < sm.getSelection().length; i++) {
                    //   var o = {};
                    //   o.id = sm.getSelection()[i].data.id;
                    //   o.reason = sm.getSelection()[i].data.reason;
                    //   tmpArr.push(o);
                    // }
                    // punchProblemGridSelectionCount = sm.getCount();
                    // punchProblemGridSelectionArray = tmpArr;
                    var selectedLen = sm.getSelection().length;
                    if (selectedLen == recLen) {
                        // console.log('all selected');
                    } else if (selectedLen == 0) {
                        // console.log('all deselect');
                    }
                }
            }
        }),
        columns: [Ext.create('Ext.grid.RowNumberer', {
                //locked: true,
                header: '#',
                flex: 0.3
            }), {
                header: 'FP ID',
                dataIndex: 'employee',
                align: 'center',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return addLeadingZero(9, value);
                },
                flex: 0.8
            }, {
                header: 'CARD NO',
                dataIndex: 'card_no',
                align: 'center',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return addLeadingZero(9, value);
                },
                flex: 0.8
            }, {
                header: 'NAME',
                dataIndex: 'name',
                align: 'left',
                //locked: true,
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.toUpperCase();
                },
                flex: 1
            }, {
                header: 'SECTION',
                dataIndex: 'section',
                align: 'left',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return '<div style="white-space:normal !important;">' + value.toUpperCase() + '</div>';
                    // return value.toUpperCase();
                },
                flex: 1
            }, {
                header: 'DATE',
                dataIndex: 'date',
                align: 'center',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.formatDate();
                },
                flex: 0.8
            }, {
                header: 'TIME',
                dataIndex: 'time',
                align: 'center',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return time12Format(value);
                },
                flex: 0.5
            }, {
                header: 'REASON',
                dataIndex: 'reason',
                align: 'left',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return '<div style="white-space:normal !important;">' + value.toCapitalize() + '</div>';
                    // return value.toCapitalize();
                },
                flex: 2
            },
            // {
            //   xtype:'actioncolumn',
            //   header: 'APPLY',
            //   align: 'center',
            //   hideable: true,
            //   listeners:{
            //     afterrender:function(cmp){
            //       cmp.hidden = ((PGID==4||PGID==5)||((PGID==2||PGID==3)&&acLvl>200&&acLvl<300))?true:false;
            //     }
            //   },
            //   items: [
            //     {
            //       icon: '/uploads/icons/checkmark.png',
            //       tooltip: 'APPLY',
            //       handler: function(grid, rowIndex, colIndex) {
            //           var rec = grid.getStore().getAt(rowIndex);
            //           // employeeLeaveFormWindow(rec)
            //       }
            //     }
            //   ],
            //   flex: 0.5
            // },
            // {
            //   xtype:'actioncolumn',
            //   header: 'REJECT',
            //   align: 'center',
            //   hideable: true,
            //   listeners:{
            //     afterrender:function(cmp){
            //       cmp.hidden = ((PGID==4||PGID==5)||((PGID==2||PGID==3)&&acLvl>200&&acLvl<300))?true:false;
            //     }
            //   },
            //   items: [
            //     {
            //       icon: '/uploads/icons/erase.png',
            //       tooltip: 'REJECT',
            //       handler: function(grid, rowIndex, colIndex) {
            //           var rec = grid.getStore().getAt(rowIndex);
            //           // employeeLeaveFormWindow(rec)
            //       }
            //     }
            //   ],
            //   flex: 0.5
            // },
        ]
    });
    store.loadPage(1);
    return punch_problem_grid;
}

function punchProblemGridReload(GID) {
    if (Ext.getCmp('punch_problem_grid_' + GID)) {
        // var department = Ext.getCmp('punch_problem_tab_department').value;
        var params = {};
        if (Ext.getCmp('punch_problem_grid_emp_' + GID))
            params.id = Ext.getCmp('punch_problem_grid_emp_' + GID).value;
        if (Ext.getCmp('punch_problem_grid_date_' + GID))
            params.date = Ext.getCmp('punch_problem_grid_date_' + GID).value;
        Ext.getCmp('punch_problem_grid_' + GID).setLoading(true);
        Ext.getCmp('punch_problem_grid_' + GID).getStore().load({
            params: params,
            callback: function(records, operation, success) {
                Ext.getCmp('punch_problem_grid_' + GID).setLoading(false);
            },
            scope: this
        });
    }
}

function punchProblemInputFormWindow(PGID) {
    return Ext.create('Ext.window.Window', {
        title: 'Add New Punch Problem',
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
                    name: 'employee',
                    anyMatch: true,
                    allowBlank: false,
                    editable: true,
                    typeAhead: true,
                    transform: 'stateSelect',
                    forceSelection: true,
                    emptyText: 'Select Employee ...',
                    fieldLabel: 'Employee:',
                    filedAlign: 'top',
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
                            url: '/getEmployeeCombo'
                        },
                        autoLoad: true,
                        autoSync: true
                    },
                }),
                Ext.create('Ext.form.field.Date', {
                    name: 'date',
                    fieldLabel: 'Date:',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
                    labelAlign: 'left',
                    maxValue: new Date(),
                    labelStyle: 'text-align:left;border solid 1px white;',
                    labelSeparator: '',
                    emptyText: 'Give Date...',
                    labelClsExtra: 'some-class',
                    fieldStyle: 'text-align: left;font-size: 12px;',
                    autoScroll: true
                }), {
                    xtype: 'timefield',
                    name: 'time',
                    allowBlank: false,
                    emptyText: 'Give Time ...',
                    fieldLabel: 'Time',
                    minValue: '00:01 AM',
                    maxValue: '11:59 PM',
                    increment: 1,
                    anchor: '100%'
                },
                newTextField('Reason', 'reason')
            ],
            buttons: [{
                text: 'Reset',
                handler: function() {
                    this.up('form').getForm().reset();
                }
            }, {
                text: 'Submit',
                formBind: true,
                // icon: '/uploads/icons/dowload.png',
                handler: function() {
                    var success = false;
                    var win = this.up('.window');
                    var panel = this.up('form'),
                        form = panel.getForm(),
                        values = form.getValues();
                    if (form.isValid()) {
                        values.time = time24Format(values.time);
                        values.date = new Date(values.date).formatedDate();
                        if (tab_panel) {
                            socket.emit('CreatePunchProblem', values).on('CreatePunchProblem', function(message) {
                                if (message == "success") {
                                    success = true;
                                    punchProblemGridReload(PGID);
                                    Ext.MessageBox.alert('success', 'Successfully data inserted');
                                    win.close();
                                } else if (message == "error") {
                                    Ext.MessageBox.alert('Error', 'Data not inserted. \nPossible problem could be duplicate entry');
                                }
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