function disappointedSalaryStatementWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Disappointed Salary Statement Report',
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
                        values.file_name = tDate.getDate() + '_' + monthNames[values.date.getMonth()] + '_' + values.date.getUTCFullYear() + '_Disappointed_Salary_Statement_Report';
                        values.employeeType = form.findField("employee_type").rawValue.toUpperCase();
                        values.URL = site_url;
                        values.status = 3;
                        if (tab_panel) {
                            panel.setLoading(true);
                            socket.emit('DownloadDisappointedSalaryStatementReport', values).on('DownloadDisappointedSalaryStatementReport', function(r) {
                                Ext.MessageBox.alert({
                                    title: 'Disappointed Salary Statement Report Download',
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