function complianceBonusStatementWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Compliance Bonus Statement Report',
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
                }),
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
                Ext.create('Ext.form.ComboBox', {
                    name: 'bonus_type',
                    fieldLabel: 'Bonus Type:',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Bonus Type',
                    autoScroll: true,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'name',
                    selectOnFocus: true,
                    triggerAction: 'all',
                    store: {
                        fields: ['name'],
                        data: [{
                            name: 'BASIC'
                        }, {
                            name: 'HALF GROSS'
                        }],
                        autoLoad: true,
                        autoSync: true
                    },
                }),
                Ext.create('Ext.form.ComboBox', {
                    name: 'festive_type',
                    fieldLabel: 'Festive Type:',
                    filedAlign: 'top',
                    allowBlank: false,
                    editable: false,
                    emptyText: 'Festive Type',
                    autoScroll: true,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'name',
                    selectOnFocus: true,
                    triggerAction: 'all',
                    store: {
                        fields: ['name'],
                        data: [{
                            name: 'EID-AL-FITR'
                        }, {
                            name: 'EID-UL-AZHA'
                        }],
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
                        values.date = (values.month_search != '') ? new Date(values.month_search) : new Date();
                        var tDate = new Date();
                        values.date.setDate(10);
                        values.file_name = tDate.getDate() + '_' + monthNames[values.date.getMonth()] + '_' + values.date.getUTCFullYear() + '_Compliance_Bonus_Statement_Report';
                        values.sectionName = form.findField("section").rawValue.toUpperCase();
                        values.URL = site_url;
                        if (tab_panel) {
                            panel.setLoading(true);
                            socket.emit('DownloadComplianceBonusStatementReport', values).on('DownloadComplianceBonusStatementReport', function(r) {
                                Ext.MessageBox.alert({
                                    title: 'Compliance Bonus Statement Report Download',
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