function overtimeReportWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Overtime Statement Report',
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
                    listeners: {
                        blur: function(self, The, eOpts) {
                            // console.log(self);
                            // console.log(self.value);
                            // Ext.getCmp('overtimeMonthWeekDetailsCombo').getStore().load({
                            //   params: {
                            //     date: self.value
                            //   },
                            //   callback: function (records, operation, success){
                            //     // console.log(records);
                            //     Ext.getCmp('overtimeMonthWeekDetailsCombo').setDisabled(false);
                            //     // Ext.getCmp('overtimeMonthWeekDetailsCombo').setLoading(false);
                            //   },
                            //   scope: this
                            // });
                        },
                    }
                }),
                // Ext.create('Ext.form.ComboBox', {
                //   name: 'week',
                //   id: 'overtimeMonthWeekDetailsCombo',
                //   fieldLabel: 'Week:',
                //   filedAlign: 'top',
                //   allowBlank: false,
                //   editable : false,
                //   disabled : true,
                //   emptyText: 'Week',
                //   autoScroll: true,
                //   queryMode: 'local',
                //   displayField: 'name',
                //   valueField: 'dates',
                //   selectOnFocus: true,
                //   triggerAction: 'all',
                //   store: {
                //     fields: ['dates', 'name'],
                //     proxy: {
                //       type: 'ajax',
                //       url: '/getMonthWeekDetails'
                //     },
                //     autoLoad: true,
                //     autoSync: true
                //   },
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
                        fields: ['id', 'name', 'nameBangla'],
                        proxy: {
                            type: 'ajax',
                            url: '/getSection/2'
                        },
                        autoLoad: true,
                        autoSync: true
                    },
                }),
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
                        data: [{
                            id: 1,
                            name: 'REGULAR'
                        }, {
                            id: 2,
                            name: 'HOLD'
                        }],
                        autoLoad: true,
                        autoSync: true
                    },
                }),
                Ext.create('Ext.form.ComboBox', {
                    name: 'overtime',
                    fieldLabel: 'Overtime:',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Overtime',
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
                            name: '7 PM - 8 PM'
                        }, {
                            id: 2,
                            name: '8 PM - 9 PM'
                        }, {
                            id: 3,
                            name: '7 PM - 9 PM'
                        }, {
                            id: 4,
                            name: '9 PM - 6 AM'
                        }, {
                            id: 5,
                            name: '7 PM - 6 AM'
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
                        values.sectionName = form.findField("section").rawValue.toUpperCase();
                        try {
                            values.sectionBanglaName = form.findField("section").displayTplData[0].nameBangla;
                        } catch (err) {
                            values.sectionBanglaName = 'ইনপুট করা হয় নি';
                        }
                        values.file_name = tDate.getDate() + '_' + monthNames[values.date.getMonth()] + '_' + values.date.getUTCFullYear() + '_OverTime_Report';
                        values.URL = site_url;
                        if (tab_panel) {
                            panel.setLoading(true);
                            socket.emit('DownloadBanglaOverTimeReport', values).on('DownloadBanglaOverTimeReport', function(r) {
                                Ext.MessageBox.alert({
                                    title: 'Overtime Report Download',
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
                        values.sectionName = form.findField("section").rawValue.toUpperCase();
                        values.file_name = tDate.getDate() + '_' + monthNames[values.date.getMonth()] + '_' + values.date.getUTCFullYear() + '_OverTime_Report';
                        values.URL = site_url;
                        if (tab_panel) {
                            panel.setLoading(true);
                            socket.emit('DownloadOverTimeReport', values).on('DownloadOverTimeReport', function(r) {
                                Ext.MessageBox.alert({
                                    title: 'Overtime Report Download',
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