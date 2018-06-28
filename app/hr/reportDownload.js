function reportDownloadWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Report Download Window',
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
                    id: 'dailyAttendanceReportDate',
                    fieldLabel: 'Report Date:',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
                    value: new Date(),
                    labelAlign: 'left',
                    labelStyle: 'text-align:left;border solid 1px white;',
                    labelSeparator: '',
                    emptyText: 'Give Date...',
                    labelClsExtra: 'some-class',
                    fieldStyle: 'text-align: left;font-size: 12px;',
                    autoScroll: true
                }),
                Ext.create('Ext.form.ComboBox', {
                    name: 'attendance_period',
                    id: 'report_tab_attendance_period',
                    fieldLabel: 'Period:',
                    filedAlign: 'top',
                    allowBlank: true,
                    editable: false,
                    emptyText: 'Attendance Period',
                    autoScroll: true,
                    queryMode: 'local',
                    displayField: 'name',
                    value: 'IN TIME',
                    valueField: 'name',
                    selectOnFocus: true,
                    triggerAction: 'all',
                    store: {
                        fields: ['name'],
                        data: [{
                            'name': 'IN TIME'
                        }, {
                            'name': 'OUT TIME'
                        }, {
                            'name': 'BOTH'
                        }],
                    },
                    listeners: {
                        blur: function(self, The, eOpts) {
                            //Ext.getCmp('report_tab_attendance_type').clearValue();
                            //Ext.getCmp('report_tab_department').clearValue();
                            //Ext.getCmp('report_tab_section').clearValue();
                            //Ext.getCmp('report_tab_employee_type').clearValue();
                        },
                    }
                }),
                Ext.create('Ext.form.ComboBox', {
                    name: 'attendance_type',
                    id: 'report_tab_attendance_type',
                    fieldLabel: 'Type:',
                    filedAlign: 'top',
                    allowBlank: true,
                    editable: false,
                    emptyText: 'Attendance Type',
                    autoScroll: true,
                    queryMode: 'local',
                    displayField: 'name',
                    value: 'ABSENT',
                    valueField: 'name',
                    selectOnFocus: true,
                    triggerAction: 'all',
                    store: {
                        fields: ['name'],
                        data: [{
                            'name': 'PRESENT'
                        }, {
                            'name': 'ABSENT'
                        }, {
                            'name': 'LATE'
                        }],
                    },
                    listeners: {
                        blur: function(self, The, eOpts) {
                            //Ext.getCmp('report_tab_attendance_type').clearValue();
                            //Ext.getCmp('report_tab_department').clearValue();
                            //Ext.getCmp('report_tab_section').clearValue();
                            //Ext.getCmp('report_tab_employee_type').clearValue();
                        },
                    }
                }),
                Ext.create('Ext.form.ComboBox', {
                    name: 'department',
                    id: 'report_tab_department',
                    fieldLabel: 'Department:',
                    filedAlign: 'top',
                    allowBlank: true,
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
                            //Ext.getCmp('report_tab_attendance_type').clearValue();
                            //Ext.getCmp('report_tab_department').clearValue();
                            Ext.getCmp('report_tab_section').clearValue();
                            //Ext.getCmp('report_tab_employee_type').clearValue();
                        },
                    }
                }),
                Ext.create('Ext.form.ComboBox', {
                    name: 'section',
                    id: 'report_tab_section',
                    fieldLabel: 'Section:',
                    filedAlign: 'top',
                    allowBlank: true,
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
                            //Ext.getCmp('report_tab_attendance_type').clearValue();
                            Ext.getCmp('report_tab_department').clearValue();
                            //Ext.getCmp('report_tab_section').clearValue();
                            //Ext.getCmp('report_tab_employee_type').clearValue();
                        },
                    }
                }),
                Ext.create('Ext.form.ComboBox', {
                    name: 'employee_type',
                    id: 'report_tab_employee_type',
                    fieldLabel: 'Employee Type:',
                    filedAlign: 'top',
                    allowBlank: true,
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
                            //Ext.getCmp('report_tab_attendance_type').clearValue();
                            //Ext.getCmp('report_tab_department').clearValue();
                            //Ext.getCmp('report_tab_section').clearValue();
                            //Ext.getCmp('report_tab_employee_type').clearValue();
                        },
                    }
                }),
                //newDateField('Date:', 'date', 'dailyAttendanceReportDate')
            ],
            buttons: [{
                text: 'Reset',
                handler: function() {
                    this.up('form').getForm().reset();
                }
            }, {
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
                        if (tab_panel) {
                            panel.setLoading(true);
                            socket.emit('DownloadDailyAttendanceReportPDF', values).on('DownloadDailyAttendanceReportPDF', function(r) {
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