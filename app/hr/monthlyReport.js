function monthlyReportWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Monthly Report',
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
                // Ext.create('Ext.form.ComboBox', {
                //   name: 'department',
                //   id: 'monthly_report_tab_department',
                //   fieldLabel: 'Department:',
                //   filedAlign: 'top',
                //   allowBlank: true,
                //   editable : true,
                //   emptyText: 'Department Name',
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
                //       url: '/department'
                //     },
                //     autoLoad: true,
                //     autoSync: true
                //   },
                //   listeners: {
                //     blur: function(self, The, eOpts){
                //       if(Ext.getCmp('monthly_report_tab_section')){
                //         Ext.getCmp('monthly_report_tab_section').clearValue();
                //       }
                //     },
                //   }
                // }),
                Ext.create('Ext.form.ComboBox', {
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
                        fields: ['id', 'name'],
                        proxy: {
                            type: 'ajax',
                            url: '/section'
                        },
                        autoLoad: true,
                        autoSync: true
                    },
                }),
                // Ext.create('Ext.form.ComboBox', {
                //   name: 'employee_type',
                //   id: 'monthly_report_tab_employee_type',
                //   fieldLabel: 'Employee Type:',
                //   filedAlign: 'top',
                //   allowBlank: true,
                //   editable : true,
                //   emptyText: 'Employee Type',
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
                //       url: '/employee_type'
                //     },
                //     autoLoad: true,
                //     autoSync: true
                //   },
                //   listeners: {
                //     blur: function(self, The, eOpts){
                //       //Ext.getCmp('report_tab_attendance_type').clearValue();
                //       //Ext.getCmp('report_tab_department').clearValue();
                //       //Ext.getCmp('report_tab_section').clearValue();
                //       //Ext.getCmp('report_tab_employee_type').clearValue();
                //     },
                //   }
                // }),
                Ext.create('Ext.form.ComboBox', {
                    name: 'status',
                    fieldLabel: 'Status:',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Status',
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
                }),
            ],
            buttons: [{
                text: 'Download',
                icon: '/uploads/icons/download.png',
                formBind: true,
                handler: function() {
                    var panel = this.up('form'),
                        form = panel.getForm(),
                        values = form.getValues();
                    if (form.isValid()) {
                        values.date = (values.date != '') ? new Date(values.date) : new Date();
                        values.file_name = monthNames[values.date.getMonth()] + '_' + values.date.getUTCFullYear() + '_Monthly_Report';
                        values.URL = site_url;
                        values.id = values.section;
                        if (tab_panel) {
                            panel.setLoading(true);
                            // socket.emit('DownloadMonthAttendance', values).on('DownloadMonthAttendance', function (r) {
                            //   Ext.MessageBox.alert({
                            //     title:'Monthly Report Download',
                            //     buttons: Ext.MessageBox.CANCEL,
                            //     msg: 'Please <a href="/uploads/pdf/'+values.file_name+'.pdf" download>click here</a> to confirm the file download',
                            //     animateTarget: 'mb4',
                            //     icon: Ext.MessageBox.QUESTION
                            //   });
                            //   panel.setLoading(false);
                            // });
                            socket.emit('DownloadMonthAttendanceV2', values).on('DownloadMonthAttendanceV2', function(r) {
                                Ext.MessageBox.alert({
                                    title: 'Monthly Report Download',
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